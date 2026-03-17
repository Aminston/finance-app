export type TransactionType = "ingreso" | "egreso"

export type Transaction = {
  id: string
  date: string
  description: string
  merchant: string
  amount: number
  type: TransactionType
  category: string
  account: string
  statement: string
  confidence: number
}

export type Account = {
  id: string
  name: string
  institution?: string
}

export type TransactionFilters = {
  month?: string | null
  account?: string | null
  search?: string | null
}

export type CreateTransactionData = Omit<Transaction, "id">

export type ImportData = {
  bankName?: string
  accountName?: string
  rows: Record<string, string>[]
  mapping: Record<string, string>
}
