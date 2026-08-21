import { useState, useMemo } from 'react';
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

  // 1. Fetch Farm General Detail
  const { data: farmData, isLoading: isDetailLoading, isError: isDetailError, refetch: refetchDetail } = useQuery({
    queryKey: ['farms', 'detail', farmId],
    queryFn: async () => {
      const res = await farmsApi.getFarmDetail(farmId);
      return res.data;
    },
    enabled: Boolean(farmId),
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch Farm Photos Sub-Resource explicitly
  const { data: photosRes = [], isLoading: isPhotosLoading, refetch: refetchPhotos } = useQuery({
    queryKey: ['farms', farmId, 'photos'],
    queryFn: async () => {
      try {
        const res = await farmsApi.getFarmPhotos(farmId);
        return res.data || [];
      } catch {
        return [];
      }
    },
    enabled: Boolean(farmId),
    staleTime: 1000 * 60 * 5,
  });

  // Consolidate photos from all potential API response fields
  const photosList = useMemo(() => {
    if (Array.isArray(photosRes) && photosRes.length > 0) return photosRes;
    if (Array.isArray(farmData?.farm_photos) && farmData.farm_photos.length > 0) return farmData.farm_photos;
    if (Array.isArray(farmData?.photos) && farmData.photos.length > 0) return farmData.photos;
    if (Array.isArray(farmData?.farmPhotos) && farmData.farmPhotos.length > 0) return farmData.farmPhotos;
    return [];
  }, [photosRes, farmData]);

  // Extract Cover Photo (marked as is_primary or fallback to first photo)
  const primaryPhoto = useMemo(() => {
    if (!photosList || photosList.length === 0) return null;
    const foundPrimary = photosList.find(
      (p) =>
        p.is_primary === true ||
        p.is_primary === 1 ||
        p.is_primary === 'true' ||
        p.is_primary === '1'
    );
    return foundPrimary || photosList[0];
  }, [photosList]);

  if (!farmId) return null;

  const isLoading = isDetailLoading;
  const isError = isDetailError;

  return (
    <AnimatePresence>
      <div className="absolute top-20 bottom-0 right-0 sm:top-24 sm:bottom-4 sm:right-4 z-[850] w-full sm:max-w-md bg-white shadow-2xl border border-[#C2C9BD]/60 flex flex-col font-body rounded-t-[28px] sm:rounded-3xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E2E8E2] flex items-center justify-between bg-[#F1F5F1]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-[#191C19] line-clamp-1">
                {farmData?.farm_name || 'Detail Peternakan'}
              </h3>
              <span className="text-[11px] text-[#495348] font-medium font-body">
                {farmData?.district?.name ? `Kec. ${farmData.district.name}` : 'Kabupaten Pringsewu'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#495348] hover:text-[#191C19] hover:bg-[#E8EFE8] transition-colors"
            aria-label="Tutup detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - MD3 Capsule Pill Container */}
        <div className="px-6 pt-3 pb-1 bg-white">
          <div className="flex bg-[#F1F5F1] p-1.5 rounded-full border border-[#C2C9BD]/40 text-xs font-heading font-bold shadow-2xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1.5 px-3 rounded-full transition-all duration-150 text-center ${
                activeTab === 'overview'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#495348] hover:text-[#191C19]'
              }`}
            >
              Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('livestock')}
              className={`flex-1 py-1.5 px-3 rounded-full transition-all duration-150 text-center ${
                activeTab === 'livestock'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#495348] hover:text-[#191C19]'
              }`}
            >
              Ternak ({farmData?.livestock?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 py-1.5 px-3 rounded-full transition-all duration-150 text-center ${
                activeTab === 'photos'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'text-[#495348] hover:text-[#191C19]'
              }`}
            >
              Foto ({photosList.length})
            </button>
          </div>
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
              onRetry={() => {
                refetchDetail();
                refetchPhotos();
              }}
            />
          )}

          {farmData && (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5 text-xs text-[#191C19]">
                  {/* Primary Photo (Sampul) */}
                  {primaryPhoto && (
                    <div className="rounded-2xl overflow-hidden border border-[#C2C9BD]/50 aspect-video relative group shadow-2xs bg-[#F1F5F1]">
                      <img
                        src={getImageUrl(primaryPhoto.file_path || primaryPhoto)}
                        alt={farmData.farm_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#2E7D32] text-white text-[9px] font-bold font-heading uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        Sampul Utama
                      </span>
                      {primaryPhoto.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-[11px]">
                          {primaryPhoto.caption}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#F1F5F1]/70 rounded-2xl border border-[#C2C9BD]/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading">
                        Kategori Usaha
                      </span>
                      <p className="font-bold text-[#191C19] text-sm">
                        {farmData.farm_category?.name || 'Komersial'}
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#F1F5F1]/70 rounded-2xl border border-[#C2C9BD]/40 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading">
                        Skala Usaha
                      </span>
                      <p className="font-bold text-[#191C19] text-sm">
                        {farmData.farm_scale?.name || 'Besar'}
                      </p>
                    </div>
                  </div>

                  {/* Detail Info List */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#F1F5F1] text-[#495348] flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[#495348] block text-[11px] font-semibold">Nama Pemilik</span>
                        <span className="font-bold text-[#191C19] text-xs">{farmData.owner_name || 'Tidak tercatat'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#F1F5F1] text-[#495348] flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[#495348] block text-[11px] font-semibold">Kontak / Telepon</span>
                        <span className="font-semibold text-[#191C19] text-xs">{farmData.phone || '-'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#F1F5F1] text-[#495348] flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[#495348] block text-[11px] font-semibold">Alamat & Wilayah Administratif</span>
                        <p className="font-semibold text-[#191C19] text-xs leading-relaxed">
                          {farmData.address || 'Pringsewu'}
                          {farmData.village?.name && `, Pekon ${farmData.village.name}`}
                          {farmData.district?.name && `, Kec. ${farmData.district.name}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#F1F5F1] text-[#495348] flex items-center justify-center shrink-0 mt-0.5">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[#495348] block text-[11px] font-semibold">Koordinat Geografis</span>
                        <span className="font-mono text-[#191C19] text-[11px] font-semibold">
                          {farmData.latitude?.toFixed(6)}, {farmData.longitude?.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    {farmData.notes && (
                      <div className="p-3.5 bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9] text-[#1B5E20] text-xs leading-relaxed">
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
                    <div className="p-6 text-center text-[#495348] text-xs">
                      Belum ada data komoditas ternak yang terdaftar.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {farmData.livestock.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl border border-[#C2C9BD]/50 bg-white hover:border-[#2E7D32]/50 hover:shadow-2xs transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading">
                              {item.livestock_category?.name || 'Komoditas'}
                            </span>
                            <span className="text-xs font-bold font-heading text-[#1B5E20] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9]">
                              {item.population?.toLocaleString('id-ID')} ekor
                            </span>
                          </div>
                          <h4 className="text-sm font-bold font-heading text-[#191C19]">
                            {item.livestock_type?.name || 'Ternak'}
                          </h4>
                          {item.livestock_subtype?.name && (
                            <p className="text-xs text-[#495348]">
                              Ras / Subtipe: <span className="font-semibold text-[#191C19]">{item.livestock_subtype.name}</span>
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
                  {isPhotosLoading ? (
                    <div className="p-8 text-center text-[#495348] text-xs">
                      Memuat galeri foto...
                    </div>
                  ) : photosList.length === 0 ? (
                    <div className="p-8 text-center text-[#495348] text-xs flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-2 stroke-[1.5]" />
                      <span>Belum ada foto kandang yang diunggah.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {photosList.map((photo, idx) => {
                        const isPrimary =
                          photo.is_primary === true ||
                          photo.is_primary === 1 ||
                          photo.is_primary === 'true' ||
                          photo.is_primary === '1';
                        return (
                          <div
                            key={photo.id || photo.file_path || idx}
                            onClick={() => setSelectedPhoto(photo)}
                            className="group relative aspect-square rounded-2xl overflow-hidden border border-[#C2C9BD]/50 cursor-pointer bg-[#F1F5F1]"
                          >
                            <img
                              src={getImageUrl(photo.file_path || photo)}
                              alt={photo.caption || 'Foto kandang'}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
                              }}
                            />
                            {isPrimary && (
                              <span className="absolute top-2 left-2 bg-[#2E7D32] text-white text-[9px] font-bold font-heading uppercase px-2 py-0.5 rounded-full shadow-xs">
                                Sampul
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <ExternalLink className="w-5 h-5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Photo Lightbox Modal - MD3 Dialog */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="relative max-w-2xl w-full bg-white rounded-[28px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={getImageUrl(selectedPhoto.file_path || selectedPhoto)}
                alt={selectedPhoto.caption || 'Preview'}
                className="w-full max-h-[70vh] object-contain bg-[#111611]"
              />
              {selectedPhoto.caption && (
                <div className="p-5 bg-white text-[#191C19] text-xs font-body font-semibold">
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
