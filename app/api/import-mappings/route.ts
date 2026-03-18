import { prisma } from "@/lib/db"
import { ok, handleRouteError, requireAuth } from "@/lib/api"
import { ValidationError } from "@/lib/errors"

export async function GET(request: Request) {
  try {
    const { organizationId } = await requireAuth()
    const { searchParams } = new URL(request.url)
    const bankName = searchParams.get("bankName")
    if (!bankName) throw new ValidationError("bankName es requerido")

    const mapping = await prisma.importMapping.findUnique({
      where: { organizationId_bankName: { organizationId, bankName } },
    })
    return ok(mapping)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    const { user, organizationId } = await requireAuth()
    const body = await request.json()
    const { bankName, mapping } = body as { bankName?: string; mapping?: Record<string, string> }
    if (!bankName || !mapping) throw new ValidationError("bankName y mapping son requeridos")

    const saved = await prisma.importMapping.upsert({
      where: { organizationId_bankName: { organizationId, bankName } },
      update: { mappingJson: mapping },
      create: { bankName, mappingJson: mapping, userId: user.id, organizationId },
    })
    return ok(saved)
  } catch (error) {
    return handleRouteError(error)
  }
}
