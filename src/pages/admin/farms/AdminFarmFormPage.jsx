import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { farmsApi } from '../../../services/api';
import { getImageUrl } from '../../../utils/imageUrl';
import {
  useDistrictsQuery,
  useVillagesQuery,
  useFarmCategoriesQuery,
  useFarmScalesQuery,
  useLivestockCategoriesQuery,
  useLivestockTypesQuery,
  useLivestockSubtypesQuery,
} from '../../../hooks/useMasterData';
import { useToast } from '../../../context/ToastContext';
import MapCoordinatePicker from '../../../components/admin/MapCoordinatePicker';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

// Form validation schema
const farmSchema = z.object({
  farm_name: z.string().min(3, 'Nama peternakan minimal 3 karakter'),
  owner_name: z.string().optional().default(''),
  address: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  district_id: z.string().min(1, 'Pilih kecamatan'),
  village_id: z.string().optional().default(''),
  farm_category_id: z.string().min(1, 'Pilih kategori usaha'),
  farm_scale_id: z.string().min(1, 'Pilih skala usaha'),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export default function AdminFarmFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const [activeTab, setActiveTab] = useState('general'); // general, livestock, photos
  const [coordinates, setCoordinates] = useState({
    latitude: -5.3582,
    longitude: 104.9749,
  });

  // Modal states for livestock & photo
  const [livestockModalOpen, setLivestockModalOpen] = useState(false);
  const [editingLivestock, setEditingLivestock] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });

  // Form hook
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      farm_name: '',
      owner_name: '',
      address: '',
      phone: '',
      notes: '',
      district_id: '',
      village_id: '',
      farm_category_id: '',
      farm_scale_id: '',
      latitude: -5.3582,
      longitude: 104.9749,
    },
  });

  const selectedDistrictId = watch('district_id');

  // Master data queries
  const { data: districtsGeoJSON } = useDistrictsQuery();
  const { data: villagesGeoJSON } = useVillagesQuery(selectedDistrictId);
  const { data: categories = [] } = useFarmCategoriesQuery();
  const { data: scales = [] } = useFarmScalesQuery();

  const districtList = districtsGeoJSON?.features?.map((f) => ({
    id: String(f.properties?.id || f.id),
    name: f.properties?.name || f.properties?.district_name || 'Kecamatan',
  })) || [];

  const villageList = villagesGeoJSON?.features?.map((f) => ({
    id: String(f.properties?.id || f.id),
    name: f.properties?.name || f.properties?.village_name || 'Pekon/Desa',
  })) || [];

  // Fetch Existing Farm Detail for Edit
  const { data: existingFarm } = useQuery({
    queryKey: ['admin', 'farms', 'detail', id],
    queryFn: async () => {
      const res = await farmsApi.getAdminFarmById(id);
      return res.data;
    },
    enabled: isEditMode,
  });

  // Fetch Livestock List for this farm
  const { data: livestockList = [], refetch: refetchLivestock } = useQuery({
    queryKey: ['admin', 'farms', id, 'livestock'],
    queryFn: async () => {
      const res = await farmsApi.getFarmLivestock(id);
      return res.data || [];
    },
    enabled: isEditMode,
  });

  // Fetch Photos List for this farm
  const { data: photosList = [], refetch: refetchPhotos } = useQuery({
    queryKey: ['admin', 'farms', id, 'photos'],
    queryFn: async () => {
      const res = await farmsApi.getFarmPhotos(id);
      return res.data || [];
    },
    enabled: isEditMode,
  });

  // Populate form in edit mode
  useEffect(() => {
    if (existingFarm) {
      reset({
        farm_name: existingFarm.farm_name || '',
        owner_name: existingFarm.owner_name || '',
        address: existingFarm.address || '',
        phone: existingFarm.phone || '',
        notes: existingFarm.notes || '',
        district_id: String(existingFarm.district?.id || existingFarm.district_id || ''),
        village_id: String(existingFarm.village?.id || existingFarm.village_id || ''),
        farm_category_id: String(existingFarm.farm_category?.id || existingFarm.farm_category_id || ''),
        farm_scale_id: String(existingFarm.farm_scale?.id || existingFarm.farm_scale_id || ''),
        latitude: existingFarm.latitude || -5.3582,
        longitude: existingFarm.longitude || 104.9749,
      });
      if (existingFarm.latitude && existingFarm.longitude) {
        setCoordinates({
          latitude: existingFarm.latitude,
          longitude: existingFarm.longitude,
        });
      }
    }
  }, [existingFarm, reset]);

  const handleCoordinateChange = (lat, lng) => {
    setCoordinates({ latitude: lat, longitude: lng });
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  // Submit Farm Mutation
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      district_id: parseInt(data.district_id, 10),
      village_id: data.village_id ? parseInt(data.village_id, 10) : null,
      farm_category_id: parseInt(data.farm_category_id, 10),
      farm_scale_id: parseInt(data.farm_scale_id, 10),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    try {
      if (isEditMode) {
        await farmsApi.updateFarm(id, payload);
        success('Data peternakan berhasil diperbarui');
      } else {
        const res = await farmsApi.createFarm(payload);
        success('Peternakan baru berhasil didaftarkan');
        if (res.data?.id) {
          navigate(`/admin/farms/${res.data.id}/edit`);
          return;
        }
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'farms'] });
      queryClient.invalidateQueries({ queryKey: ['spatial'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      navigate('/admin/farms');
    } catch (err) {
      showError(err.message || 'Gagal menyimpan data peternakan');
    }
  };

  // Sub-resource Mutations: Livestock
  const deleteLivestockMutation = useMutation({
    mutationFn: async (livestockId) => {
      return await farmsApi.deleteLivestock(livestockId);
    },
    onSuccess: () => {
      success('Komoditas ternak berhasil dihapus');
      refetchLivestock();
      setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
    },
    onError: (err) => showError(err.message || 'Gagal menghapus ternak'),
  });

  // Sub-resource Mutations: Photos
  const setPrimaryPhotoMutation = useMutation({
    mutationFn: async (photoId) => {
      return await farmsApi.updatePhoto(photoId, { is_primary: true });
    },
    onSuccess: () => {
      success('Foto utama berhasil diperbarui');
      refetchPhotos();
    },
    onError: (err) => showError(err.message || 'Gagal mengatur foto utama'),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId) => {
      return await farmsApi.deletePhoto(photoId);
    },
    onSuccess: () => {
      success('Foto berhasil dihapus');
      refetchPhotos();
      setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
    },
    onError: (err) => showError(err.message || 'Gagal menghapus foto'),
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-body text-[#191C19] pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            to="/admin/farms"
            className="p-2.5 rounded-full border border-[#C2C9BD] bg-white hover:bg-[#F1F5F1] text-[#495348] transition-colors"
            title="Kembali ke Daftar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-[#191C19] tracking-tight">
              {isEditMode ? `Edit: ${existingFarm?.farm_name || 'Peternakan'}` : 'Tambah Peternakan Baru'}
            </h1>
            <p className="text-xs text-[#495348] mt-0.5">
              Kelola informasi kandang, koordinat PostGIS, komoditas, dan galeri foto.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Tabs (Only active in Edit Mode) - MD3 Primary Tabs Container */}
      {isEditMode && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#C2C9BD]/50 rounded-full shadow-2xs text-xs font-semibold font-heading">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-5 py-2.5 rounded-full transition-all duration-150 ${
              activeTab === 'general'
                ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
                : 'text-[#495348] hover:text-[#191C19] hover:bg-[#F1F5F1]'
            }`}
          >
            Informasi Umum & Spasial
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('livestock')}
            className={`px-5 py-2.5 rounded-full transition-all duration-150 ${
              activeTab === 'livestock'
                ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
                : 'text-[#495348] hover:text-[#191C19] hover:bg-[#F1F5F1]'
            }`}
          >
            Komoditas Ternak ({livestockList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-5 py-2.5 rounded-full transition-all duration-150 ${
              activeTab === 'photos'
                ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
                : 'text-[#495348] hover:text-[#191C19] hover:bg-[#F1F5F1]'
            }`}
          >
            Galeri Foto ({photosList.length})
          </button>
        </div>
      )}

      {/* TAB 1: GENERAL & SPATIAL INFORMATION */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-7 text-xs">
            
            {/* Section 1 */}
            <div className="space-y-4">
              <h3 className="text-base font-bold font-heading text-[#191C19] border-b border-[#E2E8E2] pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                <span>1. Identitas & Profil Usaha Peternakan</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* Farm Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Nama Peternakan / Usaha Kandang <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('farm_name')}
                    placeholder="Contoh: Peternakan Barokah Jaya"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                  {errors.farm_name && (
                    <span className="text-[#BA1A1A] text-[11px] block">{errors.farm_name.message}</span>
                  )}
                </div>

                {/* Owner Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Nama Pemilik / Pengelola
                  </label>
                  <input
                    type="text"
                    {...register('owner_name')}
                    placeholder="Contoh: H. Slamet Riyadi"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Kategori Usaha <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <select
                    {...register('farm_category_id')}
                    className="w-full px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.farm_category_id && (
                    <span className="text-[#BA1A1A] text-[11px] block">{errors.farm_category_id.message}</span>
                  )}
                </div>

                {/* Scale Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Skala Usaha <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <select
                    {...register('farm_scale_id')}
                    className="w-full px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  >
                    <option value="">Pilih Skala Usaha</option>
                    {scales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.farm_scale_id && (
                    <span className="text-[#BA1A1A] text-[11px] block">{errors.farm_scale_id.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold font-heading text-[#191C19] border-b border-[#E2E8E2] pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                <span>2. Wilayah Administratif & Alamat</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* District */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Kecamatan <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <select
                    {...register('district_id')}
                    className="w-full px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districtList.map((d) => (
                      <option key={d.id} value={d.id}>
                        Kec. {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.district_id && (
                    <span className="text-[#BA1A1A] text-[11px] block">{errors.district_id.message}</span>
                  )}
                </div>

                {/* Village Cascading */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Desa / Pekon
                  </label>
                  <select
                    {...register('village_id')}
                    disabled={!selectedDistrictId}
                    className="w-full px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all disabled:opacity-50"
                  >
                    <option value="">Pilih Desa / Pekon</option>
                    {villageList.map((v) => (
                      <option key={v.id} value={v.id}>
                        Pekon {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address Detail */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Alamat Lengkap / RT / RW
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    placeholder="Contoh: Jl. Ahmad Yani RT 02 RW 01"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Catatan Teknis & Biosekuriti Kandang
                  </label>
                  <textarea
                    rows={3}
                    {...register('notes')}
                    placeholder="Contoh: Kandang close-house dengan sistem desinfektan otomatis..."
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold font-heading text-[#191C19] border-b border-[#E2E8E2] pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                <span>3. Geocoding & Koordinat Spasial PostGIS</span>
              </h3>

              {/* Interactive Map Picker */}
              <MapCoordinatePicker
                latitude={coordinates.latitude}
                longitude={coordinates.longitude}
                onChange={handleCoordinateChange}
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/admin/farms"
              className="px-6 py-2.5 rounded-full border border-[#C2C9BD] bg-white hover:bg-[#F1F5F1] text-[#495348] text-xs font-bold font-heading transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data Peternakan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: LIVESTOCK COMMODITIES SUB-RESOURCE */}
      {activeTab === 'livestock' && isEditMode && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E2] pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-[#191C19]">
                Komoditas Ternak & Populasi
              </h3>
              <p className="text-xs text-[#495348] mt-0.5">
                Kelola jenis hewan ternak dan populasi yang dipelihara pada peternakan ini.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingLivestock(null);
                setLivestockModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold font-heading shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Komoditas</span>
            </button>
          </div>

          {livestockList.length === 0 ? (
            <div className="p-12 text-center text-[#495348]">
              Belum ada komoditas ternak yang terdaftar di peternakan ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                  <tr>
                    <th className="py-3.5 px-4 rounded-l-xl">Kategori Taksonomi</th>
                    <th className="py-3.5 px-4">Jenis Ternak</th>
                    <th className="py-3.5 px-4">Ras / Subtipe</th>
                    <th className="py-3.5 px-4 text-right">Populasi</th>
                    <th className="py-3.5 px-4 text-right rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E2]/60">
                  {livestockList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#191C19] font-heading">
                        {item.livestock_category?.name || 'Ruminansia'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#191C19]">
                        {item.livestock_type?.name || 'Ternak'}
                      </td>
                      <td className="py-3.5 px-4 text-[#495348]">
                        {item.livestock_subtype?.name || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#2E7D32] text-sm">
                        {item.population?.toLocaleString('id-ID')} ekor
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLivestock(item);
                              setLivestockModalOpen(true);
                            }}
                            className="p-2 rounded-full text-[#495348] hover:text-[#1565C0] hover:bg-[#E3F2FD] transition-colors"
                            title="Edit Komoditas"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'livestock',
                                id: item.id,
                                title: `Hapus ${item.livestock_type?.name || 'Ternak'} (${item.population} ekor)?`,
                              })
                            }
                            className="p-2 rounded-full text-[#495348] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/50 transition-colors"
                            title="Hapus Komoditas"
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
      )}

      {/* TAB 3: PHOTOS GALLERY & UPLOAD SUB-RESOURCE */}
      {activeTab === 'photos' && isEditMode && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E2] pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-[#191C19]">
                Galeri Foto Kandang & Fasilitas
              </h3>
              <p className="text-xs text-[#495348] mt-0.5">
                Foto dokumentasi kandang fisik dan sarana pendukung biosekuriti.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold font-heading shadow-xs transition-all shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Foto Baru</span>
            </button>
          </div>

          {photosList.length === 0 ? (
            <div className="p-12 text-center text-[#495348] space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#E8EFE8] text-[#2E7D32] flex items-center justify-center mx-auto">
                <ImageIcon className="w-7 h-7 stroke-[1.8]" />
              </div>
              <p>Belum ada foto kandang yang diunggah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {photosList.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-3xl border border-[#C2C9BD]/50 overflow-hidden bg-white flex flex-col shadow-2xs group hover:shadow-sm transition-all"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#F1F5F1]">
                    <img
                      src={getImageUrl(photo.file_path)}
                      alt={photo.caption || 'Foto kandang'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    {photo.is_primary && (
                      <span className="absolute top-3 left-3 bg-[#2E7D32] text-white text-[10px] font-bold font-heading uppercase px-3 py-1 rounded-full shadow-sm">
                        Foto Utama
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-[#191C19] font-medium line-clamp-2 text-xs">
                      {photo.caption || 'Tanpa keterangan'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E2]">
                      {!photo.is_primary ? (
                        <button
                          type="button"
                          onClick={() => setPrimaryPhotoMutation.mutate(photo.id)}
                          className="text-[11px] font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
                        >
                          Jadikan Utama
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#495348] italic font-medium">Foto Utama</span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            type: 'photo',
                            id: photo.id,
                            title: 'Hapus foto ini secara permanen?',
                          })
                        }
                        className="p-1.5 rounded-full text-[#495348] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/50 transition-colors"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT LIVESTOCK */}
      {livestockModalOpen && (
        <LivestockModal
          key={editingLivestock ? String(editingLivestock.id) : 'new-livestock'}
          isOpen={livestockModalOpen}
          onClose={() => {
            setLivestockModalOpen(false);
            setEditingLivestock(null);
          }}
          farmId={id}
          initialData={editingLivestock}
          onSuccess={() => {
            setLivestockModalOpen(false);
            setEditingLivestock(null);
            refetchLivestock();
          }}
        />
      )}

      {/* MODAL: UPLOAD PHOTO */}
      {photoModalOpen && (
        <PhotoUploadModal
          isOpen={photoModalOpen}
          onClose={() => setPhotoModalOpen(false)}
          farmId={id}
          onSuccess={() => {
            setPhotoModalOpen(false);
            refetchPhotos();
          }}
        />
      )}

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
        onConfirm={() => {
          if (deleteConfirm.type === 'livestock') {
            deleteLivestockMutation.mutate(deleteConfirm.id);
          } else if (deleteConfirm.type === 'photo') {
            deletePhotoMutation.mutate(deleteConfirm.id);
          }
        }}
        title="Konfirmasi Hapus"
        message={deleteConfirm.title}
        confirmLabel="Ya, Hapus"
      />

    </div>
  );
}

// Sub-component: Livestock Modal Form
function LivestockModal({ isOpen, onClose, farmId, initialData, onSuccess }) {
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryId, setCategoryId] = useState(initialData ? String(initialData.livestock_category_id || '') : '');
  const [typeId, setTypeId] = useState(initialData ? String(initialData.livestock_type_id || '') : '');
  const [subtypeId, setSubtypeId] = useState(initialData ? String(initialData.livestock_subtype_id || '') : '');
  const [population, setPopulation] = useState(initialData ? (initialData.population || 10) : 10);

  const { data: categories = [] } = useLivestockCategoriesQuery();
  const { data: types = [] } = useLivestockTypesQuery(categoryId);
  const { data: subtypes = [] } = useLivestockSubtypesQuery(typeId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!typeId) {
      showError('Pilih jenis ternak');
      return;
    }
    if (!population || population <= 0) {
      showError('Jumlah populasi harus lebih dari 0');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        // Update
        await farmsApi.updateLivestock(initialData.id, {
          livestock_subtype_id: subtypeId ? parseInt(subtypeId, 10) : null,
          population: parseInt(population, 10),
        });
        success('Data ternak berhasil diperbarui');
      } else {
        // Create
        await farmsApi.addLivestock(farmId, {
          livestock_category_id: categoryId ? parseInt(categoryId, 10) : null,
          livestock_type_id: parseInt(typeId, 10),
          livestock_subtype_id: subtypeId ? parseInt(subtypeId, 10) : null,
          population: parseInt(population, 10),
        });
        success('Komoditas ternak berhasil ditambahkan');
      }
      onSuccess();
    } catch (err) {
      showError(err.message || 'Gagal menyimpan komoditas ternak');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Komoditas Ternak' : 'Tambah Komoditas Ternak'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
        
        {/* Category */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Kategori Ternak</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setTypeId('');
              setSubtypeId('');
            }}
            disabled={Boolean(initialData)}
            className="w-full px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all disabled:opacity-60"
          >
            <option value="">Pilih Kategori (Ruminansia / Unggas)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Jenis Ternak <span className="text-[#BA1A1A]">*</span></label>
          <select
            value={typeId}
            onChange={(e) => {
              setTypeId(e.target.value);
              setSubtypeId('');
            }}
            disabled={Boolean(initialData)}
            className="w-full px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all disabled:opacity-60"
          >
            <option value="">Pilih Jenis Ternak</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subtype / Breed */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Ras / Subtipe (Opsional)</label>
          <select
            value={subtypeId}
            onChange={(e) => setSubtypeId(e.target.value)}
            disabled={!typeId || subtypes.length === 0}
            className="w-full px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all disabled:opacity-50"
          >
            <option value="">{subtypes.length === 0 ? 'Tidak ada sub-ras spesifik' : 'Pilih Ras / Subtipe'}</option>
            {subtypes.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        {/* Population */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Jumlah Populasi (Ekor) <span className="text-[#BA1A1A]">*</span></label>
          <input
            type="number"
            min="1"
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
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
            {isSubmitting ? 'Menyimpan...' : 'Simpan Ternak'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Sub-component: Photo Upload Modal Form
function PhotoUploadModal({ isOpen, onClose, farmId, onSuccess }) {
  const { success, error: showError } = useToast();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        showError('Ukuran file maksimal 5MB');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showError('Pilih file gambar untuk diunggah');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    if (caption) formData.append('caption', caption);
    formData.append('is_primary', isPrimary ? 'true' : 'false');
    formData.append('sort_order', '1');

    setIsUploading(true);
    try {
      await farmsApi.uploadPhoto(farmId, formData);
      success('Foto kandang berhasil diunggah');
      setFile(null);
      setCaption('');
      setIsPrimary(false);
      setPreview(null);
      onSuccess();
    } catch (err) {
      showError(err.message || 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unggah Foto Kandang Peternakan"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleUpload} className="space-y-4 text-xs font-body">
        
        {/* File Input */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Pilih Berkas Foto (JPG/PNG/WebP, max 5MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-xs text-[#495348] file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#E8F5E9] file:text-[#1B5E20] hover:file:bg-[#D7F3D6] cursor-pointer"
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="aspect-video rounded-2xl overflow-hidden border border-[#C2C9BD]/70 bg-[#F1F5F1]">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Caption */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#191C19] block font-heading">Keterangan / Caption Foto</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Contoh: Tampak depan kandang utama"
            className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
          />
        </div>

        {/* Primary Toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="rounded border-[#C2C9BD] text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
          />
          <span className="text-[#191C19] font-semibold">Jadikan Foto Sampul Utama (Primary)</span>
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
            disabled={isUploading || !file}
            className="px-6 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold font-heading transition-all shadow-xs disabled:opacity-50"
          >
            {isUploading ? 'Mengunggah...' : 'Unggah Foto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
