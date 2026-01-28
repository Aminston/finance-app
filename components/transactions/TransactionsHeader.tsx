import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UploadDialog } from "@/components/transactions/UploadDialog";

export function TransactionsHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <PageHeader
        title="FinanceFlow"
        subtitle="Keep every transaction organized and ready for analysis."
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/analytics">Analytics</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
            <DropdownMenuItem>Sync accounts</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UploadDialog />
      </div>
    </div>
  );
}
