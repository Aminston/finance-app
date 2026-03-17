---
fecha: YYYY-MM-DD
estado: borrador
autor:
feature: [nombre del feature]
prd: docs/prd/YYYY-MM-DD-nombre.md
---

# Spec técnica — [Nombre del feature]

> Usar este documento cuando el PRD no es suficiente para describir la implementación técnica. Ideal para features con lógica compleja, múltiples sistemas involucrados, o decisiones de arquitectura importantes.

## Contexto técnico

> Qué sistemas/módulos están involucrados. Estado actual del código relacionado.

## Flujo de datos

```
[Usuario] → [Componente] → [API Route] → [Service] → [DB]
                ↑                              ↓
           [React Query]              [Supabase/Prisma]
```

> Describir el flujo paso a paso si es complejo.

## Modelos de datos afectados

| Tabla | Acción | Campos nuevos / modificados |
|-------|--------|-----------------------------|
| `transactions` | SELECT / INSERT | — |

### Schema changes (si aplica)

```sql
-- Migración requerida
ALTER TABLE ...
```

> Si hay cambios de schema, crear el archivo en `docs/db/migrations/` y registrar en `docs/db/MIGRATIONS.md`.

## Validaciones

| Campo | Regla | Error |
|-------|-------|-------|
| `amount` | Número, no cero | "El monto no puede ser cero" |

## Casos edge

- [ ] ¿Qué pasa si el archivo viene vacío?
- [ ] ¿Qué pasa si el usuario no tiene cuentas aún?
- [ ] ¿Qué pasa si falla la conexión a DB?

## Criterios de aceptación

- [ ] El usuario puede [acción principal]
- [ ] Si falla, el usuario ve un mensaje claro
- [ ] Los datos persisten correctamente en DB
- [ ] TypeScript compila sin errores (`npm run build`)

## Impacto en features existentes

> ¿Este cambio afecta algún feature ya implementado? ¿Qué habría que actualizar?
