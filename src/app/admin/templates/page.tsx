"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Tag } from "@/components/ui/Tag";

interface TplItem {
  id: number; name: string; category: string; isFree: boolean;
}

export default function TemplatesAdminPage() {
  const [items, setItems] = useState<TplItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/templates")
      .then((r) => r.json())
      .then((json) => { if (json.success) setItems(json.data); });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">模板管理</h1>
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "名称" },
          { key: "category", label: "风格分类" },
          {
            key: "isFree",
            label: "类型",
            render: (item) => <Tag label={item.isFree ? "免费" : "付费"} paid={!item.isFree} />,
          },
        ]}
        data={items}
      />
    </div>
  );
}
