import { db } from "@/lib/db";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HotList } from "@/components/home/HotList";
import { CopyList } from "@/components/copywriting/CopyList";

export default async function HomePage() {
  const [categories, moods, freeItems, hotItems] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.mood.findMany({ orderBy: { sortOrder: "asc" } }),
    db.copywriting.findMany({
      where: { isFree: true },
      include: { category: true, mood: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.copywriting.findMany({
      include: { category: true, mood: true },
      orderBy: { usageCount: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div>
      <HeroSection />
      <CategoryGrid categories={categories} moods={moods} selectedScene={null} selectedMood={null} />
      <CopyList items={freeItems} emptyMessage="暂无免费文案，请稍后再来" />
      <HotList items={hotItems} />
    </div>
  );
}
