//GeoServerLayer.jsx

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

function GeoServerLayer({ geojsonData }) {
  const customGeoJSONRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (geojsonData) {
      const customGeoServerLayer = L.geoJSON(geojsonData, {
        style: {
          fillColor: 'green',
          fillOpacity: 0.1,
          color: 'black',
          weight: 1,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(
            `<b>${feature.properties.name || 'No name available'}</b>`
          );
        },
      }).addTo(map);

      customGeoJSONRef.current = customGeoServerLayer;

      if (customGeoServerLayer.getBounds().isValid()) {
        map.fitBounds(customGeoServerLayer.getBounds());
      }
    }

    return () => {
      if (customGeoJSONRef.current) {
        map.removeLayer(customGeoJSONRef.current);
        customGeoJSONRef.current = null;
      }
    };
  }, [geojsonData, map]);

  return null;
}

export default GeoServerLayer;
