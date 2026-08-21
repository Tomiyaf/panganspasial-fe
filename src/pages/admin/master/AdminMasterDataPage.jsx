import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
} from 'lucide-react';
import { masterApi } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../../components/ui/Modal';

export default function AdminMasterDataPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('categories'); // categories, scales, taxonomy
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  // 1. Fetch Farm Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['master', 'farm-categories'],
    queryFn: async () => {
      const res = await masterApi.getFarmCategories();
      return res.data || [];
    },
  });

  // 2. Fetch Farm Scales
  const { data: scales = [] } = useQuery({
    queryKey: ['master', 'farm-scales'],
    queryFn: async () => {
      const res = await masterApi.getFarmScales();
      return res.data || [];
    },
  });

  // 3. Fetch Livestock Categories
  const { data: livestockCategories = [] } = useQuery({
    queryKey: ['master', 'livestock-categories'],
    queryFn: async () => {
      const res = await masterApi.getLivestockCategories();
      return res.data || [];
    },
  });

  // 4. Fetch Livestock Types
  const { data: livestockTypes = [] } = useQuery({
    queryKey: ['master', 'livestock-types'],
    queryFn: async () => {
      const res = await masterApi.getLivestockTypes();
      return res.data || [];
    },
  });

  return (
    <div className="space-y-6 font-body text-[#191C19] max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
            Master Data & Taksonomi Ternak
          </h1>
          <p className="text-xs sm:text-sm text-[#495348] mt-1">
            Kelola klasifikasi kategori peternakan, skala usaha, dan taksonomi jenis komoditas.
          </p>
        </div>
      </div>

      {/* MD3 Primary Tabs Container */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#C2C9BD]/50 rounded-full shadow-2xs text-xs font-semibold font-heading">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-full transition-all duration-150 ${
            activeTab === 'categories'
              ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
              : 'text-[#495348] hover:text-[#191C19] hover:bg-[#F1F5F1]'
          }`}
        >
          Kategori Peternakan ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('scales')}
          className={`px-5 py-2.5 rounded-full transition-all duration-150 ${
            activeTab === 'scales'
              ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
              : 'text-[#495348] hover:text-[#191C19] hover:bg-[#F1F5F1]'
          }`}
        >
          Skala Usaha ({scales.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('taxonomy')}
          className={`px-5 py-2.5 rounded-full transition-all duration-150 ${
            activeTab === 'taxonomy'
              ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
              : 'text-[#495348] hover:text-[#191C19] hover:bg-[#F1F5F1]'
          }`}
        >
          Taksonomi Komoditas ({livestockTypes.length})
        </button>
      </div>

      {/* TAB 1: FARM CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E2] pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-[#191C19]">
                Kategori Operasional Peternakan
              </h3>
              <p className="text-xs text-[#495348] mt-0.5">
                Klasifikasi model bisnis atau kepemilikan unit kandang ternak.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold font-heading shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                <tr>
                  <th className="py-3.5 px-4 w-20 rounded-l-xl">ID</th>
                  <th className="py-3.5 px-4">Nama Kategori</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Deskripsi / Penjelasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E2]/60">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#495348]">#{c.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#191C19] font-heading">{c.name}</td>
                    <td className="py-3.5 px-4 text-[#495348]">{c.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FARM SCALES */}
      {activeTab === 'scales' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6 text-xs">
          <div className="border-b border-[#E2E8E2] pb-4">
            <h3 className="text-base font-bold font-heading text-[#191C19]">
              Klasifikasi Skala Usaha Ternak
            </h3>
            <p className="text-xs text-[#495348] mt-0.5">
              Tingkatan kapasitas produksi dan populasi ternak.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                <tr>
                  <th className="py-3.5 px-4 w-20 rounded-l-xl">ID</th>
                  <th className="py-3.5 px-4">Skala Usaha</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Kriteria Batasan Populasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E2]/60">
                {scales.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#495348]">#{s.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#191C19] font-heading">{s.name}</td>
                    <td className="py-3.5 px-4 text-[#495348]">{s.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVESTOCK TAXONOMY */}
      {activeTab === 'taxonomy' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6 text-xs">
          <div className="border-b border-[#E2E8E2] pb-4">
            <h3 className="text-base font-bold font-heading text-[#191C19]">
              Taksonomi Komoditas Ternak
            </h3>
            <p className="text-xs text-[#495348] mt-0.5">
              Hirarki kategori taksonomi dan jenis komoditas ternak yang tercatat di sistem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {livestockCategories.map((lc) => (
              <div key={lc.id} className="p-5 rounded-2xl bg-[#F1F5F1]/60 border border-[#C2C9BD]/50 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading block">
                  Kategori #{lc.id}
                </span>
                <h4 className="text-base font-extrabold text-[#191C19] font-heading">{lc.name}</h4>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                <tr>
                  <th className="py-3.5 px-4 w-20 rounded-l-xl">ID</th>
                  <th className="py-3.5 px-4">Jenis Ternak</th>
                  <th className="py-3.5 px-4 rounded-r-xl">Kategori Induk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E2]/60">
                {livestockTypes.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#495348]">#{t.id}</td>
                    <td className="py-3.5 px-4 font-bold text-[#191C19] font-heading">{t.name}</td>
                    <td className="py-3.5 px-4 text-[#495348]">
                      <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-bold text-[11px] border border-[#C8E6C9]">
                        {t.category_name || (t.category_id === '1' ? 'Ruminansia Besar' : t.category_id === '2' ? 'Ruminansia Kecil' : 'Unggas')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD FARM CATEGORY */}
      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        onSuccess={() => {
          setAddCategoryModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['master', 'farm-categories'] });
        }}
      />

    </div>
  );
}

// Sub-component: Add Category Modal Form
function AddCategoryModal({ isOpen, onClose, onSuccess }) {
  const { success, error: showError } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showError('Nama kategori diperlukan');
      return;
    }
    setIsSubmitting(true);
    try {
      await masterApi.createFarmCategory({ name, description });
      success('Kategori peternakan baru berhasil ditambahkan');
      setName('');
      setDescription('');
      onSuccess();
    } catch (err) {
      showError(err.message || 'Gagal menambahkan kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Kategori Peternakan Baru" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Nama Kategori *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Sentra Pembibitan Unggul"
            className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Deskripsi</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Penjelasan kriteria kategori..."
            className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
          />
        </div>

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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
