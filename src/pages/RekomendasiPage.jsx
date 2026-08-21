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
    <div className="pt-28 pb-20 min-h-[100dvh] bg-[#F8FAF8] text-[#191C19] font-body">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">

        {/* Page Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-xs font-bold font-heading">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span>Spatial Decision Support System (SDSS)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#191C19] tracking-tight leading-tight">
            Rekomendasi Potensi Peternakan Wilayah
          </h1>
          <p className="text-sm sm:text-base text-[#495348] font-body leading-relaxed">
            Hasil pembobotan multikriteria menggunakan metode <em>Simple Additive Weighting (SAW)</em> untuk menentukan zona sentra unggulan dan prioritas kebijakan pengembangan peternakan di Kabupaten Pringsewu.
          </p>
        </div>

        {/* Top Recommendation Highlight Card (Rank 1) - MD3 Rich Container */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : topRank ? (
          <div className="p-8 md:p-12 rounded-[28px] bg-gradient-to-br from-[#1B5E20] via-[#0F3914] to-[#0A240E] text-white shadow-2xl relative overflow-hidden border border-[#2E7D32]/30">
            {/* Background Soft Glow */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#81C784]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-[#A5D6A7] text-xs font-bold font-heading shadow-xs">
                  <Award className="w-4 h-4 text-[#FFD54F]" />
                  <span>Peringkat 1 — Sentra Utama Rekomendasi</span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white">
                  Kecamatan {topRank.district_name}
                </h2>

                <p className="text-sm sm:text-base text-[#C2C9BD] font-body leading-relaxed max-w-[65ch]">
                  {topRank.explanation ||
                    'Wilayah dengan konsentrasi populasi ternak tertinggi dan daya dukung sarana produksi peternakan paling optimal di Kabupaten Pringsewu.'}
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-[#C2C9BD]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]" />
                    <span>Total Unit: <strong className="text-white font-heading">{topRank.farm_count} Peternakan</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64B5F6]" />
                    <span>Populasi: <strong className="text-white font-heading">{topRank.total_population?.toLocaleString('id-ID')} Ekor</strong></span>
                  </div>
                </div>
              </div>

              {/* Score Metric Tile */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#A3B3A2] font-heading font-bold">
                  Skor Indeks SAW
                </span>
                <div className="text-5xl sm:text-6xl font-extrabold font-heading text-[#81C784] tracking-tight">
                  {typeof topRank.score === 'number' ? topRank.score.toFixed(4) : topRank.score}
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#81C784]/20 border border-[#81C784]/30 text-[#A5D6A7] text-xs font-bold font-heading">
                  {topRank.recommendation || 'Sangat Potensial'}
                </span>
                <div className="pt-3">
                  <Link
                    to={`/spasial?district_id=${topRank.district_id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#191C19] hover:bg-[#E8F5E9] text-xs font-bold font-heading shadow-md transition-all"
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold font-heading text-[#191C19] tracking-tight">
                Peringkat Kelayakan Potensi 9 Kecamatan
              </h3>
              <p className="text-xs text-[#495348] mt-0.5">
                Daftar lengkap urutan hasil perangkingan multikriteria spasial.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F1F5F1]/70 text-[#495348] uppercase font-heading text-[10px] tracking-wider border-b border-[#E2E8E2]">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16 rounded-l-xl">Rank</th>
                  <th className="py-3.5 px-4">Kecamatan</th>
                  <th className="py-3.5 px-4 text-center">Skor SAW</th>
                  <th className="py-3.5 px-4 text-center">Status Potensi</th>
                  <th className="py-3.5 px-4 text-right">Peternakan</th>
                  <th className="py-3.5 px-4 text-right">Populasi</th>
                  <th className="py-3.5 px-4">Rekomendasi Kebijakan</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E2]/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#495348]">
                      Memuat daftar rekomendasi SDSS...
                    </td>
                  </tr>
                ) : recommendations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#495348]">
                      Belum ada data perhitungan SDSS.
                    </td>
                  </tr>
                ) : (
                  recommendations.map((item) => (
                    <tr key={item.district_id} className="hover:bg-[#F1F5F1]/40 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`w-8 h-8 inline-flex items-center justify-center rounded-full font-bold font-heading text-xs shadow-2xs ${
                            item.rank === 1
                              ? 'bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]'
                              : item.rank === 2
                              ? 'bg-[#F1F5F1] text-[#495348] border border-[#C2C9BD]/40'
                              : item.rank === 3
                              ? 'bg-[#FFF3E0] text-[#E65100] border border-[#FFCC80]'
                              : 'bg-[#F8FAF8] text-[#74796E]'
                          }`}
                        >
                          #{item.rank}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-[#191C19] font-heading block text-sm">
                          Kecamatan {item.district_name}
                        </span>
                        <span className="text-[11px] text-[#495348] font-mono">
                          {item.district_code || '18.10.xx'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-[#191C19] text-sm">
                        {typeof item.score === 'number' ? item.score.toFixed(4) : item.score}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold font-heading ${
                            item.recommendation?.toLowerCase().includes('sangat')
                              ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]'
                              : item.recommendation?.toLowerCase().includes('potensial')
                              ? 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]'
                              : 'bg-[#F1F5F1] text-[#495348] border border-[#C2C9BD]/40'
                          }`}
                        >
                          {item.recommendation || 'Potensial'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-semibold text-[#191C19]">
                        {item.farm_count} unit
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-[#2E7D32]">
                        {item.total_population?.toLocaleString('id-ID')} ekor
                      </td>

                      <td className="py-4 px-4 text-[#495348] max-w-xs leading-relaxed">
                        {item.explanation || 'Optimal untuk ekspansi komoditas.'}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <Link
                          to={`/spasial?district_id=${item.district_id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E8F5E9] hover:bg-[#2E7D32] hover:text-white text-[#1B5E20] text-[11px] font-bold font-heading transition-colors"
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

        {/* Methodology & Criteria Explanation Section - MD3 Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-3 hover:border-[#2E7D32]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold font-heading text-[#191C19]">
              Metode Simple Additive Weighting (SAW)
            </h4>
            <p className="text-xs text-[#495348] leading-relaxed font-body">
              Metode penjumlahan terbobot dari rating kinerja pada setiap alternatif di semua atribut kriteria spasial.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-3 hover:border-[#1565C0]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold font-heading text-[#191C19]">
              Kriteria Spasial & Komoditas
            </h4>
            <p className="text-xs text-[#495348] leading-relaxed font-body">
              Mengintegrasikan parameter populasi hewan ternak, kepadatan unit usaha, daya dukung pakan, dan zonasi wilayah.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-3 hover:border-[#2E7D32]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold font-heading text-[#191C19]">
              Pengambilan Keputusan Obyektif
            </h4>
            <p className="text-xs text-[#495348] leading-relaxed font-body">
              Membantu dinas dalam alokasi bantuan pakan, pembinaan mantri hewan, serta perizinan kandang baru secara adil.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
