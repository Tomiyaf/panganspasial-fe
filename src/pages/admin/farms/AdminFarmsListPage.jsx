import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { farmsApi } from '../../../services/api';
import { useDistrictsQuery, useFarmCategoriesQuery } from '../../../hooks/useMasterData';
import { useToast } from '../../../context/ToastContext';
import Pagination from '../../../components/ui/Pagination';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import ErrorState from '../../../components/ui/ErrorState';

export default function AdminFarmsListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [farmCategoryId, setFarmCategoryId] = useState('');

  // Delete modal state
  const [farmToDelete, setFarmToDelete] = useState(null);

  // Fetch Master filters
  const { data: districtsGeoJSON } = useDistrictsQuery();
  const { data: categories = [] } = useFarmCategoriesQuery();

  const districtList = districtsGeoJSON?.features?.map((f) => ({
    id: f.properties?.id || f.id,
    name: f.properties?.name || f.properties?.district_name || 'Kecamatan',
  })) || [];

  // Fetch Farms Data
  const {
    data: farmsRes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'farms', { page, search, districtId, farmCategoryId }],
    queryFn: async () => {
      const res = await farmsApi.getAdminFarms({
        page,
        limit: 15,
        search: search || undefined,
        district_id: districtId || undefined,
        farm_category_id: farmCategoryId || undefined,
      });
      return res;
    },
  });

  const farms = farmsRes?.data || [];
  const meta = farmsRes?.meta || { total: 0, page: 1, limit: 15, total_pages: 1 };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await farmsApi.deleteFarm(id);
    },
    onSuccess: () => {
      success('Peternakan beserta komoditas dan fotonya berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'farms'] });
      queryClient.invalidateQueries({ queryKey: ['spatial'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      setFarmToDelete(null);
    },
    onError: (err) => {
      showError(err.message || 'Gagal menghapus peternakan');
    },
  });

  const handleDeleteConfirm = () => {
    if (farmToDelete) {
      deleteMutation.mutate(farmToDelete.id);
    }
  };

  return (
    <div className="space-y-6 font-body text-[#191C19] max-w-7xl mx-auto">
      
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
            Data Peternakan & Spasial
          </h1>
          <p className="text-xs sm:text-sm text-[#495348] mt-1">
            Daftar seluruh unit peternakan terdaftar di Kabupaten Pringsewu.
          </p>
        </div>

        <Link
          to="/admin/farms/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-xs transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Peternakan</span>
        </Link>
      </div>

      {/* MD3 Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs flex flex-col md:flex-row items-center gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#495348] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama peternakan, pemilik, atau alamat..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
          />
        </div>

        {/* District Filter */}
        <select
          value={districtId}
          onChange={(e) => {
            setDistrictId(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-52 px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
        >
          <option value="">Semua Kecamatan</option>
          {districtList.map((d) => (
            <option key={d.id} value={d.id}>
              Kec. {d.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={farmCategoryId}
          onChange={(e) => {
            setFarmCategoryId(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-48 px-3.5 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-[#C2C9BD]/50 shadow-2xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : isError ? (
          <div className="p-8">
            <ErrorState onRetry={refetch} />
          </div>
        ) : farms.length === 0 ? (
          <EmptyState
            title="Tidak Ada Peternakan Ditemukan"
            description="Belum ada data peternakan yang cocok dengan filter atau kata kunci pencarian."
            actionLabel="Tambah Peternakan Baru"
            onAction={() => navigate('/admin/farms/new')}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                  <tr>
                    <th className="py-3.5 px-5">Nama Peternakan / Pemilik</th>
                    <th className="py-3.5 px-4">Wilayah Administratif</th>
                    <th className="py-3.5 px-4">Kategori & Skala</th>
                    <th className="py-3.5 px-4 text-center">Komoditas & Populasi</th>
                    <th className="py-3.5 px-4 text-center">Koordinat</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E2]/60">
                  {farms.map((farm) => (
                    <tr key={farm.id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                      
                      {/* Name & Owner */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 shadow-2xs">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-[#191C19] font-heading block text-sm">
                              {farm.farm_name}
                            </span>
                            <span className="text-[11px] text-[#495348]">
                              Pemilik: {farm.owner_name || 'Tidak tercatat'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* District & Village */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#191C19] block">
                          Kec. {farm.district || '-'}
                        </span>
                        <span className="text-[11px] text-[#495348]">
                          Pekon {farm.village || '-'}
                        </span>
                      </td>

                      {/* Category & Scale */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-heading bg-[#E8EFE8] text-[#1B5E20] border border-[#C2C9BD]/30">
                            {farm.category || 'Komersial'}
                          </span>
                          <span className="text-[11px] text-[#495348] font-medium pl-0.5">
                            Skala: {farm.scale || 'Besar'}
                          </span>
                        </div>
                      </td>

                      {/* Livestock Count & Population */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-[#191C19] block text-sm">
                          {farm.total_population?.toLocaleString('id-ID') || 0} ekor
                        </span>
                        <span className="text-[10px] text-[#495348] font-heading">
                          {farm.total_livestock_count || 1} jenis ternak
                        </span>
                      </td>

                      {/* Spatial Coordinates */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[#495348]">
                        {farm.latitude ? `${farm.latitude.toFixed(4)}, ${farm.longitude.toFixed(4)}` : '-'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/spasial?id=${farm.id}`}
                            target="_blank"
                            className="p-2 rounded-full text-[#495348] hover:text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                            title="Buka di Peta WebGIS"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/farms/${farm.id}/edit`}
                            className="p-2 rounded-full text-[#495348] hover:text-[#1565C0] hover:bg-[#E3F2FD] transition-colors"
                            title="Edit Data Peternakan"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setFarmToDelete(farm)}
                            className="p-2 rounded-full text-[#495348] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/50 transition-colors"
                            title="Hapus Peternakan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(farmToDelete)}
        onClose={() => setFarmToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Peternakan"
        message={`Apakah Anda yakin ingin menghapus "${farmToDelete?.farm_name}"? Seluruh data komoditas ternak dan foto yang terhubung akan ikut terhapus secara beruntun (cascade).`}
        confirmLabel="Ya, Hapus Peternakan"
        isLoading={deleteMutation.isPending}
      />

    </div>
  );
}
