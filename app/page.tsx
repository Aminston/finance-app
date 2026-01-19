import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 py-10">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">FinanceFlow</h1>
        <p className="mt-3 text-muted-foreground">
          Manage your personal finances with clarity and control.
        </p>
      </div>
      <Button asChild>
        <Link href="/transactions">Go to transactions</Link>
      </Button>
    </main>
  );
}
