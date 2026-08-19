import { useQuery } from '@tanstack/react-query';
import { masterApi, spatialApi } from '../services/api';

// Hook for Districts
export function useDistrictsQuery() {
  return useQuery({
    queryKey: ['spatial', 'districts'],
    queryFn: async () => {
      const res = await spatialApi.getDistrictsGeoJSON();
      return res; // Raw GeoJSON FeatureCollection
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Hook for Villages (Cascading with district_id)
export function useVillagesQuery(districtId) {
  return useQuery({
    queryKey: ['spatial', 'villages', districtId],
    queryFn: async () => {
      if (!districtId) return { type: 'FeatureCollection', features: [] };
      const res = await spatialApi.getVillagesGeoJSON({ district_id: districtId });
      return res;
    },
    enabled: Boolean(districtId),
    staleTime: 1000 * 60 * 30,
  });
}

// Hook for Farm Categories
export function useFarmCategoriesQuery() {
  return useQuery({
    queryKey: ['master', 'farm-categories'],
    queryFn: async () => {
      const res = await masterApi.getFarmCategories();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 15,
  });
}

// Hook for Farm Scales
export function useFarmScalesQuery() {
  return useQuery({
    queryKey: ['master', 'farm-scales'],
    queryFn: async () => {
      const res = await masterApi.getFarmScales();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 15,
  });
}

// Hook for Livestock Categories
export function useLivestockCategoriesQuery() {
  return useQuery({
    queryKey: ['master', 'livestock-categories'],
    queryFn: async () => {
      const res = await masterApi.getLivestockCategories();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 30,
  });
}

// Hook for Livestock Types (Filtered by category_id)
export function useLivestockTypesQuery(categoryId) {
  return useQuery({
    queryKey: ['master', 'livestock-types', categoryId],
    queryFn: async () => {
      const res = await masterApi.getLivestockTypes(categoryId ? { category_id: categoryId } : {});
      return res.data || [];
    },
    staleTime: 1000 * 60 * 15,
  });
}

// Hook for Livestock Subtypes (Filtered by type_id)
export function useLivestockSubtypesQuery(typeId) {
  return useQuery({
    queryKey: ['master', 'livestock-subtypes', typeId],
    queryFn: async () => {
      if (!typeId) return [];
      const res = await masterApi.getLivestockSubtypes({ type_id: typeId });
      return res.data || [];
    },
    enabled: Boolean(typeId),
    staleTime: 1000 * 60 * 15,
  });
}
