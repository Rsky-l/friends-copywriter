"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "📊 数据概览" },
  { href: "/admin/copywriting", label: "📝 文案管理" },
  { href: "/admin/categories", label: "🏷️ 分类管理" },
  { href: "/admin/templates", label: "🎨 模板管理" },
  { href: "/admin/orders", label: "💰 订单管理" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 p-4 hidden md:block">
      <Link href="/admin/dashboard" className="text-lg font-bold text-brand-600 mb-6 block">
        📝 后台管理
      </Link>
      <nav className="space-y-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors
              ${pathname === href
                ? "bg-brand-50 text-brand-600 font-medium"
                : "text-slate-600 hover:bg-gray-50"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
