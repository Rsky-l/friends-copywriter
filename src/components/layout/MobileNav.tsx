"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/rewrite", label: "AI改写", icon: "✏️" },
  { href: "/generate", label: "原创", icon: "✨" },
  { href: "/pricing", label: "付费", icon: "👑" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors
                ${active ? "text-brand-500" : "text-slate-400 hover:text-slate-600"}`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
