const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'dataStore.json');

const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

let dataStore = readData();

const getTileData = (h3) => {
  return dataStore[h3] || [];
};

const addTileData = (h3, data) => {
  if (!dataStore[h3]) dataStore[h3] = [];
  dataStore[h3].push(data);
  writeData(dataStore);
};

const removeTileData = (h3) => {
  dataStore[h3] = [];
  writeData(dataStore);
};

module.exports = {
  readData,
  getTileData,
  addTileData,
  removeTileData,
};
