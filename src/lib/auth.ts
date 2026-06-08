import { cookies } from "next/headers";
import { db } from "./db";

export async function createToken(userId: number): Promise<string> {
  const payload = JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 3600 * 1000 });
  return Buffer.from(payload).toString("base64");
}

export async function getUserId(): Promise<number | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    if (payload.exp < Date.now()) return null;
    return payload.userId as number;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const id = await getUserId();
  if (!id) return null;
  return db.user.findUnique({ where: { id } });
}
