import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';

// EducationalHub
import DosAndDonts from './DosAndDonts';
import SafetyProtocols from './SafetyProtocols';
import FirstAid from './FirstAid';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GenInfo({ navigation }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

const handleBackPress = () => {
  if (selectedLesson === null) {
    navigation.navigate('EducationalHubInterface');
  } else {
    setSelectedLesson(null);
    navigation.navigate('Gen Info');
  }
};

  const handlePress = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.headerBox}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleBackPress}>
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.backArrow}
              />
                <Text style={styles.headerText}>
                  {selectedLesson ? selectedLesson.replace(/([A-Z])/g, ' $1').toUpperCase() : 'GEN INFO'}
                </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.boxContainer}>
          {selectedLesson === null && (
            <>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => navigation.navigate('DosAndDonts')}>
                  <Image source={require('../../assets/icons/round-logo.png')} style={ styles.image } />
                  <Text style={styles.boxTitle}>STUDY GUIDE: DOS AND DONT'S</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => navigation.navigate('SafetyProtocols')}>
                <Image source={require('../../assets/icons/round-logo.png')} style={ styles.image } />
                <Text style={styles.boxTitle}>STUDY GUIDE: SAFETY PROTOCOLS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => navigation.navigate('FirstAid')}>
                <Image source={require('../../assets/icons/round-logo.png')} style={ styles.image } />
                <Text style={styles.boxTitle}>STUDY GUIDE: FIRST AID</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedLesson === 'DosAndDonts' && <DosAndDonts />}
          {selectedLesson === 'SafetyProtocols' && <SafetyProtocols />}
          {selectedLesson === 'FirstAid' && <FirstAid />}
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
    width: windowWidth * 0.8, // Adjust the width as needed
    height: windowHeight * 0.4, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  boxTitle: {
    color: '#318E99',
    width: '70%',
    fontSize: windowWidth * 0.035,
    margin: windowWidth * 0.01,
    marginLeft: windowWidth * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  proceedButton: {
    width: '80%',
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
    rectangleBox: {
      height: '15%',
      width: '85%',
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      padding: 10,
      borderRadius: 50,
      marginBottom: windowHeight * 0.025,
      flexDirection: 'row', // Keep this
      justifyContent: 'flex-start', // Change this
      alignItems: 'center', // Keep this
    },
    image: { // Add this style
      width: windowWidth / 15, // Adjust as needed
      height: windowHeight / 15, // Adjust as needed
      resizeMode: 'contain',
      marginLeft: windowWidth * 0.05, // Adjust as needed
    },
});