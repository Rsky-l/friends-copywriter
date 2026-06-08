import { NextRequest, NextResponse } from "next/server";
import { verifyNotify, processPayment } from "@/lib/payment";

export async function GET(req: NextRequest) {
  // Mock mode: handle test payment
  const url = new URL(req.url);
  const mock = url.searchParams.get("mock") === "true";
  const orderId = parseInt(url.searchParams.get("orderId") || "0");

  if (mock && orderId) {
    try {
      await processPayment(orderId, `mock_tx_${Date.now()}`);
    } catch (e) {
      console.error("Mock payment error:", e);
    }
    return NextResponse.redirect(new URL("/pricing?paid=success", req.url));
  }

  return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  // Real xorpay notify callback
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const aoid = params.get("aoid") || "";
    const orderId = params.get("order_id") || "";
    const payPrice = params.get("pay_price") || "";
    const payTime = params.get("pay_time") || "";
    const sign = params.get("sign") || "";

    console.log("[payment] notify received:", { aoid, orderId, payPrice, payTime });

    if (!aoid || !orderId || !sign) {
      return new Response("missing params", { status: 400 });
    }

    // Verify signature
    if (!verifyNotify({ aoid, order_id: orderId, pay_price: payPrice, pay_time: payTime, sign })) {
      console.error("[payment] signature verification failed");
      return new Response("sign error", { status: 400 });
    }

    // Process payment
    const detail = params.get("detail") || "{}";
    let transactionId = "";
    try {
      transactionId = JSON.parse(detail).transaction_id || aoid;
    } catch {
      transactionId = aoid;
    }

    await processPayment(parseInt(orderId), transactionId);
    console.log(`[payment] ✅ Order ${orderId} paid successfully`);

    return new Response("success");
  } catch (error) {
    console.error("[payment] callback error:", error);
    return new Response("error", { status: 500 });
  }
}
