import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CopyList } from "@/components/copywriting/CopyList";

interface Props {
  params: Promise<{ scene: string; mood: string }>;
}

export default async function CrossFilterPage({ params }: Props) {
  const { scene, mood: moodSlug } = await params;

  const [category, mood, categories, moods] = await Promise.all([
    scene === "all" ? null : db.category.findUnique({ where: { slug: scene } }),
    db.mood.findUnique({ where: { slug: moodSlug } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.mood.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!mood) notFound();

  const items = await db.copywriting.findMany({
    where: {
      ...(scene !== "all" && category ? { categoryId: category.id } : {}),
      moodId: mood.id,
    },
    include: { category: true, mood: true },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  const categoryName = scene === "all" ? "全部" : category?.name ?? "";

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-4">
        {categoryName} · {mood.icon} {mood.name}
      </h1>
      <CategoryGrid categories={categories} moods={moods} selectedScene={scene} selectedMood={moodSlug} />
      <CopyList items={items} emptyMessage="该组合下暂无文案" />
    </div>
  );
}
