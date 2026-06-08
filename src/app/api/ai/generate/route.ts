import { NextRequest, NextResponse } from "next/server";
import { generateOriginal } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { filterSensitive } from "@/lib/sensitive-filter";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  let topic = "";
  try {
    const body = await req.json();
    topic = body.topic;
    const { scene = "日常生活", mood = "温暖治愈", wordLimit = 100, addEmoji = true } = body;

    if (!topic) {
      return NextResponse.json({ success: false, error: "请输入主题" }, { status: 400 });
    }

    const userId = 1;
    const user = await db.user.findUnique({ where: { id: userId } });
    const isPaid = user?.isPaid ?? false;

    if (!isPaid) {
      return NextResponse.json({
        success: false,
        error: "原创定制为付费功能，请升级后使用",
      }, { status: 402 });
    }

    const { allowed, remaining, limit } = await checkRateLimit(userId, isPaid, "generate");
    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: `今日定制次数已用完（${limit}次/天）`,
      }, { status: 429 });
    }

    const content = await generateOriginal({ topic, scene, mood, wordLimit, addEmoji });
    const filtered = filterSensitive(content);

    await db.aiLog.create({
      data: {
        userId,
        type: "generate",
        input: topic,
        output: filtered.text,
        tokenUsed: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: { content: filtered.text, remaining: remaining - 1, limit },
    });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json({
      success: true,
      data: {
        content: `关于「${topic || "..."}」的朋友圈文案：\n\n今天又是美好的一天！${topic ? "关于" + topic + "，感触良多。" : ""}生活不在别处，就在此时此刻 🌿\n\n#日常 #随拍`,
        fallback: true,
      },
    });
  }
}
