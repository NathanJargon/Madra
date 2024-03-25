import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { firebase } from './FirebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Splash({ navigation }) {
  const fadeAnim = useState(new Animated.Value(1))[0]; // Initial value for opacity: 1
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
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
    }
  }, [fadeAnim, navigation, isClicked]);

    return (
      <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => setIsClicked(true)}>
        <ImageBackground source={require('../assets/bg1.png')} style={styles.backgroundImage}>
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <Animated.Image
              source={require('../assets/icons/logo.png')}
              style={styles.logo}
            />
          </Animated.View>
          <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>CLICK ANYWHERE TO CONTINUE</Animated.Text>
        </ImageBackground>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    logoContainer: {
      width: windowWidth * .7,
      height: windowHeight * .35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10,
      alignItems: 'center', // to ensure the image is centered in the view
      justifyContent: 'center', // to ensure the image is centered in the view
      overflow: 'hidden',
      borderRadius: 10,
    },
    logo: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  text: {
    fontSize: 15,
    marginTop: 10,
    color: 'white',
    fontFamily: 'media-sans-bold',
  },
});