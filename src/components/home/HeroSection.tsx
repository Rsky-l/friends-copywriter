import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-brand-50 to-blue-100 rounded-2xl p-6 mb-6">
      <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
        朋友圈文案生成器
      </h1>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">
        AI 驱动的文案利器 — 分类浏览、智能改写、配图搭配，让你的朋友圈更有格调
      </p>
      <div className="flex gap-3">
        <Link href="/rewrite" className="btn-primary text-sm !py-2.5 !px-5">
          ✏️ AI 改写
        </Link>
        <Link href="/generate" className="btn-gold text-sm !py-2.5 !px-5">
          ✨ 定制原创
        </Link>
      </div>
    </section>
  );
}
