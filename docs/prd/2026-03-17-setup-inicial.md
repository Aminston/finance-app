---
fecha: 2026-03-17
estado: implementado
autor: Federico
---

# Setup inicial — Arquitectura escalable con Supabase

## Qué se solicitó

- Clonar el repositorio desde GitHub (`Aminston/finance-app`)
- Conectar la aplicación a Supabase (PostgreSQL)
- Auditar el estado actual del código e identificar mejoras
- Proponer y ejecutar una arquitectura escalable y modular presentable al CTO

## Qué se implementó

Se conectó la app a Supabase, se sincronizó el schema de Prisma con la DB existente, y se refactorizó la arquitectura completa hacia un modelo **feature-first** con service layer, tipado de API, validación de environment y componentes compartidos.

La UI quedó visualmente idéntica. Todo el cambio fue estructural.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `.env` | Connection string a Supabase PostgreSQL |
| `prisma/schema.prisma` | Schema Prisma sincronizado con DB de Supabase (8 modelos) |
| `lib/constants.ts` | Categorías, colores, presets — fuente de verdad de valores hardcodeados |
| `lib/api.ts` | `ok()`, `err()`, `handleRouteError()` — contrato tipado para todas las API routes |
| `lib/errors.ts` | `AppError`, `NotFoundError`, `ValidationError`, `UnauthorizedError` |
| `lib/env.ts` | Validación de variables de entorno con Zod en startup |
| `hooks/useUpdateSearchParam.ts` | Hook compartido para actualizar URL search params |
| `components/shared/FilterSelect.tsx` | Select genérico reutilizable (reemplaza 3 duplicados) |
| `components/shared/SectionCard.tsx` | Card wrapper para analytics (reemplaza 3 duplicados) |
| `components/shared/ChartLegend.tsx` | Leyenda de charts reutilizable |
| `components/shared/ErrorBoundary.tsx` | Error boundary genérico como clase React |
| `components/shared/skeletons/TableSkeleton.tsx` | Skeleton de tabla con animación |
| `components/shared/skeletons/ChartSkeleton.tsx` | Skeleton de chart con animación |
| `features/transactions/components/TransactionsTable.tsx` | Reducido de 352 a ~100 líneas (solo shell) |
| `features/transactions/components/TransactionsColumns.tsx` | Column definitions extraídas |
| `features/transactions/components/CreateAccountDialog.tsx` | Dialog de cuenta extraído |
| `features/transactions/hooks/useTransactionRows.ts` | Row state management extraído |
| `features/transactions/lib/service.ts` | Business logic real (import, get, accounts) |
| `features/transactions/types.ts` | Tipos del feature transactions |
| `features/transactions/index.ts` | Barrel export — API pública del feature |
| `features/analytics/components/AnalyticsProvider.tsx` | Context que parsea URL params una sola vez |
| `features/analytics/types.ts` | Tipos del feature analytics |
| `features/analytics/index.ts` | Barrel export — API pública del feature |
| `app/api/transactions/import/route.ts` | Thin controller (5 líneas → llama a service) |
| `app/api/import-mappings/route.ts` | Thin controller con manejo de errores tipado |
| `app/analytics/page.tsx` | Agregado `<Suspense>` boundaries + textos en Español |

## Endpoints / DB

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/transactions/import` | Importa transacciones desde Excel/CSV via `TransactionService` |
| `GET`  | `/api/import-mappings` | Obtiene mapeo de columnas por banco |
| `POST` | `/api/import-mappings` | Guarda/actualiza mapeo de columnas |
| `GET`  | `/api/transactions` | Obtiene transacciones con filtros (pendiente conectar DB real) |
| `GET`  | `/transactions-template.xlsx` | Descarga plantilla Excel para importación |

### Cambios de schema

No se modificó el schema de Supabase. Se actualizó `prisma/schema.prisma` para sincronizar con el schema existente en la DB (que ya tenía las 8 tablas).

Ver schema completo en `docs/db/schema.md`.

## Decisiones de diseño

**Feature-first architecture sobre organización por tipo**
> Se eligió `features/[nombre]/` en lugar de `components/`, `lib/`, `hooks/` globales porque permite que cada desarrollador sea dueño de un módulo completo sin riesgo de colisiones. Escala mejor en equipo.

**Sin Repository Pattern por ahora**
> Prisma ya es una abstracción suficiente. El Repository Pattern añadiría complejidad sin ganancia real en este momento. Se agrega cuando haya múltiples fuentes de datos o lógica de acceso compleja. El service llama directamente a Prisma.

**userId placeholder `00000000-0000-0000-0000-000000000000`**
> La DB de Supabase requiere `userId` en todas las tablas (multi-tenant), pero auth no está implementado aún. Se marcaron todos los sitios con `// TODO: Sprint 4` para facilitar el reemplazo cuando se implemente Supabase Auth. Los TODOs son buscables con grep.

**`lib/env.ts` con Zod pero solo DATABASE_URL por ahora**
> Las variables de Supabase Auth (`NEXT_PUBLIC_SUPABASE_URL`, etc.) están comentadas porque auth no está implementado. Se descomientan en Sprint 4.

**Supabase Auth sobre NextAuth**
> El proyecto ya usa Supabase como DB. Usar Supabase Auth evita añadir otra dependencia y permite aprovechar RLS nativo de Supabase para seguridad multi-tenant a nivel DB.

**`<Suspense>` en analytics page**
> Next.js 14 requiere que `useSearchParams()` esté dentro de un Suspense boundary en páginas estáticas. Se agregaron boundaries granulares por chart para loading states futuros.

## Estado de pendientes

- [ ] Sprint 2 — Conectar datos reales: reemplazar `mockData` con queries Prisma en `lib/transactions.ts`
- [ ] Sprint 2 — Analytics con datos reales de DB (reemplazar `Math.sin/cos` en `lib/analytics.ts`)
- [ ] Sprint 2 — React Query para caching e invalidation
- [ ] Sprint 3 — Upload real de archivos a Supabase Storage
- [ ] Sprint 4 — Implementar Supabase Auth + middleware.ts
- [ ] Sprint 4 — Habilitar RLS en todas las tablas de Supabase
- [ ] Sprint 4 — Reemplazar userId placeholder con `session.user.id`
