import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = 'Tidak Ada Data Ditemukan',
  description = 'Belum ada data yang tersedia untuk filter atau kriteria pencarian ini.',
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-bold font-heading text-slate-900 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-slate-500 font-body max-w-sm mt-1 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 text-xs font-semibold font-heading rounded-lg bg-[#2E7D32] hover:bg-[#236327] text-white shadow-xs transition-colors"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
