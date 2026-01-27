"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ColumnMappingOption = {
  label: string;
  value: string;
};

export type ColumnMappingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: string[];
  mapping: Record<string, string>;
  mappingOptions: ColumnMappingOption[];
  missingFields: string[];
  bankName: string;
  savePreference: boolean;
  onMappingChange: (column: string, value: string) => void;
  onSavePreferenceChange: (nextValue: boolean) => void;
  onConfirm: () => void;
};

export function ColumnMappingDialog({
  open,
  onOpenChange,
  columns,
  mapping,
  mappingOptions,
  missingFields,
  bankName,
  savePreference,
  onMappingChange,
  onSavePreferenceChange,
  onConfirm
}: ColumnMappingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Mapeo de columnas</DialogTitle>
          <DialogDescription>
            Vincula las columnas detectadas con los campos de la transacción. Banco: {bankName || "Sin seleccionar"}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto pr-2 flex-1">
          <div className="grid gap-4">
            {columns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No se detectaron columnas en el archivo.</p>
            ) : (
              columns.map((column) => (
                <div key={column} className="grid gap-2 md:grid-cols-[1.2fr_2fr] md:items-center">
                  <div>
                    <p className="text-sm font-medium">{column}</p>
                    <p className="text-xs text-muted-foreground">Columna origen</p>
                  </div>
                  <Select
                    value={mapping[column] ?? "ignore"}
                    onValueChange={(value) => onMappingChange(column, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mappingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-input"
              checked={savePreference}
              onChange={(event) => onSavePreferenceChange(event.target.checked)}
            />
            <span>Guardar preferencia de mapeo para este banco</span>
          </div>
          {missingFields.length > 0 && (
            <p className="text-sm text-destructive">
              Faltan campos obligatorios: {missingFields.join(", ")}. Completa el mapeo para continuar.
            </p>
          )}
        </div>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={onConfirm} disabled={missingFields.length > 0 || columns.length === 0}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
