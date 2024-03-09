import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, TextInput } from 'react-native';
import { initDB } from './Database';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Dashboard() {
  const [username, setUsername] = useState('USER');

  useEffect(() => {
    const db = initDB();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT username FROM Users',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            setUsername(rows.item(0).username);
          }
        },
        (_, error) => console.log('Error fetching data:', error)
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageTextContainer}>
        <ImageBackground source={require('../assets/icons/profileBackground.png')} style={styles.profileLogoBackground}>
          <Image source={require('../assets/icons/profilelogo.png')} style={styles.profileLogo} />
        </ImageBackground>
        <View styles={styles.textContainer}>
          <Text style={styles.rightText}>HI {username}!</Text>
          <Text style={styles.rightSmallText}>MADRA: YOUR PARTNER FOR LIFE</Text>
        </View>
      </View>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/search.png')} style={styles.sendIcon} />
              <TextInput style={styles.input} placeholder="MADRA IS HERE TO HELP" />
          <Image source={require('../assets/icons/send.png')} style={styles.sendIcon} />
        </View>
        <View style={styles.imageBox}>
          <Image source={require('../assets/image1.png')} style={styles.boxImage} />
          <Image source={require('../assets/image2.png')} style={styles.boxImage} />
          <Image source={require('../assets/image3.png')} style={styles.boxImage} />
        </View>
        <View style={styles.transparentBox}>
            <ScrollView>
                <View style={styles.innerBox}>
                  <Image source={require('../assets/icons/round-logo.png')} style={styles.innerBoxImage} />
                  <Text style={styles.innerBoxText}>YOU HAVE A MADRIFICATION!</Text>
                  <View style={styles.bottomLine} />
                </View>
            </ScrollView>
          </View>
        <View style={styles.clearAllBox}>
          <Text style={styles.clearAllText}>CLEAR ALL</Text>
        </View>
      </ImageBackground>
      <Image source={require('../assets/icons/notif.png')} style={styles.fixedImage} />
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: windowWidth * 0.025,
  },
  fixedImage: {
    position: 'absolute', // Position it absolutely
    top: 0, // Adjust as needed
    right: 10, // Adjust as needed
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
    width: windowWidth / 4, // Adjust as needed
    height: windowHeight / 2.8, // Adjust as needed
    marginLeft: windowWidth * 0.125,
    resizeMode: 'contain',
  },
  rightText: {
    marginTop: windowHeight * 0.05,
    marginLeft: windowWidth * 0.07,
    fontSize: windowWidth * 0.075, // Adjust as needed
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