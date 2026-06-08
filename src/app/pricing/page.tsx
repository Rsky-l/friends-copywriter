"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const features = [
  { name: "分类文案浏览", free: "50% 基础文案", paid: "全部分类 + 持续更新" },
  { name: "AI 改写", free: "3次/天", paid: "50次/天" },
  { name: "原创定制文案", free: "❌", paid: "✅ 10次/天" },
  { name: "文字卡片模板", free: "3套基础模板", paid: "15+套精美模板" },
  { name: "配图推荐", free: "仅文字建议", paid: "图片推荐 + 下载" },
  { name: "水印", free: "有水印", paid: "无水印" },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();

      if (json.success && json.data.payUrl) {
        // Redirect to payment page (xorpay cashier or mock callback)
        window.location.href = json.data.payUrl;
      } else {
        setError(json.error || "创建订单失败，请重试");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-2">升级付费</h1>
      <p className="text-sm text-slate-500 mb-6">
        一次性解锁全部功能，永久使用
      </p>

      {/* 付费卡片 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-300 mb-6">
        <div className="text-center mb-4">
          <span className="text-4xl font-extrabold text-amber-600">¥5.9</span>
          <span className="text-sm text-amber-500 ml-2">一次性买断</span>
        </div>
        <ul className="space-y-2 mb-4">
          {features.map((f) => (
            <li key={f.name} className="flex justify-between text-sm">
              <span className="text-slate-600">{f.name}</span>
              <span className="font-medium text-emerald-600">{f.paid}</span>
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-sm text-red-500 text-center mb-3">{error}</p>
        )}

        <Button
          variant="gold"
          onClick={handlePay}
          loading={loading}
          className="w-full text-base !py-3"
        >
          立即解锁 — ¥5.9
        </Button>

        <p className="text-xs text-slate-400 text-center mt-3">
          点击后将跳转到支付页面，支持微信和支付宝
        </p>
      </div>

      {/* 免费版对比 */}
      <div className="card mb-6">
        <h3 className="font-bold text-slate-700 mb-3">免费版</h3>
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f.name} className="flex justify-between text-sm">
              <span className="text-slate-600">{f.name}</span>
              <span className="text-slate-400">{f.free}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
