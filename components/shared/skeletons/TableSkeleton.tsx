export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse space-y-1">
      {/* Header */}
      <div className="flex gap-4 border-b px-4 py-3">
        {[120, 200, 150, 80, 100, 120].map((w, i) => (
          <div key={i} className="h-3 rounded bg-muted" style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3">
          {[120, 200, 150, 80, 100, 120].map((w, j) => (
            <div
              key={j}
              className="h-3 rounded bg-muted"
              style={{ width: w, opacity: 1 - i * 0.08 }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
