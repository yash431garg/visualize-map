import React, { useState } from 'react';
import MapView, { Polygon } from 'react-native-maps';
// import { h3ToGeoBoundary } from 'h3-js';

const exampleTiles = [
  {
    h3_index: '8928308280fffff',
    point_count: 10,
    boundary: [
      [19.135, 72.925],
      [19.135, 72.935],
      [19.145, 72.935],
      [19.145, 72.925],
      [19.135, 72.925],
    ],
    centroid: [19.140, 72.930],
  },
  {
    h3_index: '8928308280bffff',
    point_count: 20,
    boundary: [
      [19.145, 72.935],
      [19.145, 72.945],
      [19.155, 72.945],
      [19.155, 72.935],
      [19.145, 72.935],
    ],
    centroid: [19.150, 72.940],
  },
  // Add more example tiles as needed
];

const TileMap = () => {
  const [tiles] = useState(exampleTiles);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 19.140,
        longitude: 72.930,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {tiles.map(tile => (
        <Polygon
          key={tile.h3_index}
          coordinates={tile.boundary.map(coord => ({
            latitude: coord[0],
            longitude: coord[1],
          }))}
          fillColor={`rgba(0, 0, 255, ${tile.point_count / 100})`}
          strokeColor="rgba(0, 0, 255, 0.5)"
          onPress={() => {
            alert(`Tile: ${tile.h3_index}\nPoints: ${tile.point_count}\nCentroid: ${tile.centroid}`);
          }}
        />
      ))}
    </MapView>
  );
};

export default TileMap;
