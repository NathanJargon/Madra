import React, { useEffect, useState } from 'react';
import MapView, { Circle } from 'react-native-maps';

export default function MapUtil() {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson')
      .then(response => response.json())
      .then(data => setEarthquakes(data.features));
  }, []);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: -33.865427,
        longitude: 151.196123,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {earthquakes.map((quake) => (
        <Circle
          key={quake.id}
          center={{
            latitude: quake.geometry.coordinates[1],
            longitude: quake.geometry.coordinates[0],
          }}
          radius={quake.properties.mag * 10000}
          fillColor="rgba(255,0,0,0.2)"
          strokeColor="rgba(255,255,255,0.5)"
        />
      ))}
    </MapView>
  );
}