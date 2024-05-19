import React, { useState, useEffect } from 'react';
import MapView, { Polygon } from 'react-native-maps';
// import { h3ToGeoBoundary } from 'h3-js';
// import dataStore from '../../'

const exampleTiles = [
  {
    h3_index: '876cd509effffff',
    point_count: 1,
    boundary: [
      [-98.79140189335327, 0.004776890402165126],
      [-98.79950795817176, -0.005703390744686303],
      [-98.79496272384904, -0.01768582553386822],
      [-98.78230989034097, -0.019188269526569275],
      [-98.77420275079145, -0.008706767505227364],
      [-98.77874951926755, 0.0032759574710647236],
      [-98.79140189335327, 0.004776890402165126],
    ],
    centroid: [-0.0072049837306055265, -98.78685615975664],
  },
  {
    h3_index: '87754e64dffffff',
    point_count: 1,
    boundary: [
      [0.011068641252733968, 0.0040366078429530956],
      [0.012918798977731558, 0.0155588830203374],
      [0.004938607301423723, 0.02183459408696617],
      [-0.004890221433452032, 0.01658960380044516],
      [-0.00674069517984491, 0.0050694082359001805],
      [0.0012379756529081653, -0.0012078765229775557],
      [0.011068641252733968, 0.0040366078429530956],
    ],
    centroid: [0.010313775838641999, 0.0030883583888293054],
  },
];


const TileMap = () => {
  const [tiles, setTiles] = useState(exampleTiles);


useEffect(()=> {
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  // Example usage:
  const apiURL = 'https://e009-49-37-249-165.ngrok-free.app/tiles';
  
  fetchData(apiURL).then(data => {
    if (data) {
      setTiles(data)
      console.log('Data fetched successfully:', data);
    }
  });
  

}, [])

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 19.14,
        longitude: 72.93,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {tiles.map((tile) => (
        <Polygon
          key={tile.h3_index}
          coordinates={tile.boundary.map((coord) => ({
            latitude: coord[0],
            longitude: coord[1],
          }))}
          fillColor={`rgba(0, 0, 255, ${tile.point_count / 100})`}
          onPress={() => {
            alert(
              `Tile: ${tile.h3_index}\nPoints: ${tile.point_count}\nCentroid: ${tile.centroid}`
            );
          }}
        />
      ))}
    </MapView>
  );
};

export default TileMap;
