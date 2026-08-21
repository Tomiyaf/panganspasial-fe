import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Cpu, ArrowRight } from 'lucide-react';

export default function TentangPage() {
  const dataSources = [
    {
      title: 'Dinas Pertanian & Peternakan Kab. Pringsewu',
      desc: 'Data registrasi kandang ternak komersial, mandiri, kelompok tani ternak, dan data populasi berkala.',
    },
    {
      title: 'Badan Pusat Statistik (BPS) Kabupaten Pringsewu',
      desc: 'Data sensus pertanian, populasi ternak tahunan, dan indikator produksi daging & telur regional.',
    },
    {
      title: 'Badan Informasi Geospasial (BIG)',
      desc: 'Peta rupa bumi indonesia (RBI) dan batas batas administratif resmi 9 kecamatan & 126 pekon/desa.',
    },
  ];

  return (
    <div className="pt-28 pb-20 min-h-[100dvh] bg-[#F8FAF8] text-[#191C19] font-body">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-14">

        {/* Header Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-xs font-bold font-heading">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span>Profil & Visi Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#191C19] tracking-tight">
            Tentang Panganspasial.id
          </h1>
          <p className="text-base text-[#495348] font-body leading-relaxed">
            Platform Geographic Information System (WebGIS) dan Spatial Decision Support System (SDSS) resmi untuk transparansi dan tata kelola geospasial sektor peternakan di Kabupaten Pringsewu.
          </p>
        </div>

        {/* Main Narrative Card - MD3 Surface Card */}
        <div className="p-8 sm:p-12 rounded-[28px] bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-8">
          <div className="space-y-4 leading-relaxed text-sm sm:text-base text-[#495348]">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#191C19]">
              Latar Belakang & Transformasi Digital
            </h2>
            <p>
              Kabupaten Pringsewu merupakan salah satu lumbung produksi peternakan strategis di Provinsi Lampung. Selama bertahun-tahun, pencatatan data peternakan dilakukan secara parsial dalam bentuk tabel konvensional yang menyulitkan analisis kewilayahan, mitigasi penyakit, dan penentuan zonasi pakan.
            </p>
            <p>
              <strong className="text-[#191C19] font-bold">Panganspasial.id</strong> hadir menjembatani kebutuhan integrasi data lapangan dengan teknologi geospasial modern PostGIS. Platform ini memetakan seluruh titik usaha peternakan, sebaran komoditas unggulan (sapi potong, sapi perah, kambing, ayam broiler, dan petelur), serta menyediakan algoritma pendukung keputusan spasial bagi pemerintah daerah, akademisi, dan masyarakat luas.
            </p>
          </div>

          {/* Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E2E8E2]">
            <div className="space-y-3 p-4 rounded-2xl bg-[#F1F5F1]/50 border border-[#C2C9BD]/30">
              <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-2xs">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold font-heading text-[#191C19]">
                Presisi Koordinat Spasial
              </h3>
              <p className="text-xs text-[#495348] leading-relaxed">
                Pemetaan titik kandang berbasis koordinat PostGIS SRID 4326 dengan batas administratif pekon dan kecamatan.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#F1F5F1]/50 border border-[#C2C9BD]/30">
              <div className="w-10 h-10 rounded-full bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold font-heading text-[#191C19]">
                Analisis Multikriteria SAW
              </h3>
              <p className="text-xs text-[#495348] leading-relaxed">
                Algoritma pembobotan objektif untuk menilai kelayakan dan potensi pengembangan wilayah peternakan.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#F1F5F1]/50 border border-[#C2C9BD]/30">
              <div className="w-10 h-10 rounded-full bg-[#FFF8E1] text-[#B78103] flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold font-heading text-[#191C19]">
                Validasi Lapangan Berkala
              </h3>
              <p className="text-xs text-[#495348] leading-relaxed">
                Data survei diverifikasi langsung oleh mantri hewan dinas untuk menjaga validitas dan integritas informasi.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sources & Attribution */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold font-heading text-[#191C19]">
              Sumber & Otoritas Data
            </h3>
            <p className="text-xs text-[#495348]">
              Seluruh data spasial dan populasi dihimpun dari lembaga dan instansi resmi terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {dataSources.map((ds, idx) => (
              <div key={idx} className="p-6 sm:p-7 rounded-3xl bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-2 hover:border-[#2E7D32]/40 transition-colors">
                <span className="inline-block text-xs font-bold font-heading text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                  0{idx + 1}
                </span>
                <h4 className="text-sm font-bold font-heading text-[#191C19]">
                  {ds.title}
                </h4>
                <p className="text-xs text-[#495348] leading-relaxed font-body">
                  {ds.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner - MD3 Deep Surface Card */}
        <div className="p-8 sm:p-10 rounded-[28px] bg-gradient-to-br from-[#1B5E20]/40 to-[#111611] border border-[#2E7D32]/30 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold font-heading text-white">
              Ingin Menjelajahi Peta Wilayah?
            </h3>
            <p className="text-xs text-[#A3B3A2]">
              Buka peta spasial interaktif untuk melihat titik peternakan nyata di 9 kecamatan.
            </p>
          </div>
          <Link
            to="/spasial"
            className="px-8 py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold font-heading transition-all shrink-0 inline-flex items-center gap-2 shadow-md"
          >
            <span>Buka WebGIS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
