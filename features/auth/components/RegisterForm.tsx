"use client"

import * as React from "react"
import Link from "next/link"
import { signUp } from "../lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RegisterForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const result = await signUp(new FormData(event.currentTarget))
    if (result?.error) {
      setError(result.error)
      setPending(false)
    } else if (result?.success) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-xl font-semibold">Revisa tu email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enviamos un enlace de confirmación a tu dirección de email. Haz clic en el enlace para activar tu cuenta.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold mb-1">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          FinanceFlow
        </div>
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Comienza a gestionar tus finanzas</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">Nombre completo</label>
          <Input id="name" name="name" type="text" placeholder="Juan Pérez" required autoComplete="name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input id="email" name="email" type="email" placeholder="tu@email.com" required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} autoComplete="new-password" />
          <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
