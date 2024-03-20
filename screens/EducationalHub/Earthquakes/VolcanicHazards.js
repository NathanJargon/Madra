import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function VolcanicHazards({ navigation }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleBackPress = () => {
    if (selectedLesson === null) {
      navigation.navigate('Student Centered Info');
    } else {
      setSelectedLesson(null);
      navigation.navigate('EarthquakeHazards');
    }
  };

  const images = [
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/VolcanicHazards-1.png?alt=media&token=5b361845-6d81-476b-ae01-6971f5fbb0c7' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/VolcanicHazards-2.png?alt=media&token=2641d3e3-f2e7-498a-8057-f354b36a7520' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/VolcanicHazards-3.png?alt=media&token=80869533-9c4b-4477-b93e-3451a8a30831' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/VolcanicHazards-4.png?alt=media&token=8d307067-e814-4479-abc5-dca60af711d1' },
  ];
  

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.headerBox}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleBackPress}>
              <Image
                source={require('../../../assets/icons/back.png')}
                style={styles.backArrow}
              />
                <Text style={styles.headerText}>
                  VOLCANIC HAZARDS
                </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ImageViewer imageUrls={images} />
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
    },
    boxContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });