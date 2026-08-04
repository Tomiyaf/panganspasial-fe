import { BarChart3 } from 'lucide-react';

export default function StatistikPage() {
  return (
    <div className="pt-24 pb-16 min-h-[100dvh] bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1565C0] flex items-center justify-center mx-auto">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-slate-900">
          Dashboard Statistik Peternakan
        </h1>
        <p className="text-slate-600 font-body">
          Analisis grafik populasi ternak, produksi daging, dan tren pertumbuhan komoditas per kecamatan di Kabupaten Pringsewu.
        </p>
      </div>
    </div>
  );
}
