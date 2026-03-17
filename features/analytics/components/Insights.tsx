"use client";

import { useAnalyticsSummary, useSpendingByCategory } from "@/lib/analytics";

export function Insights() {
  const summary = useAnalyticsSummary();
  const { categories } = useSpendingByCategory();

  const topCategory = categories.find((category) => category.name !== "Otros") ?? categories[0];
  const expenseDelta = summary.deltas.expense;
  const savingsGoal = 20;

  const insights = [
    `Tu mayor gasto fue ${topCategory.name} (${topCategory.percentage.toFixed(0)}%).`,
    `Gastaste ${Math.abs(expenseDelta).toFixed(1)}% ${expenseDelta >= 0 ? "más" : "menos"} que el periodo anterior.`,
    summary.savingsRate >= savingsGoal
      ? `Tu tasa de ahorro supera el objetivo (${savingsGoal}%).`
      : `Tu tasa de ahorro está por debajo del objetivo (${savingsGoal}%).`
  ];

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Insights rápidos</h2>
      <p className="text-sm text-muted-foreground">
        Señales clave para detectar hábitos y oportunidades de ahorro.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-foreground">
        {insights.map((insight) => (
          <li key={insight} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
