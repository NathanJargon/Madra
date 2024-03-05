import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, TextInput } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.imageTextContainer}>
        <ImageBackground source={require('../assets/icons/profileBackground.png')} style={styles.profileLogoBackground}>
          <Image source={require('../assets/icons/profilelogo.png')} style={styles.profileLogo} />
        </ImageBackground>
        <View styles={styles.textContainer}>
          <Text style={styles.rightText}>HI CHARLOTTE!</Text>
          <Text style={styles.rightSmallText}>MADRA: YOUR PARTNER FOR LIFE</Text>
        </View>
      </View>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icons/search.png')} style={styles.sendIcon} />
              <TextInput style={styles.input} placeholder="NADRA IS HERE TO HELP" />
          <Image source={require('../assets/icons/send.png')} style={styles.sendIcon} />
        </View>
        <View style={styles.imageBox}>
          <Image source={require('../assets/image1.png')} style={styles.boxImage} />
          <Image source={require('../assets/image2.png')} style={styles.boxImage} />
          <Image source={require('../assets/image3.png')} style={styles.boxImage} />
        </View>
        <View style={styles.transparentBox}>
          <View style={styles.innerBox}>
            <Image source={require('../assets/icons/logo.png')} style={styles.innerBoxImage} />
            <Text style={styles.innerBoxText}>YOU HAVE A MADRIFICATION!</Text>
          </View>
        <View style={styles.clearAllBox}>
          <Text style={styles.clearAllText}>CLEAR ALL</Text>
        </View>
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
      height: windowHeight / 25, // Adjust as needed
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
    backgroundColor: '#FFFFFF', // Solid white
    borderRadius: 20,
    marginBottom: windowHeight * 0.01,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
    width: windowWidth / 1.1, // Adjust as needed
    height: windowHeight / 3.5, // Adjust as needed
    borderRadius: 20,
    padding: 10,
    marginTop: windowHeight * 0.01,
  },
  imageBox: { // Add this style
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginTop: windowHeight * 0.01,
    overflow: 'hidden',
  },
  boxImage: { // Add this style
    width: windowWidth / 4, // Adjust as needed
    height: windowHeight / 4, // Adjust as needed
    resizeMode: 'contain',
    marginRight: windowHeight * 0.02,
  },
  inputContainer: {
    flexDirection: 'row', // Arrange children in a row
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
  },
  sendIcon: { // Add this style
    width: windowWidth / 20, // Adjust as needed
    height: windowHeight / 20, // Adjust as needed
    resizeMode: 'contain',
    marginLeft: 10, // Adjust as needed
  },
  input: {
    width: windowWidth - 120, // Adjust as needed
    height: windowHeight / 22, // Adjust as needed
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    textAlign: 'left',
    padding: 10,
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
    alignItems: 'center', // Center the contents vertically
  },
  imageTextContainer: {
    flexDirection: 'row', // Arrange children in a row
    position: 'absolute', // Position it absolutely
    bottom: windowHeight / 1.4, // Position it above the bottomContainer
    justifyContent: 'center', // Center the contents horizontally
    alignItems: 'center', // Center the contents vertically
  },
  profileLogoBackground: {
    width: 170, // Adjust as needed
    height: 170, // Adjust as needed
    marginBottom: windowHeight * 0.05,
    marginRight: windowWidth * 0.05,
    resizeMode: 'contain',
  },
  leftImage: {
    width: windowWidth / 3, // Adjust as needed
    height: windowHeight / 5, // Adjust as needed
    resizeMode: 'contain',
    justifyContent: 'center', // Center the contents vertically
    alignItems: 'center', // Center the contents horizontally
  },
  profileLogo: {
    width: windowWidth / 4, // Adjust as needed
    height: windowHeight / 4, // Adjust as needed
    marginLeft: windowWidth * 0.08,
    resizeMode: 'contain',
  },
  rightText: {
    marginRight: windowWidth * 0.15,
    fontSize: windowWidth * 0.075, // Adjust as needed
    color: '#000', // Adjust as needed
  },
  rightSmallText: {
    marginLeft: windowWidth * 0.075,
    fontSize: windowWidth * 0.025, // Adjust as needed
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