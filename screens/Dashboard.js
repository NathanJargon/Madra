import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, TextInput, Platform } from 'react-native';
import { setupDatabase } from './Database';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as SQLite from 'expo-sqlite';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { UserContext } from '../UserContext';
import Constants from 'expo-constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

 async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (token !== undefined && token.data !== undefined) {
    return token.data;
  } else {
    console.log('Failed to get token data for push notification');
    return;
  }
}


export default function Dashboard() {
  const { info, setInfo } = useContext(UserContext);
  const [username, setUsername] = useState('USER');
  const [fullName, setFullName] = useState('LOADING...');
  const [userEmail, setUserEmail] = useState(null);
  const [userCountry, setUserCountry] = useState("Philippines");
  const [earthquakes, setEarthquakes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [minMagnitude, setMinMagnitude] = useState('');
  const [timePeriod, setTimePeriod] = useState('all_day');
  const [isNotified, setIsNotified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
    const [imageUri , setImageUri] = useState(null);
  const navigation = useNavigation();
  const clearNotifications = () => {
    setEarthquakes([]);
  };
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notifiedEarthquakeIds, setNotifiedEarthquakeIds] = useState([]);


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

    useEffect(() => {
      const loadUserData = async () => {
        try {
          const userFullName = await AsyncStorage.getItem('fullName');
          if (info.fullName) {
            setFullName(info.fullName);
          } else if (userFullName) {
            setFullName(userFullName);
          } else {
            setFullName('user');
          }
        } catch (e) {
          console.error('Failed to load user data from storage.', e);
        }
      };

      loadUserData();
    }, [info]);


  const handleSearch = () => {
    const filteredEarthquakes = earthquakes.filter(earthquake => earthquake.properties.title.includes(searchTerm));
    setEarthquakes(filteredEarthquakes);
  };

    const sendNotification = async (earthquakeData) => {
      console.log('Earthquake Data for Notification:', earthquakeData);
      const trigger = { seconds: 2, repeats: false };
      const content = {
        title: 'New Earthquake Alert!',
        body: `A magnitude ${earthquakeData.properties.mag} earthquake has occurred at ${earthquakeData.properties.place}.`,
        data: { data: earthquakeData },
      };

      await Notifications.scheduleNotificationAsync({ content, trigger });
    };

    const fetchData = async () => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        const doc = await firebase.firestore().collection('users').doc(user.email).get();
        const userData = doc.data();
        console.log('User Data:', userData);
        if (userData.isNotified) {
          if (userCountry) {
            fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`) // Changed timePeriod to 'all_hour'
              .then(response => response.json())
              .then(data => {
                const filteredEarthquakes = data.features.filter(earthquake => earthquake.properties.place.includes(userCountry));
                const newEarthquakes = filteredEarthquakes.filter(earthquake => !notifiedEarthquakeIds.includes(earthquake.id));
                setEarthquakes(filteredEarthquakes);
                // Send a notification for each new earthquake
                newEarthquakes.forEach(earthquake => sendNotification(earthquake));
                // Update the list of notified earthquake IDs
                setNotifiedEarthquakeIds(notifiedEarthquakeIds.concat(newEarthquakes.map(earthquake => earthquake.id)));
              });
          }
        }
      }
    };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('email');
        const userName = await AsyncStorage.getItem('username');
        const userFullName = await AsyncStorage.getItem('fullName');
        const userCountry = await AsyncStorage.getItem('country');
        const userMinMagnitude = await AsyncStorage.getItem('minMagnitude');
        const userTimePeriod = await AsyncStorage.getItem('timePeriod');
        const userIsNotified = await AsyncStorage.getItem('isNotified');
      const imageUri = await AsyncStorage.getItem('imageUri');

        if (userEmail) setUserEmail(userEmail);
        if (userName) setUsername(userName);
        if (userFullName) setFullName(userFullName);
        if (userCountry) setUserCountry(userCountry);
        if (userMinMagnitude) setMinMagnitude(userMinMagnitude);
        if (userTimePeriod) setTimePeriod(userTimePeriod);
        if (userIsNotified) setIsNotified(userIsNotified);
      } catch (e) {
        console.error('Failed to load user data from storage.', e);
      }
    };
  
    loadUserData();
  }, []);
  
  useEffect(() => {
    const user = firebase.auth().currentUser;
  
    if (user != null) {
      setUserEmail(user.email);
      const unsubscribe = firebase.firestore().collection('users').doc(user.email).onSnapshot(async doc => {
        if (doc.exists) {
          const userData = doc.data();
          setUsername(userData.username);
          setFullName(userData.fullName);
          setUserCountry(userData.country);
          setMinMagnitude(userData.minMagnitude);
          setTimePeriod(userData.timePeriod);
          setIsNotified(userData.isNotified);
            const userImageUri = userData.imageUri;
            if (userImageUri) {
              setImageUri(userImageUri);
            }

          // Save the user data to AsyncStorage
        await AsyncStorage.setItem('imageUri', userData.imageUri);
          await AsyncStorage.setItem('email', userData.email);
          await AsyncStorage.setItem('username', userData.username);
          await AsyncStorage.setItem('fullName', userData.fullName);
          await AsyncStorage.setItem('country', userData.country);
          await AsyncStorage.setItem('timePeriod', userData.timePeriod || 'all_day');
          await AsyncStorage.setItem('isNotified', userData.isNotified ? 'true' : 'false');
          await AsyncStorage.setItem('minMagnitude', userData.minMagnitude || '5.0');
        }
      }, error => {
        console.error("Error getting document:", error);
      });
  
      // Clean up the onSnapshot listener when the component is unmounted
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [timePeriod, userCountry]);
  
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/head.png')} style={styles.imageTextContainer}>
        <Image source={imageUri ? { uri: imageUri } : require('../assets/icons/profilelogo.png')} style={styles.profileLogo} />
        <View style={styles.textContainer}>
          <Text style={styles.rightText}>HI {fullName}!</Text>
          <Text style={styles.rightSmallText}>MADRA: YOUR PARTNER FOR LIFE</Text>
        </View>
      </ImageBackground>
      
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Features')}>
            <View style={styles.inputContainer}>
                  <Image source={require('../assets/icons/search.png')} style={styles.sendIcon} />
                      <Text style={styles.input}>MADRA IS HERE TO HELP</Text>
                  <Image source={require('../assets/icons/send.png')} style={styles.sendIcon} />
            </View>
        </TouchableOpacity>

        <View style={styles.imageBox}>
          <Image source={require('../assets/image1.png')} style={styles.boxImage} />
          <Image source={require('../assets/image2.png')} style={styles.boxImage} />
          <Image source={require('../assets/image3.png')} style={styles.boxImage} />
        </View>
        <View style={styles.transparentBox}>
            <ScrollView>
                {earthquakes && earthquakes.length > 0 && earthquakes.map((earthquake, index) => (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('Map', { earthquake })}>
                    <View style={styles.innerBox}>
                      <Image source={require('../assets/icons/round-logo.png')} style={styles.innerBoxImage} />
                      <Text style={styles.innerBoxText}>YOU HAVE A MADRAFICATION!</Text>
                      <View style={styles.bottomLine} />
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
            {earthquakes && earthquakes.length > 0 && (
                <View style={styles.clearAllBox}>
                    <TouchableOpacity onPress={clearNotifications}>
                      <Text style={styles.clearAllText}>CLEAR ALL</Text>
                    </TouchableOpacity>
                </View>
          )}

      </ImageBackground>

        <TouchableOpacity
          style={styles.touchableArea}
          onPress={() => navigation.navigate('Settings')}
        >
          <Image source={require('../assets/icons/notif.png')} style={styles.fixedImage} />
        </TouchableOpacity>


        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <ImageBackground source={require('../assets/bg1.png')} style={{width: '100%', height: '100%'}}>
            <View style={styles.fullScreenView}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.enhancedTopInput}
                  placeholder="Search earthquakes..."
                  value={searchTerm}
                  onChangeText={text => setSearchTerm(text)}
                />
                <TouchableOpacity onPress={handleSearch}>
                  <Image source={require('../assets/icons/send.png')} style={styles.sendIcon1} />
                </TouchableOpacity>
              </View>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.infoBox}>
                    <ScrollView>
                      {earthquakes.map((earthquake, index) => (
                        <View key={index} style={styles.innerBox}>
                          <Text>{earthquake.properties.title}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                  <TouchableOpacity
                    style={styles.enhancedButton}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.enhancedButtonText}>Hide Modal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align children at the start of the container's main axis
  },
  imageTextContainer: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-start', // Align children at the start of the container's cross axis
    justifyContent: 'center', // Center children along the main axis of the container
    padding: 10,
  },
  profileLogo: {
    width: windowWidth / 4,
    height: windowHeight / 8,
    resizeMode: 'contain',
    overflow: 'hidden',
    borderRadius: 50,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  touchableArea: {
    position: 'absolute',
    bottom: windowHeight * 0.85,
    left: windowWidth * .9,
    width: windowWidth / 14,
    height: windowHeight / 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0)', // Set the background color to gray
    width: '100%', // Adjust the width as needed
    height: '65%', // Adjust the height as needed
    justifyContent: 'center', // Center the contents vertically
    alignItems: 'center', // Center the contents horizontally
    padding: 10, // Add some padding
  },
  modalView: {
    height: '100%',
  },  
  inputContainer: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'center', // Center the children along the main axis
    alignItems: 'center', // Center the children along the cross axis
    alignSelf: 'center',
  },
  enhancedTopInput: {
    margin: windowWidth * 0.05,
    flex: .9, // Take up the remaining space in the parent
    fontSize: windowWidth * 0.045, // Increase the font size
    height: windowHeight * 0.05,
    borderRadius: 20,
    borderWidth: 2, // Add border width
    borderColor: '#318E99', // Add border color
    textAlign: 'center', // Center the text
  },
  sendIcon1: {
    width: 30, // Increase the width
    height: 30, // Increase the height
    resizeMode: 'contain',
  },
  enhancedButton: {
    position: 'absolute', // Position it absolutely
    bottom: windowHeight * 0.25, // At the bottom of the parent
    width: '80%', // Full width
    backgroundColor: "#318E99",
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    margin: 10, // Add margin
    borderWidth: 2, // Add border width
    borderColor: '#FFFFFF', // Add border color
  },
  enhancedButtonText: {
    color: '#FFFFFF',
    fontSize: windowWidth * 0.05,
    textAlign: 'center',
  },
    clearAllBox: { // Modify this style
      position: 'absolute', // Position it absolutely
      bottom: 10, // At the bottom of the parent
      height: windowHeight / 22, // Adjust as needed
      width: windowWidth / 4, // Adjust as needed
      backgroundColor: '#FFFFFF', // Solid white
      borderRadius: 20,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center', // Center the contents horizontally
    },
  clearAllText: { // Add this style
    fontSize: windowWidth * 0.025, // Adjust as needed
    color: 'black', // Adjust as needed
  },
  innerBox: { // Modify this style
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'center', // Center the contents along the main axis
    alignItems: 'center', // Center the contents along the cross axis
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Solid white
    borderRadius: 50,
    height: windowHeight * 0.15,
    marginBottom: windowHeight * 0.01,
  },
  bottomLine: {
    position: 'absolute',
    bottom: windowHeight * 0.01,
    borderBottomColor: '#318E99', // Change the color as needed
    borderBottomWidth: 2,
    width: '40%', // Adjust the width as needed
    alignSelf: 'center', // Center the line
  },
    innerBoxImage: { // Add this style
      width: windowWidth / 15, // Adjust as needed
      height: windowHeight / 15, // Adjust as needed
      resizeMode: 'contain',
      marginRight: windowWidth * 0.05, // Adjust as needed
    },
    innerBoxText: {
      fontSize: windowWidth * 0.025, // Adjust as needed
      color: '#318E99', // Adjust as needed
    },
  transparentBox: { // Add this style
    backgroundColor: 'rgba(255, 255, 255, 0)', // Semi-transparent white
    width: windowWidth / 1.1, // Adjust as needed
    height: windowHeight / 2.8, // Adjust as needed
    borderRadius: 20,
    padding: 10,
    marginTop: windowHeight * 0.01,
  },
  imageBox: { // Add this style
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0C6B5F',
    borderRadius: 20,
    padding: 10,
    marginTop: windowHeight * 0.03,
    overflow: 'hidden',
  },
  boxImage: { // Add this style
    width: windowWidth / 4, // Adjust as needed
    height: windowHeight / 5.5, // Adjust as needed
    resizeMode: 'cover',
    margin: windowWidth * 0.015,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row', // Arrange children in a row
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 5,
  },
  sendIcon: { // Add this style
    width: windowWidth / 30, // Adjust as needed
    height: windowHeight / 30, // Adjust as needed
    resizeMode: 'contain',
    marginLeft: windowWidth * 0.02, // Adjust as needed
  },
  input: {
    width: windowWidth - 120, // Adjust as needed
    height: windowHeight / 34, // Adjust as needed
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    textAlign: 'left',
    padding: 5,
    fontSize: windowWidth * 0.03,
    fontFamily: 'montserrat-light',
  },
  fixedImage: {
    position: 'absolute', // Position it absolutely
    width: windowWidth / 14, // Adjust as needed
    height: windowHeight / 14, // Adjust as needed
    resizeMode: 'contain',
  },
  rightText: {
    marginTop: windowHeight * 0.07,
    marginLeft: windowWidth * 0.07,
    width: windowWidth * 0.5,
    fontSize: windowWidth * 0.055, // Adjust as needed
    color: '#000', // Adjust as needed
    textAlign: 'center',
    fontFamily: 'montserrat-bold',
  },
  rightSmallText: {
    fontSize: windowWidth * 0.025, // Adjust as needed
    marginLeft: windowWidth * 0.12,
    color: '#000', // Adjust as needed
  },
  bottomContainer: {
    position: 'absolute', // Position it absolutely
    bottom: 0, // At the bottom of the parent
    borderColor: '#318E99',
    borderTopWidth: 15,
    width: windowWidth, // Full width
    height: windowHeight / 1.35, // Adjust the height as needed
    justifyContent: 'center', // Center the contents vertically
    alignItems: 'center', // Center the contents horizontally
  },
});