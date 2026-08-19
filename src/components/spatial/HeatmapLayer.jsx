import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatmapLayer({ points = [], radius = 30, blur = 18, maxZoom = 13 }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Format points: [[lat, lng, intensity], ...]
    const heatData = points.map((p) => [
      p.latitude,
      p.longitude,
      Math.min(1.0, (p.weight || 1) / 10),
    ]);

    const heatLayer = L.heatLayer(heatData, {
      radius,
      blur,
      maxZoom,
      gradient: {
        0.2: '#3b82f6',
        0.4: '#10b981',
        0.6: '#eab308',
        0.8: '#f97316',
        1.0: '#ef4444',
      },
    }).addTo(map);

    return () => {
      if (map && heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points, radius, blur, maxZoom]);

  return null;
}
