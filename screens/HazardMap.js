import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, PermissionsAndroid } from 'react-native';
import EarthquakeUpdates from './EarthquakeUpdates';
import HazardMapping from './HazardMapping';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HazardMap() {
  const [showBox, setShowBox] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const navigation = useNavigation();
  
  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    
    if (!granted) {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        setLocationEnabled(true);
        await AsyncStorage.setItem('locationPermissionGranted', 'true'); // Store the flag
        navigation.navigate('Feature', { screen: 'HazardMapping' });
        setAllowed(true);
      } else {
        setLocationEnabled(false);
      }
    } else {
      setLocationEnabled(true);
      await AsyncStorage.setItem('locationPermissionGranted', 'true'); // Store the flag
      navigation.navigate('Feature', { screen: 'HazardMapping' });
      setAllowed(true);
    }
  };
  
  const checkPermission = async () => {
    const locationPermissionGranted = await AsyncStorage.getItem('locationPermissionGranted'); // Retrieve the flag
  
    if (locationPermissionGranted === 'true') {
      setLocationEnabled(true);
    } else {
      checkLocationPermission();
    }
  };
  
  useEffect(() => {
    checkPermission();
  }, []);

  // Remove this useFocusEffect hook
  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (locationEnabled) {
  //       navigation.navigate('Feature', { screen: 'HazardMapping' });
  //     }
  //   }, [locationEnabled])
  // );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/mapTop.png')} style={styles.screenContainer}>
        {showBox ? (
          <View style={styles.bottomBox}>
            <Image source={require('../assets/icons/place.png')} style={styles.image} />
            <Text style={styles.text}>HAZARD MAPPING</Text>
            <Text style={styles.subtext}>MADRA will analytically assess range of earthquake magntitudes</Text>
            <TouchableOpacity style={styles.button1} onPress={() => {setShowBox(true); checkLocationPermission();}}>
              <Text style={styles.buttonText1}>ASSESS VULNERABILITY</Text>
            </TouchableOpacity>
          </View>
        ) : locationEnabled ? (
          <Text>Location enabled, navigating to HazardMapping...</Text>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Location services are not enabled. Please enable them to view the map.</Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBox: {
    position: 'absolute', // Position the box
    bottom: 0, // Align the box to the bottom
    width: '100%', // Full width
    height: windowHeight * 0.4, // Adjust the height as needed
    backgroundColor: '#FFFFFF', // Change the color as needed
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
    borderTopLeftRadius: 30, // Add rounded corners to the top left
    borderTopRightRadius: 30, // Add rounded corners to the top right
    borderColor: '#318E99',
    borderTopWidth: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden'
  },
  image: {
    width: windowWidth * 0.45, // Adjust as needed
    height: windowHeight * 0.125, // Adjust as needed
    marginTop: windowHeight * 0.01,
    resizeMode: 'contain',
  },
  text: {
    fontSize: windowWidth * 0.065, // Adjust as needed
    fontWeight: 'bold', // Adjust as needed
    textAlign: 'center',
    marginVertical: 10, // Adjust as needed
  },
  subtext: {
    fontSize: windowWidth * 0.035, // Adjust as needed
    textAlign: 'center',
    marginBottom: 20, // Adjust as needed
  },
  button1: {
    backgroundColor: '#318E99', // Change the color as needed
    height: "12%",
    width: "90%",
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center', // Center items vertically
  },
  button2: {
    height: "12%",
    width: "90%",
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: windowHeight * 0.015,
    justifyContent: 'center', // Center items vertically
  },
  buttonText1: {
    color: 'white', // Change the color as needed
    fontWeight: 'bold', // Adjust as needed
  },
  buttonText2: {
    color: 'black', // Change the color as needed
    fontWeight: 'bold', // Adjust as needed
  },
});