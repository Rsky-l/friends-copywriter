import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const items = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ success: true, data: items });
}
