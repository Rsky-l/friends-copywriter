import { CopyCard } from "./CopyCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { CopywritingItem } from "@/types";

interface CopyListProps {
  items: CopywritingItem[];
  loading?: boolean;
  emptyMessage?: string;
}

export function CopyList({ items, loading = false, emptyMessage = "暂无文案" }: CopyListProps) {
  if (loading) return <LoadingSpinner />;
  if (!items.length) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <CopyCard key={item.id} item={item} />
      ))}
    </div>
  );
}
