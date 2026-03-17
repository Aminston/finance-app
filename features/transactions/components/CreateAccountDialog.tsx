"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type CreateAccountDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string) => void
}

export function CreateAccountDialog({ open, onOpenChange, onSave }: CreateAccountDialogProps) {
  const [name, setName] = React.useState("")

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) setName("")
      onOpenChange(next)
    },
    [onOpenChange]
  )

  const handleSave = React.useCallback(() => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    handleOpenChange(false)
  }, [name, onSave, handleOpenChange])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva cuenta</DialogTitle>
          <DialogDescription>Agrega una cuenta para seguir tus transacciones.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="new-account-name">
            Nombre de la cuenta
          </label>
          <Input
            id="new-account-name"
            placeholder="Ej. Cuenta nómina"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
