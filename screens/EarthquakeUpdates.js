import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as SQLite from 'expo-sqlite';
import { firebase } from './FirebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function EarthquakeUpdates() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Add this line

  const database_name = 'Test.db';
  const db = SQLite.openDatabase(database_name);

  const fetchData = () => {
    setIsLoading(true);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT country FROM Users WHERE id = ?',
        [1],
        (_, { rows }) => {
          let userCountry = 'Philippines';
          if (rows.length > 0 && rows.item(0).country) {
            userCountry = rows.item(0).country;
          }
          fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
            .then(response => response.text())
            .then(text => {
              try {
                const data = JSON.parse(text);
                const countries = [userCountry];
                let filteredData = data.features.filter(earthquake =>
                  countries.some(country => earthquake.properties.place.includes(country))
                );
                if (initialLoad) {
                  filteredData = filteredData.slice(0, 10);
                  setInitialLoad(false);
                }
                setEarthquakes(prevEarthquakes => [...prevEarthquakes, ...filteredData]);
              } catch (error) {
                console.error('Error parsing JSON:', error);
              } finally {
                setIsLoading(false);
              }
            })
            .catch(error => {
              console.error(error);
              setIsLoading(false);
            });
        },
        (_, error) => {
          console.log('Error fetching user country:', error);
          setIsLoading(false);
        }
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, []);


    useEffect(() => {
      const user = firebase.auth().currentUser;
      if (user) {
        const userEmail = user.email;
        const db = initDB();
        db.transaction(tx => {
          tx.executeSql(
            'SELECT country FROM Users WHERE email = ?',
            [userEmail],
            (_, { rows }) => {
              if (rows.length > 0 && rows.item(0).country) {
                console.log('The logged email exists in the database');
                const userCountry = rows.item(0).country;
                // You can now use userCountry for your needs
              } else {
                console.log('The logged email does not exist in the database');
              }
            },
            (_, error) => console.log('Error fetching data:', error)
          );
        });
      } else {
        console.log('No user is logged in');
      }
    }, []);

return (
  <View style={styles.container}>
    {isLoading ? (
      <>
        <View style={styles.mapContainer, { height: windowHeight * 0.5, }}>
          <MapView
            ref={map => this.map = map}
            style={styles.map}
            initialRegion={{
              latitude: 12.8797,
              longitude: 121.7740,
              latitudeDelta: 20, // adjust as needed
              longitudeDelta: 20, // adjust as needed
            }}
          >
          </MapView>
        </View>
        <View style={styles.loadingContainer}>
          <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
        </View>
      </>
    ) : (
      <View style={styles.mapContainer}>
            <MapView
              mapType="satellite"
              ref={map => this.map = map}
              style={styles.map}
              initialRegion={{
                latitude: 13.41,
                longitude: 122.56,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
          {earthquakes.map((earthquake, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: earthquake.geometry.coordinates[1],
                longitude: earthquake.geometry.coordinates[0],
              }}
              title={earthquake.properties.title}
            />
          ))}
        </MapView>
        <ScrollView
          style={styles.scrollView}
          onEndReached={fetchData}
          onEndReachedThreshold={0.1}
        >
          {earthquakes.map((earthquake, index) => {
            const earthquakeTime = new Date(earthquake.properties.time);
            return (
              <TouchableOpacity key={index} onPress={() => {
                this.map.animateToRegion({
                  latitude: earthquake.geometry.coordinates[1],
                  longitude: earthquake.geometry.coordinates[0],
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
                  }}>
                    <View style={index === 0 ? styles.firstBox : styles.box}>
                      <Image source={require('../assets/icons/realroundlogo.png')} style={styles.smallImage} />
                      <View>
                        <Text style={styles.boxText}>{earthquake.properties.title}</Text>
                        <Text style={styles.boxText}>{earthquakeTime.toString()}</Text>
                      </View>
                      <Image source={require('../assets/icons/forward.png')} style={styles.forwardImage} />
                    </View>
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
      </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1, 
    width: windowWidth,
  },
  scrollView: {
    flex: 0.45,
  },
  firstBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: windowHeight * 0.1,
    backgroundColor: 'white',
    marginBottom: 2,
    paddingHorizontal: 10,
    borderTopWidth: 15,
    borderColor: '#318E99'
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: windowHeight * 0.08,
    backgroundColor: 'white',
    marginBottom: 2,
    paddingHorizontal: 10,
  },
  smallImage: {
    width: 45, // Adjust the size as needed
    height: 45, // Adjust the size as needed
  },
  boxText: {
    fontSize: windowWidth * 0.03, // Adjust the size as needed
    color: 'black', // Change the color as needed
  },
  forwardImage: {
    width: 20, // Adjust the size as needed
    height: 20, // Adjust the size as needed
  },
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
loadingImage: {
  width: 100,
  height: 100,
},
});