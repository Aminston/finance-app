import { mockTransactions } from "@/data/mockData";
import type { Transaction } from "@/types";

export type TransactionFilters = {
  month?: string | null;
  account?: string | null;
  search?: string | null;
};

const monthMap: Record<string, string> = {
  "January 2024": "2024-01"
};

export async function getTransactions(filters: TransactionFilters = {}) {
  const monthKey = filters.month ? monthMap[filters.month] ?? filters.month : undefined;
  const normalizedSearch = filters.search?.toLowerCase().trim();

  const results = mockTransactions.filter((transaction) => {
    if (monthKey && !transaction.date.startsWith(monthKey)) {
      return false;
    }

    if (filters.account && filters.account !== "All Accounts") {
      if (transaction.account !== filters.account) {
        return false;
      }
    }

    if (normalizedSearch) {
      const haystack = `${transaction.merchant} ${transaction.description}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });

  return results as Transaction[];
}
