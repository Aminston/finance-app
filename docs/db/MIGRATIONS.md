# Migraciones de Base de Datos — FinanceFlow

> Este archivo es el **índice cronológico** de todos los cambios aplicados al schema de Supabase.
> Cada migración tiene su SQL en `docs/db/migrations/`.
>
> **Importante:** Las migraciones se aplican manualmente en Supabase → SQL Editor.
> Siempre registrar aquí después de aplicar.

---

## Historial

| Fecha | Archivo | Descripción | Aplicado |
|-------|---------|-------------|---------|
| 2026-03-17 | `2026-03-17-initial-schema.sql` | Schema inicial completo: profiles, accounts, statement_uploads, processing_jobs, ai_request_logs, transaction_drafts, transactions, categories, import_mappings | ✅ |

---

## Cómo agregar una migración

1. Crea el archivo SQL en `docs/db/migrations/YYYY-MM-DD-descripcion-corta.sql`
2. Aplícalo en Supabase → SQL Editor
3. Agrega una fila a la tabla de arriba con estado `✅`
4. Actualiza `docs/db/schema.md` para reflejar los cambios
5. Actualiza `prisma/schema.prisma` si es necesario y corre `npx prisma generate`

### Template de migración

```sql
-- Migración: YYYY-MM-DD — Descripción
-- Autor: [nombre]
-- PRD: docs/prd/YYYY-MM-DD-feature.md

-- ─── Cambios ──────────────────────────────────────────────────────────────────

-- [Acción 1]
ALTER TABLE public.[tabla] ADD COLUMN [columna] [tipo] [constraints];

-- [Acción 2]
CREATE INDEX IF NOT EXISTS [nombre_idx] ON public.[tabla]([columna]);

-- ─── Rollback ─────────────────────────────────────────────────────────────────
-- Para revertir (ejecutar manualmente si es necesario):
-- ALTER TABLE public.[tabla] DROP COLUMN [columna];
```

---

## Pendientes

| Feature | Schema change requerido | Sprint |
|---------|------------------------|--------|
| Auth + RLS | Habilitar RLS en todas las tablas | Sprint 4 |
| Categorías custom | Conectar `categories` al frontend | Sprint 3 |
