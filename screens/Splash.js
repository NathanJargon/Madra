import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { firebase } from './FirebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Splash({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }
      });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fadeAnim, navigation]);

  return (
    <ImageBackground source={require('../assets/bg1.png')} style={styles.backgroundImage}>
      <Animated.Image
        source={require('../assets/icons/round-logo.png')}
        style={[
          styles.logo,
          { opacity: fadeAnim },
        ]}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: windowWidth * .7,
    height: windowHeight * .7,
    resizeMode: 'contain',
  },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
});