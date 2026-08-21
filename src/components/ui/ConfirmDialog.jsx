import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini? Data yang dihapus tidak dapat dipulihkan.',
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  isDestructive = true,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={!isLoading}>
      <div className="flex flex-col items-center text-center space-y-4 pt-1">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isDestructive
            ? 'bg-[#FFDAD6] text-[#BA1A1A]'
            : 'bg-[#FFF8E1] text-[#B78103]'
        }`}>
          <AlertTriangle className="w-7 h-7 stroke-[2]" />
        </div>

        <div className="space-y-1.5 px-2">
          <h4 className="text-lg font-bold font-heading text-[#191C19] tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-[#495348] font-body leading-relaxed max-w-[38ch] mx-auto">
            {message}
          </p>
        </div>

        <div className="w-full flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E8E2]">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#C2C9BD] text-[#495348] hover:bg-[#F1F5F1] text-xs font-semibold font-heading transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-full text-white text-xs font-bold font-heading transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
              isDestructive
                ? 'bg-[#BA1A1A] hover:bg-[#93000A] active:bg-[#680003]'
                : 'bg-[#2E7D32] hover:bg-[#1B5E20] active:bg-[#002106]'
            }`}
          >
            {isLoading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
