import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type ImportPayload = {
  bankName?: string;
  accountName?: string;
  rows: Record<string, string>[];
  mapping: Record<string, string>;
};

const REQUIRED_FIELDS = ["date", "amount", "description"];

const buildTargetToSource = (mapping: Record<string, string>) => {
  return Object.entries(mapping).reduce<Record<string, string>>((acc, [source, target]) => {
    if (target && target !== "ignore" && !acc[target]) {
      acc[target] = source;
    }
    return acc;
  }, {});
};

const parseAmount = (value?: string) => {
  if (!value) {
    return null;
  }
  const normalized = value.replace(/[^0-9,.-]/g, "").replace(/,/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const parseDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ImportPayload;
  const { bankName, accountName, rows, mapping } = body;

  if (!rows?.length || !mapping) {
    return NextResponse.json({ error: "rows and mapping are required" }, { status: 400 });
  }

  const targetToSource = buildTargetToSource(mapping);
  const missingRequired = REQUIRED_FIELDS.filter((field) => !targetToSource[field]);

  if (missingRequired.length > 0) {
    return NextResponse.json(
      { error: `Missing required mappings: ${missingRequired.join(", ")}` },
      { status: 400 }
    );
  }

  const accountLabel = accountName || bankName || "Imported Account";
  const accountCache = new Map<string, string>();

  const getAccountId = async (name: string) => {
    if (accountCache.has(name)) {
      return accountCache.get(name) as string;
    }

    const existing = await prisma.account.findFirst({
      where: {
        name,
        institution: bankName ?? undefined
      }
    });

    const account = existing ??
      (await prisma.account.create({
        data: { name, institution: bankName ?? undefined }
      }));

    accountCache.set(name, account.id);
    return account.id;
  };

  const transactions = [];

  for (const row of rows) {
    const dateValue = parseDate(row[targetToSource.date]);
    const amountValue = parseAmount(row[targetToSource.amount]);
    const descriptionValue = row[targetToSource.description]?.trim();

    if (!dateValue || amountValue == null || !descriptionValue) {
      continue;
    }

    const merchantValue = targetToSource.merchant ? row[targetToSource.merchant]?.trim() : null;
    const categoryValue = targetToSource.category ? row[targetToSource.category]?.trim() : null;
    const accountValue = targetToSource.account ? row[targetToSource.account]?.trim() : null;
    const typeValue = targetToSource.type ? row[targetToSource.type]?.trim() : null;

    const normalizedAmount = amountValue;
    const computedType = typeValue || (normalizedAmount < 0 ? "debit" : "credit");
    const resolvedAccountName = accountValue || accountLabel;
    const accountId = await getAccountId(resolvedAccountName);

    transactions.push({
      date: dateValue,
      description: descriptionValue,
      merchant: merchantValue || descriptionValue,
      amount: normalizedAmount,
      type: computedType,
      category: categoryValue || "Uncategorized",
      accountId,
      statement: bankName || "Imported",
      confidence: 100
    });
  }

  if (transactions.length === 0) {
    return NextResponse.json(
      { error: "No valid rows after applying the mapping." },
      { status: 400 }
    );
  }

  await prisma.transaction.createMany({
    data: transactions
  });

  return NextResponse.json({ data: { imported: transactions.length } });
}
