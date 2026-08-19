import { Search, Filter, RotateCcw, X } from 'lucide-react';
import {
  useDistrictsQuery,
  useVillagesQuery,
  useFarmCategoriesQuery,
  useFarmScalesQuery,
  useLivestockCategoriesQuery,
  useLivestockTypesQuery,
} from '../../hooks/useMasterData';

export default function SpatialFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isOpen,
  onClose,
  totalResults = 0,
}) {
  const { data: districtsGeoJSON } = useDistrictsQuery();
  const { data: villagesGeoJSON } = useVillagesQuery(filters.district_id);
  const { data: categories = [] } = useFarmCategoriesQuery();
  const { data: scales = [] } = useFarmScalesQuery();
  const { data: livestockCategories = [] } = useLivestockCategoriesQuery();
  const { data: livestockTypes = [] } = useLivestockTypesQuery(filters.livestock_category_id);

  // Extract district features from GeoJSON
  const districtList = districtsGeoJSON?.features?.map((f) => ({
    id: f.properties?.id || f.id,
    name: f.properties?.name || f.properties?.district_name || 'Kecamatan',
  })) || [];

  const villageList = villagesGeoJSON?.features?.map((f) => ({
    id: f.properties?.id || f.id,
    name: f.properties?.name || f.properties?.village_name || 'Pekon/Desa',
  })) || [];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-[900] w-full sm:w-80 bg-white border-r border-slate-200/90 shadow-2xl flex flex-col font-body transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-slate-900">
              Filter Spasial
            </h3>
            <span className="text-[11px] text-slate-500">
              {totalResults} titik terdata
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          aria-label="Tutup filter"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Form Controls */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Search Query */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">
            Cari Peternakan / Pemilik
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Nama peternakan / pemilik..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32]"
            />
          </div>
        </div>

        {/* District Filter */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">
            Kecamatan
          </label>
          <select
            value={filters.district_id || ''}
            onChange={(e) => {
              onFilterChange('district_id', e.target.value);
              onFilterChange('village_id', ''); // Reset village
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="">Semua Kecamatan (9)</option>
            {districtList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Village / Pekon Filter (Cascading) */}
        {filters.district_id && villageList.length > 0 && (
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Desa / Pekon
            </label>
            <select
              value={filters.village_id || ''}
              onChange={(e) => onFilterChange('village_id', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            >
              <option value="">Semua Desa / Pekon</option>
              {villageList.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Farm Category */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">
            Kategori Peternakan
          </label>
          <select
            value={filters.farm_category_id || ''}
            onChange={(e) => onFilterChange('farm_category_id', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Farm Scale */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">
            Skala Usaha
          </label>
          <select
            value={filters.farm_scale_id || ''}
            onChange={(e) => onFilterChange('farm_scale_id', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="">Semua Skala Usaha</option>
            {scales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Livestock Category Taxonomy */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">
            Kategori Komoditas
          </label>
          <select
            value={filters.livestock_category_id || ''}
            onChange={(e) => {
              onFilterChange('livestock_category_id', e.target.value);
              onFilterChange('livestock_type_id', '');
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="">Semua Kategori Ternak</option>
            {livestockCategories.map((lc) => (
              <option key={lc.id} value={lc.id}>
                {lc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Livestock Type */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 block">
            Jenis Ternak
          </label>
          <select
            value={filters.livestock_type_id || ''}
            onChange={(e) => onFilterChange('livestock_type_id', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value="">Semua Jenis Ternak</option>
            {livestockTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer Reset Action */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold font-heading transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Filter</span>
        </button>
      </div>
    </div>
  );
}
