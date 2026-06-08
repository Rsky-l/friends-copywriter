import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CopyButton } from "@/components/ui/CopyButton";
import { Tag } from "@/components/ui/Tag";
import { RewritePanel } from "@/components/copywriting/RewritePanel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: Props) {
  const { id } = await params;
  const item = await db.copywriting.findUnique({
    where: { id: parseInt(id) },
    include: { category: true, mood: true },
  });

  if (!item) notFound();

  return (
    <div>
      <a href="/" className="text-sm text-brand-500 hover:text-brand-600 mb-4 inline-block">
        ← 返回列表
      </a>

      <div className="card mb-6">
        <div className="flex gap-2 mb-3">
          {item.category && <Tag label={item.category.icon + " " + item.category.name} />}
          {item.mood && <Tag label={item.mood.icon + " " + item.mood.name} />}
          {!item.isFree && <Tag label="付费" paid />}
        </div>
        <p className="text-lg leading-relaxed text-slate-800 mb-4">{item.content}</p>
        <div className="flex items-center gap-3">
          <CopyButton text={item.content} />
          <span className="text-xs text-slate-400">
            {item.wordCount}字 · 已复制 {item.usageCount} 次
          </span>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-3">✏️ AI 改写</h2>
        <RewritePanel original={item.content} />
      </section>
    </div>
  );
}
