import { TransactionsFilters } from "@/components/transactions/TransactionsFilters";
import { TransactionsHeader } from "@/components/transactions/TransactionsHeader";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { getTransactions } from "@/lib/transactions";

export default async function TransactionsPage({
  searchParams
}: {
  searchParams: { month?: string; account?: string; search?: string };
}) {
  const transactions = await getTransactions({
    month: searchParams.month,
    account: searchParams.account,
    search: searchParams.search
  });

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <TransactionsHeader />
      </div>
      <div className="container space-y-6 py-8">
        <div className="rounded-xl border bg-card p-4">
          <TransactionsFilters />
        </div>
        <TransactionsTable data={transactions} />
      </div>
    </main>
  );
}
