import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [categories, moods] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.mood.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return NextResponse.json({ success: true, data: { categories, moods } });
}
