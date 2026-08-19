import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function InteractiveMapPreview() {
  const dummyDistricts = [
    { name: 'Pringsewu', farms: 34, population: '12.450' },
    { name: 'Gadingrejo', farms: 28, population: '9.800' },
    { name: 'Sukoharjo', farms: 22, population: '8.120' },
    { name: 'Pagelaran', farms: 19, population: '6.430' },
    { name: 'Adiluwih', farms: 15, population: '5.200' },
    { name: 'Ambarawa', farms: 14, population: '4.900' },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 font-heading">
              Eksplorasi Spasial
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-white">
              Peta Sebaran Wilayah Peternakan
            </h2>
            <p className="text-sm text-slate-300 font-body leading-relaxed">
              Jelajahi konsentrasi kandang dan populasi ternak berbasis peta interaktif dengan data koordinat PostGIS yang terverifikasi.
            </p>
          </div>

          <Link
            to="/spasial"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white text-xs font-bold font-heading transition-all shadow-lg shadow-emerald-950/40 shrink-0"
          >
            <span>Buka WebGIS Interaktif</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Snapshot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {dummyDistricts.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 transition-colors space-y-2"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                Kecamatan
              </span>
              <h3 className="text-sm font-bold font-heading text-white truncate">
                {d.name}
              </h3>
              <div className="pt-1 border-t border-slate-700/50 flex flex-col text-[11px] text-slate-300">
                <span>{d.farms} Peternakan</span>
                <span className="font-semibold text-emerald-400">{d.population} Ekor</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
