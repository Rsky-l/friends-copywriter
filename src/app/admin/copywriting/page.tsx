"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

interface CopyItem {
  id: number;
  content: string;
  isFree: boolean;
  wordCount: number;
  usageCount: number;
}

export default function CopywritingAdminPage() {
  const [items, setItems] = useState<CopyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/copywritings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setItems(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (item: CopyItem) => {
    if (!confirm("确定删除这条文案？")) return;
    await fetch(`/api/admin/copywritings?id=${item.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  if (loading) return <p className="text-slate-400">加载中...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">文案管理</h1>
        <Button>+ 新增文案</Button>
      </div>
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          {
            key: "content",
            label: "内容",
            render: (item) => (
              <span className="line-clamp-2 max-w-xs block">{item.content}</span>
            ),
          },
          {
            key: "isFree",
            label: "类型",
            render: (item) => <Tag label={item.isFree ? "免费" : "付费"} paid={!item.isFree} />,
          },
          { key: "wordCount", label: "字数" },
          { key: "usageCount", label: "复制数" },
        ]}
        data={items}
        onDelete={handleDelete}
      />
    </div>
  );
}
