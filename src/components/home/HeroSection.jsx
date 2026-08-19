import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../../services/api';

export default function HeroSection() {
  const { data: statsData } = useQuery({
    queryKey: ['statistics', 'overview', 'hero'],
    queryFn: async () => {
      const res = await statisticsApi.getOverview();
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const kpi = statsData?.kpi;

  const stats = [
    {
      number: kpi?.total_farms ? kpi.total_farms.toLocaleString('id-ID') : '128',
      label: 'Lokasi',
    },
    {
      number: kpi?.total_livestock_population ? kpi.total_livestock_population.toLocaleString('id-ID') : '45.800',
      label: 'Populasi',
    },
    {
      number: kpi?.total_districts ? kpi.total_districts.toString() : '9',
      label: 'Kecamatan',
    },
    {
      number: kpi?.total_livestock_types ? kpi.total_livestock_types.toString() : '12',
      label: 'Komoditas',
    },
  ];

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center overflow-hidden bg-slate-950 text-white select-none pt-24 pb-10">

      {/* Immersive Cinematic Aerial Landscape Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105 transition-transform duration-[15000ms] ease-out hover:scale-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2400&auto=format&fit=crop')`,
        }}
      />

      {/* Subtle Dark Gradient Overlay for Typography Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 z-1" />

      {/* Hero Core Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center space-y-8 my-auto">

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-[1.12] text-white">
          Pusat Informasi Spasial Peternakan{' '}
          <span className="text-emerald-400 font-heading">Kabupaten Pringsewu</span>
        </h1>

        {/* Supporting Text (Under 20 words as per anti-slop guidelines) */}
        <p className="text-base sm:text-lg text-slate-200 font-body leading-relaxed max-w-[55ch]">
          Platform WebGIS terintegrasi untuk visualisasi spasial, statistik wilayah, dan pendukung keputusan sektor peternakan.
        </p>

        {/* Single Primary Action CTA */}
        <div className="pt-1">
          <Link
            to="/spasial"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-lg bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white shadow-xl transition-all duration-200"
          >
            Eksplorasi Peta
          </Link>
        </div>

        {/* Typography-Only Editorial Statistics */}
        <div className="pt-8 w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/15">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center text-center px-4 py-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                  {stat.number}
                </span>
                <span className="text-xs font-medium text-white/70 font-body mt-1 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Subtle Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-slate-400 text-xs animate-bounce">
        <span className="text-[10px] font-medium uppercase tracking-widest font-heading">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
      </div>

    </section>
  );
}
