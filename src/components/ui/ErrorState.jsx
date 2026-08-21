import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kendala saat menghubungkan ke server atau memproses permintaan.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#FFDAD6]/30 rounded-3xl border border-[#FFDAD6] shadow-xs">
      <div className="w-12 h-12 rounded-full bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 stroke-[1.8]" />
      </div>
      <h4 className="text-sm font-bold font-heading text-[#410002]">
        {title}
      </h4>
      <p className="text-xs text-[#410002]/80 font-body max-w-sm mt-1 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-heading rounded-full bg-white border border-[#C2C9BD] text-[#191C19] hover:bg-[#F1F5F1] transition-all shadow-xs active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
}
