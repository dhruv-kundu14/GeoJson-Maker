//server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs'); // Import fs module

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

async function getGeoJSON(locality) {
  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: locality,
          format: 'json',
          polygon_geojson: 1,
          addressdetails: 1,
        },
      }
    );

    if (response.data.length === 0) {
      throw new Error(`No results found for locality: ${locality}`);
    }

    const geojson = response.data[0].geojson;

    const geojsonFeature = {
      type: 'Feature',
      geometry: geojson,
      properties: {
        name: locality,
      },
    };

    const geojsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [geojsonFeature],
    };

    return geojsonFeatureCollection;
  } catch (error) {
    console.error(`Error fetching GeoJSON data: ${error.message}`);
    throw error;
  }
}

// Function to write GeoJSON data to a text file
function writeGeoJSONToFile(geojsonData) {
  const filePath = 'geojson_data.txt';
  fs.writeFile(filePath, JSON.stringify(geojsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing GeoJSON data to file:', err);
    } else {
      console.log('GeoJSON data written to file successfully.');
    }
  });
}

app.get('/geojson', async (req, res) => {
  const locality = req.query.locality;
  if (!locality) {
    return res.status(400).json({ error: 'Please provide a locality name.' });
  }

  try {
    const geojson = await getGeoJSON(locality);
    writeGeoJSONToFile(geojson); // Write GeoJSON data to file
    res.json(geojson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate GeoJSON.' });
  }
});

// Endpoint to handle writing GeoJSON data to file
app.post('/writeGeoJSON', (req, res) => {
  const geojsonData = req.body.geojsonData;
  if (!geojsonData) {
    return res.status(400).json({ error: 'No GeoJSON data provided.' });
  }

  writeGeoJSONToFile(geojsonData); // Write GeoJSON data to file
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
