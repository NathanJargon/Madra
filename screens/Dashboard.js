import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Dashboard() {
  return (
    <ImageBackground source={require('../assets/bg1.png')} style={styles.backgroundImage}>
      {/* Other components go here */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
});