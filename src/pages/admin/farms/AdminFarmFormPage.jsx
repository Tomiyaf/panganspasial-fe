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
    <div className="space-y-6 max-w-5xl mx-auto font-body text-slate-800 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/farms"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
              {isEditMode ? `Edit: ${existingFarm?.farm_name || 'Peternakan'}` : 'Tambah Peternakan Baru'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola informasi kandang, koordinat PostGIS, komoditas, dan galeri foto.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Tabs (Only active in Edit Mode) */}
      {isEditMode && (
        <div className="flex border-b border-slate-200 text-xs font-semibold font-heading bg-white rounded-2xl px-6 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3.5 border-b-2 transition-colors mr-6 ${
              activeTab === 'general'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Informasi Umum & Spasial
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('livestock')}
            className={`py-3.5 border-b-2 transition-colors mr-6 ${
              activeTab === 'livestock'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Komoditas Ternak ({livestockList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === 'photos'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Galeri Foto ({photosList.length})
          </button>
        </div>
      )}

      {/* TAB 1: GENERAL & SPATIAL INFORMATION */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-xs">
            <h3 className="text-base font-bold font-heading text-slate-900 border-b border-slate-100 pb-3">
              1. Identitas & Profil Usaha Peternakan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Farm Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-slate-700 block">
                  Nama Peternakan / Usaha Kandang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('farm_name')}
                  placeholder="Contoh: Peternakan Barokah Jaya"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
                {errors.farm_name && (
                  <span className="text-red-500 text-[11px] block">{errors.farm_name.message}</span>
                )}
              </div>

              {/* Owner Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Nama Pemilik / Pengelola
                </label>
                <input
                  type="text"
                  {...register('owner_name')}
                  placeholder="Contoh: H. Slamet Riyadi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Kategori Usaha <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('farm_category_id')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.farm_category_id && (
                  <span className="text-red-500 text-[11px] block">{errors.farm_category_id.message}</span>
                )}
              </div>

              {/* Scale Dropdown */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Skala Usaha <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('farm_scale_id')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                >
                  <option value="">Pilih Skala Usaha</option>
                  {scales.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.farm_scale_id && (
                  <span className="text-red-500 text-[11px] block">{errors.farm_scale_id.message}</span>
                )}
              </div>
            </div>

            <h3 className="text-base font-bold font-heading text-slate-900 border-b border-slate-100 pb-3 pt-4">
              2. Wilayah Administratif & Alamat
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* District */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('district_id')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                >
                  <option value="">Pilih Kecamatan</option>
                  {districtList.map((d) => (
                    <option key={d.id} value={d.id}>
                      Kec. {d.name}
                    </option>
                  ))}
                </select>
                {errors.district_id && (
                  <span className="text-red-500 text-[11px] block">{errors.district_id.message}</span>
                )}
              </div>

              {/* Village Cascading */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  Desa / Pekon
                </label>
                <select
                  {...register('village_id')}
                  disabled={!selectedDistrictId}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32] disabled:opacity-50"
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
                <label className="font-semibold text-slate-700 block">
                  Alamat Lengkap / RT / RW
                </label>
                <input
                  type="text"
                  {...register('address')}
                  placeholder="Contoh: Jl. Ahmad Yani RT 02 RW 01"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-slate-700 block">
                  Catatan Teknis & Biosekuriti Kandang
                </label>
                <textarea
                  rows={3}
                  {...register('notes')}
                  placeholder="Contoh: Kandang close-house dengan sistem desinfektan otomatis..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <h3 className="text-base font-bold font-heading text-slate-900 border-b border-slate-100 pb-3 pt-4">
              3. Geocoding & Koordinat Spasial PostGIS
            </h3>

            {/* Interactive Map Picker */}
            <MapCoordinatePicker
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              onChange={handleCoordinateChange}
            />

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/admin/farms"
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold font-heading transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data Peternakan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: LIVESTOCK COMMODITIES SUB-RESOURCE */}
      {activeTab === 'livestock' && isEditMode && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">
                Komoditas Ternak & Populasi
              </h3>
              <p className="text-xs text-slate-500">
                Kelola hewan ternak yang dipelihara pada peternakan ini.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingLivestock(null);
                setLivestockModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Komoditas</span>
            </button>
          </div>

          {livestockList.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Belum ada komoditas ternak yang terdaftar di peternakan ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Kategori Taksonomi</th>
                    <th className="py-3 px-4">Jenis Ternak</th>
                    <th className="py-3 px-4">Ras / Subtipe</th>
                    <th className="py-3 px-4 text-right">Populasi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {livestockList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900 font-heading">
                        {item.livestock_category?.name || 'Ruminansia'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {item.livestock_type?.name || 'Ternak'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.livestock_subtype?.name || '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#2E7D32] text-sm">
                        {item.population?.toLocaleString('id-ID')} ekor
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLivestock(item);
                              setLivestockModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
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
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
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
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">
                Galeri Foto Kandang & Fasilitas
              </h3>
              <p className="text-xs text-slate-500">
                Foto dokumentasi kandang fisik dan sarana pendukung biosekuriti.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Foto Baru</span>
            </button>
          </div>

          {photosList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <ImageIcon className="w-10 h-10 mx-auto stroke-[1.5]" />
              <p>Belum ada foto kandang yang diunggah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {photosList.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col group"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-200">
                    <img
                      src={getImageUrl(photo.file_path)}
                      alt={photo.caption || 'Foto kandang'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    {photo.is_primary && (
                      <span className="absolute top-2 left-2 bg-[#2E7D32] text-white text-[9px] font-bold font-heading uppercase px-2 py-0.5 rounded-full shadow-xs">
                        Foto Utama
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-slate-700 font-medium line-clamp-2">
                      {photo.caption || 'Tanpa keterangan'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      {!photo.is_primary ? (
                        <button
                          type="button"
                          onClick={() => setPrimaryPhotoMutation.mutate(photo.id)}
                          className="text-[11px] font-semibold text-[#2E7D32] hover:underline"
                        >
                          Jadikan Utama
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Foto Utama</span>
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
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Kategori Ternak</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setTypeId('');
              setSubtypeId('');
            }}
            disabled={Boolean(initialData)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32] disabled:opacity-60"
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
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Jenis Ternak *</label>
          <select
            value={typeId}
            onChange={(e) => {
              setTypeId(e.target.value);
              setSubtypeId('');
            }}
            disabled={Boolean(initialData)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32] disabled:opacity-60"
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
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Ras / Subtipe (Opsional)</label>
          <select
            value={subtypeId}
            onChange={(e) => setSubtypeId(e.target.value)}
            disabled={!typeId || subtypes.length === 0}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32] disabled:opacity-50"
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
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Jumlah Populasi (Ekor) *</label>
          <input
            type="number"
            min="1"
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading transition-colors disabled:opacity-50"
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
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Pilih Berkas Foto (JPG/PNG/WebP, max 5MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#2E7D32] hover:file:bg-emerald-100"
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Caption */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Keterangan / Caption Foto</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Contoh: Tampak depan kandang utama"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>

        {/* Primary Toggle */}
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
          />
          <span className="text-slate-700 font-medium">Jadikan Foto Sampul Utama (Primary)</span>
        </label>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isUploading || !file}
            className="px-5 py-2 rounded-lg bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading transition-colors disabled:opacity-50"
          >
            {isUploading ? 'Mengunggah...' : 'Unggah Foto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
