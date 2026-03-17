export type DateRangePreset = "last-7" | "last-30" | "last-90" | "last-12m" | "custom"
export type Granularity = "day" | "week" | "month"

export type AnalyticsFilters = {
  preset: DateRangePreset
  currency: string
  start: Date
  end: Date
  label: string
  granularity: Granularity
}

export type CashFlowPoint = {
  date: string
  label: string
  income: number
  expense: number
  net: number
}

export type AnalyticsSummary = {
  incomeTotal: number
  expenseTotal: number
  netCashFlow: number
  savingsRate: number
  deltas: {
    income: number
    expense: number
    net: number
    savingsRate: number
  }
}

export type SpendingCategory = {
  name: string
  amount: number
  percentage: number
}
