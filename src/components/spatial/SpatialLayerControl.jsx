import { Layers } from 'lucide-react';

export default function SpatialLayerControl({
  layers,
  onToggleLayer,
  activeBasemap,
  onChangeBasemap,
  isOpen,
  onToggleOpen,
}) {
  const basemaps = [
    { id: 'voyager', name: 'Clean Light (CartoDB)' },
    { id: 'satellite', name: 'Citra Satelit (ESRI)' },
    { id: 'osm', name: 'OpenStreetMap Standard' },
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggleOpen}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-full border border-[#C2C9BD]/70 shadow-sm text-xs font-bold font-heading text-[#191C19] hover:bg-[#F1F5F1] transition-all"
        aria-label="Layer Switcher"
      >
        <Layers className="w-4 h-4 text-[#2E7D32]" />
        <span className="hidden sm:inline">Kontrol Layer</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-72 bg-white rounded-3xl border border-[#C2C9BD]/50 shadow-xl p-5 space-y-4 z-50 text-xs font-body animate-in fade-in zoom-in-95 duration-150">
          {/* Overlays Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading block">
              Layer Spasial (Overlays)
            </span>
            <div className="space-y-1">
              <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F5F1] cursor-pointer transition-colors">
                <span className="font-semibold text-[#191C19]">Titik Peternakan</span>
                <input
                  type="checkbox"
                  checked={layers.farms}
                  onChange={() => onToggleLayer('farms')}
                  className="rounded border-[#C2C9BD] text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F5F1] cursor-pointer transition-colors">
                <span className="font-semibold text-[#191C19]">Batas Wilayah Kecamatan</span>
                <input
                  type="checkbox"
                  checked={layers.districts}
                  onChange={() => onToggleLayer('districts')}
                  className="rounded border-[#C2C9BD] text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F5F1] cursor-pointer transition-colors">
                <span className="font-semibold text-[#191C19]">Heatmap Kepadatan Ternak</span>
                <input
                  type="checkbox"
                  checked={layers.heatmap}
                  onChange={() => onToggleLayer('heatmap')}
                  className="rounded border-[#C2C9BD] text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Basemap Selection */}
          <div className="space-y-2 pt-3 border-t border-[#E2E8E2]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#495348] font-heading block">
              Peta Dasar (Basemap)
            </span>
            <div className="space-y-1">
              {basemaps.map((b) => (
                <label
                  key={b.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeBasemap === b.id
                      ? 'bg-[#E8F5E9] text-[#1B5E20] font-bold'
                      : 'hover:bg-[#F1F5F1] text-[#495348]'
                  }`}
                >
                  <span>{b.name}</span>
                  <input
                    type="radio"
                    name="basemap"
                    value={b.id}
                    checked={activeBasemap === b.id}
                    onChange={() => onChangeBasemap(b.id)}
                    className="text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
