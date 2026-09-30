import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F8FAF8] text-[#191C19] px-6 py-24 font-body">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-xs font-bold font-heading">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
          <span>Error 404 • Not Found</span>
        </div>

        {/* Big 404 Visual Graphic */}
        <div className="relative">
          <h1 className="text-8xl sm:text-9xl font-black font-heading text-[#2E7D32]/20 select-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-black font-heading text-[#191C19]">
              Halaman Tidak Ditemukan
            </span>
          </div>
        </div>

        {/* Narrative */}
        <p className="text-sm text-[#495348] font-body leading-relaxed max-w-sm mx-auto">
          Halaman atau rute yang Anda tuju tidak tersedia, telah dinonaktifkan, atau alamat URL yang dimasukkan salah.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            to="/spasial"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F1F5F1] active:scale-[0.98] text-[#191C19] border border-[#C2C9BD] text-xs font-bold font-heading transition-all shadow-2xs"
          >
            <MapPin className="w-4 h-4 text-[#2E7D32]" />
            <span>Peta Spasial</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
