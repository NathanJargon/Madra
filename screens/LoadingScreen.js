import React from 'react';
import { View, ImageBackground, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => (
  <View style={styles.container}>
    <ImageBackground source={require('../assets/bg1.png')} style={styles.background}>
      <Image source={require('../assets/icons/logo.png')} style={styles.loading} />
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    width: width * 0.2,
    height: height * 0.2,
    resizeMode: 'contain',
  },
});

export default LoadingScreen;