//GeoJSONViewer.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GeoJsonLayer from './GeoJsonLayer';

function GeoJSONViewer({ onLocalityFound }) {
  const [locality, setLocality] = useState('');
  const [Geo_json, setGeoJSON] = useState(null);
  const [error, setError] = useState(null);
  const [locationId, setLocationId] = useState('');
  const [updateLocality, setUpdateLocality] = useState('');
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3005/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const fetchData = async (locality) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/geojson?locality=${locality}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
      throw new Error('Failed to fetch GeoJSON');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const geojsonData = await fetchData(locality);
      setGeoJSON(geojsonData);
      setError(null);

      if (onLocalityFound) {
        onLocalityFound(geojsonData);
      }

      window.history.pushState({}, '', `/?locality=${locality}`);
      setLocality('');
    } catch (error) {
      setError(error.message);
      setGeoJSON(null);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (Geo_json && updateLocality && locationId) {
      try {
        const dataToSend = {
          LocationId: locationId,
          geo_json: JSON.stringify(Geo_json),
          locationname: updateLocality,
        };
        console.log('Data to be updated:', dataToSend);

        const response = await axios.put('http://localhost:3005/update', dataToSend);
        console.log('Update response:', response.data);
        alert('GeoJSON data updated successfully');
      } catch (error) {
        console.error('Error updating GeoJSON:', error);
        setError('Failed to update GeoJSON');
      }
    } else {
      setError('Please enter all required fields');
    }
  };

  const handlePopupClick = (name) => {
    setLocality(name);
  };

  const filteredLocations = locations.filter(loc =>
    loc.LocationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (event) => {
    const selectedOption = locations.find(loc => loc.LocationName === event.target.value);
    if (selectedOption) {
      setLocationId(selectedOption.LocationId);
      setUpdateLocality(selectedOption.LocationName);
      setSearchTerm(selectedOption.LocationName);
    }
  };

  return (
    <div className='container'>
      <h1 align='center'>Polygon</h1>
      <div className='content'>
        <div className='locality'>
          <form id='form-submit' className='form' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Enter Locality Name'
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            />
            <button type='submit'>Get Data</button>
          </form>

          <form id='form-update' className='form' onSubmit={handleUpdate}>
            <input
              type='text'
              placeholder='Search and Select Location'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleLocationSelect(e); // Handle location select on input change
              }}
              list="location-options"
            />
            <datalist id="location-options">
              {filteredLocations.map(loc => (
                <option key={loc.LocationId} value={loc.LocationName}>
                  {loc.LocationName} (LocationId: {loc.LocationId}, OID: {loc.OID})
                </option>
              ))}
            </datalist>

            <input
              type='text'
              placeholder='Enter Locality Name to Update'
              value={updateLocality}
              onChange={(e) => setUpdateLocality(e.target.value)}
            />
            <button type='submit'>Update Data</button>
          </form>

          {error && <p>{error}</p>}
          {Geo_json && (
            <GeoJsonLayer
              geojsonData={Geo_json}
              onPopupClick={handlePopupClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GeoJSONViewer;
