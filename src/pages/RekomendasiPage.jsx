import { Link } from 'react-router-dom';
import {
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { sdssApi } from '../services/api';
import { StatCardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';

export default function RekomendasiPage() {
  const { data: recommendations = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['sdss', 'recommendations', 'public'],
    queryFn: async () => {
      const res = await sdssApi.getPublicRecommendations();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 15,
  });

  const topRank = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="pt-24 pb-20 min-h-[100dvh] bg-slate-50 text-slate-800 font-body">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">

        {/* Page Header */}
        <div className="space-y-3 max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32] font-heading">
            Spatial Decision Support System (SDSS)
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">
            Rekomendasi Potensi Peternakan Wilayah
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-body leading-relaxed">
            Hasil pembobotan multikriteria menggunakan metode <em>Simple Additive Weighting (SAW)</em> untuk menentukan zona sentra unggulan dan prioritas kebijakan pengembangan peternakan di Kabupaten Pringsewu.
          </p>
        </div>

        {/* Top Recommendation Highlight Card (Rank 1) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : topRank ? (
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold font-heading">
                  <Award className="w-4 h-4" />
                  <span>Peringkat 1 — Sentra Utama Rekomendasi</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight text-white">
                  Kecamatan {topRank.district_name}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 font-body leading-relaxed max-w-[65ch]">
                  {topRank.explanation ||
                    'Wilayah dengan konsentrasi populasi ternak tertinggi dan daya dukung sarana produksi peternakan paling optimal di Kabupaten Pringsewu.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Total Unit: <strong className="text-white">{topRank.farm_count} Peternakan</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Populasi: <strong className="text-white">{topRank.total_population?.toLocaleString('id-ID')} Ekor</strong></span>
                  </div>
                </div>
              </div>

              {/* Score Metric Tile */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-heading">
                  Skor Indeks SAW
                </span>
                <div className="text-5xl sm:text-6xl font-extrabold font-heading text-emerald-400 tracking-tight">
                  {typeof topRank.score === 'number' ? topRank.score.toFixed(4) : topRank.score}
                </div>
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold font-heading">
                  {topRank.recommendation || 'Sangat Potensial'}
                </span>
                <div className="pt-3">
                  <Link
                    to={`/spasial?district_id=${topRank.district_id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold font-heading transition-colors"
                  >
                    <span>Lihat di Peta Spasial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* SAW Ranking Cards & Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 tracking-tight">
                Peringkat Kelayakan Potensi 9 Kecamatan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar lengkap urutan hasil perangkingan multikriteria spasial.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16">Rank</th>
                  <th className="py-3.5 px-4">Kecamatan</th>
                  <th className="py-3.5 px-4 text-center">Skor SAW</th>
                  <th className="py-3.5 px-4 text-center">Status Potensi</th>
                  <th className="py-3.5 px-4 text-right">Peternakan</th>
                  <th className="py-3.5 px-4 text-right">Populasi</th>
                  <th className="py-3.5 px-4">Rekomendasi Kebijakan</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Memuat daftar rekomendasi SDSS...
                    </td>
                  </tr>
                ) : recommendations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      Belum ada data perhitungan SDSS.
                    </td>
                  </tr>
                ) : (
                  recommendations.map((item) => (
                    <tr key={item.district_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`w-7 h-7 inline-flex items-center justify-center rounded-lg font-bold font-heading text-xs ${
                            item.rank === 1
                              ? 'bg-amber-100 text-amber-800'
                              : item.rank === 2
                              ? 'bg-slate-200 text-slate-700'
                              : item.rank === 3
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{item.rank}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 font-heading block">
                          Kecamatan {item.district_name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.district_code || '18.10.xx'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-900 text-sm">
                        {typeof item.score === 'number' ? item.score.toFixed(4) : item.score}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold font-heading ${
                            item.recommendation?.toLowerCase().includes('sangat')
                              ? 'bg-emerald-50 text-[#2E7D32] border border-emerald-200'
                              : item.recommendation?.toLowerCase().includes('potensial')
                              ? 'bg-blue-50 text-[#1565C0] border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.recommendation || 'Potensial'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-semibold text-slate-800">
                        {item.farm_count} unit
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-[#2E7D32]">
                        {item.total_population?.toLocaleString('id-ID')} ekor
                      </td>

                      <td className="py-4 px-4 text-slate-600 max-w-xs leading-relaxed">
                        {item.explanation || 'Optimal untuk ekspansi komoditas.'}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <Link
                          to={`/spasial?district_id=${item.district_id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-[#2E7D32] text-[11px] font-semibold transition-colors"
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

        {/* Methodology & Criteria Explanation Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold font-heading text-slate-900">
              Metode Simple Additive Weighting (SAW)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Metode penjumlahan terbobot dari rating kinerja pada setiap alternatif di semua atribut kriteria spasial.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1565C0] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold font-heading text-slate-900">
              Kriteria Spasial & Komoditas
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Mengintegrasikan parameter populasi hewan ternak, kepadatan unit usaha, daya dukung pakan, dan zonasi wilayah.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2E7D32] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold font-heading text-slate-900">
              Pengambilan Keputusan Obyektif
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-body">
              Membantu dinas dalam alokasi bantuan pakan, pembinaan mantri hewan, serta perizinan kandang baru secara adil.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
