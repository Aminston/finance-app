import Link from "next/link";

import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CashFlowChart } from "@/components/analytics/CashFlowChart";
import { Insights } from "@/components/analytics/Insights";
import { KpiRow } from "@/components/analytics/KpiRow";
import { SpendingBreakdown } from "@/components/analytics/SpendingBreakdown";
import { FiltersCard } from "@/components/layout/FiltersCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <PageHeader
          title="Analytics"
          description="Track cash flow trends and spending insights in one place."
          actions={
            <Button variant="ghost" asChild>
              <Link href="/transactions">Transactions</Link>
            </Button>
          }
        />
      </div>

      <div className="container space-y-6 py-8">
        <FiltersCard>
          <AnalyticsFilters />
        </FiltersCard>
        <KpiRow />
        <CashFlowChart />
        <SpendingBreakdown />
        <Insights />
      </div>
    </main>
  );
}
