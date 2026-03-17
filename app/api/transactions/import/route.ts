import { transactionService } from "@/features/transactions/lib/service"
import { ok, handleRouteError } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await transactionService.importFromFile(body)
    return ok(result)
  } catch (error) {
    return handleRouteError(error)
  }
}
