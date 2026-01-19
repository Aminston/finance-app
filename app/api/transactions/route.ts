import { NextResponse } from "next/server";
import { getTransactions } from "@/lib/transactions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const account = searchParams.get("account");
  const search = searchParams.get("search");

  const transactions = await getTransactions({ month, account, search });

  return NextResponse.json({ data: transactions });
}
