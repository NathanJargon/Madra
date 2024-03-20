import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Lesson3() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>       
            <ScrollView>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>What causes liquefaction?</Text>
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Liquefaction</Text> transpires when the ground loses its solidity and takes on liquid-like characteristics due to earthquake activity. 
                    During shaking, the particles in the ground vibrate, causing <Text style={styles.boldBlackText}>compaction</Text> where sediments compress and fluids in pore spaces are expelled. 
                    This process reduces the gaps between particles, leading to heightened pore water pressure. When this pressure matches the weight of the material above, 
                    liquefaction takes place.
                </Text>
                </View>
                <View style={[styles.rectangleBox, { marginBottom: 15 }]}>
                <Text style={styles.boxText}>
                    Liquefaction is influenced by various factors including the duration and intensity of shaking, 
                    distance from the fault, density of infrastructure, and geological conditions. More intense and prolonged shaking results in more significant 
                    liquefaction. When liquefaction occurs at deeper levels, it can lead to sand and water erupting from the ground, known as <Text style={styles.boldBlackText}>sand boils</Text>.
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
  boldBlackText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.0525,
    textAlign: 'justify',
    textAlign: 'center',
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