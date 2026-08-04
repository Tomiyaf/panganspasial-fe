import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Circle, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, CheckCircle2, TrendingUp, Info } from 'lucide-react';

// Custom Map Marker Icons using SVG Data URIs for reliability
const createCustomMarker = (colorHex) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorHex}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const greenMarker = createCustomMarker('#2E7D32');
const blueMarker = createCustomMarker('#1565C0');
const amberMarker = createCustomMarker('#F9A825');

// Approximate Administrative Boundaries for Pringsewu Region
const pringsewuPolygon = [
  [-5.2500, 104.8800],
  [-5.2200, 105.0200],
  [-5.3200, 105.0800],
  [-5.4500, 105.0500],
  [-5.4800, 104.9200],
  [-5.3800, 104.8500],
];

// Sample Location Markers Data
const livestockLocations = [
  {
    id: 1,
    name: 'Sentra Sapi Potong Pagelaran',
    district: 'Kec. Pagelaran',
    lat: -5.3620,
    lng: 104.9580,
    commodity: 'Sapi Potong (Brahman Cross)',
    count: '2,450 Ekor',
    status: 'Aktif / Produksi Tinggi',
    icon: greenMarker,
  },
  {
    id: 2,
    name: 'Peternakan Kambing Rambon Gadingrejo',
    district: 'Kec. Gadingrejo',
    lat: -5.3500,
    lng: 105.0120,
    commodity: 'Kambing PE & Rambon',
    count: '5,820 Ekor',
    status: 'Aktif / Sentra Perbibitan',
    icon: blueMarker,
  },
  {
    id: 3,
    name: 'RPU Modern Ambarawa',
    district: 'Kec. Ambarawa',
    lat: -5.4120,
    lng: 104.9650,
    commodity: 'Unggas / Ayam Broiler',
    count: '12,000 Ekor/Hari',
    status: 'Fasilitas Pemotongan',
    icon: amberMarker,
  },
  {
    id: 4,
    name: 'Balai Pembibitan Ternak Sukoharjo',
    district: 'Kec. Sukoharjo',
    lat: -5.2850,
    lng: 104.9780,
    commodity: 'Sapi & Kambing Unggul',
    count: '1,200 Ekor',
    status: 'Pusat Inseminasi Buatan',
    icon: greenMarker,
  },
];

export default function InteractiveMapPreview() {
  const [mapType, setMapType] = useState('osm'); // 'osm' or 'satellite'

  const tileUrls = {
    osm: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO & OpenStreetMap',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Esri Satellite & ArcGIS',
    },
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/20 bg-slate-900/60 backdrop-blur-md shadow-2xl flex flex-col">
      {/* Map Header / Top Control Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-20 text-white">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-heading">
            Live Preview Spasial Peternakan
          </span>
        </div>

        {/* Base Layer Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setMapType('osm')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              mapType === 'osm'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Peta Vektor
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              mapType === 'satellite'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satelit
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full z-10">
        <MapContainer
          center={[-5.3582, 104.9749]}
          zoom={11}
          zoomControl={false}
          className="w-full h-full"
          scrollWheelZoom={false}
        >
          <ZoomControl position="topright" />
          
          <TileLayer
            attribution={tileUrls[mapType].attribution}
            url={tileUrls[mapType].url}
          />

          {/* District Administrative Boundary Overlay */}
          <Polygon
            positions={pringsewuPolygon}
            pathOptions={{
              color: '#2E7D32',
              weight: 2.5,
              dashArray: '6, 6',
              fillColor: '#2E7D32',
              fillOpacity: 0.12,
            }}
          />

          {/* Density / Heat Circle Overlays */}
          <Circle
            center={[-5.3620, 104.9580]}
            radius={3500}
            pathOptions={{
              color: '#2E7D32',
              fillColor: '#2E7D32',
              fillOpacity: 0.25,
              stroke: false,
            }}
          />
          <Circle
            center={[-5.3500, 105.0120]}
            radius={4200}
            pathOptions={{
              color: '#1565C0',
              fillColor: '#1565C0',
              fillOpacity: 0.22,
              stroke: false,
            }}
          />

          {/* Spatial Markers */}
          {livestockLocations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={loc.icon}>
              <Popup className="custom-popup">
                <div className="p-3.5 min-w-[200px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {loc.district}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 font-heading mb-1.5">
                    {loc.name}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Komoditas:</span>
                      <span className="font-semibold text-slate-800">{loc.commodity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Populasi/Kapasitas:</span>
                      <span className="font-bold text-[#2E7D32]">{loc.count}</span>
                    </div>
                    <div className="mt-2 text-[11px] bg-emerald-50 text-[#2E7D32] px-2 py-0.5 rounded font-medium text-center">
                      ✔ {loc.status}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating KPI Cards on Map Bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pointer-events-none">
          <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#2E7D32] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500">Cakupan Wilayah</div>
              <div className="text-sm font-extrabold text-slate-900 font-heading">
                9 Kecamatan
              </div>
            </div>
          </div>

          <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#1565C0] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500">Komoditas Utama</div>
              <div className="text-sm font-extrabold text-slate-900 font-heading">
                Sapi, Kambing, Ayam
              </div>
            </div>
          </div>

          <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-[#F9A825] flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500">Ketahanan Pangan</div>
              <div className="text-sm font-extrabold text-slate-900 font-heading">
                Status Baik (A)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
