import Link from "next/link";
import { Suspense } from "react";

import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CashFlowChart } from "@/components/analytics/CashFlowChart";
import { Insights } from "@/components/analytics/Insights";
import { KpiRow } from "@/components/analytics/KpiRow";
import { SpendingBreakdown } from "@/components/analytics/SpendingBreakdown";
import { FiltersCard } from "@/components/layout/FiltersCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartSkeleton } from "@/components/shared/skeletons/ChartSkeleton";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <PageHeader
          title="Analítica"
          description="Seguimiento de flujo de caja e insights de gastos."
          actions={
            <Button variant="ghost" asChild>
              <Link href="/transactions">Transacciones</Link>
            </Button>
          }
        />
      </div>

      <div className="container space-y-6 py-8">
        <Suspense>
          <FiltersCard>
            <AnalyticsFilters />
          </FiltersCard>
          <KpiRow />
          <Suspense fallback={<ChartSkeleton />}>
            <CashFlowChart />
          </Suspense>
          <Suspense fallback={<ChartSkeleton height={200} />}>
            <SpendingBreakdown />
          </Suspense>
          <Insights />
        </Suspense>
      </div>
    </main>
  );
}
