"use client";

import { formatCurrency, useAnalyticsFilters, useCashFlowTimeline } from "@/lib/analytics";

const incomeColor = "#10b981";
const expenseColor = "#f43f5e";
const netColor = "#6366f1";

export function CashFlowChart() {
  const { currency } = useAnalyticsFilters();
  const timeline = useCashFlowTimeline();

  if (timeline.length === 0) {
    return null;
  }

  const maxValue = Math.max(
    ...timeline.flatMap((point) => [point.income, point.expense, Math.abs(point.net)])
  );
  const chartHeight = 160;
  const chartWidth = 560;

  const getX = (index: number) => (timeline.length === 1 ? chartWidth / 2 : (index / (timeline.length - 1)) * chartWidth);
  const getY = (value: number) => chartHeight - (value / maxValue) * (chartHeight - 20) - 10;

  const buildPoints = (values: number[]) =>
    values.map((value, index) => `${getX(index)},${getY(value)}`).join(" ");

  const incomePoints = buildPoints(timeline.map((point) => point.income));
  const expensePoints = buildPoints(timeline.map((point) => point.expense));
  const netPoints = buildPoints(timeline.map((point) => Math.max(point.net, 0)));

  const labelInterval = Math.max(1, Math.floor(timeline.length / 6));

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Ingresos vs Gastos</h2>
          <p className="text-sm text-muted-foreground">Comparativa de flujo de dinero en el tiempo.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: incomeColor }} />
            Ingresos
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: expenseColor }} />
            Gastos
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: netColor }} />
            Cash Flow
          </span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-48 w-full">
          <polyline
            points={`${incomePoints} ${chartWidth},${chartHeight} 0,${chartHeight}`}
            fill={`${incomeColor}33`}
            stroke="none"
          />
          <polyline
            points={`${expensePoints} ${chartWidth},${chartHeight} 0,${chartHeight}`}
            fill={`${expenseColor}22`}
            stroke="none"
          />
          <polyline points={incomePoints} fill="none" stroke={incomeColor} strokeWidth="2.5" />
          <polyline points={expensePoints} fill="none" stroke={expenseColor} strokeWidth="2.5" />
          <polyline points={netPoints} fill="none" stroke={netColor} strokeWidth="2" strokeDasharray="4 3" />

          {timeline.map((point, index) => (
            <g key={point.date}>
              <circle cx={getX(index)} cy={getY(point.income)} r="3" fill={incomeColor}>
                <title>
                  {point.label}: Ingresos {formatCurrency(point.income, currency)}
                </title>
              </circle>
              <circle cx={getX(index)} cy={getY(point.expense)} r="3" fill={expenseColor}>
                <title>
                  {point.label}: Gastos {formatCurrency(point.expense, currency)}
                </title>
              </circle>
            </g>
          ))}
        </svg>
        <div className="mt-3 grid grid-cols-6 text-xs text-muted-foreground">
          {timeline.map((point, index) => {
            if (index % labelInterval !== 0 && index !== timeline.length - 1) {
              return <span key={point.date} />;
            }
            return (
              <span key={point.date} className="truncate text-center">
                {point.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
