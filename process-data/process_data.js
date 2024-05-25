const fs = require('fs');
const csv = require('csv-parser');
const h3 = require('h3-js');

// Function to convert hex to latitude and longitude
function hexToLatLng(hexStr) {
  const buffer = Buffer.from(hexStr.replace(/\s/g, ''), 'hex');
  const lat = buffer.readDoubleBE(0);
  const lng = buffer.readDoubleBE(8);
  return [lat, lng];
}

// Function to safely parse JSON-like strings
function safeJsonParse(str) {
  try {
    const jsonString = str
      .replace(/=/g, ':')
      .replace(/'/g, '"')
      .replace(/([a-zA-Z0-9_]+)(:)/g, '"$1"$2');
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON string:', str);
    return {};
  }
}

// Read and process the CSV data
const results = [];
fs.createReadStream('mumbai_map_data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // console.log(results, 'Results');
    // Clean and process data
    const cleanedData = results
      .map((row) => {
        try {
          const [lat, lng] = hexToLatLng(row.geometry);
          // console.log(lat, lng);

          return {
            id: row.id,
            lat: lat,
            lng: lng,
            names: safeJsonParse(row.names),
            addresses: safeJsonParse(row.addresses),
            categories: safeJsonParse(row.categories),
            h3_index: h3.latLngToCell(lat, lng, 7),
          };
        } catch (error) {
          console.error('Error processing row:', row, error);
          return null; // Return null for rows with errors
        }
      })
      .filter((row) => row !== null); // Remove null rows

    // console.log(cleanedData, 'data');
    // Group by H3 index to aggregate points
    const tileMap = cleanedData.reduce((acc, row) => {
      if (!acc[row.h3_index]) {
        acc[row.h3_index] = {
          h3_index: row.h3_index,
          point_count: 0,
          boundary: h3.cellToBoundary(row.h3_index, true),
          centroid: h3.cellToLatLng(row.h3_index),
        };
      }
      acc[row.h3_index].point_count += 1;
      return acc;
    }, {});

    const tileArray = Object.values(tileMap);
    // console.log(tileArray);

    // Save the result
    fs.writeFileSync('dataStore.json', JSON.stringify(tileArray, null, 2));
    // console.log('Data processing complete. Results saved to file.');

    // Exit the process
    process.exit(0);
  });
