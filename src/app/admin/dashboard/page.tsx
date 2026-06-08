import { db } from "@/lib/db";
import { StatsCard } from "@/components/admin/StatsCard";

export default async function DashboardPage() {
  const [copyCount, userCount, paidUserCount, ordersSum] = await Promise.all([
    db.copywriting.count(),
    db.user.count(),
    db.user.count({ where: { isPaid: true } }),
    db.order.aggregate({ where: { status: "paid" }, _sum: { amount: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">数据概览</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="文案总数" value={copyCount} icon="📝" />
        <StatsCard title="用户总数" value={userCount} icon="👥" />
        <StatsCard title="付费用户" value={paidUserCount} icon="👑" />
        <StatsCard title="总收入" value={`¥${ordersSum._sum.amount?.toFixed(2) || "0.00"}`} icon="💰" />
      </div>
    </div>
  );
}
