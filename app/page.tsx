import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 py-10">
      <PageHeader
        title="FinanceFlow"
        subtitle="Manage your personal finances with clarity and control."
        className="space-y-3 text-center"
      />
      <Button asChild>
        <Link href="/transactions">Go to transactions</Link>
      </Button>
    </main>
  );
}
