import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text, Image, ImageBackground } from 'react-native';
import MapView from 'react-native-maps';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function EarthquakeUpdates() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <ScrollView style={styles.scrollView}>
        {/* Replace this with your boxes */}
        <View style={styles.box}>
          <Image source={require('../assets/icons/realroundlogo.png')} style={styles.smallImage} />
          <Text style={styles.boxText}>LASANG EARTHQUAKE: M. 4.5 I 3 E. BRGY 2A</Text>
          <Image source={require('../assets/icons/forward.png')} style={styles.forwardImage} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1, 
    width: windowWidth,
  },
  scrollView: {
    flex: 0.45,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: windowHeight * 0.08,
    backgroundColor: 'white',
    marginBottom: 2,
    paddingHorizontal: 10, // Add some padding to the sides of the box
  },
  smallImage: {
    width: 45, // Adjust the size as needed
    height: 45, // Adjust the size as needed
  },
  boxText: {
    fontSize: windowWidth * 0.03, // Adjust the size as needed
    color: 'black', // Change the color as needed
  },
  forwardImage: {
    width: 20, // Adjust the size as needed
    height: 20, // Adjust the size as needed
  },
});