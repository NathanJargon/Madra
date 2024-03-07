import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Settings() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.headerBox}>
          <View style={styles.headerContent}>
            <Text style={styles.centeredText}>SETTINGS</Text>
          </View>
        </View>
        <View style={styles.boxRow}>
          <View style={styles.box1}>
            <Image source={require('../assets/icons/profilelogo.png')} style={styles.boxImage} />
            <View style={styles.textContainer}>
              <Text style={styles.boxText1}>BEATRICE BAYLON</Text>
              <Text style={styles.boxText2}>beatric_baylon@gmail.com</Text>
              <Text style={styles.boxText3}>09263456857</Text>
            </View>
          </View>
        </View>
        <View style={styles.boxRow}>
          <View style={styles.box2}>
            <View style={styles.innerBox1}>
              <Text style={styles.innerBoxHeader}>OPTIONS</Text>
              <Text style={styles.innerBoxSmallText}>Madrification</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13, }}>Customizable Alerts</Text>
              <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>Push Notification</Text>
              <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
            </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>Earthquake Details</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>Localize Alerts</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
              </View>
            </View>
            <View style={styles.innerBox2}>
              <Text style={styles.innerBoxHeader}>ACCOUNT</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>Personal Information</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>Country</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>Language</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
              </View>
            </View>
            <View style={styles.innerBox3}>
              <Text style={styles.innerBoxHeader}>GENERAL</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>About</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13,}}>Privacy and Policy</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
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
    innerBoxImage: {
      width: windowWidth * 0.03, // Adjust as needed
      height: windowHeight * 0.03, // Adjust as needed
      resizeMode: 'contain',
      marginLeft: windowWidth * 0.02, // Add some margin to the left
    },
  centeredText: {
    fontSize: windowWidth * 0.1, // adjust as needed
    color: '#000', // adjust as needed
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: windowHeight * 0.02,
  },
  box1: {
    flexDirection: 'row', // Keep this as 'row'
    width: windowWidth * 0.9, // Adjust the width as needed
    height: windowHeight * 0.2, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    flexDirection: 'column', // Add this
    margin: windowWidth * 0.03,
    marginRight: windowWidth * 0.05,
  },
  boxImage: {
    width: windowWidth * 0.4, // Adjust as needed
    height: windowHeight * 0.15, // Adjust as needed
    resizeMode: 'contain', // Or 'cover'
  },
  boxText1: {
    fontSize: windowWidth * 0.05, // Adjust as needed
    color: '#000', // Adjust as needed
    marginTop: windowHeight * 0.01, // Adjust as needed
  },
  boxText2: {
    fontSize: windowWidth * 0.025, // Adjust as needed
    color: '#000', // Adjust as needed
  },
  boxText3: {
    fontSize: windowWidth * 0.025, // Adjust as needed
    color: '#000', // Adjust as needed
  },
    box2: {
      flexDirection: 'column', // Keep this
      width: windowWidth * .9, // Adjust the width as needed
      height: windowHeight * 0.525, // Adjust the height as needed
      backgroundColor: 'white', // Change the color as needed
      borderRadius: 20,
      justifyContent: 'center', // Center items vertically
      alignItems: 'center', // Center items horizontally
      padding: 10,
    },
    innerBox1: {
      flexDirection: 'column', // Change this
      width: windowWidth * 0.8, // Adjust as needed
      height: windowHeight * 0.2, // Adjust as needed
      backgroundColor: 'rgba(255, 255, 255, 0)', // Change the color as needed
      borderRadius: 10, // Adjust as needed
      justifyContent: 'flex-start', // Align items to the start
      alignItems: 'flex-start', // Align items to the left
      padding: 10, // Add some padding
    },
    innerBox2: {
      flexDirection: 'column', // Change this
      width: windowWidth * 0.8, // Adjust as needed
      height: windowHeight * 0.15, // Adjust as needed
      backgroundColor: 'rgba(255, 255, 255, 0)', // Change the color as needed
      borderRadius: 10, // Adjust as needed
      justifyContent: 'flex-start', // Align items to the start
      alignItems: 'flex-start', // Align items to the left
      padding: 10, // Add some padding
    },
    innerBox3: {
      flexDirection: 'column', // Change this
      width: windowWidth * 0.8, // Adjust as needed
      height: windowHeight * 0.13, // Adjust as needed
      backgroundColor: 'rgba(255, 255, 255, 0)', // Change the color as needed
      borderRadius: 10, // Adjust as needed
      justifyContent: 'flex-start', // Align items to the start
      alignItems: 'flex-start', // Align items to the left
      padding: 10, // Add some padding
    },

    // Add a new style for the header
    innerBoxHeader: {
      fontSize: windowWidth * 0.035, // Adjust as needed
      color: '#000', // Adjust as needed
      marginBottom: windowWidth * 0.02, // Add some margin to the bottom
    },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  headerBox: {
    width: '100%', // Full width
    height: windowHeight * 0.125, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    overflow: 'hidden',
  },
    innerBoxText: {
      fontSize: windowWidth * 0.045, // Adjust as needed
      color: '#000', // Adjust as needed
      textAlign: 'center', // Center the text
      marginLeft: windowWidth * 0.2,
    },
    innerBoxSmallText: {
      fontSize: windowWidth * 0.045, // Adjust as needed
      color: '#000', // Adjust as needed
      textAlign: 'center', // Center the text
      marginLeft: windowWidth * 0.075,
    },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
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