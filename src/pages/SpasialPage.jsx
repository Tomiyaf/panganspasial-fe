import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';
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
const amberMarker = createMarkerIcon('#D97706');
const orangeMarker = createMarkerIcon('#E65100');

// Vibrant & distinguishable thematic color palette for village polygons
const VILLAGE_COLOR_PALETTE = [
  { fill: '#10B981', stroke: '#047857' }, // Emerald Green
  { fill: '#3B82F6', stroke: '#1D4ED8' }, // Ocean Blue
  { fill: '#F59E0B', stroke: '#D97706' }, // Warm Amber
  { fill: '#8B5CF6', stroke: '#6D28D9' }, // Violet Purple
  { fill: '#EC4899', stroke: '#BE185D' }, // Vivid Pink
  { fill: '#14B8A6', stroke: '#0F766E' }, // Teal
  { fill: '#F97316', stroke: '#C2410C' }, // Tangerine Orange
  { fill: '#6366F1', stroke: '#4338CA' }, // Indigo
  { fill: '#84CC16', stroke: '#4D7C0F' }, // Lime Green
  { fill: '#06B6D4', stroke: '#0E7490' }, // Cyan
  { fill: '#A855F7', stroke: '#7E22CE' }, // Purple
  { fill: '#E11D48', stroke: '#9F1239' }, // Crimson Rose
  { fill: '#059669', stroke: '#064E3B' }, // Forest Green
  { fill: '#D97706', stroke: '#92400E' }, // Dark Amber
  { fill: '#0284C7', stroke: '#0369A1' }, // Sky Blue
  { fill: '#4F46E5', stroke: '#3730A3' }, // Deep Indigo
];

const getVillagePalette = (identifier) => {
  if (!identifier) return VILLAGE_COLOR_PALETTE[0];
  let hash = 0;
  const str = String(identifier);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % VILLAGE_COLOR_PALETTE.length;
  return VILLAGE_COLOR_PALETTE[index];
};

