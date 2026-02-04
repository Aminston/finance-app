"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const TEMPLATE_URL = "/transactions-template.xlsx";

type UploadStatus = "idle" | "uploading" | "processing" | "complete";

export function TransactionsHeader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [lastFileName, setLastFileName] = useState<string | null>(null);

  const statusLabel = useMemo(() => {
    if (!lastFileName) {
      return null;
    }

    switch (uploadStatus) {
      case "uploading":
        return `Subiendo ${lastFileName}...`;
      case "processing":
        return "Procesando transacciones...";
      case "complete":
        return "Carga completada.";
      default:
        return null;
    }
  }, [lastFileName, uploadStatus]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  };

  const startUploadSimulation = () => {
    clearTimers();
    setUploadStatus("uploading");
    timeoutsRef.current.push(
      window.setTimeout(() => setUploadStatus("processing"), 800)
    );
    timeoutsRef.current.push(
      window.setTimeout(() => setUploadStatus("complete"), 1800)
    );
    timeoutsRef.current.push(
      window.setTimeout(() => setUploadStatus("idle"), 4200)
    );
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLastFileName(file.name);
    startUploadSimulation();
    event.target.value = "";
  };

  return (
    <PageHeader
      title="FinanceFlow"
      description="Keep every transaction organized and ready for analysis."
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
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="inline-flex items-center rounded-md border bg-background shadow-sm">
                <Button
                  className="rounded-r-none border-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Subir Excel
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-l-none border-l px-2"
                      aria-label="Descargar plantilla"
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a href={TEMPLATE_URL} download>
                        Descargar plantilla
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              Plantilla con banco y nombre de cuenta incluidos.
            </span>
            {statusLabel && (
              <span className="text-xs text-muted-foreground" aria-live="polite">
                {statusLabel}
              </span>
            )}
          </div>
        </>
      }
    />
  );
}
