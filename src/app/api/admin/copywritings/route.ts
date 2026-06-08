import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const items = await db.copywriting.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await db.copywriting.create({
    data: {
      content: body.content,
      categoryId: body.categoryId || 1,
      moodId: body.moodId || 1,
      wordCount: body.content?.length || 0,
      isFree: body.isFree ?? true,
      suggestImageStyle: body.suggestImageStyle || "",
    },
  });
  return NextResponse.json({ success: true, data: item });
}

export async function DELETE(req: NextRequest) {
  const id = parseInt(new URL(req.url).searchParams.get("id") || "0");
  await db.copywriting.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
