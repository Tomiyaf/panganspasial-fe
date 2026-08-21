import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = 'Tidak Ada Data Ditemukan',
  description = 'Belum ada data yang tersedia untuk filter atau kriteria pencarian ini.',
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-[#C2C9BD]/50 shadow-xs">
      <div className="w-14 h-14 rounded-full bg-[#E8EFE8] text-[#2E7D32] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>
      <h4 className="text-base font-bold font-heading text-[#191C19] tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-[#495348] font-body max-w-sm mt-1 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 text-xs font-bold font-heading rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-sm transition-all active:scale-95"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
