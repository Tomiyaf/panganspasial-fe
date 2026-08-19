import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit,
  Trash2,
  Play,
  AlertTriangle,
} from 'lucide-react';
import { sdssApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';
import ErrorState from '../../../components/ui/ErrorState';

export default function AdminSDSSPage() {
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const [criterionModalOpen, setCriterionModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });

  // 1. Fetch Criteria List
  const {
    data: criteria = [],
    isLoading: isCriteriaLoading,
    isError: isCriteriaError,
    refetch: refetchCriteria,
  } = useQuery({
    queryKey: ['admin', 'sdss', 'criteria'],
    queryFn: async () => {
      const res = await sdssApi.getCriteria();
      return res.data || [];
    },
  });

  // 2. Fetch Latest SDSS Results
  const {
    data: recommendations = [],
    isLoading: isRecsLoading,
    refetch: refetchRecommendations,
  } = useQuery({
    queryKey: ['admin', 'sdss', 'recommendations'],
    queryFn: async () => {
      const res = await sdssApi.getPublicRecommendations();
      return res.data || [];
    },
  });

  // Calculate total weight accumulator
  const totalWeight = criteria.reduce((sum, c) => sum + (c.is_active ? Number(c.weight || 0) : 0), 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.001;

  // Recalculate SDSS SAW Mutation
  const calculateMutation = useMutation({
    mutationFn: async () => {
      return await sdssApi.calculateSDSS();
    },
    onSuccess: () => {
      success('Kalkulasi SDSS SAW selesai dan hasil pemeringkatan diperbarui di database.');
      queryClient.invalidateQueries({ queryKey: ['sdss'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sdss'] });
      refetchRecommendations();
    },
    onError: (err) => showError(err.message || 'Gagal menghitung ulang SDSS'),
  });

  // Delete Criterion Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await sdssApi.deleteCriterion(id);
    },
    onSuccess: () => {
      success('Kriteria berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['admin', 'sdss', 'criteria'] });
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    },
    onError: (err) => showError(err.message || 'Gagal menghapus kriteria'),
  });

  return (
    <div className="space-y-8 font-body text-slate-800">
      
      {/* Header & Calculate Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Sistem Pendukung Keputusan (SDSS SAW)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola bobot kriteria multikriteria dan jalankan kalkulasi peringkat wilayah peternakan.
          </p>
        </div>

        <button
          type="button"
          disabled={calculateMutation.isPending}
          onClick={() => calculateMutation.mutate()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-md transition-all disabled:opacity-50 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{calculateMutation.isPending ? 'Menghitung SAW...' : 'Hitung Ulang & Simpan Hasil SDSS'}</span>
        </button>
      </div>

      {/* Weight Balance Warning Alert */}
      {!isWeightValid && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold font-heading block">Akumulasi Bobot Kriteria Belum Normal (1.00)</span>
            <p className="mt-0.5 text-amber-700 leading-relaxed">
              Total bobot kriteria aktif saat ini adalah <strong>{totalWeight.toFixed(2)}</strong>. Dalam metode SAW, akumulasi seluruh bobot kriteria aktif harus berjumlah <strong>1.00 (100%)</strong> agar hasil perankingan akurat.
            </p>
          </div>
        </div>
      )}

      {/* 1. Criteria Management Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900">
              1. Master Kriteria Penilaian Spasial & Bobot
            </h3>
            <p className="text-xs text-slate-500">
              Parameter multikriteria penentu indeks sentra unggulan peternakan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCriterion(null);
              setCriterionModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#2E7D32] hover:text-white text-slate-700 text-xs font-bold font-heading transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kriteria Baru</span>
          </button>
        </div>

        {isCriteriaLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : isCriteriaError ? (
          <ErrorState onRetry={refetchCriteria} />
        ) : criteria.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Belum ada kriteria yang terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Kriteria</th>
                  <th className="py-3 px-4">Deskripsi</th>
                  <th className="py-3 px-4 text-center">Tipe (Benefit / Cost)</th>
                  <th className="py-3 px-4 text-center">Bobot (Weight)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criteria.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {c.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-heading uppercase ${
                        c.criteria_type === 'benefit' ? 'bg-emerald-50 text-[#2E7D32]' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {c.criteria_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                      {Number(c.weight).toFixed(2)} ({(Number(c.weight) * 100).toFixed(0)}%)
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {c.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCriterion(c);
                            setCriterionModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit Kriteria"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              id: c.id,
                              name: c.name,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Hapus Kriteria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Live SDSS SAW Results Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold font-heading text-slate-900">
            2. Pratinjau Pemeringkatan Hasil Kalkulasi Terakhir
          </h3>
          <p className="text-xs text-slate-500">
            Data peringkat yang tampil pada halaman publik rekomendasi spasial.
          </p>
        </div>

        {isRecsLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-center w-16">Rank</th>
                  <th className="py-3 px-4">Kecamatan</th>
                  <th className="py-3 px-4 text-center">Skor SAW</th>
                  <th className="py-3 px-4 text-center">Kategori Potensi</th>
                  <th className="py-3 px-4 text-right">Unit Peternakan</th>
                  <th className="py-3 px-4 text-right">Total Populasi</th>
                  <th className="py-3 px-4">Narasi Rekomendasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recommendations.map((r) => (
                  <tr key={r.district_id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 text-center font-bold font-heading">
                      #{r.rank}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">
                      Kecamatan {r.district_name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#2E7D32]">
                      {typeof r.score === 'number' ? r.score.toFixed(4) : r.score}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-heading bg-emerald-50 text-[#2E7D32] border border-emerald-200">
                        {r.recommendation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold">
                      {r.farm_count} unit
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {r.total_population?.toLocaleString('id-ID')} ekor
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">
                      {r.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT CRITERION */}
      {criterionModalOpen && (
        <CriterionModal
          key={editingCriterion ? String(editingCriterion.id) : 'new-criterion'}
          isOpen={criterionModalOpen}
          onClose={() => {
            setCriterionModalOpen(false);
            setEditingCriterion(null);
          }}
          initialData={editingCriterion}
          onSuccess={() => {
            setCriterionModalOpen(false);
            setEditingCriterion(null);
            refetchCriteria();
          }}
        />
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={() => deleteMutation.mutate(deleteConfirm.id)}
        title="Hapus Kriteria SDSS"
        message={`Apakah Anda yakin ingin menghapus kriteria "${deleteConfirm.name}"?`}
        confirmLabel="Ya, Hapus Kriteria"
        isLoading={deleteMutation.isPending}
      />

    </div>
  );
}

// Sub-component: Criterion Modal Form
function CriterionModal({ isOpen, onClose, initialData, onSuccess }) {
  const { success, error: showError } = useToast();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [criteriaType, setCriteriaType] = useState(initialData?.criteria_type || 'benefit');
  const [weight, setWeight] = useState(initialData?.weight ? Number(initialData.weight) : 0.20);
  const [isActive, setIsActive] = useState(initialData?.is_active !== undefined ? initialData.is_active : true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showError('Nama kriteria diperlukan');
      return;
    }
    if (weight <= 0 || weight > 1) {
      showError('Bobot kriteria harus di antara 0.01 dan 1.00');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        criteria_type: criteriaType,
        weight: parseFloat(weight),
        is_active: isActive,
      };

      if (initialData) {
        await sdssApi.updateCriterion(initialData.id, payload);
        success('Kriteria berhasil diperbarui');
      } else {
        await sdssApi.createCriterion(payload);
        success('Kriteria baru berhasil ditambahkan');
      }
      onSuccess();
    } catch (err) {
      showError(err.message || 'Gagal menyimpan kriteria');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Kriteria SDSS' : 'Tambah Kriteria SDSS Baru'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Nama Kriteria *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Kepadatan Populasi Ternak"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Deskripsi Indikator</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Penjelasan indikator perhitungan spasial..."
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Tipe Kriteria (Benefit / Cost) *</label>
          <div className="grid grid-cols-2 gap-2">
            <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${
              criteriaType === 'benefit' ? 'bg-emerald-50 border-emerald-500 text-[#2E7D32]' : 'border-slate-200 text-slate-700'
            }`}>
              <input
                type="radio"
                name="type"
                value="benefit"
                checked={criteriaType === 'benefit'}
                onChange={(e) => setCriteriaType(e.target.value)}
                className="sr-only"
              />
              <span className="font-bold font-heading">Benefit (Makin tinggi makin baik)</span>
            </label>

            <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${
              criteriaType === 'cost' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-slate-200 text-slate-700'
            }`}>
              <input
                type="radio"
                name="type"
                value="cost"
                checked={criteriaType === 'cost'}
                onChange={(e) => setCriteriaType(e.target.value)}
                className="sr-only"
              />
              <span className="font-bold font-heading">Cost (Makin rendah makin baik)</span>
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Bobot Normalisasi (0.01 - 1.00) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1.00"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
          />
          <span className="text-slate-700 font-medium">Kriteria Aktif dalam Perhitungan SAW</span>
        </label>

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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Kriteria'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
