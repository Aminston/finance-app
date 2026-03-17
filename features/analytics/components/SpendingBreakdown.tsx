"use client";

import { formatCurrency, useAnalyticsFilters, useSpendingByCategory } from "@/lib/analytics";

const colors = ["#6366f1", "#f97316", "#14b8a6", "#facc15", "#e879f9", "#94a3b8"];

export function SpendingBreakdown() {
  const { currency } = useAnalyticsFilters();
  const { categories, total } = useSpendingByCategory();

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Distribución de gastos</h2>
        <p className="text-sm text-muted-foreground">Enfoque por categoría y ranking de impacto.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col items-center gap-4">
          <svg width="140" height="140" viewBox="0 0 140 140" className="overflow-visible">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="16" />
            {categories.map((category, index) => {
              const length = (category.percentage / 100) * circumference;
              const offset = circumference - cumulative;
              cumulative += length;

              return (
                <circle
                  key={category.name}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth="16"
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Gasto total</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(total, currency)}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            {categories.map((category, index) => (
              <span key={category.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                {category.name}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{category.name}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(category.amount, currency)} · {category.percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: colors[index % colors.length]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
