import { prisma } from "@/lib/db"
import { ok, err, handleRouteError } from "@/lib/api"
import { ValidationError } from "@/lib/errors"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bankName = searchParams.get("bankName")
    if (!bankName) throw new ValidationError("bankName es requerido")

    const mapping = await prisma.importMapping.findUnique({ where: { bankName } })
    return ok(mapping)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bankName, mapping } = body as { bankName?: string; mapping?: Record<string, string> }
    if (!bankName || !mapping) throw new ValidationError("bankName y mapping son requeridos")

    // TODO: Sprint 4 — agregar userId desde session cuando auth esté implementado
    const saved = await prisma.importMapping.upsert({
      where: { bankName },
      update: { mappingJson: mapping },
      create: { bankName, mappingJson: mapping, userId: "00000000-0000-0000-0000-000000000000" },
    })
    return ok(saved)
  } catch (error) {
    return handleRouteError(error)
  }
}
