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
    <div className="space-y-8 font-body text-[#191C19] max-w-7xl mx-auto">
      
      {/* Header & Calculate Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
            Sistem Pendukung Keputusan (SDSS SAW)
          </h1>
          <p className="text-xs sm:text-sm text-[#495348] mt-1">
            Kelola bobot kriteria multikriteria dan jalankan kalkulasi peringkat wilayah peternakan.
          </p>
        </div>

        <button
          type="button"
          disabled={calculateMutation.isPending}
          onClick={() => calculateMutation.mutate()}
          className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-sm transition-all disabled:opacity-50 shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{calculateMutation.isPending ? 'Menghitung SAW...' : 'Hitung Ulang & Simpan Hasil SDSS'}</span>
        </button>
      </div>

      {/* Weight Balance Warning Alert */}
      {!isWeightValid && (
        <div className="p-5 rounded-3xl bg-[#FFF8E1] border border-[#FFE082] text-[#5D3F00] flex items-start gap-3.5 text-xs shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-[#B78103] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold font-heading text-sm block">Akumulasi Bobot Kriteria Belum Normal (1.00)</span>
            <p className="mt-1 text-[#5D3F00]/90 leading-relaxed">
              Total bobot kriteria aktif saat ini adalah <strong>{totalWeight.toFixed(2)}</strong>. Dalam metode Simple Additive Weighting (SAW), akumulasi seluruh bobot kriteria aktif harus berjumlah tepat <strong>1.00 (100%)</strong> agar hasil perankingan akurat.
            </p>
          </div>
        </div>
      )}

      {/* 1. Criteria Management Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E2] pb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-[#191C19]">
              1. Master Kriteria Penilaian Spasial & Bobot
            </h3>
            <p className="text-xs text-[#495348] mt-0.5">
              Parameter multikriteria penentu indeks sentra unggulan peternakan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCriterion(null);
              setCriterionModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8F5E9] hover:bg-[#2E7D32] hover:text-white text-[#1B5E20] text-xs font-bold font-heading transition-all shrink-0"
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
          <div className="p-12 text-center text-[#495348] text-xs">
            Belum ada kriteria yang terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                <tr>
                  <th className="py-3.5 px-4 rounded-l-xl">Nama Kriteria</th>
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-4 text-center">Tipe (Benefit / Cost)</th>
                  <th className="py-3.5 px-4 text-center">Bobot (Weight)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E2]/60">
                {criteria.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#191C19] font-heading">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#495348] max-w-xs">
                      {c.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-heading uppercase ${
                        c.criteria_type === 'benefit' ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]' : 'bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]'
                      }`}>
                        {c.criteria_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#191C19]">
                      {Number(c.weight).toFixed(2)} ({(Number(c.weight) * 100).toFixed(0)}%)
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-heading ${
                        c.is_active ? 'bg-[#E8F5E9] text-[#1B5E20]' : 'bg-[#F1F5F1] text-[#495348]'
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
                          className="p-2 rounded-full text-[#495348] hover:text-[#1565C0] hover:bg-[#E3F2FD] transition-colors"
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
                          className="p-2 rounded-full text-[#495348] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/50 transition-colors"
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6">
        <div className="border-b border-[#E2E8E2] pb-4">
          <h3 className="text-base font-bold font-heading text-[#191C19]">
            2. Pratinjau Pemeringkatan Hasil Kalkulasi Terakhir
          </h3>
          <p className="text-xs text-[#495348] mt-0.5">
            Data peringkat yang tampil pada halaman publik rekomendasi spasial.
          </p>
        </div>

        {isRecsLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16 rounded-l-xl">Rank</th>
                  <th className="py-3.5 px-4">Kecamatan</th>
                  <th className="py-3.5 px-4 text-center">Skor SAW</th>
                  <th className="py-3.5 px-4 text-center">Kategori Potensi</th>
                  <th className="py-3.5 px-4 text-right">Unit Peternakan</th>
                  <th className="py-3.5 px-4 text-right">Total Populasi</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Narasi Rekomendasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E2]/60">
                {recommendations.map((r) => (
                  <tr key={r.district_id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold font-heading text-xs">
                        #{r.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#191C19] font-heading">
                      Kecamatan {r.district_name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#2E7D32]">
                      {typeof r.score === 'number' ? r.score.toFixed(4) : r.score}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-heading bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
                        {r.recommendation}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#191C19]">
                      {r.farm_count} unit
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#191C19]">
                      {r.total_population?.toLocaleString('id-ID')} ekor
                    </td>
                    <td className="py-3.5 px-4 text-[#495348] max-w-sm truncate">
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
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Nama Kriteria *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Kepadatan Populasi Ternak"
            className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Deskripsi Indikator</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Penjelasan indikator perhitungan spasial..."
            className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Tipe Kriteria (Benefit / Cost) *</label>
          <div className="grid grid-cols-2 gap-2">
            <label className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all ${
              criteriaType === 'benefit' ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20] shadow-xs' : 'border-[#C2C9BD]/70 text-[#495348] hover:bg-[#F1F5F1]'
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

            <label className={`p-3 rounded-2xl border flex items-center gap-2 cursor-pointer transition-all ${
              criteriaType === 'cost' ? 'bg-[#FFF3E0] border-[#E65100] text-[#E65100] shadow-xs' : 'border-[#C2C9BD]/70 text-[#495348] hover:bg-[#F1F5F1]'
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

        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Bobot Normalisasi (0.01 - 1.00) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1.00"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
            required
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-[#C2C9BD] text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
          />
          <span className="text-[#191C19] font-semibold">Kriteria Aktif dalam Perhitungan SAW</span>
        </label>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E8E2]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#C2C9BD] text-[#495348] hover:bg-[#F1F5F1] text-xs font-bold font-heading transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold font-heading transition-all shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Kriteria'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
