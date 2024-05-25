const express = require('express');
const bodyParser = require('body-parser');
const {
  getTileData,
  addTileData,
  removeTileData,
  readData,
} = require('./dataStore');

const app = express();
const port = 6000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world!' });
});


// Get all data
app.get('/tiles', (req, res) => {
  const allData = readData();
  res.json(allData);
});

// Get data by H3 tile
app.get('/tile/:h3', (req, res) => {
  const h3 = req.params.h3;
  res.json(getTileData(h3));
});

// Add data to a tile
app.post('/tile/:h3', (req, res) => {
  const h3 = req.params.h3;
  const data = req.body.data;
  addTileData(h3, data);
  res.status(201).send('Data added');
});

// Remove data from a tile
app.delete('/tile/:h3', (req, res) => {
  const h3 = req.params.h3;
  removeTileData(h3);
  res.send('Data removed');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
