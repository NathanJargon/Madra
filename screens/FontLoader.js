import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function FontLoader({ children }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  async function loadFonts() {
    try {
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync({
        'NeueMachina-Regular': require('../assets/fonts/NeueMachina-Regular.otf'),
        'NeueMachina-Ultrabold': require('../assets/fonts/NeueMachina-Ultrabold.otf'),
        'Roc': require('../assets/fonts/Roc.otf'),
        'Codec': require('../assets/fonts/Codec.ttf'),
        'Horizon': require('../assets/fonts/Horizon.ttf'),
        'Montserrat-Light': require('../assets/fonts/Montserrat Light.otf'),
        'NeueMachina-Light': require('../assets/fonts/NeueMachina-Light.otf'),
        // ...other fonts
      });
      setFontsLoaded(true);
    } catch (e) {
      console.warn(e);
    } finally {
      SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return children;
}