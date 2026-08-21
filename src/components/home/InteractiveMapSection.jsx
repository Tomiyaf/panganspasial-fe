import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { spatialApi } from '../../services/api';

// Custom Map Marker Icons using SVG Data URIs
const createCustomMarker = (colorHex) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorHex}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker transition-all duration-200',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const greenMarker = createCustomMarker('#2E7D32');
const blueMarker = createCustomMarker('#1565C0');
const amberMarker = createCustomMarker('#F9A825');

const defaultMockLocations = [
  {
    id: '1',
    farm_name: 'Peternakan Barokah Jaya',
    district: 'Adiluwih',
    village: 'Adiluwih',
    category: 'Komersial',
    scale: 'Besar',
    total_population: 150,
    coordinates: [105.0205381, -5.2269279],
  },
  {
    id: '2',
    farm_name: 'Sentra Kambing Mandiri',
    district: 'Gadingrejo',
    village: 'Gadingrejo',
    category: 'Mandiri',
    scale: 'Sedang',
    total_population: 85,
    coordinates: [105.0120, -5.3500],
  },
  {
    id: '3',
    farm_name: 'Kemitraan Broiler Sukoharjo',
    district: 'Sukoharjo',
    village: 'Sukoharjo III',
    category: 'Kemitraan',
    scale: 'Besar',
    total_population: 12000,
    coordinates: [104.9780, -5.2850],
  },
  {
    id: '4',
    farm_name: 'Peternakan Sapi Potong Pagelaran',
    district: 'Pagelaran',
    village: 'Pagelaran',
    category: 'Komersial',
    scale: 'Besar',
    total_population: 60,
    coordinates: [104.9580, -5.3620],
  },
];

export default function InteractiveMapSection() {
  // Fetch real GeoJSON districts boundaries
  const { data: districtsGeoJSON } = useQuery({
    queryKey: ['spatial', 'districts', 'home'],
    queryFn: async () => {
      const res = await spatialApi.getDistrictsGeoJSON();
      return res;
    },
    staleTime: 1000 * 60 * 30,
  });

  // Fetch real GeoJSON farms
  const { data: farmsGeoJSON } = useQuery({
    queryKey: ['spatial', 'farms', 'home'],
    queryFn: async () => {
      const res = await spatialApi.getFarmsGeoJSON();
      return res;
    },
    staleTime: 1000 * 60 * 10,
  });

  // Extract farm points from GeoJSON or fallback
  const farmFeatures = farmsGeoJSON?.features && farmsGeoJSON.features.length > 0
    ? farmsGeoJSON.features
    : defaultMockLocations.map((loc) => ({
        type: 'Feature',
        id: loc.id,
        geometry: {
          type: 'Point',
          coordinates: loc.coordinates,
        },
        properties: {
          id: loc.id,
          farm_name: loc.farm_name,
          district: loc.district,
          village: loc.village,
          category: loc.category,
          scale: loc.scale,
          total_population: loc.total_population,
        },
      }));

  return (
    <section className="w-full py-20 md:py-28 bg-[#F8FAF8] text-[#191C19]">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 text-center space-y-2.5 mb-10"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E7D32] font-heading">
          Peta Interaktif
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#191C19] tracking-tight">
          Visualisasi Spasial Wilayah
        </h2>
        <p className="text-sm sm:text-base text-[#495348] font-body leading-relaxed max-w-[60ch] mx-auto">
          Eksplorasi sebaran titik peternakan, zonasi komoditas, dan batas administratif 9 kecamatan di Kabupaten Pringsewu.
        </p>
      </motion.div>

      {/* Main Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="w-[92%] max-w-[1400px] mx-auto"
      >
        <div className="relative h-[520px] md:h-[600px] rounded-3xl overflow-hidden border border-[#C2C9BD]/50 bg-white shadow-sm">
          <MapContainer
            center={[-5.2480, 105.0150]}
            zoom={12.8}
            zoomSnap={0.2}
            minZoom={9}
            maxZoom={17}
            zoomControl={false}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            <ZoomControl position="topright" />

            {/* Clean Voyager Basemap */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Render District Boundaries if available */}
            {districtsGeoJSON && (
              <GeoJSON
                key={JSON.stringify(districtsGeoJSON)}
                data={districtsGeoJSON}
                style={() => ({
                  color: '#2E7D32',
                  weight: 1.5,
                  fillColor: '#2E7D32',
                  fillOpacity: 0.05,
                  dashArray: '3, 4',
                })}
              />
            )}

            {/* Render Farm Markers */}
            {farmFeatures.map((feat) => {
              const coords = feat.geometry?.coordinates; // [lng, lat]
              if (!coords || coords.length < 2) return null;
              const lat = coords[1];
              const lng = coords[0];
              const props = feat.properties || {};

              const markerIcon =
                props.scale === 'Besar'
                  ? greenMarker
                  : props.scale === 'Sedang'
                  ? blueMarker
                  : amberMarker;

              return (
                <Marker key={feat.id || props.id || `${lat}-${lng}`} position={[lat, lng]} icon={markerIcon}>
                  <Popup className="custom-popup">
                    <div className="p-4 min-w-[230px] space-y-2.5 font-body">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading">
                          {props.district ? `Kecamatan ${props.district}` : 'Pringsewu'}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#191C19] font-heading leading-tight mt-0.5">
                          {props.farm_name || 'Peternakan'}
                        </h4>
                      </div>

                      <div className="border-t border-[#E2E8E2] pt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#495348]">Kategori:</span>
                          <span className="font-semibold text-[#191C19]">{props.category || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#495348]">Skala:</span>
                          <span className="font-semibold text-[#191C19]">{props.scale || '-'}</span>
                        </div>
                        {props.total_population !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-[#495348]">Populasi:</span>
                            <span className="font-bold text-[#2E7D32]">
                              {props.total_population.toLocaleString('id-ID')} ekor
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-1.5">
                        <Link
                          to={`/spasial?id=${props.id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold font-heading rounded-full bg-[#2E7D32] text-white hover:bg-[#1B5E20] transition-colors shadow-2xs"
                        >
                          <span>Buka di WebGIS</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Top Left Status Badge - MD3 Assist Pill */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#C2C9BD]/60 shadow-xs flex items-center gap-2.5 text-xs font-medium text-[#191C19] pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
            <span className="font-bold font-heading">Kabupaten Pringsewu</span>
            <span className="text-[#C2C9BD]">|</span>
            <span className="text-[#495348] font-semibold">{farmFeatures.length} Titik Terdata</span>
          </div>

          {/* Bottom Left Minimal Legend - MD3 Assist Pill */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#C2C9BD]/60 shadow-xs text-xs font-semibold text-[#495348] hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span>Skala Besar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1565C0]" />
              <span>Skala Sedang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F9A825]" />
              <span>Skala Kecil/Mikro</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Single Primary Action Below Map */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4 }}
        className="mt-8 text-center"
      >
        <Link
          to="/spasial"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold font-heading rounded-full bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-[0.98] text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <MapPin className="w-4 h-4" />
          <span>Eksplorasi WebGIS Lengkap</span>
        </Link>
      </motion.div>
    </section>
  );
}
