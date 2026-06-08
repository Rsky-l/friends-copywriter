import { NextRequest, NextResponse } from "next/server";
import { rewrite } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { filterSensitive } from "@/lib/sensitive-filter";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  let original = "";
  try {
    const body = await req.json();
    original = body.original;
    const { style = "文艺清新", wordLimit = 100, addEmoji = true } = body;

    if (!original) {
      return NextResponse.json({ success: false, error: "请提供原文案" }, { status: 400 });
    }

    const userId = 1;
    const user = await db.user.findUnique({ where: { id: userId } });
    const isPaid = user?.isPaid ?? false;

    const { allowed, remaining, limit } = await checkRateLimit(userId, isPaid, "rewrite");
    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: `今日改写次数已用完（${limit}次/天），升级付费可享50次/天`,
      }, { status: 429 });
    }

    const variants = await rewrite({ original, style, wordLimit, addEmoji });
    const filtered = variants.map((v) => filterSensitive(v).text);

    await db.aiLog.create({
      data: {
        userId,
        type: "rewrite",
        input: original,
        output: filtered.join(" | "),
        tokenUsed: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: { variants: filtered, remaining: remaining - 1, limit },
    });
  } catch (error) {
    console.error("AI rewrite error:", error);
    return NextResponse.json({
      success: true,
      data: {
        variants: [
          original + " ✨",
          original + " 🌸",
          "每一天都是新的开始，" + original.slice(0, 20) + "…",
        ],
        fallback: true,
      },
    });
  }
}
