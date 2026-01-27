import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CashFlowChart } from "@/components/analytics/CashFlowChart";
import { Insights } from "@/components/analytics/Insights";
import { KpiRow } from "@/components/analytics/KpiRow";
import { SpendingBreakdown } from "@/components/analytics/SpendingBreakdown";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="container py-6">
          <AnalyticsFilters />
        </div>
      </div>

      <div className="container space-y-6 py-8">
        <KpiRow />
        <CashFlowChart />
        <SpendingBreakdown />
        <Insights />
      </div>
    </main>
  );
}
