import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bankName = searchParams.get("bankName");

  if (!bankName) {
    return NextResponse.json({ error: "bankName is required" }, { status: 400 });
  }

  const mapping = await prisma.importMapping.findUnique({
    where: { bankName }
  });

  return NextResponse.json({ data: mapping });
}

export async function POST(request: Request) {
  const body = await request.json();
  const bankName = body?.bankName as string | undefined;
  const mapping = body?.mapping as Record<string, string> | undefined;

  if (!bankName || !mapping) {
    return NextResponse.json({ error: "bankName and mapping are required" }, { status: 400 });
  }

  const saved = await prisma.importMapping.upsert({
    where: { bankName },
    update: { mappingJson: mapping },
    create: { bankName, mappingJson: mapping }
  });

  return NextResponse.json({ data: saved });
}
