import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AppError, UnauthorizedError, ForbiddenError } from "./errors"
import { createClient } from "./supabase/server"
import { prisma } from "./db"

// ─── Response types ───────────────────────────────────────────────────────────
export type ApiSuccess<T> = { data: T; error: null }
export type ApiError = { data: null; error: { message: string; code: string } }
export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ─── Response builders ────────────────────────────────────────────────────────
export function ok<T>(data: T): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data, error: null })
}

export function err(
  message: string,
  code = "INTERNAL_ERROR",
  status = 500
): NextResponse<ApiError> {
  return NextResponse.json({ data: null, error: { message, code } }, { status })
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
export async function requireAuth() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new UnauthorizedError()

  const organizationId = cookies().get("activeOrgId")?.value
  if (!organizationId) throw new ForbiddenError()

  const member = await prisma.member.findUnique({
    where: { userId_organizationId: { userId: user.id, organizationId } },
  })
  if (!member) throw new ForbiddenError()

  return { user, organizationId, role: member.role }
}

// ─── Route error handler ──────────────────────────────────────────────────────
export function handleRouteError(error: unknown): NextResponse<ApiError> {
  if (error instanceof AppError) {
    return err(error.message, error.code, error.status)
  }
  console.error("[API Error]", error)
  return err("Ocurrió un error inesperado")
}
