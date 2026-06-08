import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const items = await db.cardTemplate.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ success: true, data: items });
}
