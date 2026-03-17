import { NextResponse } from "next/server"
import { AppError } from "./errors"

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

// ─── Route error handler ──────────────────────────────────────────────────────
export function handleRouteError(error: unknown): NextResponse<ApiError> {
  if (error instanceof AppError) {
    return err(error.message, error.code, error.status)
  }
  console.error("[API Error]", error)
  return err("Ocurrió un error inesperado")
}