export default function SpasialPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [layerControlOpen, setLayerControlOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(() => searchParams.get('id') || null);
  const [targetLocation, setTargetLocation] = useState(null);

  // Active Map Layers (Desa/Pekon is the primary boundary layer)
  const [activeLayers, setActiveLayers] = useState({
    farms: true,
    villages: true,
    districts: false,
    heatmap: false,
  });

  // Active Basemap: voyager, satellite, osm
  const [activeBasemap, setActiveBasemap] = useState('voyager');

  // Filter State
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    district_id: searchParams.get('district_id') || '',
    village_id: searchParams.get('village_id') || '',
    farm_category_id: '',
    farm_scale_id: '',
    livestock_category_id: '',
    livestock_type_id: '',
  });

  // Sync searchParams from URL to state when query params change
  useEffect(() => {
    const urlFarmId = searchParams.get('id');
    const urlDistrictId = searchParams.get('district_id') || '';
    const urlVillageId = searchParams.get('village_id') || '';
    const urlSearch = searchParams.get('search') || '';

    if (urlFarmId) {
      setSelectedFarmId(urlFarmId);
    }
    setFilters((prev) => ({
      ...prev,
      district_id: urlDistrictId,
      village_id: urlVillageId,
      search: urlSearch,
    }));
  }, [searchParams]);

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

  // 1. Fetch Village Boundaries GeoJSON (Primary Boundary Layer)
  const { data: villagesGeoJSON } = useQuery({
    queryKey: ['spatial', 'villages', filters.district_id],
    queryFn: async () => {
      const res = await spatialApi.getVillagesGeoJSON(
        filters.district_id ? { district_id: filters.district_id } : {}
      );
      return res;
    },
    staleTime: 1000 * 60 * 30,
    enabled: activeLayers.villages,
  });

  // 1b. Fetch District Boundaries GeoJSON (Secondary/Optional Boundary Layer)
  const { data: districtsGeoJSON } = useQuery({
    queryKey: ['spatial', 'districts', 'all'],
    queryFn: async () => {
      const res = await spatialApi.getDistrictsGeoJSON();
      return res;
    },
    staleTime: 1000 * 60 * 30,
    enabled: activeLayers.districts,
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

  // Auto-focus map when a village is selected from filter
  useEffect(() => {
    if (filters.village_id && villagesGeoJSON?.features?.length) {
      const selectedFeature = villagesGeoJSON.features.find(
        (f) => String(f.properties?.id || f.id) === String(filters.village_id)
      );
      if (selectedFeature?.geometry) {
        try {
          const bbox = turf.bbox(selectedFeature); // [minLng, minLat, maxLng, maxLat]
          const centerLat = (bbox[1] + bbox[3]) / 2;
          const centerLng = (bbox[0] + bbox[2]) / 2;
          setTargetLocation([centerLat, centerLng]);
        } catch (err) {
          console.warn('Could not calculate village centroid:', err);
        }
      }
    }
  }, [filters.village_id, villagesGeoJSON]);

  // Auto-focus and open farm drawer when URL or state has selectedFarmId
  useEffect(() => {
    if (selectedFarmId && farmFeatures.length > 0) {
      const match = farmFeatures.find(
        (f) => String(f.properties?.id || f.id) === String(selectedFarmId)
      );
      if (match?.geometry?.coordinates) {
        const [lng, lat] = match.geometry.coordinates;
        setTargetLocation([lat, lng]);
      }
    }
  }, [selectedFarmId, farmFeatures]);

  const handleSelectFarm = (id, lat, lng) => {
    setSelectedFarmId(id);
    if (lat && lng) {
      setTargetLocation([lat, lng]);
    }
  };

  const basemapUrls = {
    voyager: import.meta.env.VITE_MAP_TILE_URL,
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#F8FAF8] flex flex-col pt-20">
      {/* Top Floating Control Bar - MD3 Pill Action Bar */}
      <div className="absolute top-24 left-4 right-4 z-[800] flex items-center justify-between pointer-events-none">

        {/* Left Side: Filter Trigger & Quick Stats */}
        <div className="flex items-center gap-2.5 pointer-events-auto relative">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-full border border-[#C2C9BD]/70 shadow-sm text-xs font-bold font-heading text-[#191C19] hover:bg-[#F1F5F1] transition-all duration-150"
          >
            <Filter className="w-4 h-4 text-[#2E7D32]" />
            <span>Filter Spasial</span>
            {Object.values(filters).some(Boolean) && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
            )}
          </button>

          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-full border border-[#C2C9BD]/70 shadow-sm text-xs font-medium text-[#191C19]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
            <span className="font-bold font-heading">{farmFeatures.length}</span>
            <span className="text-[#495348] font-semibold">Titik Terpetakan</span>
          </div>

          {/* Floating Filter Modal Panel - Dropdown attached to map control bar */}
          <SpatialFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            isOpen={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            totalResults={farmFeatures.length}
          />
        </div>

        {/* Right Side: Layer Switcher & Reset Map Button */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
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
            onClick={() => setTargetLocation([-5.2480, 105.0150])}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-[#C2C9BD]/70 shadow-sm text-[#495348] hover:text-[#2E7D32] hover:bg-[#F1F5F1] flex items-center justify-center transition-colors"
            title="Reset Peta (Fokus Kec. Adiluwih)"
            aria-label="Reset Tampilan Peta ke Kecamatan Adiluwih"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Full-Screen Map Container */}
      <div className="w-full h-full relative z-0">
        <MapContainer
          center={[-5.2480, 105.0150]}
          zoom={12.8}
          zoomSnap={0.2}
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

          {/* Layer 1: Administrative Boundaries (Desa / Pekon) */}
          {activeLayers.villages && villagesGeoJSON && (
            <GeoJSON
              key={`villages-${JSON.stringify(villagesGeoJSON)}`}
              data={villagesGeoJSON}
              style={(feature) => {
                const name = feature?.properties?.name || feature?.id || 'Desa';
                const isSelected =
                  filters.village_id &&
                  String(feature?.properties?.id) === String(filters.village_id);
                const palette = getVillagePalette(name);

                return {
                  color: palette.stroke,
                  weight: isSelected ? 3.5 : 2,
                  fillColor: palette.fill,
                  fillOpacity: isSelected ? 0.45 : 0.22,
                  dashArray: isSelected ? undefined : '4, 4',
                };
              }}
              onEachFeature={(feature, layer) => {
                const name = feature.properties?.name || feature.properties?.village_name || 'Pekon/Desa';
                const district = feature.properties?.district_name || 'Adiluwih';
                const totalFarms = feature.properties?.total_farms || 0;
                const totalPop = feature.properties?.total_population || 0;
                const palette = getVillagePalette(name);

                layer.bindTooltip(
                  `<div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs" style="background-color: ${palette.fill}; border: 1px solid ${palette.stroke}"></span>
                      <span class="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading">Pekon / Desa</span>
                    </div>
                    <div class="text-xs font-black font-heading text-[#191C19]">${name}</div>
                    <div class="text-[11px] text-[#495348] border-t border-[#C2C9BD]/50 pt-1 mt-1 flex flex-col gap-0.5">
                      <span>Kecamatan: <b class="text-[#191C19]">${district}</b></span>
                      <span>Kandang Terdata: <b class="text-[#2E7D32]">${totalFarms} Unit</b></span>
                      <span>Populasi Ternak: <b class="text-[#191C19]">${Number(totalPop).toLocaleString('id-ID')} Ekor</b></span>
                    </div>
                  </div>`,
                  { sticky: true, className: 'custom-leaflet-tooltip' }
                );

                layer.on({
                  mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({
                      fillOpacity: 0.5,
                      weight: 3.5,
                    });
                  },
                  mouseout: (e) => {
                    const l = e.target;
                    const isSelected =
                      filters.village_id &&
                      String(feature?.properties?.id) === String(filters.village_id);
                    l.setStyle({
                      fillOpacity: isSelected ? 0.45 : 0.22,
                      weight: isSelected ? 3.5 : 2,
                      color: palette.stroke,
                    });
                  },
                  click: () => {
                    if (feature.properties?.id) {
                      handleFilterChange('village_id', String(feature.properties.id));
                    }
                  },
                });
              }}
            />
          )}

          {/* Layer 1b: Optional Administrative Boundaries (Districts / Kecamatan) */}
          {activeLayers.districts && districtsGeoJSON && (
            <GeoJSON
              key={`districts-${JSON.stringify(districtsGeoJSON)}`}
              data={districtsGeoJSON}
              style={() => ({
                color: '#1565C0',
                weight: 2,
                fillColor: '#1565C0',
                fillOpacity: 0.04,
                dashArray: '6, 6',
              })}
              onEachFeature={(feature, layer) => {
                const name = feature.properties?.name || feature.properties?.district_name || 'Kecamatan';
                layer.bindTooltip(
                  `<div class="text-xs font-bold font-heading text-[#1565C0]">Kecamatan ${name}</div>`,
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
                  ? amberMarker
                  : orangeMarker;

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
                    <div className="p-4 min-w-[230px] space-y-2.5 font-body">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading">
                          {props.district ? `Kec. ${props.district}` : 'Pringsewu'}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#191C19] font-heading leading-tight">
                          {props.farm_name || 'Peternakan'}
                        </h4>
                      </div>

                      <div className="border-t border-[#E2E8E2] pt-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#495348]">Pemilik:</span>
                          <span className="font-semibold text-[#191C19]">{props.owner_name || '-'}</span>
                        </div>
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
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

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
