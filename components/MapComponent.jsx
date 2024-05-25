import React, {useState, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';

const MapComponent = () => {
  
    const [tiles, setTiles] = useState();


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
        const apiURL = 'https://v-data.vercel.app/tiles';
        
        fetchData(apiURL).then(data => {
          if (data) {
            const limitedData = data.slice(0, 5000);
            setTiles(limitedData)
            // console.log('Data fetched successfully:',limitedData);
          }
        });
        
      
      }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: tiles?.[0].boundary[0][1],
          longitude: tiles?.[0].boundary[0][0],
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {tiles?.map((item, index) => {
          const polygonCoordinates = item.boundary.map(coord => ({
            latitude: coord[1],
            longitude: coord[0]
          }));

          return (
            <React.Fragment key={item.h3_index}>
              <Polygon
                coordinates={polygonCoordinates}
                strokeWidth={2}
                strokeColor="red"
                fillColor="rgba(255,0,0,0.5)"
                onPress={() => {
                    alert(
                    `Tile: ${item.h3_index}\nPoints: ${item.point_count}\nCentroid: ${item.centroid}`
                    );
                    }}
              />
              {/* <Marker
                coordinate={{
                  latitude: item.centroid[0],
                  longitude: item.centroid[1]
                }}
                title={`Centroid ${index + 1}`}
                description={`h3_index: ${item.h3_index}`}
              /> */}
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
