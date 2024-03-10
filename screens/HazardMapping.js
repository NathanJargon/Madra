import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Animated } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { firebase } from './FirebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HazardMapping({ navigation }) {
  const [showMap, setShowMap] = useState(false);
  const [earthquakes, setEarthquakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Add this line
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);

  const handleEarthquakeClick = (earthquake) => {
    setSelectedEarthquake(earthquake);
    mapRef.current.animateToRegion({
      latitude: earthquake.geometry.coordinates[1],
      longitude: earthquake.geometry.coordinates[0],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

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

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([{ latitude: 13.41, longitude: 122.56 }], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [mapRef]);

  useEffect(() => {
    const getShowMap = async () => {
      const storedShowMap = await AsyncStorage.getItem('showMap');
      setShowMap(storedShowMap === 'true');
    };
    getShowMap();
  }, []);

  useEffect(() => {
    if (showMap) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      }).start();
    }
  }, [showMap]);

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true
    }).start(async () => {
      setShowMap(true);
      await AsyncStorage.setItem('showMap', 'true');
    });
  };

return (
  <View style={styles.container}>
    <Animated.View style={[styles.container, { opacity: 1 }]}>
      {showMap ? (
        <MapView
            mapType="satellite"
            ref={mapRef}
            onLayout={() => console.log('Map has been laid out')}
            style={{ flex: 1, width: '100%', height: '100%', }}
            initialRegion={{
              latitude: 12.8797,
              longitude: 121.7740,
              latitudeDelta: 20, // adjust as needed
              longitudeDelta: 20, // adjust as needed
            }}
          >
            {earthquakes.map((earthquake, index) => (
              <Circle
                key={index}
                center={{
                  latitude: earthquake.geometry.coordinates[1],
                  longitude: earthquake.geometry.coordinates[0],
                }}
                radius={(earthquake.properties.mag + 1) * 10000} // Adjust the scaling factor as needed
                strokeColor={'#000'} // border color
                fillColor={'rgba(255,0,0,0.5)'} // fill color
              />
            ))}
        </MapView>
        ) : (
          <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
            <View style={styles.boxContainer}>
              <Text style={styles.boxTitle}>HAZARD MAP</Text>
              <ImageBackground source={require('../assets/hazardImage.png')} style={styles.box}>
              </ImageBackground>
              <TouchableOpacity style={styles.proceedButton} onPress={fadeOut}>
                <Text style={styles.proceedButtonText}>ASSESS VULNERABILITY</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      </Animated.View>
      <View style={styles.infoBox}>
        {selectedEarthquake && (
          <>
            <Text>Magnitude: {selectedEarthquake.properties.mag}</Text>
            <Text>Time: {new Date(selectedEarthquake.properties.time).toString()}</Text>
          </>
        )}
        {earthquakes.map((earthquake, index) => (
          <TouchableOpacity key={index} onPress={() => handleEarthquakeClick(earthquake)}>
            <Text>{earthquake.properties.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
  </View>
);
}


const styles = StyleSheet.create({
  infoBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 200, // adjust as needed
    height: 300, // adjust as needed
    backgroundColor: 'white', // change as needed
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
boxContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  boxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%', // Adjust the width as needed
  },
  box: {
    width: windowWidth * 0.8, // Adjust the width as needed
    height: windowHeight * 0.4, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
      borderRadius: 20,
      overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  boxTitle: {
    fontSize: windowWidth * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  proceedButton: {
    width: '80%',
    height: '10%',
    margin: windowWidth * 0.05,
    backgroundColor: '#318E99',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  headerBox: {
    width: '100%', // Full width
    height: windowHeight * 0.175, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    borderColor: '#318E99',
    borderBottomWidth: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
      padding: 30,
    },
  backArrow: {
    width: windowWidth * 0.05,
    height: windowHeight * 0.05,
    resizeMode: 'contain',
    marginRight: windowWidth * 0.02,
  },
  headerText: {
    fontSize: windowWidth * 0.035,
    color: '#000',
  },
  bottomContainer: {
    width: windowWidth, // Full width
    height: '100%', // Adjust the height as needed
  },
});