import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/payment";
import { getUserId } from "@/lib/auth";

const MOCK = process.env.MOCK_PAYMENT === "true";
const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    let userId = await getUserId();

    // Mock mode or first-time user: auto-create dev user
    if (!userId && MOCK) {
      userId = 1;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 }
      );
    }

    const result = await createPayment({
      userId,
      amount: 5.9,
      name: "朋友圈文案生成器-永久会员",
      notifyUrl: `${APP_URL}/api/payment/callback`,
      returnUrl: `${APP_URL}/pricing?paid=success`,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: result.orderId,
        payUrl: result.payUrl,
        amount: 5.9,
      },
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { success: false, error: "创建订单失败，请重试" },
      { status: 500 }
    );
  }
}
