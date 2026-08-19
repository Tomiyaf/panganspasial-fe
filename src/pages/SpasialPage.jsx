import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Filter, RotateCcw, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { spatialApi } from '../services/api';
import SpatialFilters from '../components/spatial/SpatialFilters';
import SpatialLayerControl from '../components/spatial/SpatialLayerControl';
import FarmDetailDrawer from '../components/spatial/FarmDetailDrawer';
import HeatmapLayer from '../components/spatial/HeatmapLayer';

// Helper Map Controller for resetting view & zooming to feature
function MapController({ targetLocation }) {
  const map = useMap();

  if (targetLocation && targetLocation[0] && targetLocation[1]) {
    map.flyTo(targetLocation, 14, { duration: 1.2 });
  }

  return null;
}

// Marker Icon Generators
const createMarkerIcon = (colorHex) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorHex}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const greenMarker = createMarkerIcon('#2E7D32');
const blueMarker = createMarkerIcon('#1565C0');
const amberMarker = createMarkerIcon('#F9A825');

export default function SpasialPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [layerControlOpen, setLayerControlOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(() => searchParams.get('id') || null);
  const [targetLocation, setTargetLocation] = useState(null);

  // Active Map Layers
  const [activeLayers, setActiveLayers] = useState({
    farms: true,
    districts: true,
    heatmap: false,
  });

  // Active Basemap: voyager, satellite, osm
  const [activeBasemap, setActiveBasemap] = useState('voyager');

  // Filter State
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    district_id: searchParams.get('district_id') || '',
    village_id: '',
    farm_category_id: '',
    farm_scale_id: '',
    livestock_category_id: '',
    livestock_type_id: '',
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      district_id: '',
      village_id: '',
      farm_category_id: '',
      farm_scale_id: '',
      livestock_category_id: '',
      livestock_type_id: '',
    });
    setSearchParams({});
  };

  // 1. Fetch District Boundaries GeoJSON
  const { data: districtsGeoJSON } = useQuery({
    queryKey: ['spatial', 'districts', 'all'],
    queryFn: async () => {
      const res = await spatialApi.getDistrictsGeoJSON();
      return res;
    },
    staleTime: 1000 * 60 * 30,
  });

  // 2. Fetch Farms GeoJSON with Filters
  const { data: farmsGeoJSON } = useQuery({
    queryKey: ['spatial', 'farms', filters],
    queryFn: async () => {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.district_id) params.district_id = filters.district_id;
      if (filters.village_id) params.village_id = filters.village_id;
      if (filters.farm_category_id) params.farm_category_id = filters.farm_category_id;
      if (filters.farm_scale_id) params.farm_scale_id = filters.farm_scale_id;
      if (filters.livestock_type_id) params.livestock_type_id = filters.livestock_type_id;

      const res = await spatialApi.getFarmsGeoJSON(params);
      return res;
    },
    staleTime: 1000 * 60 * 5,
  });

  // 3. Fetch Heatmap Points
  const { data: heatmapRes } = useQuery({
    queryKey: ['spatial', 'heatmap', filters.district_id, filters.farm_category_id],
    queryFn: async () => {
      const res = await spatialApi.getHeatmapData({
        district_id: filters.district_id || undefined,
        farm_category_id: filters.farm_category_id || undefined,
      });
      return res.data;
    },
    enabled: activeLayers.heatmap,
    staleTime: 1000 * 60 * 10,
  });

  const farmFeatures = useMemo(() => {
    return farmsGeoJSON?.features || [];
  }, [farmsGeoJSON]);

  const handleSelectFarm = (id, lat, lng) => {
    setSelectedFarmId(id);
    if (lat && lng) {
      setTargetLocation([lat, lng]);
    }
  };

  const basemapUrls = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-100 flex flex-col pt-20">
      {/* Top Floating Control Bar */}
      <div className="absolute top-24 left-4 right-4 z-[800] flex items-center justify-between pointer-events-none">
        
        {/* Left Side: Filter Trigger & Quick Stats */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-xs font-semibold font-heading text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-[#2E7D32]" />
            <span>Filter Spasial</span>
            {Object.values(filters).some(Boolean) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <div className="hidden md:flex items-center gap-2 px-3.5 py-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="font-semibold">{farmFeatures.length}</span>
            <span className="text-slate-500">Titik Terpetakan</span>
          </div>
        </div>

        {/* Right Side: Layer Switcher & Reset Map Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <SpatialLayerControl
            layers={activeLayers}
            onToggleLayer={(layerName) =>
              setActiveLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }))
            }
            activeBasemap={activeBasemap}
            onChangeBasemap={(b) => setActiveBasemap(b)}
            isOpen={layerControlOpen}
            onToggleOpen={() => setLayerControlOpen(!layerControlOpen)}
          />

          <button
            onClick={() => setTargetLocation([-5.3582, 104.9749])}
            className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-slate-700 hover:bg-slate-50 transition-colors"
            title="Reset Peta Pringsewu"
            aria-label="Reset Tampilan Peta"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Full-Screen Map Container */}
      <div className="w-full h-full relative z-0">
        <MapContainer
          center={[-5.3582, 104.9749]}
          zoom={11}
          minZoom={9}
          maxZoom={17}
          zoomControl={false}
          className="w-full h-full"
        >
          <ZoomControl position="bottomright" />
          <MapController targetLocation={targetLocation} />

          {/* Active Basemap Layer */}
          <TileLayer
            key={activeBasemap}
            attribution='&copy; CARTO / ESRI / OpenStreetMap'
            url={basemapUrls[activeBasemap]}
          />

          {/* Layer 1: Administrative Boundaries (Districts) */}
          {activeLayers.districts && districtsGeoJSON && (
            <GeoJSON
              key={JSON.stringify(districtsGeoJSON)}
              data={districtsGeoJSON}
              style={() => ({
                color: '#2E7D32',
                weight: 2,
                fillColor: '#2E7D32',
                fillOpacity: 0.06,
                dashArray: '4, 4',
              })}
              onEachFeature={(feature, layer) => {
                const name = feature.properties?.name || feature.properties?.district_name || 'Kecamatan';
                layer.bindTooltip(
                  `<div class="text-xs font-bold font-heading text-slate-800">Kecamatan ${name}</div>`,
                  { sticky: true, className: 'custom-leaflet-tooltip' }
                );
              }}
            />
          )}

          {/* Layer 2: Heatmap Overlay */}
          {activeLayers.heatmap && heatmapRes?.points && (
            <HeatmapLayer points={heatmapRes.points} />
          )}

          {/* Layer 3: Point Markers for Farms */}
          {activeLayers.farms &&
            farmFeatures.map((feat) => {
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
                <Marker
                  key={feat.id || props.id || `${lat}-${lng}`}
                  position={[lat, lng]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => handleSelectFarm(props.id, lat, lng),
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-4 min-w-[220px] space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                          {props.district ? `Kec. ${props.district}` : 'Pringsewu'}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 font-heading leading-tight">
                          {props.farm_name || 'Peternakan'}
                        </h4>
                      </div>

                      <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pemilik:</span>
                          <span className="font-semibold text-slate-800">{props.owner_name || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Kategori:</span>
                          <span className="font-semibold text-slate-800">{props.category || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Skala:</span>
                          <span className="font-semibold text-slate-800">{props.scale || '-'}</span>
                        </div>
                        {props.total_population !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Populasi:</span>
                            <span className="font-bold text-[#2E7D32]">
                              {props.total_population.toLocaleString('id-ID')} ekor
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleSelectFarm(props.id, lat, lng)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2E7D32] text-white hover:bg-[#236327] transition-colors"
                        >
                          <span>Buka Detail Lengkap</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      {/* Floating Filter Sidebar Drawer */}
      <SpatialFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        totalResults={farmFeatures.length}
      />

      {/* Farm Detail Modal/Drawer */}
      {selectedFarmId && (
        <FarmDetailDrawer
          farmId={selectedFarmId}
          onClose={() => {
            setSelectedFarmId(null);
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete('id');
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
