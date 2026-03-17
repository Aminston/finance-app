import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { CheckIcon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatTransactionDate } from "@/lib/date"
import { cn } from "@/lib/utils"
import { TRANSACTION_CATEGORIES, getAmountColorClass, getConfidenceColorClass } from "@/lib/constants"
import type { Transaction } from "../types"

type ColumnOptions = {
  accounts: string[]
  onUpdateRow: (id: string, patch: Partial<Transaction>) => void
  onOpenCreateAccount: (rowId: string) => void
}

export function buildTransactionColumns({
  accounts,
  onUpdateRow,
  onOpenCreateAccount,
}: ColumnOptions): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatTransactionDate(row.original.date)}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <Input
          className="h-8"
          value={row.original.description}
          onChange={(e) => onUpdateRow(row.original.id, { description: e.target.value })}
        />
      ),
    },
    {
      accessorKey: "merchant",
      header: "Comercio",
      cell: ({ row }) => (
        <Input
          className="h-8"
          value={row.original.merchant}
          onChange={(e) => onUpdateRow(row.original.id, { merchant: e.target.value })}
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => {
        const amount = row.original.amount
        return (
          <Input
            className={cn("h-8 text-right font-semibold", getAmountColorClass(amount))}
            type="number"
            step="0.01"
            value={Number.isNaN(amount) ? "" : amount}
            onChange={(e) =>
              onUpdateRow(row.original.id, {
                amount: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />
        )
      },
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: ({ row }) => (
        <Select
          value={row.original.category}
          onValueChange={(value) => onUpdateRow(row.original.id, { category: value })}
        >
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "account",
      header: "Cuenta",
      cell: ({ row }) => (
        <Select
          value={row.original.account}
          onValueChange={(value) => onUpdateRow(row.original.id, { account: value })}
        >
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc} value={acc}>
                {acc}
              </SelectItem>
            ))}
            <SelectSeparator />
            <div className="border-t bg-muted/30 px-1 py-1">
              <button
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm font-medium text-primary hover:bg-accent"
                type="button"
                onClick={() => onOpenCreateAccount(row.original.id)}
              >
                Crear nueva cuenta…
              </button>
            </div>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "statement",
      header: "Estado de cuenta",
      cell: ({ row }) => (
        <Input
          className="h-8"
          value={row.original.statement}
          onChange={(e) => onUpdateRow(row.original.id, { statement: e.target.value })}
        />
      ),
    },
    {
      accessorKey: "confidence",
      header: "Confianza",
      cell: ({ row }) => {
        const confidence = row.original.confidence
        return (
          <div className={cn("flex items-center gap-2 font-medium", getConfidenceColorClass(confidence))}>
            <CheckIcon className="h-4 w-4" />
            {confidence}%
          </div>
        )
      },
    },
  ]
}
