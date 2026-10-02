import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm as useFormspree, ValidationError } from '@formspree/react';
import { Building2, Mail, Phone, Clock, Send, MapPin, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const contactSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(8, 'Nomor telepon tidak valid'),
  subject: z.string().min(4, 'Subjek pesan diperlukan'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

export default function KontakPage() {
  const { success, error: toastError } = useToast();
  const [formspreeState, handleFormspreeSubmit, resetFormspree] = useFormspree('xljdyzon');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const isSending = isSubmitting || formspreeState.submitting;

  const onSubmit = async (data) => {
    try {
      const result = await handleFormspreeSubmit(data);
      if (result && result.kind === 'error') {
        const formErrors = result.getFormErrors();
        const msg =
          formErrors.length > 0
            ? formErrors.map((e) => e.message).join(', ')
            : 'Gagal mengirim pesan ke server. Silakan coba lagi.';
        toastError(msg, 'Pengiriman Gagal');
      } else {
        success('Pesan Anda berhasil dikirim ke Dinas Pertanian & Peternakan Kabupaten Pringsewu.');
        reset();
      }
    } catch (err) {
      console.error('Error submitting formspree form:', err);
      toastError('Terjadi gangguan jaringan saat mengirim formulir.', 'Pengiriman Gagal');
    }
  };

  const handleResetForm = () => {
    resetFormspree();
    reset();
  };

  return (
    <div className="pt-28 pb-20 min-h-[100dvh] bg-[#F8FAF8] text-[#191C19] font-body">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 space-y-12">

        {/* Page Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-xs font-bold font-heading">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span>Layanan & Informasi Publik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-[#191C19] tracking-tight">
            Hubungi Dinas Pertanian & Peternakan
          </h1>
          <p className="text-sm sm:text-base text-[#495348] font-body leading-relaxed">
            Sampaikan permohonan informasi data peternakan, kemitraan riset spasial, atau pelaporan validasi titik kandang baru di Kabupaten Pringsewu.
          </p>
        </div>

        {/* 2-Column Layout: Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Office Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 sm:p-9 rounded-[28px] bg-white border border-[#C2C9BD]/50 shadow-2xs space-y-6">
              <h3 className="text-xl font-bold font-heading text-[#191C19] tracking-tight">
                Kantor Dinas Resmi
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#495348] block font-bold font-heading">Alamat Kantor</span>
                    <p className="font-medium text-[#191C19] leading-relaxed mt-0.5">
                      Jl. Suhada No. 1, Pringsewu Barat, Kecamatan Pringsewu, Kabupaten Pringsewu, Lampung 35373
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#495348] block font-bold font-heading">Email Layanan Informasi</span>
                    <a
                      href="mailto:info@panganspasial.id"
                      className="font-semibold text-[#191C19] hover:text-[#2E7D32] transition-colors mt-0.5 block"
                    >
                      info@panganspasial.id
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8E1] text-[#B78103] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#495348] block font-bold font-heading">Telepon / Fax</span>
                    <p className="font-semibold text-[#191C19] mt-0.5">
                      (0729) 123-456 / 0812-3456-7890
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#495348] block font-bold font-heading">Jam Pelayanan Kantor</span>
                    <p className="font-semibold text-[#191C19] mt-0.5">
                      Senin – Jumat: 08:00 – 16:00 WIB
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Pin Highlight */}
              <div className="pt-4 border-t border-[#E2E8E2] flex items-center gap-2 text-[11px] text-[#495348] font-medium">
                <MapPin className="w-4 h-4 text-[#2E7D32]" />
                <span>Titik Koordinat Pusat: -5.3582, 104.9749</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-[28px] bg-white border border-[#C2C9BD]/50 shadow-2xs">
            {formspreeState.succeeded ? (
              <div className="py-8 px-4 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold font-heading text-[#191C19] tracking-tight">
                    Pesan Berhasil Dikirim!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#495348] leading-relaxed font-body">
                    Terima kasih telah menghubungi kami. Pesan dan permohonan informasi Anda telah berhasil terkirim ke Dinas Pertanian & Peternakan Kabupaten Pringsewu dan akan segera ditindaklanjuti.
                  </p>
                </div>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E8F5E9] text-[#1B5E20] hover:bg-[#C8E6C9] font-bold font-heading text-xs transition-all active:scale-[0.98]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Kirim Pesan Lain</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold font-heading text-[#191C19] tracking-tight mb-2">
                  Kirim Pesan / Pengajuan Informasi
                </h3>
                <p className="text-xs text-[#495348] mb-6 font-medium">
                  Isi formulir di bawah ini untuk terhubung langsung dengan tim administrasi dinas.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-body">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="font-bold text-[#191C19] block font-heading">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        placeholder="Contoh: Dr. Budi Santoso"
                        className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                      />
                      {errors.name && (
                        <span className="text-red-500 text-[11px] block">{errors.name.message}</span>
                      )}
                      <ValidationError prefix="Nama" field="name" errors={formspreeState.errors} className="text-red-500 text-[11px] block" />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="font-bold text-[#191C19] block font-heading">
                        Alamat Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                      />
                      {errors.email && (
                        <span className="text-red-500 text-[11px] block">{errors.email.message}</span>
                      )}
                      <ValidationError prefix="Email" field="email" errors={formspreeState.errors} className="text-red-500 text-[11px] block" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="font-bold text-[#191C19] block font-heading">
                        Nomor WhatsApp / Telepon <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="081234567890"
                        className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                      />
                      {errors.phone && (
                        <span className="text-red-500 text-[11px] block">{errors.phone.message}</span>
                      )}
                      <ValidationError prefix="Telepon" field="phone" errors={formspreeState.errors} className="text-red-500 text-[11px] block" />
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="font-bold text-[#191C19] block font-heading">
                        Subjek Keperluan <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        {...register('subject')}
                        placeholder="Permohonan Data / Pelaporan Kandang"
                        className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                      />
                      {errors.subject && (
                        <span className="text-red-500 text-[11px] block">{errors.subject.message}</span>
                      )}
                      <ValidationError prefix="Subjek" field="subject" errors={formspreeState.errors} className="text-red-500 text-[11px] block" />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="font-bold text-[#191C19] block font-heading">
                      Isi Pesan / Keterangan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      {...register('message')}
                      placeholder="Tuliskan rincian pesan atau pertanyaan Anda secara lengkap..."
                      className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                    />
                    {errors.message && (
                      <span className="text-red-500 text-[11px] block">{errors.message.message}</span>
                    )}
                    <ValidationError prefix="Pesan" field="message" errors={formspreeState.errors} className="text-red-500 text-[11px] block" />
                  </div>

                  {/* Global Formspree error fallback */}
                  <ValidationError errors={formspreeState.errors} className="text-red-600 text-xs bg-red-50 border border-red-200 p-2.5 rounded-lg" />

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading transition-all duration-150 disabled:opacity-60 shadow-md cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengirim Pesan...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Pesan Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

