"use server"

import { redirect } from "next/navigation"
import { headers, cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db"

function getOrigin() {
  const headersList = headers()
  const host = headersList.get("host")
  const proto = headersList.get("x-forwarded-proto") ?? "http"
  return `${proto}://${host}`
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect("/")
}

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getOrigin()}/auth/callback`,
      data: { full_name: name },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create Profile record with the same UUID as auth.users
  if (data.user) {
    await prisma.profile.upsert({
      where: { id: data.user.id },
      update: {},
      create: { id: data.user.id, fullName: name },
    })
  }

  return { success: true }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()

  // Clear active org cookie
  cookies().set("activeOrgId", "", { maxAge: 0, path: "/" })

  redirect("/login")
}

export async function resetPasswordRequest(formData: FormData) {
  const email = formData.get("email") as string

  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getOrigin()}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string

  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  redirect("/")
}
