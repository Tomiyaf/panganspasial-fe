import { motion } from 'framer-motion';

export default function ValuePropSection() {
  const pillars = [
    {
      number: '01',
      title: 'Pengambilan Keputusan Berbasis Data',
      description: 'Menggantikan estimasi konvensional dengan data geospasial presisi tinggi untuk alokasi kebijakan, bantuan pakan, dan infrastruktur peternakan.',
    },
    {
      number: '02',
      title: 'Pemetaan Ketahanan & Potensi Pakan',
      description: 'Mengidentifikasi wilayah surplus dan defisit pakan secara real-time untuk menjaga stabilitas rantai pasok dan mencegah krisis ketersediaan.',
    },
    {
      number: '03',
      title: 'Pengawasan Populasi & Kesehatan Ternak',
      description: 'Memantauan sebaran populasi ternak, fasilitas pemotongan (RPU), dan zonasi pencegahan penyakit hewan secara transparan di 9 kecamatan.',
    },
    {
      number: '04',
      title: 'Sistem Pendukung Keputusan (SDSS)',
      description: 'Memberikan rekomendasi lokasi strategis pengembangan usaha peternakan bagi pemerintah, peternak lokal, maupun investor.',
    },
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-white text-slate-800 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Asymmetric 2-Column Editorial Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Large Impactful Headline & Narrative (col-span-5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-28"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32] font-heading">
              Nilai Strategis Platform
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15]">
              Mengapa Panganspasial.id Penting?
            </h2>
            
            <p className="text-base sm:text-lg text-slate-600 font-body leading-relaxed">
              Sektor peternakan Kabupaten Pringsewu membutuhkan tata kelola berbasis bukti spasial. Panganspasial.id menjembatani data lapangan dengan analisis geospasial untuk mewujudkan ketahanan pangan yang tangguh dan berkelanjutan.
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-medium text-slate-500 font-body">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span>Dinas Pertanian & Peternakan Kabupaten Pringsewu</span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Structured Editorial Value Pillars (col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 divide-y divide-slate-200/80"
          >
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="py-8 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start group"
              >
                {/* Number Accent */}
                <div className="sm:col-span-2 text-xl font-extrabold font-heading text-[#2E7D32]/80 group-hover:text-[#2E7D32] transition-colors">
                  {pillar.number}
                </div>

                {/* Content */}
                <div className="sm:col-span-10 space-y-2">
                  <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 font-body leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
