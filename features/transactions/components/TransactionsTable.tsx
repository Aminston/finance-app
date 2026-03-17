"use client"

import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import type { Transaction } from "../types"
import { useTransactionRows } from "../hooks/useTransactionRows"
import { buildTransactionColumns } from "./TransactionsColumns"
import { CreateAccountDialog } from "./CreateAccountDialog"

type TransactionsTableProps = {
  data: Transaction[]
}

export function TransactionsTable({ data }: TransactionsTableProps) {
  const { rows, accounts, updateRow, addAccount } = useTransactionRows(data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [activeRowId, setActiveRowId] = React.useState<string | null>(null)
  const parentRef = React.useRef<HTMLDivElement | null>(null)

  const handleOpenCreateAccount = React.useCallback((rowId: string) => {
    setActiveRowId(rowId)
    setDialogOpen(true)
  }, [])

  const handleSaveAccount = React.useCallback(
    (name: string) => {
      addAccount(name)
      if (activeRowId) updateRow(activeRowId, { account: name })
      setActiveRowId(null)
    },
    [activeRowId, addAccount, updateRow]
  )

  const columns = React.useMemo(
    () => buildTransactionColumns({ accounts, onUpdateRow: updateRow, onOpenCreateAccount: handleOpenCreateAccount }),
    [accounts, updateRow, handleOpenCreateAccount]
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  })

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="px-6 py-4">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b">
                    {hg.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 font-medium">
                        {header.isPlaceholder ? null : (
                          <button
                            className={cn(
                              "flex w-full items-center gap-2 text-left",
                              header.column.getCanSort() && "cursor-pointer select-none"
                            )}
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === "asc" ? "↑" : null}
                            {header.column.getIsSorted() === "desc" ? "↓" : null}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
            <div ref={parentRef} className="max-h-[520px] overflow-auto">
              <table className="w-full border-collapse text-left text-sm">
                <tbody
                  className="relative block"
                  style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = table.getRowModel().rows[virtualRow.index]
                    return (
                      <tr
                        key={row.id}
                        data-index={virtualRow.index}
                        className="absolute left-0 right-0 flex border-b last:border-b-0"
                        style={{ transform: `translateY(${virtualRow.start}px)` }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="flex-1 px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveAccount}
      />
    </>
  )
}
