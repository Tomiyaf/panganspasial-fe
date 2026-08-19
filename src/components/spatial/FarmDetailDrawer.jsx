import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, User, Layers, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { farmsApi } from '../../services/api';
import { getImageUrl } from '../../utils/imageUrl';
import { CardSkeleton } from '../ui/LoadingSkeleton';
import ErrorState from '../ui/ErrorState';

export default function FarmDetailDrawer({ farmId, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, livestock, photos
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const { data: farmData, isLoading, isError, refetch } = useQuery({
    queryKey: ['farms', 'detail', farmId],
    queryFn: async () => {
      const res = await farmsApi.getFarmDetail(farmId);
      return res.data;
    },
    enabled: Boolean(farmId),
    staleTime: 1000 * 60 * 5,
  });

  if (!farmId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 right-0 z-[1000] w-full sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col font-body">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#2E7D32] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900 line-clamp-1">
                {farmData?.farm_name || 'Detail Peternakan'}
              </h3>
              <span className="text-[11px] text-slate-500 font-body">
                {farmData?.district?.name ? `Kec. ${farmData.district.name}` : 'Kabupaten Pringsewu'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Tutup detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 text-xs font-semibold font-heading bg-white px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors mr-6 ${
              activeTab === 'overview'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab('livestock')}
            className={`py-3 border-b-2 transition-colors mr-6 ${
              activeTab === 'livestock'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Komoditas Ternak ({farmData?.livestock?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'photos'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Galeri Foto ({farmData?.farm_photos?.length || 0})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              <CardSkeleton />
            </div>
          )}

          {isError && (
            <ErrorState
              title="Gagal Memuat Detail Peternakan"
              message="Informasi lengkap peternakan tidak dapat diakses."
              onRetry={refetch}
            />
          )}

          {farmData && (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5 text-xs text-slate-700">
                  {/* Primary Photo Hero if available */}
                  {farmData.farm_photos && farmData.farm_photos.length > 0 && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video relative group">
                      <img
                        src={getImageUrl(farmData.farm_photos[0].file_path)}
                        alt={farmData.farm_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      {farmData.farm_photos[0].caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-[11px]">
                          {farmData.farm_photos[0].caption}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                        Kategori Usaha
                      </span>
                      <p className="font-semibold text-slate-900">
                        {farmData.farm_category?.name || 'Komersial'}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                        Skala Usaha
                      </span>
                      <p className="font-semibold text-slate-900">
                        {farmData.farm_scale?.name || 'Besar'}
                      </p>
                    </div>
                  </div>

                  {/* Detail Info List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Nama Pemilik</span>
                        <span className="font-medium text-slate-800">{farmData.owner_name || 'Tidak tercatat'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Kontak / Telepon</span>
                        <span className="font-medium text-slate-800">{farmData.phone || '-'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Alamat & Wilayah Administratif</span>
                        <p className="font-medium text-slate-800 leading-relaxed">
                          {farmData.address || 'Pringsewu'}
                          {farmData.village?.name && `, Pekon ${farmData.village.name}`}
                          {farmData.district?.name && `, Kec. ${farmData.district.name}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Layers className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Koordinat Geografis</span>
                        <span className="font-mono text-slate-700 text-[11px]">
                          {farmData.latitude?.toFixed(6)}, {farmData.longitude?.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    {farmData.notes && (
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/80 text-emerald-900 text-xs leading-relaxed">
                        <span className="font-bold font-heading block mb-0.5">Catatan Teknis / Biosekuriti:</span>
                        {farmData.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LIVESTOCK COMMODITIES */}
              {activeTab === 'livestock' && (
                <div className="space-y-4">
                  {(!farmData.livestock || farmData.livestock.length === 0) ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      Belum ada data komoditas ternak yang terdaftar.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {farmData.livestock.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-300 transition-colors space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                              {item.livestock_category?.name || 'Komoditas'}
                            </span>
                            <span className="text-xs font-extrabold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-full">
                              {item.population?.toLocaleString('id-ID')} ekor
                            </span>
                          </div>
                          <h4 className="text-sm font-bold font-heading text-slate-900">
                            {item.livestock_type?.name || 'Ternak'}
                          </h4>
                          {item.livestock_subtype?.name && (
                            <p className="text-xs text-slate-500">
                              Ras / Subtipe: <span className="font-medium text-slate-700">{item.livestock_subtype.name}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PHOTOS GALLERY */}
              {activeTab === 'photos' && (
                <div className="space-y-4">
                  {(!farmData.farm_photos || farmData.farm_photos.length === 0) ? (
                    <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-2 stroke-[1.5]" />
                      <span>Belum ada foto kandang yang diunggah.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {farmData.farm_photos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => setSelectedPhoto(photo)}
                          className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer bg-slate-100"
                        >
                          <img
                            src={getImageUrl(photo.file_path)}
                            alt={photo.caption || 'Foto kandang'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          {photo.is_primary && (
                            <span className="absolute top-2 left-2 bg-[#2E7D32] text-white text-[9px] font-bold font-heading uppercase px-1.5 py-0.5 rounded shadow-xs">
                              Utama
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <ExternalLink className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Photo Lightbox Modal */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={getImageUrl(selectedPhoto.file_path)}
                alt={selectedPhoto.caption || 'Preview'}
                className="w-full max-h-[70vh] object-contain bg-slate-950"
              />
              {selectedPhoto.caption && (
                <div className="p-4 bg-white text-slate-800 text-xs font-body">
                  {selectedPhoto.caption}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
}
