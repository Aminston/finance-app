import { prisma } from "@/lib/db"
import { ValidationError, NotFoundError } from "@/lib/errors"
import type { TransactionFilters, ImportData } from "../types"

const REQUIRED_IMPORT_FIELDS = ["date", "amount", "description"] as const

function buildTargetToSource(mapping: Record<string, string>): Record<string, string> {
  return Object.entries(mapping).reduce<Record<string, string>>((acc, [source, target]) => {
    if (target && target !== "ignore" && !acc[target]) acc[target] = source
    return acc
  }, {})
}

function parseAmount(value?: string): number | null {
  if (!value) return null
  const normalized = value.replace(/[^0-9,.-]/g, "").replace(/,/g, "")
  const parsed = Number.parseFloat(normalized)
  return Number.isNaN(parsed) ? null : parsed
}

function parseDate(value?: string): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export class TransactionService {
  // ─── Queries ───────────────────────────────────────────────────────────────

  async getFiltered(filters: TransactionFilters) {
    const where: Record<string, unknown> = {}

    if (filters.month) {
      const [year, month] = filters.month.split("-").map(Number)
      if (year && month) {
        where.date = {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        }
      }
    }

    if (filters.account && filters.account !== "Todas las cuentas") {
      where.account = { name: filters.account }
    }

    if (filters.search) {
      where.OR = [
        { description: { contains: filters.search, mode: "insensitive" } },
        { merchant: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    return prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      take: 500,
    })
  }

  // ─── Import ────────────────────────────────────────────────────────────────

  async importFromFile(payload: ImportData) {
    const { bankName, accountName, rows, mapping } = payload

    if (!rows?.length || !mapping) {
      throw new ValidationError("rows y mapping son requeridos")
    }

    const targetToSource = buildTargetToSource(mapping)
    const missing = REQUIRED_IMPORT_FIELDS.filter((f) => !targetToSource[f])
    if (missing.length > 0) {
      throw new ValidationError(`Mapeos requeridos faltantes: ${missing.join(", ")}`)
    }

    const accountLabel = accountName || bankName || "Cuenta importada"
    const accountCache = new Map<string, string>()

    const getAccountId = async (name: string): Promise<string> => {
      if (accountCache.has(name)) return accountCache.get(name)!

      const existing = await prisma.account.findFirst({
        where: { name, institution: bankName ?? undefined },
      })

      // TODO: Sprint 4 — reemplazar userId con session.user.id cuando auth esté implementado
      const account =
        existing ??
        (await prisma.account.create({
          data: { name, institution: bankName ?? undefined, userId: "00000000-0000-0000-0000-000000000000" },
        }))

      accountCache.set(name, account.id)
      return account.id
    }

    const transactions = []

    for (const row of rows) {
      const date = parseDate(row[targetToSource.date])
      const amount = parseAmount(row[targetToSource.amount])
      const description = row[targetToSource.description]?.trim()

      if (!date || amount == null || !description) continue

      const merchant = targetToSource.merchant ? row[targetToSource.merchant]?.trim() : null
      const category = targetToSource.category ? row[targetToSource.category]?.trim() : null
      const accountValue = targetToSource.account ? row[targetToSource.account]?.trim() : null
      const typeValue = targetToSource.type ? row[targetToSource.type]?.trim() : null

      const type = typeValue || (amount < 0 ? "egreso" : "ingreso")
      const accountId = await getAccountId(accountValue || accountLabel)

      // TODO: Sprint 4 — reemplazar userId con session.user.id cuando auth esté implementado
      transactions.push({
        date,
        description,
        merchant: merchant || description,
        amount,
        type,
        category: category || "Otros",
        accountId,
        userId: "00000000-0000-0000-0000-000000000000",
        statement: bankName || "Importado",
        confidence: 100,
      })
    }

    if (transactions.length === 0) {
      throw new ValidationError("No hay filas válidas después de aplicar el mapeo")
    }

    await prisma.transaction.createMany({ data: transactions })

    return { imported: transactions.length }
  }

  // ─── Accounts ──────────────────────────────────────────────────────────────

  async getAccounts() {
    return prisma.account.findMany({ orderBy: { name: "asc" } })
  }

  async getAccountById(id: string) {
    const account = await prisma.account.findUnique({ where: { id } })
    if (!account) throw new NotFoundError("Cuenta")
    return account
  }
}

export const transactionService = new TransactionService()
