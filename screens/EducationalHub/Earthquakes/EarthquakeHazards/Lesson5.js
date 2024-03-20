import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Lesson5() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>       
            <ScrollView>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    A tsunami is a sequence of waves resulting from significant displacements of water, often triggered by earthquakes or large underwater landslides. 
                    Originating from the Japanese words "tsu" meaning "harbor" and "nami" meaning "wave," it literally translates to "harbor wave."
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    When an earthquake occurs beneath the ocean, it forces the water above to move upward, generating tsunamis. Initially, these waves are small, 
                    but they grow as they move into shallower waters, a phenomenon known as wave shoaling, as they approach the coastline. Similar to seismic waves transitioning 
                    from harder to softer materials, tsunamis decrease in speed as they move into shallower waters. This decrease in velocity is offset by an increase in wave amplitude or height.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    Tsunamis typically arise from earthquakes in subduction zones, which are locations at converging tectonic plate boundaries. In these zones, 
                    one plate descends (subducts) beneath another. This downward movement of the subducting plate is influenced by temperature, as the colder lithosphere is 
                    denser and thus sinks below the warmer lithosphere.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    A tsunami can be local or regional. Local tsunamis are from a nearby source. They are confined to coasts within 100 km or 
                    the distance they travel within less than an hour. Regional tsunamis affect a wide geographical area, typically within 1,000 km or 1-3 
                    hours of the wave travel time.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    Tsunamis are monitored using open-ocean buoys and tide gauges, which track changes in sea level. A magnitude 7.5 earthquake is sufficient to trigger a tsunami watch. 
                    If a tsunami is confirmed by tide stations, a warning is issued, and evacuation procedures are enacted.
                    There are natural indicators of an approaching tsunami:

                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    Prolonged, intense ground shaking
                    Sudden recession of sea levels, exposing ocean floor features
                    Loud, rumbling noises resembling a freight train or aircraft
                    A massive incoming wall of water
                </Text>
                </View>
                <View style={[styles.rectangleBox, { marginBottom: 15 }]}>
                <Text style={styles.boxText}>
                    In such situations, immediate evacuation to higher ground is imperative. It's crucial to avoid low-lying or coastal areas even after the initial wave, 
                    as tsunamis often arrive in multiple waves, sometimes hours apart.
                </Text>
                </View>
            </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  linkText: {
    color: 'blue',
    fontSize: 10,
  },
  boxImage: {
    width: windowWidth * 1,
    height: windowHeight * 0.5, 
    resizeMode: 'contain', 
    alignSelf: 'center',
  },
  boldBlackText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.0525,
    textAlign: 'justify',
  },
  bottomContainer: {
    width: windowWidth, // Full width
    height: '100%', // Adjust the height as needed
  },
  rectangleBox: {
    paddingTop: 10,
    marginTop: 10,
    borderRadius: 0,
    overflow: 'hidden',
  },
  boxContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  boxText: {
    color: 'white',
    fontSize: windowWidth * 0.05,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlign: 'justify',
  },
});