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
        className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-xs font-semibold font-heading text-slate-800 hover:bg-slate-50 transition-colors"
        aria-label="Layer Switcher"
      >
        <Layers className="w-4 h-4 text-[#2E7D32]" />
        <span className="hidden sm:inline">Kontrol Layer</span>
      </button>

      {isOpen && (
        <div className="absolute top-11 right-0 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-4 z-50 text-xs font-body animate-in fade-in zoom-in-95 duration-150">
          {/* Overlays Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading block">
              Layer Spasial (Overlays)
            </span>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="font-medium text-slate-700">Titik Peternakan</span>
                <input
                  type="checkbox"
                  checked={layers.farms}
                  onChange={() => onToggleLayer('farms')}
                  className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="font-medium text-slate-700">Batas Wilayah Kecamatan</span>
                <input
                  type="checkbox"
                  checked={layers.districts}
                  onChange={() => onToggleLayer('districts')}
                  className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <span className="font-medium text-slate-700">Heatmap Kepadatan Ternak</span>
                <input
                  type="checkbox"
                  checked={layers.heatmap}
                  onChange={() => onToggleLayer('heatmap')}
                  className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Basemap Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading block">
              Peta Dasar (Basemap)
            </span>
            <div className="space-y-1">
              {basemaps.map((b) => (
                <label
                  key={b.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    activeBasemap === b.id
                      ? 'bg-emerald-50 text-[#2E7D32] font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{b.name}</span>
                  <input
                    type="radio"
                    name="basemap"
                    value={b.id}
                    checked={activeBasemap === b.id}
                    onChange={() => onChangeBasemap(b.id)}
                    className="text-[#2E7D32] focus:ring-[#2E7D32] w-3.5 h-3.5"
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
