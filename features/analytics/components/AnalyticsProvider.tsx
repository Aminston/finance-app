"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import type { AnalyticsFilters, DateRangePreset, Granularity } from "../types"

const DAY_IN_MS = 24 * 60 * 60 * 1000

const presetConfig: Record<
  Exclude<DateRangePreset, "custom">,
  { days: number; granularity: Granularity }
> = {
  "last-7": { days: 7, granularity: "day" },
  "last-30": { days: 30, granularity: "day" },
  "last-90": { days: 90, granularity: "week" },
  "last-12m": { days: 365, granularity: "month" },
}

function sanitizeDate(d: Date) {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(d: Date, n: number) {
  const date = new Date(d)
  date.setDate(date.getDate() + n)
  return date
}

function getGranularityForCustom(start: Date, end: Date): Granularity {
  const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_IN_MS) + 1)
  if (diff > 120) return "month"
  if (diff > 45) return "week"
  return "day"
}

const AnalyticsContext = React.createContext<AnalyticsFilters | null>(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const now = React.useMemo(() => new Date(), [])

  const filters = React.useMemo<AnalyticsFilters>(() => {
    const presetParam = searchParams.get("range") ?? "last-30"
    const preset: DateRangePreset =
      ["last-7", "last-30", "last-90", "last-12m", "custom"].includes(presetParam)
        ? (presetParam as DateRangePreset)
        : "last-30"

    const currencyParam = searchParams.get("currency") ?? "MXN"
    const currency = currencyParam === "USD" ? "USD" : "MXN"

    const parseParam = (v: string | null) => {
      if (!v) return null
      const d = new Date(v)
      return Number.isNaN(d.getTime()) ? null : sanitizeDate(d)
    }

    let start: Date
    let end: Date
    let granularity: Granularity

    if (preset === "custom") {
      let s = parseParam(searchParams.get("start"))
      let e = parseParam(searchParams.get("end"))
      if (!s || !e) {
        const cfg = presetConfig["last-30"]
        e = sanitizeDate(now)
        s = addDays(e, -(cfg.days - 1))
        granularity = cfg.granularity
      } else {
        if (s > e) [s, e] = [e, s]
        granularity = getGranularityForCustom(s, e)
      }
      start = s
      end = e
    } else {
      const { days, granularity: g } = presetConfig[preset]
      end = sanitizeDate(now)
      start = addDays(end, -(days - 1))
      granularity = g
    }

    const fmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", timeZone: "UTC" })
    const label = `${fmt.format(start)} – ${fmt.format(end)} · ${currency}`

    return { preset, currency, start, end, label, granularity }
  }, [searchParams, now])

  return <AnalyticsContext.Provider value={filters}>{children}</AnalyticsContext.Provider>
}

export function useAnalyticsContext(): AnalyticsFilters {
  const ctx = React.useContext(AnalyticsContext)
  if (!ctx) throw new Error("useAnalyticsContext must be used inside <AnalyticsProvider>")
  return ctx
}
