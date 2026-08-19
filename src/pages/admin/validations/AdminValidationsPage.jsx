import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
} from 'lucide-react';
import { validationsApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../../components/ui/Modal';
import Pagination from '../../../components/ui/Pagination';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import ErrorState from '../../../components/ui/ErrorState';

export default function AdminValidationsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');

  // Modal states
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [newValidationModalOpen, setNewValidationModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch Validations List
  const {
    data: validationsRes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'validations', { page, statusFilter, entityTypeFilter }],
    queryFn: async () => {
      const res = await validationsApi.getValidations({
        page,
        limit: 15,
        status: statusFilter || undefined,
        entity_type: entityTypeFilter || undefined,
      });
      return res;
    },
  });

  const validations = validationsRes?.data || [];
  const meta = validationsRes?.meta || { total: 0, page: 1, limit: 15, total_pages: 1 };

  return (
    <div className="space-y-6 font-body text-slate-800">
      
      {/* Header & New Validation Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Validasi Data Survei Lapangan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi fisik laporan peternakan dan populasi ternak oleh mantri hewan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewValidationModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Catatan Survei Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
        >
          <option value="">Semua Status Survei</option>
          <option value="pending">Pending (Tertunda)</option>
          <option value="valid">Valid (Disetujui)</option>
          <option value="rejected">Rejected (Ditolak)</option>
        </select>

        {/* Entity Type Filter */}
        <select
          value={entityTypeFilter}
          onChange={(e) => {
            setEntityTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
        >
          <option value="">Semua Tipe Entitas</option>
          <option value="farm">Peternakan (Farm)</option>
          <option value="livestock">Komoditas Ternak (Livestock)</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : isError ? (
          <div className="p-8">
            <ErrorState onRetry={refetch} />
          </div>
        ) : validations.length === 0 ? (
          <EmptyState
            title="Tidak Ada Catatan Validasi"
            description="Belum ada data verifikasi survei yang sesuai dengan filter."
            icon={CheckSquare}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Entitas Survei</th>
                    <th className="py-3.5 px-4">Status Verifikasi</th>
                    <th className="py-3.5 px-4">Petugas / Validator</th>
                    <th className="py-3.5 px-4">Catatan Lapangan</th>
                    <th className="py-3.5 px-4">Waktu Verifikasi</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {validations.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Entity */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-slate-900 font-heading capitalize">
                            {v.entity_type === 'farm' ? 'Unit Peternakan' : 'Komoditas Ternak'}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            #{v.entity_id}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {v.status === 'valid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-heading bg-emerald-50 text-[#2E7D32] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Valid</span>
                          </span>
                        ) : v.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-heading bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3" />
                            <span>Ditolak</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-heading bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Validator */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="font-semibold block">{v.validator?.name || 'Dr. Subandi'}</span>
                        <span className="text-[10px] text-slate-400">{v.validator?.email || 'Mantri Hewan'}</span>
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-sm leading-relaxed">
                        {v.notes || 'Hasil pemeriksaan fisik kandang dan sanitasi'}
                      </td>

                      {/* Validated At */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {v.validated_at ? new Date(v.validated_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecord(v);
                            setVerifyModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#2E7D32] hover:text-white text-slate-700 text-xs font-semibold font-heading transition-colors"
                        >
                          Verifikasi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={meta.page}
              totalPages={meta.total_pages}
              totalItems={meta.total}
              limit={meta.limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>

      {/* MODAL: VERIFY STATUS */}
      {selectedRecord && (
        <VerifyStatusModal
          key={String(selectedRecord.id)}
          isOpen={verifyModalOpen}
          onClose={() => {
            setVerifyModalOpen(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
          onSuccess={() => {
            setVerifyModalOpen(false);
            setSelectedRecord(null);
            refetch();
          }}
        />
      )}

      {/* MODAL: CREATE NEW VALIDATION */}
      {newValidationModalOpen && (
        <CreateValidationModal
          isOpen={newValidationModalOpen}
          onClose={() => setNewValidationModalOpen(false)}
          onSuccess={() => {
            setNewValidationModalOpen(false);
            refetch();
          }}
        />
      )}

    </div>
  );
}

// Sub-component: Verify Status Modal
function VerifyStatusModal({ isOpen, onClose, record, onSuccess }) {
  const { success, error: showError } = useToast();
  const [status, setStatus] = useState(record?.status || 'valid');
  const [notes, setNotes] = useState(record?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await validationsApi.updateValidationStatus(record.id, { status, notes });
      success('Status verifikasi survei berhasil diperbarui');
      onSuccess();
    } catch (err) {
      showError(err.message || 'Gagal memperbarui status validasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Perbarui Status Validasi Survei"
      subtitle={`Entitas: ${record?.entity_type} #${record?.entity_id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">Pilih Status Verifikasi *</label>
          <div className="grid grid-cols-3 gap-2">
            <label className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              status === 'valid' ? 'border-emerald-500 bg-emerald-50 text-[#2E7D32]' : 'border-slate-200 text-slate-700'
            }`}>
              <input
                type="radio"
                name="status"
                value="valid"
                checked={status === 'valid'}
                onChange={(e) => setStatus(e.target.value)}
                className="sr-only"
              />
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-bold font-heading">Valid</span>
            </label>

            <label className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              status === 'rejected' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-700'
            }`}>
              <input
                type="radio"
                name="status"
                value="rejected"
                checked={status === 'rejected'}
                onChange={(e) => setStatus(e.target.value)}
                className="sr-only"
              />
              <XCircle className="w-4 h-4" />
              <span className="font-bold font-heading">Ditolak</span>
            </label>

            <label className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              status === 'pending' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-700'
            }`}>
              <input
                type="radio"
                name="status"
                value="pending"
                checked={status === 'pending'}
                onChange={(e) => setStatus(e.target.value)}
                className="sr-only"
              />
              <Clock className="w-4 h-4" />
              <span className="font-bold font-heading">Pending</span>
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">Catatan Mantri / Bukti Survei *</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tuliskan catatan hasil verifikasi kondisi fisik kandang atau alasan penolakan..."
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Verifikasi'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Sub-component: Create New Validation Record
function CreateValidationModal({ isOpen, onClose, onSuccess }) {
  const { success, error: showError } = useToast();
  const [entityType, setEntityType] = useState('farm');
  const [entityId, setEntityId] = useState('');
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entityId) {
      showError('Masukkan ID Entitas');
      return;
    }

    setIsSubmitting(true);
    try {
      await validationsApi.createValidation({
        entity_type: entityType,
        entity_id: entityId,
        status,
        notes,
      });
      success('Catatan survei baru berhasil dibuat');
      setEntityId('');
      setNotes('');
      onSuccess();
    } catch (err) {
      showError(err.message || 'Gagal membuat catatan validasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buat Catatan Survei Lapangan Baru"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">Tipe Entitas *</label>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="farm">Unit Peternakan (Farm)</option>
            <option value="livestock">Komoditas Ternak (Livestock)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">ID Entitas Terdaftar *</label>
          <input
            type="text"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="Contoh: 1"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">Status Awal *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="pending">Pending (Menunggu Verifikasi)</option>
            <option value="valid">Valid (Disetujui)</option>
            <option value="rejected">Rejected (Ditolak)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">Catatan Pemeriksaan Lapangan</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Keterangan kondisi kandang, populasi riil, atau catatan mantri..."
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading disabled:opacity-50"
          >
            {isSubmitting ? 'Membuat...' : 'Buat Catatan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
