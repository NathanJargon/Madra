import React, { useEffect, useState, useRef } from 'react';
import { BackHandler, View, ScrollView, StyleSheet, Dimensions, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as SQLite from 'expo-sqlite';
import { firebase } from './FirebaseConfig';
import { setupDatabase } from './Database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function EarthquakeUpdates({ navigation }) {
  const [earthquakes, setEarthquakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [userLocation, setUserLocation] = useState('Philippines');
  const mapRef = useRef();

    let mapType = "satellite"; // your mapType value

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      })();
    }, []);

    useEffect(() => {
      const backAction = () => {
        navigation.navigate('Home');
        return true; // This will prevent the app from exiting
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove(); // Don't forget to remove the event listener when the component is unmounted
    }, [navigation]);

    if (!mapType) {
      console.warn('mapType was null or undefined, setting it to "standard"');
      mapType = "standard";
    }


    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userEmail = await AsyncStorage.getItem('email'); // Fetch the userEmail
        const doc = await firebase.firestore().collection('users').doc(userEmail).get();
        let timePeriod = doc.data().timePeriod;
        timePeriod = timePeriod && timePeriod.trim();
        console.log(`Time period: '${timePeriod}'`);
        if (!timePeriod) {
          timePeriod = 'all_month'; // Default value if timePeriod is null or empty
        }
        const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${timePeriod}.geojson`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const countries = [userLocation];
        let filteredData = data.features.filter(earthquake =>
          countries.some(country => earthquake.properties.place.includes(country))
        );
        if (initialLoad) {
          filteredData = filteredData.slice(0, 10);
          setInitialLoad(false);
        }
        setEarthquakes(prevEarthquakes => [...prevEarthquakes, ...filteredData]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      const fetchUserCountry = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
          const unsubscribe = firebase.firestore().collection('users').doc(user.email).onSnapshot(async doc => {
            if (doc.exists) {
              const userData = doc.data();
              setUserLocation(userData.country); // Assuming 'country' is a field in your user document
              await fetchData(); // Fetch data after setting the user location
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

return (
  <View style={styles.container}>
    {isLoading ? (
      <>
        <View style={styles.mapContainer, { height: windowHeight * 0.5, }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 12.8797,
              longitude: 121.7740,
              latitudeDelta: 20, // adjust as needed
              longitudeDelta: 20, // adjust as needed
            }}
            showsUserLocation={true} 
          >
          </MapView>
        </View>
        <View style={styles.loadingContainer}>
          <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
        </View>
      </>
    ) : (
        <View style={{...styles.mapContainer, height: windowHeight * 0.5, flex: 1}}>
          <MapView
              provider={PROVIDER_GOOGLE}
              mapType={mapType}
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: 13.41,
                longitude: 122.56,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true} 
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
                mapRef.current.animateToRegion({
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
    backgroundColor: '#00605B',
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
    backgroundColor: '#00605B',
    marginBottom: 2,
    paddingHorizontal: 10,
  },
  smallImage: {
    width: 45, // Adjust the size as needed
    height: 45, // Adjust the size as needed
  },
  boxText: {
    fontSize: windowWidth * 0.03, // Adjust the size as needed
    color: '#FFFFFF',
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