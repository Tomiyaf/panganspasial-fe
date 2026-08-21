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
    <section className="w-full py-24 md:py-32 bg-white text-[#191C19] border-t border-[#C2C9BD]/40">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-xs font-bold font-heading">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              <span>Nilai Strategis Platform</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#191C19] tracking-tight leading-[1.15]">
              Mengapa Panganspasial.id Penting?
            </h2>
            
            <p className="text-base sm:text-lg text-[#495348] font-body leading-relaxed">
              Sektor peternakan Kabupaten Pringsewu membutuhkan tata kelola berbasis bukti spasial. Panganspasial.id menjembatani data lapangan dengan analisis geospasial untuk mewujudkan ketahanan pangan yang tangguh dan berkelanjutan.
            </p>

            <div className="pt-4 border-t border-[#E2E8E2] flex items-center gap-3 text-xs font-semibold text-[#495348] font-body">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span>Dinas Pertanian & Peternakan Kabupaten Pringsewu</span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: MD3 Surface Bento Cards (col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-4"
          >
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="p-6 sm:p-7 rounded-3xl bg-[#F1F5F1]/60 border border-[#C2C9BD]/50 hover:bg-white hover:border-[#2E7D32]/50 hover:shadow-sm transition-all duration-200 grid grid-cols-1 sm:grid-cols-12 gap-5 items-start group"
              >
                {/* Circular Tonal Number Badge */}
                <div className="sm:col-span-2">
                  <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-extrabold font-heading text-lg flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:bg-[#2E7D32] group-hover:text-white transition-all">
                    {pillar.number}
                  </div>
                </div>

                {/* Content */}
                <div className="sm:col-span-10 space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-[#191C19] tracking-tight group-hover:text-[#2E7D32] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#495348] font-body leading-relaxed">
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
