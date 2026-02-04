"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { CheckIcon } from "@radix-ui/react-icons";

import type { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatTransactionDate } from "@/lib/date";
import { cn } from "@/lib/utils";

const categories = [
  "Salary",
  "Bonus",
  "Groceries",
  "Dining",
  "Housing",
  "Transport",
  "Health",
  "Entertainment",
  "Coffee",
  "Freelance"
];

type TransactionsTableProps = {
  data: Transaction[];
};

export function TransactionsTable({ data }: TransactionsTableProps) {
  const [rows, setRows] = React.useState<Transaction[]>(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [accounts, setAccounts] = React.useState<string[]>(() => {
    const uniqueAccounts = Array.from(new Set(data.map((item) => item.account))).filter(Boolean);
    return uniqueAccounts.length > 0 ? uniqueAccounts : ["Checking", "Savings", "Credit Card"];
  });
  const [isAccountDialogOpen, setIsAccountDialogOpen] = React.useState(false);
  const [newAccountName, setNewAccountName] = React.useState("");
  const [activeAccountRowId, setActiveAccountRowId] = React.useState<string | null>(null);
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const updateRow = React.useCallback((id: string, patch: Partial<Transaction>) => {
    setRows((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }, []);
  const openCreateAccountDialog = React.useCallback((rowId: string) => {
    setActiveAccountRowId(rowId);
    setNewAccountName("");
    setIsAccountDialogOpen(true);
  }, []);
  const handleDialogOpenChange = React.useCallback((open: boolean) => {
    setIsAccountDialogOpen(open);
    if (!open) {
      setNewAccountName("");
      setActiveAccountRowId(null);
    }
  }, []);
  const handleSaveAccount = React.useCallback(() => {
    const trimmedName = newAccountName.trim();
    if (!trimmedName) {
      return;
    }
    setAccounts((prev) => (prev.includes(trimmedName) ? prev : [...prev, trimmedName]));
    if (activeAccountRowId) {
      updateRow(activeAccountRowId, { account: trimmedName });
    }
    handleDialogOpenChange(false);
  }, [activeAccountRowId, handleDialogOpenChange, newAccountName, updateRow]);

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatTransactionDate(row.original.date)}
          </span>
        )
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <Input
            className="h-8"
            value={row.original.description}
            onChange={(event) => updateRow(row.original.id, { description: event.target.value })}
          />
        )
      },
      {
        accessorKey: "merchant",
        header: "Merchant",
        cell: ({ row }) => (
          <Input
            className="h-8"
            value={row.original.merchant}
            onChange={(event) => updateRow(row.original.id, { merchant: event.target.value })}
          />
        )
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.original.amount;
          return (
            <Input
              className={cn(
                "h-8 text-right font-semibold",
                amount >= 0 ? "text-emerald-600" : "text-rose-600"
              )}
              type="number"
              step="0.01"
              value={Number.isNaN(amount) ? "" : amount}
              onChange={(event) =>
                updateRow(row.original.id, {
                  amount: event.target.value === "" ? 0 : Number(event.target.value)
                })
              }
            />
          );
        }
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.type}
          </Badge>
        )
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <Select
              value={transaction.category}
              onValueChange={(value) => updateRow(transaction.id, { category: value })}
            >
              <SelectTrigger className="h-8 w-[160px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
      },
      {
        accessorKey: "account",
        header: "Account",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <Select
              value={transaction.account}
              onValueChange={(value) => updateRow(transaction.id, { account: value })}
            >
              <SelectTrigger className="h-8 w-[160px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account} value={account}>
                    {account}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <div className="border-t bg-muted/30 px-1 py-1">
                  <button
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm font-medium text-primary hover:bg-accent"
                    type="button"
                    onClick={() => openCreateAccountDialog(transaction.id)}
                  >
                    Crear nueva cuenta…
                  </button>
                </div>
              </SelectContent>
            </Select>
          );
        }
      },
      {
        accessorKey: "statement",
        header: "Statement",
        cell: ({ row }) => (
          <Input
            className="h-8"
            value={row.original.statement}
            onChange={(event) => updateRow(row.original.id, { statement: event.target.value })}
          />
        )
      },
      {
        accessorKey: "confidence",
        header: "Confidence",
        cell: ({ row }) => {
          const confidence = row.original.confidence;
          const color =
            confidence >= 90 ? "text-emerald-600" : confidence >= 75 ? "text-amber-600" : "text-rose-600";
          return (
            <div className={cn("flex items-center gap-2 font-medium", color)}>
              <CheckIcon className="h-4 w-4" />
              {confidence}%
            </div>
          );
        }
      }
    ],
    [updateRow]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8
  });

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="px-6 py-4">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header) => (
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
                    const row = table.getRowModel().rows[virtualRow.index];
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isAccountDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva cuenta</DialogTitle>
            <DialogDescription>Agrega una cuenta para seguir tus transacciones.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="new-account-name">
              Nombre de la cuenta
            </label>
            <Input
              id="new-account-name"
              placeholder="Ej. Cuenta nómina"
              value={newAccountName}
              onChange={(event) => setNewAccountName(event.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveAccount} disabled={!newAccountName.trim()}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
