import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 20,
  onPageChange,
}) {
  if (totalPages <= 1 && totalItems <= limit) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#E2E8E2] bg-white text-xs text-[#495348] font-body">
      <div>
        Menampilkan <span className="font-bold text-[#191C19]">{startItem}</span> -{' '}
        <span className="font-bold text-[#191C19]">{endItem}</span> dari{' '}
        <span className="font-bold text-[#191C19]">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 rounded-full border border-[#C2C9BD] text-[#495348] hover:bg-[#F1F5F1] hover:text-[#191C19] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3.5 py-1 rounded-full bg-[#F1F5F1] font-semibold text-[#191C19] text-xs">
          Hal. {currentPage} / {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 rounded-full border border-[#C2C9BD] text-[#495348] hover:bg-[#F1F5F1] hover:text-[#191C19] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
