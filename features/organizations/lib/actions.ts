"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createOrganization } from "./service"
import { ValidationError } from "@/lib/errors"

export async function createOrgAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autenticado" }
  }

  const name = (formData.get("name") as string)?.trim()
  if (!name || name.length < 2) {
    return { error: "El nombre debe tener al menos 2 caracteres" }
  }

  try {
    const org = await createOrganization(user.id, name)

    cookies().set("activeOrgId", org.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: error.message }
    }
    console.error("[createOrgAction]", error)
    return { error: "Error al crear la organización" }
  }

  redirect("/")
}
