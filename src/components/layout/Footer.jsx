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
    { name: 'Documentation', path: '/tentang' },
  ];

  return (
    <footer className="w-full bg-[#0F172A] text-slate-300 font-body select-none">
      
      {/* Optional Pre-Footer Closing CTA Section */}
      <div className="border-b border-slate-800/80 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Ready to explore spatial livestock information?
            </h3>
            <p className="text-sm sm:text-base text-slate-400 font-body">
              Akses peta spasial interaktif dan data geospasial peternakan Kabupaten Pringsewu.
            </p>
          </div>
          <Link
            to="/spasial"
            className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-lg bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white shadow-lg transition-all duration-200 shrink-0"
          >
            Eksplorasi WebGIS
          </Link>
        </motion.div>
      </div>

      {/* Main 4-Column Footer Layout */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Column 1: Brand & Institutional Identity */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center">
                <MapPin className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight font-heading text-white">
                Panganspasial<span className="text-emerald-400">.id</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-body max-w-sm">
              A modern WebGIS platform providing integrated spatial information for livestock development in Kabupaten Pringsewu.
            </p>
            <div className="pt-2 text-xs text-slate-500 font-body">
              Dinas Pertanian & Peternakan Kabupaten Pringsewu
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {platformLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-heading uppercase tracking-wider text-white">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Jl. Suhada No. 1, Pringsewu Barat, Kabupaten Pringsewu, Lampung 35373</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:info@panganspasial.id" className="hover:text-white transition-colors">
                  info@panganspasial.id
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+62729123456" className="hover:text-white transition-colors">
                  +62 (729) 123-456
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Final Bottom Bar */}
      <div className="border-t border-slate-800/80 py-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-body">
          <div>
            © 2026 Panganspasial.id. Hak Cipta Dilindungi.
          </div>
          <div>
            Built with React, React Leaflet, Tailwind CSS
          </div>
        </div>
      </div>

    </footer>
  );
}
