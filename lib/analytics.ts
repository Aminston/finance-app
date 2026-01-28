"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

export type DateRangePreset = "last-7" | "last-30" | "last-90" | "last-12m" | "custom";
export type CurrencyCode = "MXN" | "USD";
export type Granularity = "day" | "week" | "month";

export type AnalyticsFilters = {
  preset: DateRangePreset;
  currency: CurrencyCode;
  start: Date;
  end: Date;
  label: string;
  granularity: Granularity;
};

export type CashFlowPoint = {
  date: string;
  label: string;
  income: number;
  expense: number;
  net: number;
};

export type AnalyticsSummary = {
  incomeTotal: number;
  expenseTotal: number;
  netCashFlow: number;
  savingsRate: number;
  deltas: {
    income: number;
    expense: number;
    net: number;
    savingsRate: number;
  };
};

export type SpendingCategory = {
  name: string;
  amount: number;
  percentage: number;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const shortDateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  timeZone: "UTC"
});

const shortDateYearFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
});

const monthFormatter = new Intl.DateTimeFormat("es-ES", {
  month: "short",
  timeZone: "UTC"
});

const currencyFormatter = (currency: CurrencyCode) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  });

const percentageFormatter = new Intl.NumberFormat("es-MX", {
  style: "percent",
  maximumFractionDigits: 1
});

const presetConfig: Record<Exclude<DateRangePreset, "custom">, { days: number; granularity: Granularity }> = {
  "last-7": { days: 7, granularity: "day" },
  "last-30": { days: 30, granularity: "day" },
  "last-90": { days: 90, granularity: "week" },
  "last-12m": { days: 365, granularity: "month" }
};

const sanitizeDate = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (value: Date, amount: number) => {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
};

const addMonths = (value: Date, amount: number) => {
  const date = new Date(value);
  date.setMonth(date.getMonth() + amount);
  return date;
};

const parseDateParam = (value: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return sanitizeDate(parsed);
};

const formatShortDate = (value: Date) =>
  shortDateFormatter
    .format(value)
    .toLowerCase()
    .replace(".", "");

const formatShortDateWithYear = (value: Date) =>
  shortDateYearFormatter
    .format(value)
    .toLowerCase()
    .replace(".", "");

const formatMonthLabel = (value: Date) =>
  monthFormatter
    .format(value)
    .toLowerCase()
    .replace(".", "");

const getPresetRange = (preset: Exclude<DateRangePreset, "custom">, now: Date) => {
  const { days, granularity } = presetConfig[preset];
  const end = sanitizeDate(now);
  const start = addDays(end, -(days - 1));
  return { start, end, granularity };
};

const getGranularityForCustom = (start: Date, end: Date): Granularity => {
  const diffInDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_IN_MS) + 1);
  if (diffInDays > 120) return "month";
  if (diffInDays > 45) return "week";
  return "day";
};

export const formatRangeLabel = (start: Date, end: Date) =>
  `${formatShortDate(start)} – ${formatShortDateWithYear(end)}`;

export const formatCurrency = (amount: number, currency: CurrencyCode) =>
  currencyFormatter(currency).format(amount);

export const formatPercentage = (value: number) => percentageFormatter.format(value / 100);

export const formatInputDate = (date: Date) => date.toISOString().slice(0, 10);

export const useAnalyticsFilters = (): AnalyticsFilters => {
  const searchParams = useSearchParams();
  const now = React.useMemo(() => new Date(), []);

  const presetParam = (searchParams.get("range") as DateRangePreset | null) ?? "last-30";
  const preset: DateRangePreset =
    presetParam === "last-7" ||
    presetParam === "last-30" ||
    presetParam === "last-90" ||
    presetParam === "last-12m" ||
    presetParam === "custom"
      ? presetParam
      : "last-30";

  const currencyParam = (searchParams.get("currency") as CurrencyCode | null) ?? "MXN";
  const currency: CurrencyCode = currencyParam === "USD" ? "USD" : "MXN";

  const customStart = parseDateParam(searchParams.get("start"));
  const customEnd = parseDateParam(searchParams.get("end"));

  let start = customStart;
  let end = customEnd;
  let granularity: Granularity = "day";

  if (preset === "custom" && start && end) {
    if (start > end) {
      [start, end] = [end, start];
    }
    granularity = getGranularityForCustom(start, end);
  } else {
    const presetRange = getPresetRange(preset === "custom" ? "last-30" : preset, now);
    start = presetRange.start;
    end = presetRange.end;
    granularity = presetRange.granularity;
  }

  const label = `${formatRangeLabel(start, end)} · ${currency}`;

  return {
    preset,
    currency,
    start,
    end,
    label,
    granularity
  };
};

