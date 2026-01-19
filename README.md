# FinanceFlow

FinanceFlow is a personal finance dashboard built with Next.js, Prisma, and modern UI primitives.

## Stack

- Next.js + TypeScript + App Router
- TailwindCSS
- shadcn/ui components
- TanStack Table + Virtual
- Prisma ORM + PostgreSQL

## Getting started

```bash
npm install
npm run dev
```

## Prisma

1. Copy `.env.example` to `.env` and set your `DATABASE_URL`.
2. Run the migrate script:

```bash
npm run prisma:migrate
```

## Scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` — build the app
- `npm run start` — start the production server
- `npm run prisma:migrate` — run Prisma migrations
