import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CopyList } from "@/components/copywriting/CopyList";

interface Props {
  params: Promise<{ scene: string }>;
}

export default async function ScenePage({ params }: Props) {
  const { scene } = await params;

  if (scene === "all") {
    const [categories, moods, items] = await Promise.all([
      db.category.findMany({ orderBy: { sortOrder: "asc" } }),
      db.mood.findMany({ orderBy: { sortOrder: "asc" } }),
      db.copywriting.findMany({
        include: { category: true, mood: true },
        orderBy: { createdAt: "desc" },
        take: 40,
      }),
    ]);
    return (
      <div>
        <h1 className="text-xl font-bold text-slate-800 mb-4">全部文案</h1>
        <CategoryGrid categories={categories} moods={moods} selectedScene="all" selectedMood={null} />
        <CopyList items={items} emptyMessage="暂无文案" />
      </div>
    );
  }

  const category = await db.category.findUnique({ where: { slug: scene } });
  if (!category) notFound();

  const [categories, moods, items] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.mood.findMany({ orderBy: { sortOrder: "asc" } }),
    db.copywriting.findMany({
      where: { categoryId: category.id },
      include: { category: true, mood: true },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-4">
        {category.icon} {category.name}文案
      </h1>
      <CategoryGrid categories={categories} moods={moods} selectedScene={scene} selectedMood={null} />
      <CopyList items={items} emptyMessage="该分类下暂无文案" />
    </div>
  );
}
