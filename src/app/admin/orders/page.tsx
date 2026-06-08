"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Tag } from "@/components/ui/Tag";

interface OrdItem {
  id: number; userId: number; amount: number; status: string; createdAt: string;
}

const statusMap: Record<string, { label: string; paid: boolean }> = {
  pending: { label: "待支付", paid: false },
  paid: { label: "已支付", paid: true },
  refunded: { label: "已退款", paid: false },
};

export default function OrdersAdminPage() {
  const [items, setItems] = useState<OrdItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((json) => { if (json.success) setItems(json.data); });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">订单管理</h1>
      <DataTable
        columns={[
          { key: "id", label: "订单号" },
          { key: "userId", label: "用户ID" },
          { key: "amount", label: "金额" },
          {
            key: "status",
            label: "状态",
            render: (item) => {
              const s = statusMap[item.status] || { label: item.status, paid: false };
              return <Tag label={s.label} paid={s.paid} />;
            },
          },
          {
            key: "createdAt",
            label: "创建时间",
            render: (item) => new Date(item.createdAt).toLocaleString("zh-CN"),
          },
        ]}
        data={items}
      />
    </div>
  );
}
