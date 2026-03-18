"use client"

import * as React from "react"
import { updatePassword } from "../lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ResetPasswordForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirm = formData.get("confirm") as string

    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    setPending(true)
    setError(null)
    const result = await updatePassword(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Nueva contraseña</h1>
        <p className="mt-1 text-sm text-muted-foreground">Elige una contraseña segura</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">Nueva contraseña</label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} autoComplete="new-password" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-sm font-medium">Confirmar contraseña</label>
          <Input id="confirm" name="confirm" type="password" placeholder="••••••••" required minLength={8} autoComplete="new-password" />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Guardando..." : "Guardar contraseña"}
        </Button>
      </form>
    </div>
  )
}
