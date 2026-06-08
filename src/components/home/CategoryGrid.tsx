import Link from "next/link";
import type { CategoryItem, MoodItem } from "@/types";

interface CategoryGridProps {
  categories: CategoryItem[];
  moods: MoodItem[];
  selectedScene: string | null;
  selectedMood: string | null;
}

export function CategoryGrid({ categories, moods, selectedScene, selectedMood }: CategoryGridProps) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">
        按场景浏览
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/"
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors
            ${!selectedScene ? "bg-brand-500 text-white" : "bg-white text-slate-600 hover:bg-brand-50"}`}
        >
          全部
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={selectedScene === cat.slug ? "/" : `/category/${cat.slug}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors
              ${selectedScene === cat.slug
                ? "bg-brand-500 text-white"
                : "bg-white text-slate-600 hover:bg-brand-50"}`}
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">
        按情绪筛选
      </h2>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <Link
            key={mood.id}
            href={`/category/${selectedScene || "all"}/${mood.slug}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors
              ${selectedMood === mood.slug
                ? "bg-brand-500 text-white"
                : "bg-white text-slate-600 hover:bg-brand-50"}`}
          >
            {mood.icon} {mood.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
