import { CopyCard } from "@/components/copywriting/CopyCard";
import type { CopywritingItem } from "@/types";

export function HotList({ items }: { items: CopywritingItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-3">🔥 热门推荐</h2>
      <div className="grid gap-3">
        {items.slice(0, 8).map((item) => (
          <CopyCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
