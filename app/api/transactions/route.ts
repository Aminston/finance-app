import { ok, handleRouteError, requireAuth } from "@/lib/api"
import { transactionService } from "@/features/transactions/lib/service"

export async function GET(request: Request) {
  try {
    const { organizationId } = await requireAuth()
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const account = searchParams.get("account")
    const search = searchParams.get("search")

    const transactions = await transactionService.getFiltered({ month, account, search }, organizationId)
    return ok(transactions)
  } catch (error) {
    return handleRouteError(error)
  }
}
