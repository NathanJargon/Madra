import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';
import MadramaniaQuiz from './MadramaniaQuiz';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Madramania() {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handlePress = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>
          {selectedLesson === null && (
            <>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => handlePress('FirstAid')}>
                <Text style={styles.boxTitle}>LESSON: FIRST AID</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => handlePress('DosAndDonts')}>
                <Text style={styles.boxTitle}>LESSON: DO’S AND DONT’S</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => handlePress('SafetyProtocols')}>
                <Text style={styles.boxTitle}>LESSON: SAFETY PROTOCOLS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => handlePress('StudyOfEarthquake')}>
                <Text style={styles.boxTitle}>LESSON: EARTHQUAKE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rectangleBox} onPress={() => handlePress('StudyOfEarthquake')}>
                <Text style={styles.boxTitle}>LESSON: DISASTER RISK REDUCTION MANAGEMENT (DRRM)</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedLesson !== null && <MadramaniaQuiz lesson={selectedLesson} />}
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
    color: 'white',
    fontSize: windowWidth * 0.035,
    margin: windowWidth * 0.01,
    marginLeft: windowWidth * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlign: 'left',
  },
    boxSmallTitle: {
     fontSize: windowWidth * 0.03,
     textAlign: 'center',
     fontWeight: 'bold',
   },
  proceedButton: {
    width: '80%',
    height: '7%',
    marginBottom: windowHeight * 0.01,
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
      borderWidth: 1,
      backgroundColor: "#318E99",
      borderColor: 'white',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      width: windowWidth * 0.75, // Set the width to 80% of the window width
    },
  centeredText: {
    textAlign: 'center',
    fontSize: windowWidth * 0.035, // Adjust the font size as needed
  },
});