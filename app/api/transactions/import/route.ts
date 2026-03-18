import { transactionService } from "@/features/transactions/lib/service"
import { ok, handleRouteError, requireAuth } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const { user, organizationId } = await requireAuth()
    const body = await request.json()
    const result = await transactionService.importFromFile(body, user.id, organizationId)
    return ok(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
