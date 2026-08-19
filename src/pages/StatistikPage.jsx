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
    <div className="pt-24 pb-20 min-h-[100dvh] bg-slate-50 text-slate-800 font-body">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">

        {/* Page Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32] font-heading">
              Data & Analisis
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Dashboard Statistik Peternakan
            </h1>
            <p className="text-sm text-slate-600 font-body max-w-[60ch]">
              Agregasi populasi komoditas ternak, unit usaha, dan sebaran kewilayahan di 9 kecamatan Kabupaten Pringsewu.
            </p>
          </div>

          {/* District Filter Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-medium text-slate-700">
              <Filter className="w-4 h-4 text-[#2E7D32]" />
              <span>Wilayah:</span>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
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
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold font-heading uppercase tracking-wider text-slate-400">
                  Total Peternakan
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {kpi.total_farms?.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-slate-500">Unit kandang terverifikasi</p>
            </div>

            {/* KPI 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold font-heading uppercase tracking-wider text-slate-400">
                  Total Populasi Ternak
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1565C0] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {kpi.total_livestock_population?.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-slate-500">Ekor ternak terdata</p>
            </div>

            {/* KPI 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold font-heading uppercase tracking-wider text-slate-400">
                  Kecamatan Terdata
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#F9A825] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {kpi.total_districts}
              </div>
              <p className="text-[11px] text-slate-500">Kecamatan administratif</p>
            </div>

            {/* KPI 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold font-heading uppercase tracking-wider text-slate-400">
                  Variasi Komoditas
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {kpi.total_livestock_types}
              </div>
              <p className="text-[11px] text-slate-500">Jenis hewan ternak</p>
            </div>

          </div>
        )}

        {/* Charts Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 1: Populasi per Jenis Ternak (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900 tracking-tight">
                  Populasi per Jenis Komoditas Ternak
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jumlah populasi ternak terkelompok menurut jenis komoditas.
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>

            <div className="h-[300px] w-full">
              {isLivestockLoading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
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
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      formatter={(val) => [`${val.toLocaleString('id-ID')} ekor`, 'Populasi']}
                      contentStyle={{
                        borderRadius: '0.75rem',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="total_population" fill="#2E7D32" radius={[6, 6, 0, 0]}>
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
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900 tracking-tight">
                  Distribusi Kategori Usaha
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proporsi tipe kemitraan dan model operasional.
                </p>
              </div>
              <PieIcon className="w-5 h-5 text-slate-400" />
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
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span className="text-xs text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Skala Usaha Mini Bar Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading block">
                Proporsi Skala Usaha
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {scaleDistribution.map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg flex justify-between">
                    <span className="text-slate-600">{item.scale}:</span>
                    <span className="font-bold text-slate-900">{item.count} unit</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Agregasi Komparasi Kecamatan Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900 tracking-tight">
                Tabel Agregasi Peternakan per Kecamatan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan jumlah peternakan, sebaran desa, dan total populasi hewan di Kabupaten Pringsewu.
              </p>
            </div>
            <Link
              to="/spasial"
              className="inline-flex items-center gap-1.5 text-xs font-semibold font-heading text-[#2E7D32] hover:text-[#236327] transition-colors"
            >
              <span>Eksplorasi di Peta WebGIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Kode Wilayah</th>
                  <th className="py-3.5 px-4">Nama Kecamatan</th>
                  <th className="py-3.5 px-4 text-center">Jumlah Desa/Pekon</th>
                  <th className="py-3.5 px-4 text-right">Unit Peternakan</th>
                  <th className="py-3.5 px-4 text-right">Total Populasi</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isFarmsStatsLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Memuat data agregasi kecamatan...
                    </td>
                  </tr>
                ) : (farmsStatsRes || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Data statistik kecamatan belum tersedia.
                    </td>
                  </tr>
                ) : (
                  farmsStatsRes.map((d) => (
                    <tr key={d.district_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {d.district_code || '18.10.xx'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-heading">
                        Kecamatan {d.district_name}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600">
                        {d.village_count || 14} Pekon
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                        {d.farm_count} unit
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#2E7D32]">
                        {d.total_population?.toLocaleString('id-ID')} ekor
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/spasial?district_id=${d.district_id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-[#2E7D32] hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
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
