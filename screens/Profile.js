import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Profile() {
  return (
    <ImageBackground source={require('../assets/bg1.png')} style={styles.backgroundImage}>
      <View style={styles.centerBox} />
      <View style={styles.circleBox} />
      <Image source={require('../assets/icons/profilelogo.png')} style={styles.profileLogo} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLogo: {
    position: 'absolute',
    top: windowHeight * 0.09, // Increase this value as needed
    width: windowWidth * 0.4, // Adjust as needed
    height: windowHeight * 0.4, // Adjust as needed
    resizeMode: 'contain',
  },
  circleBox: {
    position: 'absolute',
    top: windowHeight * 0.175, // Same as profileLogo
    width: windowWidth * 0.45, // Same as profileLogo
    height: windowHeight * 0.4, // Same as profileLogo
    borderRadius: (windowWidth * 0.4) / 2, // Half of the width or height to make it a circle
    backgroundColor: 'white', // Change the color as needed
  },
  centerBox: {
    marginTop: windowHeight * 0.2, // Increase this value as needed
    width: windowWidth * 0.8, // Adjust the width as needed
    height: windowHeight * 0.55, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});