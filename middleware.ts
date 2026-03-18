import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"]
const ORG_EXEMPT_ROUTES = ["/onboarding", "/auth/callback"]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  // Refresh session — required on every request with @supabase/ssr
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  const isOrgExempt = ORG_EXEMPT_ROUTES.some((r) => pathname.startsWith(r))

  // Authenticated user hitting auth pages → redirect to app
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Unauthenticated user hitting protected page → redirect to login
  if (!user && !isAuthRoute && !isOrgExempt) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Authenticated user with no active org → redirect to onboarding
  if (user && !isAuthRoute && !isOrgExempt) {
    const activeOrgId = request.cookies.get("activeOrgId")?.value
    if (!activeOrgId) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
