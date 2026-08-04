import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    if (isHomePage) {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setScrolled(true);
    }
  }, [isHomePage]);

  const useTransparentStyle = isHomePage && !scrolled;

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Spasial', path: '/spasial' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'Rekomendasi', path: '/rekomendasi' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        useTransparentStyle
          ? 'bg-transparent text-white border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Minimalist Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              useTransparentStyle
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-[#2E7D32] text-white shadow-xs'
            }`}>
              <MapPin className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight font-heading">
                Panganspasial<span className={useTransparentStyle ? 'text-emerald-400' : 'text-[#2E7D32]'}>.id</span>
              </span>
              <span className={`text-[11px] font-medium tracking-wide ${useTransparentStyle ? 'text-slate-300' : 'text-slate-500'}`}>
                Kabupaten Pringsewu
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                    useTransparentStyle
                      ? isActive
                        ? 'text-white font-semibold'
                        : 'text-slate-200 hover:text-white'
                      : isActive
                      ? 'text-[#2E7D32] font-semibold'
                      : 'text-slate-600 hover:text-[#2E7D32]'
                  } group`}
                >
                  {link.name}
                  {/* Underline hover effect */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-transform duration-300 origin-left ${
                      useTransparentStyle ? 'bg-emerald-400' : 'bg-[#2E7D32]'
                    } ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Single Primary CTA */}
          <div className="hidden md:flex items-center">
            <Link
              to="/spasial"
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                useTransparentStyle
                  ? 'bg-[#2E7D32] hover:bg-[#236327] text-white shadow-lg shadow-black/20 border border-emerald-500/30'
                  : 'bg-[#2E7D32] hover:bg-[#236327] text-white shadow-xs'
              }`}
            >
              Eksplorasi Peta
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                useTransparentStyle ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 text-slate-800 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-[#2E7D32] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#2E7D32]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/spasial"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-lg bg-[#2E7D32] text-white shadow-xs"
            >
              Eksplorasi Peta
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
