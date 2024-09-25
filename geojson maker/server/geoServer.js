//GeoServer.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rYhz1X@1',
  database: 'smart_logistics',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database.');
  }
});

app.get('/getMarkers', (req, res) => {
  const sql = 'SELECT * FROM `master_routing_locations`';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

app.post('/insert', (req, res) => {
  const { OID, Geo_json, LocationName } = req.body;
  const sql = 'INSERT INTO `master_routing_locations` (OID, Geo_json, LocationName) VALUES (?, ?, ?)';
  db.query(sql, [OID, Geo_json, LocationName], (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'geoJson created successfully',
      userId: result.insertId,
    });
  });
});

app.put('/update', (req, res) => {
  const { LocationId, geo_json, locationname } = req.body;
  console.log('Received update request:', { LocationId, geo_json, locationname });

  const query = 'UPDATE master_routing_locations SET Geo_json = ?, LocationName = ? WHERE LocationId = ?';
  db.query(query, [geo_json, locationname, LocationId], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Error updating data');
    } else {
      console.log('Update result:', result);
      if (result.affectedRows === 0) {
        res.status(404).send('No rows updated');
      } else {
        res.send('Data updated successfully');
      }
    }
  });
});




app.get('/locationNames', (req, res) => {
  const sql = 'SELECT DISTINCT LocationName FROM `master_routing_locations`';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

app.get('/locations', (req, res) => {
  const query = 'SELECT LocationId, OID, LocationName FROM master_routing_locations';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      res.status(500).send('Error fetching locations');
    } else {
      res.status(200).json(results);
    }
  });
});


app.get('/oidsByLocationName', (req, res) => {
  const { locationName } = req.query;
  const sql = 'SELECT OID FROM `master_routing_locations` WHERE LocationName = ?';
  db.query(sql, [locationName], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
