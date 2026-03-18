"use client"

import * as React from "react"
import { createOrgAction } from "../lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CreateOrgForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const result = await createOrgAction(new FormData(event.currentTarget))
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre de la organización
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Mi empresa, Familia Pérez..."
          required
          minLength={2}
          maxLength={80}
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Puede ser tu nombre, empresa o cualquier grupo de personas.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creando..." : "Crear organización"}
      </Button>
    </form>
  )
}
