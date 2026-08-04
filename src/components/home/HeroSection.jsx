import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const stats = [
    { number: '2.453', label: 'Lokasi' },
    { number: '487.200', label: 'Populasi' },
    { number: '9', label: 'Kecamatan' },
    { number: '5', label: 'Komoditas' },
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
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/50 to-slate-950/85 z-1" />

      {/* Hero Core Content - Vertically & Horizontally Centered */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center space-y-8 my-auto">

        {/* Minimal Eyebrow */}
        {/* <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400 font-heading">
          Kabupaten Pringsewu
        </span>*/}

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.12] text-white">
          Pusat Informasi Spasial Peternakan <span className='text-emerald-400 font-heading '>Kabupaten Pringsewu</span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-slate-200 font-body leading-relaxed max-w-[60ch]">
          Platform WebGIS yang menyajikan informasi spasial peternakan untuk mendukung pengambilan keputusan berbasis data.
        </p>

        {/* Single Primary Action CTA */}
        <div className="pt-2">
          <Link
            to="/spasial"
            className="inline-flex items-center justify-center px-9 py-4 text-base font-semibold rounded-lg bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white shadow-xl transition-all duration-200"
          >
            Eksplorasi Peta
          </Link>
        </div>

        {/* Typography-Only Editorial Statistics directly below CTA */}
        <div className="pt-10 w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
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
      <div className="relative z-10 flex flex-col items-center gap-1.5 text-slate-300/80 animate-bounce">
        <span className="text-[10px] font-medium uppercase tracking-widest font-heading">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
      </div>

    </section>
  );
}
