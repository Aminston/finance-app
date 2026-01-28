import Link from "next/link";

import { PageHeaderSection } from "@/components/layout/PageHeaderSection";
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
    <PageHeaderSection
      title="FinanceFlow"
      subtitle="Keep every transaction organized and ready for analysis."
      actions={
        <>
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
        </>
      }
    />
  );
}
