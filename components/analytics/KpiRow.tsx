"use client";

import { formatCurrency, formatPercentage, useAnalyticsFilters, useAnalyticsSummary } from "@/lib/analytics";

const buildDeltaLabel = (delta: number) => {
  const direction = delta >= 0 ? "↑" : "↓";
  const value = Math.abs(delta).toFixed(1);
  return `${direction} ${value}%`;
};

export function KpiRow() {
  const { currency } = useAnalyticsFilters();
  const summary = useAnalyticsSummary();

  const kpis = [
    {
      label: "Ingresos totales",
      value: formatCurrency(summary.incomeTotal, currency),
      delta: summary.deltas.income,
      tone: "text-emerald-600",
      deltaTone: summary.deltas.income >= 0 ? "text-emerald-600" : "text-rose-600",
      description: "vs periodo anterior"
    },
    {
      label: "Gastos totales",
      value: formatCurrency(summary.expenseTotal, currency),
      delta: summary.deltas.expense,
      tone: "text-rose-600",
      deltaTone: summary.deltas.expense <= 0 ? "text-emerald-600" : "text-rose-600",
      description: "vs periodo anterior"
    },
    {
      label: "Cash Flow Neto",
      value: formatCurrency(summary.netCashFlow, currency),
      delta: summary.deltas.net,
      tone: summary.netCashFlow >= 0 ? "text-emerald-600" : "text-rose-600",
      deltaTone: summary.deltas.net >= 0 ? "text-emerald-600" : "text-rose-600",
      description: "vs periodo anterior"
    },
    {
      label: "Tasa de ahorro",
      value: formatPercentage(summary.savingsRate),
      delta: summary.deltas.savingsRate,
      tone: summary.savingsRate >= 20 ? "text-emerald-600" : "text-amber-600",
      deltaTone: summary.deltas.savingsRate >= 0 ? "text-emerald-600" : "text-rose-600",
      description: "vs periodo anterior"
    }
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">{kpi.label}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <span className={`text-2xl font-semibold ${kpi.tone}`}>{kpi.value}</span>
            <span className={`text-xs font-semibold ${kpi.deltaTone}`}>{buildDeltaLabel(kpi.delta)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{kpi.description}</p>
        </div>
      ))}
    </section>
  );
}
