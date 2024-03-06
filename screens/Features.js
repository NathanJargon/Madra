import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Features() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.headerBox}>
          <View style={styles.headerContent}>
            <Image source={require('../assets/icons/back.png')} style={styles.backArrow} />
            <Text style={styles.headerText}>MADRA FEATURES</Text>
          </View>
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.boxRow}>
            <View style={styles.boxWrapper}>
              <View style={styles.box}>
                <Image source={require('../assets/appBackground.png')} style={styles.boxImage} />
                <Text style={styles.boxTitle}>HAZARD MAPPING</Text>
                <TouchableOpacity style={styles.proceedButton}>
                  <Text style={styles.proceedButtonText}>PROCEED</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.box}>
                <Image source={require('../assets/icons/analytics-color.png')} style={styles.boxImage} />
                <Text style={styles.boxTitle}>EDUCATIONAL HUB</Text>
                <TouchableOpacity style={styles.proceedButton}>
                  <Text style={styles.proceedButtonText}>PROCEED</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.boxRow}>
            <View style={styles.boxWrapper}>
              <View style={styles.box}>
                <Image source={require('../assets/icons/analytics-color.png')} style={styles.boxImage} />
                <Text style={styles.boxTitle}>MADRAMANIA</Text>
                <TouchableOpacity style={styles.proceedButton}>
                  <Text style={styles.proceedButtonText}>PROCEED</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.box}>
                <Image source={require('../assets/icons/analytics-color.png')} style={styles.boxImage} />
                <Text style={styles.boxTitle}>EARTHQUAKE UPDATES</Text>
                <TouchableOpacity style={styles.proceedButton}>
                  <Text style={styles.proceedButtonText}>PROCEED</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
boxContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  boxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%', // Adjust the width as needed
  },
  box: {
    width: windowWidth * 0.4, // Adjust the width as needed
    height: windowHeight * 0.26, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  boxImage: {
    width: '100%',
    height: '55%',
    resizeMode: 'cover',
    borderRadius: 20,
    overflow: 'hidden',
  },
  boxTitle: {
    fontSize: windowWidth * 0.03,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 20,
  },
  proceedButton: {
    width: '100%',
    height: '20%',
    backgroundColor: '#318E99',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  headerBox: {
    width: '100%', // Full width
    height: windowHeight * 0.175, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    borderColor: '#318E99',
    borderBottomWidth: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    padding: 30,
  },
  backArrow: {
    width: windowWidth * 0.05,
    height: windowHeight * 0.05,
    resizeMode: 'contain',
    marginRight: windowWidth * 0.02,
  },
  headerText: {
    fontSize: windowWidth * 0.035,
    color: '#000',
  },
  bottomContainer: {
    width: windowWidth, // Full width
    height: '100%', // Adjust the height as needed
  },
});