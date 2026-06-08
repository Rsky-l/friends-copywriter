import { db } from "./db";

const FREE_REWRITE_LIMIT = 3;
const PAID_REWRITE_LIMIT = 50;
const PAID_GENERATE_LIMIT = 10;

export async function checkRateLimit(
  userId: number,
  isPaid: boolean,
  type: "rewrite" | "generate"
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await db.aiLog.count({
    where: {
      userId,
      type,
      createdAt: { gte: today },
    },
  });

  let limit: number;
  if (type === "rewrite") {
    limit = isPaid ? PAID_REWRITE_LIMIT : FREE_REWRITE_LIMIT;
  } else {
    if (!isPaid) return { allowed: false, remaining: 0, limit: 0 };
    limit = PAID_GENERATE_LIMIT;
  }

  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
    limit,
  };
}
