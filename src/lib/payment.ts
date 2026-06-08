import crypto from "crypto";
import { db } from "./db";

const XORPAY_BASE = "https://xorpay.com/api";
const XORPAY_AID = process.env.XORPAY_AID || "";
const XORPAY_SECRET = process.env.XORPAY_APP_SECRET || "";
const MOCK = process.env.MOCK_PAYMENT === "true";

/**
 * Create a payment order: first in our DB, then call xorpay to get cashier URL
 */
export async function createPayment(params: {
  userId: number;
  amount: number;
  name: string;
  notifyUrl: string;
  returnUrl: string;
}): Promise<{ orderId: number; payUrl: string }> {
  // 1. Create order in our DB
  const order = await db.order.create({
    data: {
      userId: params.userId,
      amount: params.amount,
      status: "pending",
    },
  });

  if (MOCK) {
    return {
      orderId: order.id,
      payUrl: `/api/payment/callback?orderId=${order.id}&mock=true`,
    };
  }

  // 2. Call xorpay cashier API
  const payType = "native";
  const signStr = `${params.name}${payType}${params.amount.toFixed(2)}${order.id}${params.notifyUrl}${XORPAY_SECRET}`;
  const sign = crypto.createHash("md5").update(signStr).digest("hex");

  const formBody = new URLSearchParams({
    name: params.name,
    pay_type: payType, // native = QR code scan, works for both WeChat & Alipay outside WeChat
    price: params.amount.toFixed(2),
    order_id: String(order.id),
    notify_url: params.notifyUrl,
    return_url: params.returnUrl,
    sign,
  });

  const response = await fetch(`${XORPAY_BASE}/cashier/${XORPAY_AID}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
  });

  // xorpay returns empty on success, JSON on error
  const text = await response.text();
  let result: Record<string, string> = {};
  if (text) {
    try { result = JSON.parse(text); } catch { /* ignore parse errors */ }
  }

  if (result.status === "order_exist") {
    return {
      orderId: order.id,
      payUrl: `${XORPAY_BASE}/cashier/${XORPAY_AID}?order_id=${order.id}`,
    };
  }

  // Only throw if xorpay explicitly returned an error status
  if (result.status && result.status !== "order_exist") {
    console.error("XorPay error:", result);
    throw new Error(result.status || "支付创建失败");
  }

  return {
    orderId: order.id,
    payUrl: `${XORPAY_BASE}/cashier/${XORPAY_AID}?order_id=${order.id}`,
  };
}

/**
 * Verify xorpay notify callback signature
 */
export function verifyNotify(params: {
  aoid: string;
  order_id: string;
  pay_price: string;
  pay_time: string;
  sign: string;
}): boolean {
  if (MOCK) return true;

  const signStr = `${params.aoid}${params.order_id}${params.pay_price}${params.pay_time}${XORPAY_SECRET}`;
  const expected = crypto.createHash("md5").update(signStr).digest("hex");
  return expected === params.sign;
}

/**
 * Process successful payment
 */
export async function processPayment(orderId: number, transactionId: string) {
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "pending") {
    throw new Error("Order not found or already processed");
  }

  await db.$transaction([
    db.order.update({
      where: { id: orderId },
      data: {
        status: "paid",
        transactionId,
        paidAt: new Date(),
      },
    }),
    db.user.update({
      where: { id: order.userId },
      data: { isPaid: true, paidAt: new Date() },
    }),
  ]);

  return { success: true };
}
