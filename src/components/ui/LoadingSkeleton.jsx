export function SkeletonBox({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-4 w-28" />
        <SkeletonBox className="h-9 w-9 rounded-xl" />
      </div>
      <SkeletonBox className="h-8 w-20" />
      <SkeletonBox className="h-3 w-36" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-9 w-48 rounded-lg" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonBox
                key={j}
                className={`h-4 ${j === 0 ? 'w-1/4' : j === 1 ? 'w-1/3' : 'w-1/6'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
      <SkeletonBox className="h-40 w-full rounded-xl" />
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonBox className="h-4 w-1/2" />
      <div className="pt-2 border-t border-slate-100 flex justify-between">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-4 w-24" />
      </div>
    </div>
  );
}