const buildTimeline = (start: Date, end: Date, granularity: Granularity): CashFlowPoint[] => {
  const points: CashFlowPoint[] = [];
  const scaleMap: Record<Granularity, number> = {
    day: 280,
    week: 1350,
    month: 5200
  };

  const scale = scaleMap[granularity];
  let cursor = sanitizeDate(start);
  let index = 0;

  while (cursor <= end) {
    const seasonal = Math.sin(index / 2.3) * 0.12 + Math.cos(index / 3.1) * 0.06;
    const income = scale * (1.05 + seasonal + (index % 4) * 0.04);
    const expense = scale * (0.74 + Math.cos(index / 2.7) * 0.08 + (index % 5) * 0.03);
    const net = income - expense;

    const label =
      granularity === "month"
        ? formatMonthLabel(cursor)
        : formatShortDate(cursor);

    points.push({
      date: cursor.toISOString(),
      label,
      income: Math.round(income),
      expense: Math.round(expense),
      net: Math.round(net)
    });

    if (granularity === "day") {
      cursor = addDays(cursor, 1);
    } else if (granularity === "week") {
      cursor = addDays(cursor, 7);
    } else {
      cursor = addMonths(cursor, 1);
    }

    index += 1;
  }

  return points;
};

const calculateTotals = (points: CashFlowPoint[]) =>
  points.reduce(
    (totals, point) => {
      totals.income += point.income;
      totals.expense += point.expense;
      return totals;
    },
    { income: 0, expense: 0 }
  );

const calculateDelta = (current: number, previous: number) =>
  previous === 0 ? 0 : ((current - previous) / previous) * 100;

export const useCashFlowTimeline = () => {
  const { start, end, granularity } = useAnalyticsFilters();

  return React.useMemo(() => buildTimeline(start, end, granularity), [start, end, granularity]);
};

export const useAnalyticsSummary = (): AnalyticsSummary => {
  const { start, end, granularity } = useAnalyticsFilters();
  const currentTimeline = React.useMemo(() => buildTimeline(start, end, granularity), [start, end, granularity]);

  const currentTotals = calculateTotals(currentTimeline);
  const netCashFlow = currentTotals.income - currentTotals.expense;
  const savingsRate = currentTotals.income === 0 ? 0 : (netCashFlow / currentTotals.income) * 100;

  const diffInDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_IN_MS) + 1);
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(diffInDays - 1));
  const previousTimeline = buildTimeline(previousStart, previousEnd, granularity);
  const previousTotals = calculateTotals(previousTimeline);
  const previousNet = previousTotals.income - previousTotals.expense;
  const previousSavingsRate =
    previousTotals.income === 0 ? 0 : (previousNet / previousTotals.income) * 100;

  return {
    incomeTotal: currentTotals.income,
    expenseTotal: currentTotals.expense,
    netCashFlow,
    savingsRate,
    deltas: {
      income: calculateDelta(currentTotals.income, previousTotals.income),
      expense: calculateDelta(currentTotals.expense, previousTotals.expense),
      net: calculateDelta(netCashFlow, previousNet),
      savingsRate: calculateDelta(savingsRate, previousSavingsRate)
    }
  };
};

export const useSpendingByCategory = () => {
  const { expenseTotal } = useAnalyticsSummary();

  const categories = React.useMemo<SpendingCategory[]>(() => {
    const baseCategories = [
      { name: "Renta", weight: 0.32 },
      { name: "Supermercado", weight: 0.18 },
      { name: "Restaurantes", weight: 0.14 },
      { name: "Transporte", weight: 0.11 },
      { name: "Salud", weight: 0.08 },
      { name: "Entretenimiento", weight: 0.07 },
      { name: "Servicios", weight: 0.05 }
    ];

    const totalWeight = baseCategories.reduce((sum, category) => sum + category.weight, 0);
    const normalized = baseCategories.map((category) => ({
      ...category,
      weight: category.weight / totalWeight
    }));

    const topFive = normalized.slice(0, 5);
    const otherWeight = normalized.slice(5).reduce((sum, category) => sum + category.weight, 0);

    const computed = topFive.map((category) => ({
      name: category.name,
      amount: Math.round(expenseTotal * category.weight),
      percentage: category.weight * 100
    }));

    if (otherWeight > 0) {
      computed.push({
        name: "Otros",
        amount: Math.round(expenseTotal * otherWeight),
        percentage: otherWeight * 100
      });
    }

    return computed;
  }, [expenseTotal]);

  return {
    total: expenseTotal,
    categories
  };
};
