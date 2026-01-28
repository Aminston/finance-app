"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";

import { PageHeaderSection } from "@/components/layout/PageHeaderSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatInputDate, useAnalyticsFilters } from "@/lib/analytics";

const presets = [
  { label: "Últimos 7 días", value: "last-7" },
  { label: "Últimos 30 días", value: "last-30" },
  { label: "Últimos 90 días", value: "last-90" },
  { label: "Últimos 12 meses", value: "last-12m" },
  { label: "Rango personalizado", value: "custom" }
] as const;

const currencies = ["MXN", "USD"] as const;

export function AnalyticsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { preset, currency, start, end, label } = useAnalyticsFilters();

  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const handlePresetChange = (value: string) => {
    if (value === "custom") {
      updateParams({ range: value });
    } else {
      updateParams({ range: value, start: null, end: null });
    }
  };

  const handleDateChange = (key: "start" | "end", value: string) => {
    updateParams({ range: "custom", [key]: value });
  };

  return (
    <PageHeaderSection
      title="Analítica"
      subtitle="Visión rápida del flujo, gasto y capacidad de ahorro."
      actions={
        <>
          <Badge variant="outline" className="text-xs font-medium">
            {label}
          </Badge>
          <Button asChild variant="outline" className="h-9">
            <Link href="/transactions">Volver a transacciones</Link>
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <Select value={preset} onValueChange={handlePresetChange}>
          <SelectTrigger className="h-10 w-[200px]">
            <SelectValue placeholder="Rango de fechas" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currency} onValueChange={(value) => updateParams({ currency: value })}>
          <SelectTrigger className="h-10 w-[120px]">
            <SelectValue placeholder="Moneda" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {preset === "custom" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Desde</span>
              <Input
                type="date"
                value={formatInputDate(start)}
                onChange={(event) => handleDateChange("start", event.target.value)}
                className="w-[160px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Hasta</span>
              <Input
                type="date"
                value={formatInputDate(end)}
                onChange={(event) => handleDateChange("end", event.target.value)}
                className="w-[160px]"
              />
            </div>
          </div>
        )}
      </div>
    </PageHeaderSection>
  );
}
