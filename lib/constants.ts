// ─── Transaction categories ───────────────────────────────────────────────────
export const TRANSACTION_CATEGORIES = [
  "Salario",
  "Bono",
  "Freelance",
  "Inversiones",
  "Supermercado",
  "Restaurantes",
  "Renta",
  "Transporte",
  "Salud",
  "Entretenimiento",
  "Servicios",
  "Café",
  "Otros",
] as const

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]

// ─── Transaction types ────────────────────────────────────────────────────────
export const TRANSACTION_TYPES = ["ingreso", "egreso"] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

// ─── Currencies ───────────────────────────────────────────────────────────────
export const SUPPORTED_CURRENCIES = ["MXN", "USD"] as const
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]

// ─── Analytics date presets ───────────────────────────────────────────────────
export const DATE_PRESETS = [
  { label: "Últimos 7 días", value: "last-7" },
  { label: "Últimos 30 días", value: "last-30" },
  { label: "Últimos 90 días", value: "last-90" },
  { label: "Último año", value: "last-12m" },
  { label: "Personalizado", value: "custom" },
] as const

// ─── Chart colors ─────────────────────────────────────────────────────────────
export const CHART_COLORS = {
  income: "#10b981",
  expense: "#f43f5e",
  net: "#6366f1",
} as const

export const SPENDING_PALETTE = [
  "#6366f1",
  "#f97316",
  "#14b8a6",
  "#facc15",
  "#e879f9",
  "#94a3b8",
] as const

// ─── Savings goal (default, configurable per user in future) ──────────────────
export const DEFAULT_SAVINGS_GOAL_PERCENT = 20

// ─── Amount color helpers ─────────────────────────────────────────────────────
export function getAmountColorClass(amount: number): string {
  return amount >= 0 ? "text-emerald-600" : "text-rose-500"
}

export function getConfidenceColorClass(confidence: number): string {
  if (confidence >= 90) return "text-emerald-600"
  if (confidence >= 70) return "text-amber-500"
  return "text-rose-500"
}
