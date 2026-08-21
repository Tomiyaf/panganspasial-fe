import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean().default(true),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password, data.rememberMe);
      if (res.success) {
        success(`Selamat datang kembali, ${res.user?.name || 'Administrator'}!`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      showError(err.message || 'Email atau password salah');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111611] flex flex-col justify-center py-12 px-6 sm:px-8 font-body select-none">
      
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1B5E20]/30 via-[#111611] to-[#111611] pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight font-heading text-white">
              Panganspasial<span className="text-[#81C784]">.id</span>
            </span>
          </Link>
          <div className="pt-2">
            <h2 className="text-xl font-bold font-heading text-white tracking-tight">
              Portal Administrator
            </h2>
            <p className="text-xs text-[#A3B3A2] mt-0.5">
              Masuk untuk mengelola data peternakan & spasial Kabupaten Pringsewu.
            </p>
          </div>
        </div>

        {/* MD3 Elevated Login Card */}
        <div className="bg-white rounded-[28px] border border-[#C2C9BD]/50 shadow-2xl p-8 sm:p-9 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#191C19] block font-heading">
                Email Administrator <span className="text-[#BA1A1A]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#495348] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@panganspasial.id"
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                />
              </div>
              {errors.email && (
                <span className="text-[#BA1A1A] text-[11px] block">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#191C19] block font-heading">
                Kata Sandi (Password) <span className="text-[#BA1A1A]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#495348] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                />
              </div>
              {errors.password && (
                <span className="text-[#BA1A1A] text-[11px] block">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-[#C2C9BD] text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
                <span className="text-[#495348] font-semibold">Ingat sesi login</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-md transition-all duration-150 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Quick Demo Hint */}
          <div className="p-3.5 rounded-2xl bg-[#E8F5E9]/60 border border-[#C8E6C9] text-[11px] text-[#1B5E20] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span>Kredensial demo: <code className="font-bold">admin@panganspasial.id</code> / <code className="font-bold">Admin#2026</code></span>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-[#A3B3A2] hover:text-white transition-colors"
          >
            ← Kembali ke Beranda Publik
          </Link>
        </div>

      </div>
    </div>
  );
}
