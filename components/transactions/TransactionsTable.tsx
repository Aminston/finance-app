"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { CheckIcon } from "@radix-ui/react-icons";

import type { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.date}</span>
        )
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <span className="font-medium">{row.original.description}</span>
      },
      {
        accessorKey: "merchant",
        header: "Merchant"
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.original.amount;
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
          }).format(amount);

          return (
            <span
              className={cn(
                "font-semibold",
                amount >= 0 ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {formatted}
            </span>
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
              onValueChange={(value) => {
                setRows((prev) =>
                  prev.map((item) =>
                    item.id === transaction.id ? { ...item, category: value } : item
                  )
                );
              }}
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
        header: "Account"
      },
      {
        accessorKey: "statement",
        header: "Statement",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.statement}</span>
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
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8
  });

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <p className="text-sm text-muted-foreground">Track income and expenses across accounts.</p>
      </div>
      <div className="px-6 py-4">
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
  );
}
