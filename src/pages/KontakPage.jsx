import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Phone, Clock, Send, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const contactSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(8, 'Nomor telepon tidak valid'),
  subject: z.string().min(4, 'Subjek pesan diperlukan'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

export default function KontakPage() {
  const { success } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async () => {
    // Simulate inquiry submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    success('Pesan Anda berhasil dikirim ke Dinas Pertanian & Peternakan Kabupaten Pringsewu.');
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
                  <label className="font-bold text-[#191C19] block font-heading">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Contoh: Dr. Budi Santoso"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-[11px] block">{errors.name.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-[11px] block">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Nomor WhatsApp / Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="081234567890"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-[11px] block">{errors.phone.message}</span>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#191C19] block font-heading">
                    Subjek Keperluan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="Permohonan Data / Pelaporan Kandang"
                    className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                  />
                  {errors.subject && (
                    <span className="text-red-500 text-[11px] block">{errors.subject.message}</span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#191C19] block font-heading">
                  Isi Pesan / Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register('message')}
                  placeholder="Tuliskan rincian pesan atau pertanyaan Anda secara lengkap..."
                  className="w-full px-4 py-2.5 bg-[#F1F5F1]/50 rounded-xl border border-[#C2C9BD] text-[#191C19] placeholder:text-[#495348]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                />
                {errors.message && (
                  <span className="text-red-500 text-[11px] block">{errors.message.message}</span>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white text-xs font-bold font-heading transition-all duration-150 disabled:opacity-60 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
