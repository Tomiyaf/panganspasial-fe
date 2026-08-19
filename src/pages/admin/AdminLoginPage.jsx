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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-6 sm:px-8 font-body select-none">
      
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <MapPin className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight font-heading text-white">
              Panganspasial<span className="text-emerald-400">.id</span>
            </span>
          </Link>
          <div className="pt-2">
            <h2 className="text-xl font-bold font-heading text-white tracking-tight">
              Portal Administrator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Masuk untuk mengelola data peternakan & spasial Kabupaten Pringsewu.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@panganspasial.id"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-[11px] block">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-[11px] block">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
                <span className="text-slate-600 font-medium">Ingat sesi login</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-md transition-all duration-150 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* Quick Demo Hint */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span>Kredensial default: <code>admin@panganspasial.id</code> / <code>Admin#2026</code></span>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Kembali ke Beranda Publik
          </Link>
        </div>

      </div>
    </div>
  );
}
