import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (
    username === (process.env.ADMIN_USERNAME || "admin") &&
    password === (process.env.ADMIN_PASSWORD || "admin123")
  ) {
    const payload = JSON.stringify({ role: "admin", exp: Date.now() + 24 * 3600 * 1000 });
    const token = Buffer.from(payload).toString("base64");
    (await cookies()).set("admin_token", token, { httpOnly: true, maxAge: 24 * 3600, path: "/" });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "用户名或密码错误" }, { status: 401 });
}
