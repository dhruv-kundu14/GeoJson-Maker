//GeoJsonLayer.jsx

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

function GeoJsonLayer({ geojsonData, locality, onPopupClick }) {
  const customGeoJSONRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (geojsonData) {
      const customGeoJSONLayer = L.geoJSON(geojsonData, {
        style: {
          fillColor: 'green',
          fillOpacity: 0.1,
          color: 'black',
          weight: 1,
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(`<b>${feature.properties.name}</b>`);
            layer.on('popupopen', () => {
              if (onPopupClick) {
                onPopupClick(feature.properties.name);
              }
            });
          } else {
            layer.bindPopup('<b>No name available</b>');
          }
        },
      }).addTo(map);

      customGeoJSONRef.current = customGeoJSONLayer;

      const bounds = customGeoJSONLayer.getBounds();
      map.fitBounds(bounds);
    }

    return () => {
      if (customGeoJSONRef.current) {
        map.removeLayer(customGeoJSONRef.current);
        customGeoJSONRef.current = null;
      }
    };
  }, [geojsonData, map, onPopupClick]);

  useEffect(() => {
    const handleClick = (e) => {
      if (customGeoJSONRef.current) {
        const features = customGeoJSONRef.current
          .getLayers()
          .filter((layer) => {
            return (
              layer.feature.geometry.type === 'Polygon' &&
              layer.getBounds().contains(e.latlng)
            );
          });

        if (features.length > 0) {
          const name = features[0].feature.properties.name;
          console.log('Location Name:', name);
          console.log('Locality:', locality); // Log locality here
        }
      }
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, locality]);

  return null;
}

export default GeoJsonLayer;
