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
    <div className="space-y-6 font-body text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Master Data & Taksonomi Ternak
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola klasifikasi kategori peternakan, skala usaha, dan taksonomi jenis komoditas.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold font-heading bg-white rounded-2xl px-6 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`py-3.5 border-b-2 transition-colors mr-6 ${
            activeTab === 'categories'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kategori Peternakan ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('scales')}
          className={`py-3.5 border-b-2 transition-colors mr-6 ${
            activeTab === 'scales'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Skala Usaha ({scales.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('taxonomy')}
          className={`py-3.5 border-b-2 transition-colors ${
            activeTab === 'taxonomy'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Taksonomi Komoditas ({livestockTypes.length})
        </button>
      </div>

      {/* TAB 1: FARM CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">
                Kategori Operasional Peternakan
              </h3>
              <p className="text-xs text-slate-500">
                Klasifikasi model bisnis atau kepemilikan unit kandang ternak.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddCategoryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-16">ID</th>
                  <th className="py-3.5 px-4">Nama Kategori</th>
                  <th className="py-3.5 px-4">Deskripsi / Penjelasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{c.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FARM SCALES */}
      {activeTab === 'scales' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold font-heading text-slate-900">
              Klasifikasi Skala Usaha Ternak
            </h3>
            <p className="text-xs text-slate-500">
              Tingkatan kapasitas produksi dan populasi ternak.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-16">ID</th>
                  <th className="py-3.5 px-4">Skala Usaha</th>
                  <th className="py-3.5 px-4">Kriteria Batasan Populasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{s.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">{s.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVESTOCK TAXONOMY */}
      {activeTab === 'taxonomy' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold font-heading text-slate-900">
              Taksonomi Komoditas Ternak
            </h3>
            <p className="text-xs text-slate-500">
              Hirarki kategori taksonomi dan jenis komoditas ternak yang tercatat di sistem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {livestockCategories.map((lc) => (
              <div key={lc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                  Kategori #{lc.id}
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-heading">{lc.name}</h4>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-16">ID</th>
                  <th className="py-3.5 px-4">Jenis Ternak</th>
                  <th className="py-3.5 px-4">Kategori Induk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {livestockTypes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{t.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">{t.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#2E7D32] font-semibold text-[11px]">
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
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Nama Kategori *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Sentra Pembibitan Unggul"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Deskripsi</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Penjelasan kriteria kategori..."
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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
