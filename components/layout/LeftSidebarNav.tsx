"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/transactions", label: "Transacciones", icon: "💳" },
  { href: "/analytics", label: "Analítica", icon: "📊" }
];

export default function LeftSidebarNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 border-r border-zinc-800 bg-zinc-950 text-zinc-100 transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 py-4`}>
          {!collapsed && (
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <span className="inline-flex h-2 w-2 items-center justify-center rounded-full bg-emerald-400" />
              FinanceFlow
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-md border border-zinc-800 p-1 text-xs text-zinc-300 transition hover:bg-zinc-900"
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            aria-expanded={!collapsed}
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-base" aria-hidden>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className={`px-4 py-4 text-xs text-zinc-500 ${collapsed ? "text-center" : ""}`}>
          {!collapsed ? "Menú colapsable" : "⋯"}
        </div>
      </div>
    </aside>
  );
}
