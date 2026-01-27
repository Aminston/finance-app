"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UploadIcon } from "@radix-ui/react-icons";
import { ColumnMappingDialog } from "@/components/transactions/ColumnMappingDialog";
import { parseFileToRows } from "@/lib/import/fileParsers";

const TARGET_FIELDS = [
  { label: "Ignorar", value: "ignore" },
  { label: "Fecha", value: "date" },
  { label: "Descripción", value: "description" },
  { label: "Monto", value: "amount" },
  { label: "Cuenta", value: "account" },
  { label: "Categoría", value: "category" },
  { label: "Comercio", value: "merchant" },
  { label: "Tipo", value: "type" }
];

const REQUIRED_FIELDS = ["date", "amount", "description"];

export function UploadDialog() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedColumns, setParsedColumns] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [bankSelection, setBankSelection] = useState("");
  const [customBankName, setCustomBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isMappingOpen, setIsMappingOpen] = useState(false);
  const [saveMapping, setSaveMapping] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const bankName = bankSelection === "other" ? customBankName : bankSelection;

  useEffect(() => {
    if (!bankName || parsedColumns.length === 0) {
      return;
    }

    const fetchMapping = async () => {
      try {
        const response = await fetch(`/api/import-mappings?bankName=${encodeURIComponent(bankName)}`);
        if (!response.ok) {
          return;
        }
        const payload = await response.json();
        const storedMapping = payload?.data?.mappingJson ?? {};
        const nextMapping = parsedColumns.reduce<Record<string, string>>((acc, column) => {
          acc[column] = storedMapping[column] ?? "ignore";
          return acc;
        }, {});
        setMapping(nextMapping);
      } catch (error) {
        console.error("Failed to load mapping", error);
      }
    };

    fetchMapping();
  }, [bankName, parsedColumns]);

  const missingFields = useMemo(() => {
    const mappedTargets = new Set(
      Object.values(mapping).filter((value) => value && value !== "ignore")
    );
    return REQUIRED_FIELDS.filter((field) => !mappedTargets.has(field));
  }, [mapping]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) {
      return;
    }
    setFileName(nextFile.name);
    setLoadError(null);

    try {
      const { columns, rows } = await parseFileToRows(nextFile);
      setParsedColumns(columns);
      setParsedRows(rows);
      setMapping(columns.reduce<Record<string, string>>((acc, column) => ({ ...acc, [column]: "ignore" }), {}));
      setIsMappingOpen(true);
    } catch (error) {
      console.error("Failed to parse file", error);
      setLoadError("No se pudo leer el archivo. Verifica que el formato sea CSV o Excel.");
    }
  };

  const handleMappingChange = (column: string, value: string) => {
    setMapping((prev) => ({ ...prev, [column]: value }));
  };

  const handleConfirmMapping = async () => {
    if (missingFields.length > 0 || parsedRows.length === 0) {
      return;
    }

    setIsImporting(true);
    try {
      if (saveMapping && bankName) {
        await fetch("/api/import-mappings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bankName, mapping })
        });
      }

      await fetch("/api/transactions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName,
          accountName,
          rows: parsedRows,
          mapping
        })
      });

      setIsMappingOpen(false);
    } catch (error) {
      console.error("Failed to import transactions", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload CSV/XLSX</Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle>Upload Statement</DialogTitle>
          <DialogDescription>
            Importa un archivo CSV o Excel para cargar transacciones automáticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Archivo CSV/XLSX</label>
            <div className="border border-dashed rounded-xl h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <UploadIcon className="h-8 w-8" />
              <div className="text-center text-sm">
                <p>Arrastra tu archivo aquí</p>
                <p>
                  or{" "}
                  <label
                    htmlFor="statement-file"
                    className="text-primary underline underline-offset-4 cursor-pointer"
                  >
                    click to browse
                  </label>
                </p>
              </div>
              <Input
                id="statement-file"
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {fileName && <p className="text-xs text-muted-foreground">Archivo seleccionado: {fileName}</p>}
            {loadError && <p className="text-xs text-destructive">{loadError}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bank / Card Issuer *</label>
            <Select value={bankSelection} onValueChange={setBankSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select issuer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chase">Chase</SelectItem>
                <SelectItem value="American Express">American Express</SelectItem>
                <SelectItem value="Citi">Citi</SelectItem>
                <SelectItem value="Bank of America">Bank of America</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del banco (si aplica)</label>
            <Input
              placeholder="e.g., Chase Sapphire"
              value={customBankName}
              onChange={(event) => setCustomBankName(event.target.value)}
              disabled={bankSelection !== "other"}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Name (optional)</label>
            <Input
              placeholder="e.g., Chase Sapphire"
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-3 sm:gap-2">
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={isImporting || parsedRows.length === 0}
          >
            {isImporting ? "Procesando..." : "Procesar archivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ColumnMappingDialog
        open={isMappingOpen}
        onOpenChange={setIsMappingOpen}
        columns={parsedColumns}
        mapping={mapping}
        mappingOptions={TARGET_FIELDS}
        missingFields={missingFields}
        bankName={bankName}
        savePreference={saveMapping}
        onMappingChange={handleMappingChange}
        onSavePreferenceChange={setSaveMapping}
        onConfirm={handleConfirmMapping}
      />
    </Dialog>
  );
}
