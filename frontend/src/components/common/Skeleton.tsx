const pulse = 'bg-ink-100 rounded animate-pulse';

export const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="h-40 bg-ink-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className={`h-4 w-3/4 ${pulse}`} />
      <div className={`h-3 w-1/2 ${pulse}`} />
      <div className={`h-3 w-1/3 ${pulse}`} />
    </div>
  </div>
);

const SkeletonRow = ({ cols }: { cols: number }) => (
  <div className="flex items-center gap-4 px-5 py-3.5 border-b border-ink-50 last:border-0 animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <div
        key={i}
        className={`h-4 rounded bg-ink-100 ${
          i === 0 ? 'w-2/5' : i === cols - 1 ? 'w-8 ml-auto' : 'flex-1'
        }`}
      />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) => (
  <div className="card overflow-hidden">
    <div className="flex items-center gap-4 px-5 py-3 border-b border-ink-100 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className={`h-3 rounded bg-ink-100 ${i === 0 ? 'w-2/5' : 'flex-1'}`} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} cols={cols} />
    ))}
  </div>
);

export const SkeletonCardGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonList = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="card px-4 py-3.5 flex items-center gap-3 animate-pulse">
        <div className="w-5 h-5 rounded-full bg-ink-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-2/3 ${pulse}`} />
          <div className={`h-3 w-1/3 ${pulse}`} />
        </div>
        <div className="flex gap-2">
          <div className="w-7 h-7 rounded bg-ink-100" />
          <div className="w-7 h-7 rounded bg-ink-100" />
        </div>
      </div>
    ))}
  </div>
);
