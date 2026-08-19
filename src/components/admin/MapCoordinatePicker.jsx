import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

const pickerMarker = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DC2626" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-9 h-9 drop-shadow-xl animate-bounce"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`,
  className: 'coordinate-picker-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function LocationMarker({ position, setPosition, onChange }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onChange(newPos[0], newPos[1]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={pickerMarker}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          const newPos = [pos.lat, pos.lng];
          setPosition(newPos);
          onChange(newPos[0], newPos[1]);
        },
      }}
    />
  ) : null;
}

export default function MapCoordinatePicker({
  latitude,
  longitude,
  onChange,
}) {
  const defaultCenter = [-5.3582, 104.9749]; // Pringsewu center
  const [position, setPosition] = useState(
    latitude && longitude ? [latitude, longitude] : defaultCenter
  );

  const handleManualInput = (latVal, lngVal) => {
    const lat = parseFloat(latVal);
    const lng = parseFloat(lngVal);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
      onChange(lat, lng);
    }
  };

  return (
    <div className="space-y-3 font-body text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Titik Koordinat Spasial (PostGIS Point SRID 4326)</span>
        </label>
        <span className="text-[11px] text-slate-400">
          Klik pada peta atau geser pin merah untuk menentukan posisi kandang
        </span>
      </div>

      {/* Map Container */}
      <div className="h-[280px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
        <MapContainer
          center={position}
          zoom={12}
          minZoom={9}
          maxZoom={18}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onChange={onChange}
          />
        </MapContainer>

        {/* Floating Hint Overlay */}
        <div className="absolute top-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-medium text-slate-700 shadow-xs pointer-events-none">
          📍 Klik peta untuk meletakkan pin
        </div>
      </div>

      {/* Manual Input Readout / Coordinate inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[11px] text-slate-500 font-semibold block">Latitude (Lintang)</span>
          <input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) => handleManualInput(e.target.value, longitude)}
            placeholder="-5.358200"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] text-slate-500 font-semibold block">Longitude (Bujur)</span>
          <input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) => handleManualInput(latitude, e.target.value)}
            placeholder="104.974900"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          />
        </div>
      </div>
    </div>
  );
}
