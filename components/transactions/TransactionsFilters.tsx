"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FiltersBar } from "@/components/layout/FiltersBar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const months = ["January 2024"];
const accounts = ["All Accounts", "Main Checking", "Rewards Card", "Savings"];

export function TransactionsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get("month") ?? "January 2024";
  const currentAccount = searchParams.get("account") ?? "All Accounts";
  const currentSearch = searchParams.get("search") ?? "";

  const updateParams = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return (
    <FiltersBar>
      <Select value={currentMonth} onValueChange={(value) => updateParams("month", value)}>
        <SelectTrigger className="h-10 w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentAccount} onValueChange={(value) => updateParams("account", value)}>
        <SelectTrigger className="h-10 w-[180px]">
          <SelectValue placeholder="All Accounts" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account} value={account}>
              {account}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={currentSearch}
        onChange={(event) => updateParams("search", event.target.value)}
        placeholder="Search merchant or description"
        className="w-[260px]"
      />
    </FiltersBar>
  );
}
