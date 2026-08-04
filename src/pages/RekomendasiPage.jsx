import { Database } from 'lucide-react';

export default function RekomendasiPage() {
  return (
    <div className="pt-24 pb-16 min-h-[100dvh] bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#F9A825] flex items-center justify-center mx-auto">
          <Database className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">
          Sistem Pendukung Keputusan (SDSS)
        </h1>
        <p className="text-slate-600 font-body">
          Rekomendasi lokasi strategis pengembangan peternakan dan alokasi bantuan pakan berbasis analisis kecocokan lahan spasial.
        </p>
      </div>
    </div>
  );
}
