import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { h3ToGeoBoundary, h3ToGeo } from 'h3-js';

const TileMap = () => {
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:6000/tiles')
      .then((response) => response.json())
      .then((data) => {
        // Process data to match the required format
        const processedTiles = Object.keys(data).map((h3_index) => ({
          h3_index,
          point_count: data[h3_index].length,
          boundary: h3ToGeoBoundary(h3_index).map((coord) => ({
            latitude: coord[0],
            longitude: coord[1],
          })),
          centroid: h3ToGeo(h3_index),
        }));
        setTiles(processedTiles);
      })
      .catch((error) => console.error('Error fetching tiles:', error));
  }, []);

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
        <React.Fragment key={tile.h3_index}>
          <Polygon
            coordinates={tile.boundary}
            fillColor={`rgba(0, 0, 255, ${tile.point_count / 100})`}
            strokeColor="rgba(0, 0, 255, 0.5)"
            tappable
            onPress={() => {
              Alert.alert(
                `Tile Info`,
                `H3 Index: ${tile.h3_index}\nPoints: ${tile.point_count}\nCentroid: (${tile.centroid[0]}, ${tile.centroid[1]})`
              );
            }}
          />
          <Marker
            coordinate={{
              latitude: tile.centroid[0],
              longitude: tile.centroid[1],
            }}
            title={`Tile: ${tile.h3_index}`}
            description={`Points: ${tile.point_count}`}
          />
        </React.Fragment>
      ))}
    </MapView>
  );
};

export default TileMap;
