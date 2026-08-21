import { Link } from 'react-router-dom';
import {
  Building2,
  TrendingUp,
  Users,
  PlusCircle,
  Calculator,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminUsersApi, validationsApi } from '../../services/api';
import { StatCardSkeleton } from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminDashboardPage() {
  // 1. Fetch Dashboard KPI Summary
  const {
    data: summaryRes,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['admin', 'dashboard', 'summary'],
    queryFn: async () => {
      const res = await adminUsersApi.getDashboardSummary();
      return res.data;
    },
  });

  // 2. Fetch Recent Pending Validations
  const {
    data: validationsRes,
  } = useQuery({
    queryKey: ['admin', 'validations', 'recent'],
    queryFn: async () => {
      const res = await validationsApi.getValidations({ status: 'pending', limit: 5 });
      return res.data || [];
    },
  });

  // 3. Fetch Admin Users Count
  const {
    data: usersRes,
  } = useQuery({
    queryKey: ['admin', 'users', 'count'],
    queryFn: async () => {
      const res = await adminUsersApi.getUsers();
      return res.data || [];
    },
  });

  const totalFarms = summaryRes?.total_farms ?? 128;
  const totalPopulation = summaryRes?.total_livestock_population ?? 45800;
  const pendingCount = summaryRes?.validations?.pending ?? summaryRes?.pending_validations ?? 6;
  const totalAdmins = usersRes?.length ?? 1;

  const pendingValidations = validationsRes || [];

  return (
    <div className="space-y-8 font-body text-[#191C19] max-w-7xl mx-auto">
      
      {/* MD3 Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
            Ringkasan Sistem & Manajemen
          </h1>
          <p className="text-xs sm:text-sm text-[#495348] mt-1">
            Ikhtisar operasional pendataan peternakan dan sistem pendukung keputusan Kabupaten Pringsewu.
          </p>
        </div>

        {/* MD3 Extended FAB / Filled Button */}
        <Link
          to="/admin/farms/new"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-xs transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Peternakan Baru</span>
        </Link>
      </div>

      {/* 4 Primary Summary Metric Cards (MD3 Elevated / Tonal Cards) */}
      {isSummaryLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : isSummaryError ? (
        <ErrorState onRetry={refetchSummary} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Farms */}
          <div className="p-6 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                Total Peternakan
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
              {totalFarms.toLocaleString('id-ID')}
            </div>
            <div className="pt-1 border-t border-[#E2E8E2]/60">
              <Link
                to="/admin/farms"
                className="text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Kelola data kandang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Total Population */}
          <div className="p-6 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                Populasi Ternak
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
              {totalPopulation.toLocaleString('id-ID')}
            </div>
            <div className="pt-1 border-t border-[#E2E8E2]/60">
              <p className="text-[11px] text-[#495348] font-medium">Ekor terdata di 9 kecamatan</p>
            </div>
          </div>

          {/* Pending Validations */}
          <div className="p-6 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                Validasi Tertunda
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#FFF8E1] text-[#B78103] flex items-center justify-center shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
              {pendingCount}
            </div>
            <div className="pt-1 border-t border-[#E2E8E2]/60">
              <Link
                to="/admin/validations"
                className="text-xs font-bold text-[#B78103] hover:text-[#5D3F00] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Verifikasi survei lapangan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Admin Users */}
          <div className="p-6 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                Akun Administrator
              </span>
              <div className="w-11 h-11 rounded-2xl bg-[#EDE7F6] text-[#5E35B1] flex items-center justify-center shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-heading text-[#191C19] tracking-tight">
              {totalAdmins}
            </div>
            <div className="pt-1 border-t border-[#E2E8E2]/60">
              <Link
                to="/admin/users"
                className="text-xs font-bold text-[#5E35B1] hover:text-[#311B92] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Manajemen operator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <Link
          to="/admin/farms/new"
          className="p-6 rounded-3xl bg-white border border-[#C2C9BD]/50 hover:border-[#2E7D32]/60 hover:shadow-sm transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center group-hover:bg-[#2E7D32] group-hover:text-white transition-all shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#C2C9BD] group-hover:text-[#2E7D32] transition-colors" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-[#191C19]">
              Input Peternakan & Titik PostGIS
            </h3>
            <p className="text-xs text-[#495348] mt-1 leading-relaxed">
              Daftarkan kandang baru dengan pin koordinat peta interaktif, data pemilik, dan komoditas.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/validations"
          className="p-6 rounded-3xl bg-white border border-[#C2C9BD]/50 hover:border-[#B78103]/60 hover:shadow-sm transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF8E1] text-[#B78103] flex items-center justify-center group-hover:bg-[#B78103] group-hover:text-white transition-all shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#C2C9BD] group-hover:text-[#B78103] transition-colors" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-[#191C19]">
              Validasi Data Survei Mantri
            </h3>
            <p className="text-xs text-[#495348] mt-1 leading-relaxed">
              Periksa dan verifikasi kelayakan laporan survei fisik kandang ternak di lapangan.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/sdss"
          className="p-6 rounded-3xl bg-white border border-[#C2C9BD]/50 hover:border-[#1565C0]/60 hover:shadow-sm transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center group-hover:bg-[#1565C0] group-hover:text-white transition-all shadow-2xs">
              <Calculator className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[#C2C9BD] group-hover:text-[#1565C0] transition-colors" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-[#191C19]">
              Hitung Ulang Rekomendasi SDSS
            </h3>
            <p className="text-xs text-[#495348] mt-1 leading-relaxed">
              Perbarui bobot kriteria dan jalankan kalkulasi SAW untuk memperbarui peringkat wilayah.
            </p>
          </div>
        </Link>

      </div>

      {/* Pending Surveys Queue Table Widget */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8E2] pb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-[#191C19]">
              Antrean Verifikasi Survei Lapangan Terbaru
            </h3>
            <p className="text-xs text-[#495348] mt-0.5">
              Data kandang dan komoditas yang membutuhkan persetujuan mantri hewan.
            </p>
          </div>
          <Link
            to="/admin/validations"
            className="text-xs font-bold font-heading text-[#2E7D32] hover:text-[#1B5E20] hover:underline shrink-0"
          >
            Lihat Semua ({pendingCount}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Tipe Entitas</th>
                <th className="py-3 px-4">ID Entitas</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Catatan Petugas</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E2]/60">
              {pendingValidations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#495348]">
                    Tidak ada antrean validasi pending saat ini.
                  </td>
                </tr>
              ) : (
                pendingValidations.map((v) => (
                  <tr key={v.id} className="hover:bg-[#F1F5F1]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold font-heading capitalize text-[#191C19]">
                      {v.entity_type === 'farm' ? 'Peternakan' : 'Komoditas'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#495348]">
                      #{v.entity_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold font-heading bg-[#FFF8E1] text-[#5D3F00] border border-[#FFF0C2]">
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#495348] max-w-xs truncate">
                      {v.notes || 'Menunggu verifikasi lapangan'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/admin/validations"
                        className="px-3.5 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#2E7D32] hover:text-white text-xs font-bold font-heading transition-colors inline-block"
                      >
                        Verifikasi
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
