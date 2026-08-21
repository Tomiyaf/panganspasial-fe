import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Building2 } from 'lucide-react';

export default function Footer() {
  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Spasial', path: '/spasial' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'Rekomendasi', path: '/rekomendasi' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Kontak', path: '/kontak' },
  ];

  const platformLinks = [
    { name: 'Interactive WebGIS', path: '/spasial' },
    { name: 'Regional Statistics', path: '/statistik' },
    { name: 'Spatial Decision Support', path: '/rekomendasi' },
    { name: 'Data Sources', path: '/tentang' },
    { name: 'Admin Portal', path: '/admin/login' },
  ];

  return (
    <footer className="w-full bg-[#111611] text-[#A3B3A2] font-body select-none">
      
      {/* Pre-Footer Closing CTA Section - MD3 Rich Container */}
      <div className="border-b border-[#2E7D32]/20 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1400px] mx-auto px-6 lg:px-12"
        >
          <div className="rounded-[28px] border border-[#2E7D32]/30 bg-gradient-to-br from-[#1B5E20]/40 via-[#162B17]/60 to-[#111611] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#81C784] font-heading">
                Eksplorasi Geospasial Peternakan
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
                Siap menjelajahi peta sebaran peternakan Pringsewu?
              </h3>
              <p className="text-sm sm:text-base text-[#C2C9BD] font-body max-w-[60ch]">
                Akses peta interaktif, zonasi komoditas, dan data spasial peternakan 9 kecamatan secara langsung.
              </p>
            </div>
            <Link
              to="/spasial"
              className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-sm font-bold font-heading rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white shadow-xl transition-all duration-200 shrink-0"
            >
              Eksplorasi WebGIS
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main 4-Column Footer Layout */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: Brand & Institutional Identity */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight font-heading text-white">
                Panganspasial<span className="text-[#81C784]">.id</span>
              </span>
            </Link>
            <p className="text-sm text-[#A3B3A2] leading-relaxed font-body max-w-sm">
              Platform WebGIS & SDSS terintegrasi untuk keterbukaan data geospasial peternakan di Kabupaten Pringsewu.
            </p>
            <div className="pt-2 text-xs text-[#748574] font-body font-semibold">
              Dinas Pertanian & Peternakan Kabupaten Pringsewu
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-heading uppercase tracking-widest text-[#81C784]">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#A3B3A2] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-heading uppercase tracking-widest text-[#81C784]">
              Modul Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-[#A3B3A2] hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office Address */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-heading uppercase tracking-widest text-[#81C784]">
              Kontak Instansi
            </h4>
            <div className="space-y-3.5 text-sm text-[#A3B3A2]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B5E20]/40 text-[#81C784] flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Jl. Suhada No. 1, Pringsewu Barat, Kab. Pringsewu, Lampung 35373</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B5E20]/40 text-[#81C784] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:info@panganspasial.id" className="hover:text-white transition-colors">
                  info@panganspasial.id
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1B5E20]/40 text-[#81C784] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+62729123456" className="hover:text-white transition-colors">
                  +62 (729) 123-456
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Final Bottom Bar */}
      <div className="border-t border-[#2E7D32]/20 py-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#748574] font-body">
          <div>
            © 2026 Panganspasial.id. Hak Cipta Dilindungi Pemerintah Kabupaten Pringsewu.
          </div>
          <div className="flex items-center gap-2">
            <span>Material Design 3</span>
            <span>•</span>
            <span>WebGIS & SDSS SAW</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
