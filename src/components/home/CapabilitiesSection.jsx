import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

// Custom Marker for Mini Map
const miniMarker = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2E7D32" stroke="#ffffff" stroke-width="2" class="w-6 h-6 drop-shadow"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`,
  className: 'custom-mini-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const pringsewuPolygon = [
  [-5.2500, 104.8800],
  [-5.2200, 105.0200],
  [-5.3200, 105.0800],
  [-5.4500, 105.0500],
  [-5.4800, 104.9200],
  [-5.3800, 104.8500],
];

export default function CapabilitiesSection() {
  const chartData = [
    { district: 'Ambarawa', count: '12.000', label: 'Unggas', percentage: 85 },
    { district: 'Gadingrejo', count: '5.820', label: 'Kambing', percentage: 65 },
    { district: 'Pardasuka', count: '3.100', label: 'Domba', percentage: 48 },
    { district: 'Pagelaran', count: '2.450', label: 'Sapi', percentage: 40 },
    { district: 'Sukoharjo', count: '1.200', label: 'Pembibitan', percentage: 25 },
  ];

  return (
    <section className="w-full py-24 md:py-36 bg-slate-50 text-slate-800 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-4 mb-24 md:mb-32"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2E7D32] font-heading">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15]">
            A Modern Spatial Intelligence Platform for Livestock Development
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-body leading-relaxed max-w-[62ch] mx-auto">
            Panganspasial.id brings together interactive spatial visualization, regional analytics, and decision support into one integrated platform for government institutions, researchers, and stakeholders.
          </p>
        </motion.div>

        {/* Vertical Editorial Narrative */}
        <div className="space-y-28 md:space-y-40">
          
          {/* CAPABILITY 01 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] font-heading">
                  01
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                  Interactive Spatial Mapping
                </h3>
                <p className="text-base text-slate-600 font-body leading-relaxed">
                  Explore livestock distribution through an interactive WebGIS with administrative boundaries, spatial layers, and validated field data.
                </p>
              </div>
              <Link
                to="/spasial"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2E7D32] hover:text-[#236327] transition-colors shrink-0 group"
              >
                <span>Explore Spatial Map</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Tiny Window into Real Map App */}
            <div className="w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white relative">
              <MapContainer
                center={[-5.3582, 104.9749]}
                zoom={11}
                zoomControl={false}
                scrollWheelZoom={false}
                className="w-full h-full z-10"
              >
                <TileLayer
                  attribution='&copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Polygon
                  positions={pringsewuPolygon}
                  pathOptions={{ color: '#2E7D32', weight: 2, fillColor: '#2E7D32', fillOpacity: 0.1 }}
                />
                <Marker position={[-5.3620, 104.9580]} icon={miniMarker}>
                  <Popup className="custom-popup">
                    <div className="p-2 text-xs">
                      <strong>Sentra Sapi Pagelaran</strong><br />
                      Populasi: 2.450 ekor
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
              <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
                WebGIS Miniature Layer Preview
              </div>
            </div>
          </motion.div>

          {/* CAPABILITY 02 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1565C0] font-heading">
                  02
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                  Regional Statistics & Insights
                </h3>
                <p className="text-base text-slate-600 font-body leading-relaxed">
                  Analyze livestock population, commodity distribution, and regional trends through visual summaries designed for quick understanding.
                </p>
              </div>
              <Link
                to="/statistik"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1565C0] hover:text-blue-800 transition-colors shrink-0 group"
              >
                <span>View Statistics</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Tiny Window into Clean Analytics Preview */}
            <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-sm font-bold font-heading text-slate-900">
                    Distribusi Komoditas Ternak Per Kecamatan
                  </h4>
                  <span className="text-xs text-slate-500 font-body">Kabupaten Pringsewu • T.A. 2026</span>
                </div>
                <span className="text-xs font-semibold text-[#2E7D32] bg-emerald-50 px-2.5 py-1 rounded">
                  Data Terverifikasi
                </span>
              </div>

              {/* Clean Minimal Bar Chart */}
              <div className="space-y-4">
                {chartData.map((item) => (
                  <div key={item.district} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{item.district} <span className="text-slate-400 font-normal">({item.label})</span></span>
                      <span className="font-bold text-slate-900">{item.count} ekor</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2E7D32] rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CAPABILITY 03 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F9A825] font-heading">
                  03
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                  Spatial Decision Support
                </h3>
                <p className="text-base text-slate-600 font-body leading-relaxed">
                  Support planning and zoning decisions using spatial suitability analysis and recommendation scenarios based on regional characteristics.
                </p>
              </div>
              <Link
                to="/rekomendasi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#F9A825] hover:text-amber-700 transition-colors shrink-0 group"
              >
                <span>View Recommendation</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Tiny Window into Spatial Decision Support UI */}
            <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500 font-body">Recommended Area</span>
                  <div className="text-xl font-extrabold font-heading text-slate-900">Kec. Pagelaran</div>
                  <span className="text-xs text-slate-400">Zonasi Peternakan Sapi Potong</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-1">
                  <span className="text-xs text-emerald-700 font-body">Suitability Score</span>
                  <div className="text-3xl font-extrabold font-heading text-[#2E7D32]">92%</div>
                  <span className="text-xs font-medium text-emerald-800">Sangat Sesuai (Kriteria A)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs text-slate-500 font-body">Status Zonasi</span>
                  <div className="text-xl font-extrabold font-heading text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                    <span>Highly Suitable</span>
                  </div>
                  <span className="text-xs text-slate-400">Kesesuaian Lahan & Pakan</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
