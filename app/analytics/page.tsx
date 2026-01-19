import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-4 py-10">
      <h1 className="text-3xl font-semibold">Analytics</h1>
      <p className="text-muted-foreground">Analytics dashboard coming soon.</p>
      <Button asChild variant="outline">
        <Link href="/transactions">Back to transactions</Link>
      </Button>
    </main>
  );
}
