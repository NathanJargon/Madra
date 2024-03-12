import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, TextInput } from 'react-native';
import { setupDatabase } from './Database';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Dashboard() {
  const [username, setUsername] = useState('USER');
  const [fullName, setFullName] = useState('USER');
  const [userEmail, setUserEmail] = useState(null);
  const [userCountry, setUserCountry] = useState("Philippines");
  const [earthquakes, setEarthquakes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const clearNotifications = () => {
    setEarthquakes([]);
  };

  const handleSearch = () => {
    const filteredEarthquakes = earthquakes.filter(earthquake => earthquake.properties.title.includes(searchTerm));
    setEarthquakes(filteredEarthquakes);
  };

  useEffect(() => {
    const fetchData = () => {
      if (userCountry) {
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
          .then(response => response.json())
          .then(data => {
            const filteredEarthquakes = data.features.filter(earthquake => earthquake.properties.place.includes(userCountry));
            setEarthquakes(filteredEarthquakes);
          });
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [userCountry]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('email');
        const userName = await AsyncStorage.getItem('username');
        const userFullName = await AsyncStorage.getItem('fullName');
        const userCountry = await AsyncStorage.getItem('country');
  
        if (userEmail) setUserEmail(userEmail);
        if (userName) setUsername(userName);
        if (userFullName) setFullName(userFullName);
        if (userCountry) setUserCountry(userCountry);
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
  
          // Save the user data to AsyncStorage
          await AsyncStorage.setItem('email', userData.email);
          await AsyncStorage.setItem('username', userData.username);
          await AsyncStorage.setItem('fullName', userData.fullName);
          await AsyncStorage.setItem('country', userData.country);
        }
      }, error => {
        console.error("Error getting document:", error);
      });
  
      // Clean up the onSnapshot listener when the component is unmounted
      return () => unsubscribe();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageTextContainer}>
        <ImageBackground source={require('../assets/icons/profileBackground.png')} style={styles.profileLogoBackground}>
          <Image source={require('../assets/icons/profilelogo.png')} style={styles.profileLogo} />
        </ImageBackground>

        <View styles={styles.textContainer}>
          <Text style={styles.rightText}>HI {fullName}!</Text>
          <Text style={styles.rightSmallText}>MADRA: YOUR PARTNER FOR LIFE</Text>
        </View>

      </View>
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
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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
    infoBox: {
      backgroundColor: 'rgba(255, 255, 255, 0)', // Set the background color to gray
      width: '100%', // Adjust the width as needed
      height: '65%', // Adjust the height as needed
      justifyContent: 'center', // Center the contents vertically
      alignItems: 'center', // Center the contents horizontally
      padding: 10, // Add some padding
    },
  modalView: {
    height: '100%', // Take up the full height of the parent
    // ... other styles
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
    height: windowHeight / 30, // Adjust as needed
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    textAlign: 'left',
    padding: 5,
    fontSize: windowWidth * 0.03,
  },
  fixedImage: {
    position: 'absolute', // Position it absolutely
    bottom: windowHeight * 0.385, // Adjust as needed
    left: windowWidth * 0.385, // Adjust as needed
    width: windowWidth / 14, // Adjust as needed
    height: windowHeight / 14, // Adjust as needed
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column', // Arrange children in a column
    justifyContent: 'center', // Center the contents horizontally
    alignItems: 'left', // Center the contents vertically
  },
imageTextContainer: {
  flexDirection: 'row', // Arrange children in a row
  position: 'absolute', // Position it absolutely
  bottom: windowHeight / 1.4, // Position it above the bottomContainer
  right: windowWidth / 15,
  justifyContent: 'space-start', // Maximize the space between the children
  alignItems: 'center', // Center the contents vertically
  width: '100%', // Take up the full width of the parent
},
  profileLogoBackground: {
    width: 180, // Adjust as needed
    height: 180, // Adjust as needed
    marginBottom: windowHeight * 0.05,
    resizeMode: 'contain',
  },
  profileLogo: {
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    marginLeft: windowWidth * 0.1,
    marginTop: windowHeight * 0.1,
  },
  rightText: {
    marginTop: windowHeight * 0.07,
    marginLeft: windowWidth * 0.05,
    fontSize: windowWidth * 0.06, // Adjust as needed
    color: '#000', // Adjust as needed
    textAlign: 'center',
  },
  rightSmallText: {
    fontSize: windowWidth * 0.025, // Adjust as needed
    marginLeft: windowWidth * 0.07,
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