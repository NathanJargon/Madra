import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Animated } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from './FirebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HazardMapping({ navigation }) {
  const [showMap, setShowMap] = useState(false);
  const [earthquakes, setEarthquakes] = useState([]);
  const [userCountry, setUserCountry] = useState('Philippines');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Add this line
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const getCircleColor = (magnitude) => {
    if (magnitude < 2.5) {
      return 'green';
    } else if (magnitude < 5) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  const handleEarthquakeClick = (earthquake) => {
    setSelectedEarthquake(earthquake);
    mapRef.current.animateToRegion({
      latitude: earthquake.geometry.coordinates[1],
      longitude: earthquake.geometry.coordinates[0],
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };


  const fetchData = () => {
    if (userCountry) {
      fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
        .then(response => response.json())
        .then(data => {
          const filteredEarthquakes = data.features.filter(earthquake => earthquake.properties.place.includes(userCountry));
          setEarthquakes(filteredEarthquakes);
        });
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [userCountry]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('email');
        const userCountry = await AsyncStorage.getItem('country');
  
        if (userEmail) setUserEmail(userEmail);
        if (userCountry) setUserCountry(userCountry);
      } catch (e) {
        console.error('Failed to load user data from storage.', e);
      }
    };
  
    loadUserData();
  }, []);
  
  useEffect(() => {
    const fetchUserCountry = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const unsubscribe = firebase.firestore().collection('users').doc(user.email).onSnapshot(doc => {
          if (doc.exists) {
            const userData = doc.data();
            setUserEmail(userData.email);
            setUserCountry(userData.country); // Assuming 'country' is a field in your user document
            fetchData(); // Fetch data after setting the user location
          } else {
            console.log('No such document!');
          }
        }, error => {
          console.log('Error getting document:', error);
        });

        // Clean up the onSnapshot listener when the component is unmounted
        return () => unsubscribe();
      } else {
        console.log('No user is logged in');
      }
    };

    fetchUserCountry();
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
          <>
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
                  fillColor={getCircleColor(earthquake.properties.mag)} // fill color
                />
              ))}
            </MapView>


          <View style={styles.infoBox}>
            <ScrollView>
              {selectedEarthquake && (
                <>
                  <Text>Magnitude: {selectedEarthquake.properties.mag}</Text>
                  <Text>Time: {new Date(selectedEarthquake.properties.time).toString()}</Text>
                </>
              )}
              {earthquakes.map((earthquake, index) => (
                <TouchableOpacity key={index} onPress={() => handleEarthquakeClick(earthquake)}>
                  <Text>{earthquake.properties.title}</Text>
                  <Text></Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>


          </>
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
    </View>
  );
}


const styles = StyleSheet.create({
  infoBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: windowWidth * 0.3, // adjust as needed
    height: windowHeight * 0.25, // adjust as needed
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