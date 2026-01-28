"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/transactions", label: "Transacciones" },
  { href: "/analytics", label: "Analítica" }
];

export default function RightSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-2 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Navegación
      </h2>
      <ul className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
