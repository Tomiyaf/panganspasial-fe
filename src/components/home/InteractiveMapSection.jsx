import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Circle, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

// Custom Map Marker Icons using SVG Data URIs
const createCustomMarker = (colorHex) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorHex}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker transition-all duration-200',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const greenMarker = createCustomMarker('#2E7D32');
const blueMarker = createCustomMarker('#1565C0');
const amberMarker = createCustomMarker('#F9A825');
const tealMarker = createCustomMarker('#00796B');

// Pringsewu Administrative Boundary Coordinates
const pringsewuPolygon = [
  [-5.2500, 104.8800],
  [-5.2200, 105.0200],
  [-5.3200, 105.0800],
  [-5.4500, 105.0500],
  [-5.4800, 104.9200],
  [-5.3800, 104.8500],
];

// Mock Livestock Locations (6 Meaningful Points)
const mockLocations = [
  {
    id: 1,
    name: 'Peternakan Sapi Potong',
    district: 'Kecamatan Pagelaran',
    lat: -5.3620,
    lng: 104.9580,
    commodity: 'Sapi Potong',
    count: '2.450 ekor',
    icon: greenMarker,
  },
  {
    id: 2,
    name: 'Sentra Kambing Rambon',
    district: 'Kecamatan Gadingrejo',
    lat: -5.3500,
    lng: 105.0120,
    commodity: 'Kambing PE',
    count: '5.820 ekor',
    icon: blueMarker,
  },
  {
    id: 3,
    name: 'RPU Modern Ambarawa',
    district: 'Kecamatan Ambarawa',
    lat: -5.4120,
    lng: 104.9650,
    commodity: 'Ayam Broiler',
    count: '12.000 ekor/hari',
    icon: amberMarker,
  },
  {
    id: 4,
    name: 'Balai Pembibitan Ternak',
    district: 'Kecamatan Sukoharjo',
    lat: -5.2850,
    lng: 104.9780,
    commodity: 'Sapi & Kambing',
    count: '1.200 ekor',
    icon: greenMarker,
  },
  {
    id: 5,
    name: 'Peternakan Ayam Petelur',
    district: 'Kecamatan Pringsewu Kota',
    lat: -5.3650,
    lng: 104.9750,
    commodity: 'Ayam Petelur',
    count: '8.500 ekor',
    icon: amberMarker,
  },
  {
    id: 6,
    name: 'Sentra Ternak Domba',
    district: 'Kecamatan Pardasuka',
    lat: -5.4400,
    lng: 104.9200,
    commodity: 'Domba Garut',
    count: '3.100 ekor',
    icon: tealMarker,
  },
];

export default function InteractiveMapSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-slate-50 text-slate-800">

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto px-6 text-center space-y-3 mb-12 md:mb-16"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32] font-heading">
          Peta Interaktif
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
          Visualisasi Spasial Peternakan
        </h2>
        <p className="text-base sm:text-lg text-slate-600 font-body leading-relaxed max-w-[65ch] mx-auto">
          Eksplorasi sebaran populasi ternak, komoditas unggulan, dan fasilitas peternakan di Kabupaten Pringsewu secara real-time.
        </p>
      </motion.div>

      {/* Main Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-[92%] max-w-[1400px] mx-auto"
      >
        <div className="relative h-[560px] md:h-[640px] rounded-[20px] overflow-hidden border border-slate-200/80 bg-white shadow-md">

          <MapContainer
            center={[-5.3582, 104.9749]}
            zoom={11}
            minZoom={9}
            maxZoom={13}
            zoomControl={false}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            <ZoomControl position="topright" />

            {/* Clean Light CartoDB Voyager Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Administrative Boundary GeoJSON Polygon */}
            <Polygon
              positions={pringsewuPolygon}
              pathOptions={{
                color: '#2E7D32',
                weight: 2,
                dashArray: '5, 5',
                fillColor: '#2E7D32',
                fillOpacity: 0.08,
              }}
            />

            {/* Subtle Density Circles Overlay */}
            <Circle
              center={[-5.3620, 104.9580]}
              radius={3800}
              pathOptions={{
                color: '#2E7D32',
                fillColor: '#2E7D32',
                fillOpacity: 0.15,
                stroke: false,
              }}
            />
            <Circle
              center={[-5.3500, 105.0120]}
              radius={4500}
              pathOptions={{
                color: '#1565C0',
                fillColor: '#1565C0',
                fillOpacity: 0.12,
                stroke: false,
              }}
            />

            {/* Interactive Location Markers */}
            {mockLocations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={loc.icon}>
                <Popup className="custom-popup">
                  <div className="p-4 min-w-[210px] space-y-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {loc.district}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 font-heading">
                        {loc.name}
                      </h4>
                    </div>

                    <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Komoditas:</span>
                        <span className="font-semibold text-slate-800">{loc.commodity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Populasi:</span>
                        <span className="font-bold text-[#2E7D32]">{loc.count}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to="/spasial"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#2E7D32] text-white hover:bg-[#236327] transition-colors"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Minimal Floating Overlays */}

          {/* Top Left Floating Tag */}
          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2 pointer-events-none text-xs font-medium text-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="font-semibold font-heading">Kabupaten Pringsewu</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">Live Preview</span>
          </div>

          {/* Top Right Data Indicator */}
          <div className="absolute top-4 right-14 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>6 Titik Terdata</span>
          </div>

          {/* Bottom Left Simple Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700 hidden sm:flex items-center gap-4 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span>Sapi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1565C0]" />
              <span>Kambing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F9A825]" />
              <span>Unggas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00796B]" />
              <span>Domba</span>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Single CTA Below Map */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 text-center"
      >
        <Link
          to="/spasial"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-lg bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white shadow-lg shadow-emerald-950/10 transition-all duration-200"
        >
          <MapPin className="w-5 h-5" />
          <span>Eksplorasi WebGIS</span>
        </Link>
      </motion.div>

    </section>
  );
}
