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
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
        }`}>
          <AlertTriangle className="w-6 h-6 stroke-[2]" />
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold font-heading text-slate-900">
            {title}
          </h4>
          <p className="text-xs text-slate-600 font-body leading-relaxed max-w-[40ch]">
            {message}
          </p>
        </div>

        <div className="w-full flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold font-heading transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white text-xs font-semibold font-heading transition-colors disabled:opacity-50 shadow-xs ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                : 'bg-[#2E7D32] hover:bg-[#236327] active:bg-[#1b4d1f]'
            }`}
          >
            {isLoading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
