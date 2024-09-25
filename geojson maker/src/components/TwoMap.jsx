// //TwoMap.jsx

// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import GeoServerLayer from './GeoServerLayer';
// import GeoJsonLayer from './GeoJsonLayer';
// import GeoJSONViewer from './GeoJSONViewer';
// import FetchJson from './FetchJson';

// function TwoMap() {
//   const position = [28.5732306, 76.8388351]; // Example position
//   const [mapInstance, setMapInstance] = useState(null);
//   const [markers, setMarkers] = useState([]);

//   let DefaultIcon = L.icon({
//     iconUrl: '/location-pointer.png',
//     iconSize: [25, 41],
//     iconAnchor: [10, 41],
//     popupAnchor: [2, -40],
//   });
//   L.Marker.prototype.options.icon = DefaultIcon;

//   return (
//     <div className='map-container' style={{ display: 'flex' }}>
//       <FetchJson setMarkers={setMarkers} />
//       <div className='map' id='left-map' style={{ flex: 1, height: '100vh' }}>
//         <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//           />
        
//           {markers.map(
//             (marker) =>
//               marker.latitude !== undefined &&
//               marker.longitude !== undefined && (
//                 <Marker
//                   key={marker.id}
//                   position={[marker.latitude, marker.longitude]}
//                 >
//                   <Popup>{marker.name}</Popup>
//                 </Marker>
//               )
//           )}
//           {markers.map(
//             (marker, index) =>
//               marker.Geo_json && (
//                 <GeoServerLayer key={index} geojsonData={marker.Geo_json} />
//               )
//           )}
//         </MapContainer>
//       </div>
//       <div className='map' id='right-map' style={{ flex: 1, height: '100vh' }}>
//         <MapContainer
//           center={position}
//           zoom={13}
//           scrollWheelZoom={true}
//           whenCreated={setMapInstance}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//           />
//           <GeoJsonLayer mapInstance={mapInstance} />
//           <div
//             style={{
//               position: 'absolute',
//               top: '10px',
//               left: '10px',
//               zIndex: '1000',
//             }}
//           >
//             <GeoJSONViewer />
//           </div>
//         </MapContainer>
//       </div>
//     </div>
//   );
// }

// export default TwoMap;



// TwoMap.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GeoServerLayer from './GeoServerLayer';
import GeoJsonLayer from './GeoJsonLayer';
import GeoJSONViewer from './GeoJSONViewer';
import axios from 'axios';

function TwoMap() {
  const position = [28.5732306, 76.8388351]; // Example position
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [geojsonData, setGeojsonData] = useState(null);

  let DefaultIcon = L.icon({
    iconUrl: '/location-pointer.png',
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  const handleLocalityFound = (data) => {
    setGeojsonData(data);
  };

  const fetchLatestData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/getMarkers');
      setMarkers(response.data);
    } catch (error) {
      console.error('Error fetching latest data:', error);
    }
  };

  useEffect(() => {
    fetchLatestData(); // Fetch initial data
  }, []);

  return (
    <div className='map-container' style={{ display: 'flex' }}>
      <div className='map' id='left-map' style={{ flex: 1, height: '100vh', position: 'relative' }}>
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {markers.map(
            (marker) =>
              marker.latitude !== undefined &&
              marker.longitude !== undefined && (
                <Marker
                  key={marker.id}
                  position={[marker.latitude, marker.longitude]}
                >
                  <Popup>{marker.name}</Popup>
                </Marker>
              )
          )}
          {markers.map(
            (marker, index) =>
              marker.Geo_json && (
                <GeoServerLayer key={index} geojsonData={marker.Geo_json} />
              )
          )}
        </MapContainer>
        <button
          onClick={fetchLatestData}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: '1000',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          Refresh Data
        </button>
      </div>
      <div className='map' id='right-map' style={{ flex: 1, height: '100vh' }}>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          whenCreated={setMapInstance}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <GeoJsonLayer mapInstance={mapInstance} />
          {geojsonData && (
            <GeoServerLayer key={'geojson-layer'} geojsonData={geojsonData} />
          )}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: '1000',
              backgroundColor: 'rgba(255, 255, 255, 0.3)', // Add background to make form readable
              padding: '10px', // Add some padding
              borderRadius: '5px', // Add border radius for better appearance
              boxShadow: '0 0 10px rgba(0,0,0,0.5)', // Add shadow for better visibility
              
            }}
          >
            <GeoJSONViewer onLocalityFound={handleLocalityFound} />
          </div>
        </MapContainer>
      </div>
    </div>
  );
}

export default TwoMap;
