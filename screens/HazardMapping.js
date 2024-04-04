import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Animated } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
  const [selectedEarthquakeIndex, setSelectedEarthquakeIndex] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [displayedEarthquakes, setDisplayedEarthquakes] = useState([]);

  useEffect(() => {
  if (selectedMarkerIndex !== null) {
    setDisplayedEarthquakes([earthquakes[selectedMarkerIndex]]);
  } else {
    setDisplayedEarthquakes(earthquakes);
  }
}, [earthquakes, selectedMarkerIndex]);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      mapRef.current.fitToCoordinates([{ latitude: 13.41, longitude: 122.56 }], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  }, [mapReady]);


  const getCircleColor = (magnitude) => {
    if (magnitude < 2.5) {
      return 'rgba(0, 128, 0, 0.5)';
    } else if (magnitude < 5) {
      return 'rgba(255, 255, 0, 0.5)';
    } else {
      return 'rgba(255, 0, 0, 0.5)';
    }
  };

  const handleEarthquakeClick = (earthquake, index) => {
    setSelectedEarthquake(earthquake);
    setSelectedEarthquakeIndex(index);
    console.log('Earthquake:', earthquake);
    console.log('Index:', index);
    setTimeout(() => {
      setSelectedEarthquakeIndex(null);
    }, 5000);
    mapRef.current.animateToRegion({
      latitude: earthquake.geometry.coordinates[1],
      longitude: earthquake.geometry.coordinates[0],
      latitudeDelta: 5,
      longitudeDelta: 5,
    });
  };

  const filteredEarthquakes = useMemo(() => {
    return earthquakes.filter(earthquake => earthquake.properties.place.includes(userCountry));
  }, [earthquakes, userCountry]);

  let mapType = "satellite"; // your mapType value

  if (!mapType) {
    console.warn('mapType was null or undefined, setting it to "standard"');
    mapType = "standard";
  }

  const fetchData = async () => {
    if (userCountry) {
      setIsLoading(true); // Set loading to true when starting to fetch data
      const userEmail = await AsyncStorage.getItem('email'); // Fetch the userEmail
      const doc = await firebase.firestore().collection('users').doc(userEmail).get();
      let timePeriod = doc.data().timePeriod;
      timePeriod = timePeriod && timePeriod.trim();
      console.log(`Time period: '${timePeriod}'`);
      if (!timePeriod) {
        timePeriod = 'all_week'; // Default value if timePeriod is null or empty
      }
      let url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timePeriod}.geojson`;
      console.log(url);
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const filteredEarthquakes = data.features.filter(earthquake => earthquake.properties.place.includes(userCountry));
          setEarthquakes(filteredEarthquakes);
          setIsLoading(false); // Set loading to false when data is fetched
        });
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000 * 30);

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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/arrow_back.png')} style={styles.backImage} />
      </TouchableOpacity>
      <Animated.View style={[styles.container, { opacity: 1 }]}>
        {isLoading ? (
          <ImageBackground source={require('../assets/bg1.png')} style={styles.loadingContainer}>
            <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
          </ImageBackground>
      ) : (
          <>
              <MapView
                provider={PROVIDER_GOOGLE}
                mapType={mapType}
                ref={mapRef}
                onLayout={() => setMapReady(true)}
                style={{ flex: 1, width: '100%', height: '100%', }}
                initialRegion={{
                  latitude: 12.8797,
                  longitude: 121.7740,
                  latitudeDelta: 20, // adjust as needed
                  longitudeDelta: 20, // adjust as needed
                }}
              >
              {displayedEarthquakes.map((earthquake, index) => (
                <View key={index}>
                  <Marker
                    coordinate={{
                      latitude: earthquake.geometry.coordinates[1],
                      longitude: earthquake.geometry.coordinates[0],
                    }}
                    onPress={() => handleEarthquakeClick(earthquake, index)}
                    pinColor={selectedEarthquakeIndex === null ? 'red' : (index === selectedEarthquakeIndex ? 'red' : 'white')}
                  />
                  <Circle
                    center={{
                      latitude: earthquake.geometry.coordinates[1],
                      longitude: earthquake.geometry.coordinates[0],
                    }}
                    radius={(earthquake.properties.mag + 1) * 10000}
                    strokeColor={selectedEarthquakeIndex === null ? '#000' : (index === selectedEarthquakeIndex ? '#000' : 'white')}
                    fillColor={selectedEarthquakeIndex === null ? getCircleColor(earthquake.properties.mag) : (index === selectedEarthquakeIndex ? getCircleColor(earthquake.properties.mag) : 'white')}
                  />
                </View>
              ))}
            </MapView>

            <ImageBackground source={require('../assets/bg1.png')} style={styles.infoBox}>
              <ScrollView>
                {selectedEarthquake && (
                  <>
                  </>
                )}
                {earthquakes.map((earthquake, index) => (
                    <TouchableOpacity key={index} onPress={() => handleEarthquakeClick(earthquake, index)}>
                      <Text style={styles.infoText}>{earthquake.properties.title}</Text>
                      <Text></Text>
                    </TouchableOpacity>
                ))}
              </ScrollView>
            </ImageBackground>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  infoText: {
    color: 'white',
    fontFamily: 'glacial-indifference-regular',
  },
  loadingImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  backImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  infoBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: windowWidth * 0.3, // adjust as needed
    height: windowHeight * 0.3, // adjust as needed
    backgroundColor: 'white', // change as needed
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
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