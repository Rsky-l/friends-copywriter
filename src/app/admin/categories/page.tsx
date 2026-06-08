"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";

interface CatItem {
  id: number; name: string; slug: string; sortOrder: number;
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [moods, setMoods] = useState<CatItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setCategories(json.data.categories);
          setMoods(json.data.moods);
        }
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">分类管理</h1>

      <h2 className="text-lg font-bold text-slate-700 mb-3">场景分类</h2>
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "名称" },
          { key: "slug", label: "Slug" },
          { key: "sortOrder", label: "排序" },
        ]}
        data={categories}
      />

      <h2 className="text-lg font-bold text-slate-700 mb-3 mt-8">情绪标签</h2>
      <DataTable
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "名称" },
          { key: "slug", label: "Slug" },
          { key: "sortOrder", label: "排序" },
        ]}
        data={moods}
      />
    </div>
  );
}
