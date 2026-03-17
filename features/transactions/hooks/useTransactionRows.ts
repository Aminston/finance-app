"use client"

import * as React from "react"
import type { Transaction } from "../types"

export function useTransactionRows(initialData: Transaction[]) {
  const [rows, setRows] = React.useState<Transaction[]>(initialData)
  const [accounts, setAccounts] = React.useState<string[]>(() => {
    const unique = Array.from(new Set(initialData.map((t) => t.account))).filter(Boolean)
    return unique.length > 0 ? unique : ["Cuenta principal", "Ahorros", "Tarjeta de crédito"]
  })

  const updateRow = React.useCallback((id: string, patch: Partial<Transaction>) => {
    setRows((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  const addAccount = React.useCallback((name: string) => {
    setAccounts((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }, [])

  return { rows, accounts, updateRow, addAccount }
}
