import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const openid = body.openid || "mock_openid_dev_user";

  let user = await db.user.findUnique({ where: { openid } });
  if (!user) {
    user = await db.user.create({
      data: {
        openid,
        nickname: body.nickname || "用户",
        avatar: body.avatar || "",
      },
    });
  }

  const token = await createToken(user.id);

  const response = NextResponse.json({ success: true, data: { user } });
  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 3600,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
