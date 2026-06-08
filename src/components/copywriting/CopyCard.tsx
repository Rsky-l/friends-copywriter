import Link from "next/link";
import { CopyButton } from "@/components/ui/CopyButton";
import { Tag } from "@/components/ui/Tag";
import type { CopywritingItem } from "@/types";

export function CopyCard({ item }: { item: CopywritingItem }) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <Link href={`/detail/${item.id}`} className="block">
        <p className="text-base leading-relaxed text-slate-800 mb-3 line-clamp-3">
          {item.content}
        </p>
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {item.category && <Tag label={item.category.icon + " " + item.category.name} />}
          {item.mood && <Tag label={item.mood.icon + " " + item.mood.name} />}
          {!item.isFree && <Tag label="付费" paid />}
        </div>
        <CopyButton text={item.content} className="!py-1.5 !px-4 !text-xs" />
      </div>
    </div>
  );
}
