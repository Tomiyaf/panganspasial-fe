import { Mail } from 'lucide-react';

export default function KontakPage() {
  return (
    <div className="pt-24 pb-16 min-h-[100dvh] bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">
          Hubungi Dinas Pertanian & Peternakan
        </h1>
        <p className="text-slate-600 font-body">
          Layanan informasi publik, pengajuan integrasi data spasial, dan informasi kemitraan peternakan Kabupaten Pringsewu.
        </p>
      </div>
    </div>
  );
}
