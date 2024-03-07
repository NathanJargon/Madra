import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Map() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bg1.png')} style={styles.bottomContainer}>
         <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.headerBox}>
          <View style={styles.headerContent}>

          </View>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerBox: {
    width: '100%', // Full width
    height: windowHeight * .65, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    padding: 30,
  },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  bottomContainer: {
    width: windowWidth, // Full width
    height: '100%', // Adjust the height as needed
  },
});