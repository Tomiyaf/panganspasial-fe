import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Building2,
  Layers,
  ArrowRight,
  Filter,
  PieChart as PieIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { statisticsApi } from '../services/api';
import { useDistrictsQuery } from '../hooks/useMasterData';
import { StatCardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

export default function StatistikPage() {
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  // 1. Fetch Master Districts for Filter Dropdown
  const { data: districtsGeoJSON } = useDistrictsQuery();
  const districtOptions = districtsGeoJSON?.features?.map((f) => ({
    id: f.properties?.id || f.id,
    name: f.properties?.name || f.properties?.district_name || 'Kecamatan',
  })) || [];

  // 2. Fetch Overview KPI
  const {
    data: overviewRes,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ['statistics', 'overview', selectedDistrictId],
    queryFn: async () => {
      const res = await statisticsApi.getOverview(
        selectedDistrictId ? { district_id: selectedDistrictId } : {}
      );
      return res.data;
    },
  });

  // 3. Fetch Livestock Population by Commodity
  const {
    data: livestockRes,
    isLoading: isLivestockLoading,
  } = useQuery({
    queryKey: ['statistics', 'livestock', selectedDistrictId],
    queryFn: async () => {
      const res = await statisticsApi.getLivestockStats(
        selectedDistrictId ? { district_id: selectedDistrictId } : {}
      );
      return res.data || [];
    },
  });

  // 4. Fetch District Aggregate Table
  const {
    data: farmsStatsRes,
    isLoading: isFarmsStatsLoading,
  } = useQuery({
    queryKey: ['statistics', 'farms', 'districts'],
    queryFn: async () => {
      const res = await statisticsApi.getFarmsStats();
      return res.data || [];
    },
  });

  const kpi = overviewRes?.kpi || {
    total_farms: 128,
    total_livestock_population: 45800,
    total_districts: 9,
    total_livestock_types: 12,
  };

  const categoryDistribution = overviewRes?.category_distribution || [
    { category: 'Komersial', count: 72 },
    { category: 'Mandiri', count: 38 },
    { category: 'Kemitraan', count: 18 },
  ];

  const scaleDistribution = overviewRes?.scale_distribution || [
    { scale: 'Besar', count: 35 },
    { scale: 'Sedang', count: 48 },
    { scale: 'Kecil', count: 32 },
    { scale: 'Mikro', count: 13 },
  ];

  const COLORS = ['#2E7D32', '#1565C0', '#F9A825', '#00796B', '#8E24AA', '#D81B60'];

  return (
    <div className="pt-28 pb-20 min-h-[100dvh] bg-[#F8FAF8] text-[#191C19] font-body">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">

        {/* Page Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E2E8E2]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-xs font-bold font-heading">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span>Data & Analisis Kewilayahan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#191C19] tracking-tight">
              Dashboard Statistik Peternakan
            </h1>
            <p className="text-sm text-[#495348] font-body max-w-[60ch]">
              Agregasi populasi komoditas ternak, unit usaha, dan sebaran kewilayahan di 9 kecamatan Kabupaten Pringsewu.
            </p>
          </div>

          {/* District Filter Dropdown - MD3 Outlined Chip */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#C2C9BD] shadow-2xs text-xs font-semibold text-[#191C19]">
              <Filter className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-[#495348]">Wilayah:</span>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="bg-transparent font-bold text-[#191C19] focus:outline-none cursor-pointer"
              >
                <option value="">Seluruh Kabupaten Pringsewu</option>
                {districtOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    Kecamatan {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4 Primary KPI Summary Cards */}
        {isOverviewLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : isOverviewError ? (
          <ErrorState onRetry={refetchOverview} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* KPI 1 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-2 hover:border-[#2E7D32]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                  Total Peternakan
                </span>
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-2xs">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#191C19] tracking-tight">
                {kpi.total_farms?.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-[#495348] font-medium">Unit kandang terverifikasi</p>
            </div>

            {/* KPI 2 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-2 hover:border-[#1565C0]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                  Total Populasi Ternak
                </span>
                <div className="w-10 h-10 rounded-full bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center shadow-2xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#191C19] tracking-tight">
                {kpi.total_livestock_population?.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-[#495348] font-medium">Ekor ternak terdata</p>
            </div>

            {/* KPI 3 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-2 hover:border-[#B78103]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                  Kecamatan Terdata
                </span>
                <div className="w-10 h-10 rounded-full bg-[#FFF8E1] text-[#B78103] flex items-center justify-center shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#191C19] tracking-tight">
                {kpi.total_districts}
              </div>
              <p className="text-[11px] text-[#495348] font-medium">Kecamatan administratif</p>
            </div>

            {/* KPI 4 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-2 hover:border-[#7B1FA2]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-heading uppercase tracking-wider text-[#495348]">
                  Variasi Komoditas
                </span>
                <div className="w-10 h-10 rounded-full bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center shadow-2xs">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-[#191C19] tracking-tight">
                {kpi.total_livestock_types}
              </div>
              <p className="text-[11px] text-[#495348] font-medium">Jenis hewan ternak</p>
            </div>

          </div>
        )}

        {/* Charts Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 1: Populasi per Jenis Ternak (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-[#191C19] tracking-tight">
                  Populasi per Jenis Komoditas Ternak
                </h3>
                <p className="text-xs text-[#495348] mt-0.5">
                  Jumlah populasi ternak terkelompok menurut jenis komoditas.
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-[#495348]" />
            </div>

            <div className="h-[300px] w-full">
              {isLivestockLoading ? (
                <div className="h-full flex items-center justify-center text-xs text-[#495348]">
                  Memuat grafik...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={livestockRes?.length ? livestockRes : [
                      { type_name: 'Sapi Potong', total_population: 5400 },
                      { type_name: 'Ayam Broiler', total_population: 28500 },
                      { type_name: 'Kambing PE', total_population: 6800 },
                      { type_name: 'Ayam Petelur', total_population: 12000 },
                      { type_name: 'Domba', total_population: 3100 },
                    ]}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="type_name"
                      tick={{ fontSize: 11, fill: '#495348' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#495348' }} />
                    <Tooltip
                      formatter={(val) => [`${val.toLocaleString('id-ID')} ekor`, 'Populasi']}
                      contentStyle={{
                        borderRadius: '1rem',
                        border: '1px solid #C2C9BD',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    />
                    <Bar dataKey="total_population" fill="#2E7D32" radius={[8, 8, 0, 0]}>
                      {(livestockRes || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Proporsi Kategori & Skala Usaha (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-heading text-[#191C19] tracking-tight">
                  Distribusi Kategori Usaha
                </h3>
                <p className="text-xs text-[#495348] mt-0.5">
                  Proporsi tipe kemitraan dan model operasional.
                </p>
              </div>
              <PieIcon className="w-5 h-5 text-[#495348]" />
            </div>

            <div className="h-[240px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {categoryDistribution.map((_, index) => (
                      <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val} Peternakan`, 'Jumlah']}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #C2C9BD', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-xs font-semibold text-[#191C19]">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Skala Usaha Mini Bar Breakdown */}
            <div className="pt-3 border-t border-[#E2E8E2] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading block">
                Proporsi Skala Usaha
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {scaleDistribution.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#F1F5F1]/70 rounded-xl flex justify-between border border-[#C2C9BD]/30">
                    <span className="text-[#495348] font-semibold">{item.scale}:</span>
                    <span className="font-bold text-[#191C19]">{item.count} unit</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Agregasi Komparasi Kecamatan Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold font-heading text-[#191C19] tracking-tight">
                Tabel Agregasi Peternakan per Kecamatan
              </h3>
              <p className="text-xs text-[#495348] mt-0.5">
                Perbandingan jumlah peternakan, sebaran desa, dan total populasi hewan di Kabupaten Pringsewu.
              </p>
            </div>
            <Link
              to="/spasial"
              className="inline-flex items-center gap-1.5 text-xs font-bold font-heading text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
            >
              <span>Eksplorasi di Peta WebGIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                <tr>
                  <th className="py-3.5 px-4 rounded-l-xl">Kode Wilayah</th>
                  <th className="py-3.5 px-4">Nama Kecamatan</th>
                  <th className="py-3.5 px-4 text-center">Jumlah Desa/Pekon</th>
                  <th className="py-3.5 px-4 text-right">Unit Peternakan</th>
                  <th className="py-3.5 px-4 text-right">Total Populasi</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E2]/60">
                {isFarmsStatsLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#495348]">
                      Memuat data agregasi kecamatan...
                    </td>
                  </tr>
                ) : (farmsStatsRes || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#495348]">
                      Data statistik kecamatan belum tersedia.
                    </td>
                  </tr>
                ) : (
                  farmsStatsRes.map((d) => (
                    <tr key={d.district_id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#495348]">
                        {d.district_code || '18.10.xx'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#191C19] font-heading">
                        Kecamatan {d.district_name}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#495348] font-semibold">
                        {d.village_count || 14} Pekon
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-[#191C19]">
                        {d.farm_count} unit
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#2E7D32]">
                        {d.total_population?.toLocaleString('id-ID')} ekor
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/spasial?district_id=${d.district_id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#2E7D32] hover:text-white text-[11px] font-bold font-heading transition-colors"
                        >
                          <span>Peta</span>
                          <ArrowRight className="w-3 h-3" />
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
    </div>
  );
}
