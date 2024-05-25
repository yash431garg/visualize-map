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
// console.log(dataStore)

const getTileData = (h3) => {
  const data = dataStore.filter(obj => obj.h3_index === h3);
  return data.length > 0 ? data[0] : [];
};


// const addTileData = (h3, data) => {
//   if (!dataStore[h3]) dataStore[h3] = [];
//   dataStore[h3].push(data);
//   writeData(dataStore);
// };

const removeTileData = (h3) => {
  const index = dataStore.findIndex(obj => obj.h3_index === h3);
  console.log(index)
  if (index !== -1) {
    dataStore.splice(index, 1);
    writeData(dataStore);
  }
};

module.exports = {
  readData,
  getTileData,
  removeTileData,
};
