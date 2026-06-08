import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-brand-600">
          📝 文案生成器
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/rewrite" className="text-sm text-slate-500 hover:text-brand-500 transition-colors">
            AI改写
          </Link>
          <Link href="/pricing" className="btn-gold text-xs !py-2 !px-4">
            升级付费
          </Link>
        </nav>
      </div>
    </header>
  );
}
