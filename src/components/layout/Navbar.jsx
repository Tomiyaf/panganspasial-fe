import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Peta Spasial', path: '/spasial' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'Rekomendasi', path: '/rekomendasi' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[900] transition-all duration-200 select-none ${
        scrolled || !isHomePage
          ? 'bg-white/90 backdrop-blur-md border-b border-[#C2C9BD]/40 shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform duration-200">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight font-heading text-[#191C19] leading-tight">
              Panganspasial<span className="text-[#2E7D32]">.id</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#495348] font-heading">
              Kab. Pringsewu
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - MD3 Capsule Pill Container */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#F1F5F1] p-1.5 rounded-full border border-[#C2C9BD]/40 font-body text-xs font-semibold shadow-2xs">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
                    : 'text-[#495348] hover:text-[#191C19] hover:bg-white/70'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Admin Access */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#191C19] hover:bg-[#2E7D32] active:scale-[0.98] text-white text-xs font-bold font-heading transition-all shadow-xs"
          >
            <span>Portal Admin</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#A3B3A2]" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-full bg-[#F1F5F1] text-[#191C19] hover:bg-[#E8EFE8] transition-colors border border-[#C2C9BD]/40"
          aria-label="Menu navigasi"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer Menu - MD3 Surface Card */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#C2C9BD]/50 px-6 py-4 space-y-3 font-body text-xs overflow-hidden shadow-lg"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-full font-semibold transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#2E7D32] text-white font-bold'
                      : 'text-[#191C19] hover:bg-[#F1F5F1]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E2E8E2]">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#191C19] text-white font-bold font-heading"
              >
                <span>Masuk Portal Admin</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#A3B3A2]" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
