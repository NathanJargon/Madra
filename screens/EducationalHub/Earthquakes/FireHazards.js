import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FireHazards({ navigation }) {
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
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/FireHazards-1.png?alt=media&token=95f5ee99-b43a-43e4-b0ae-ef875013d3be' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/FireHazards-2.png?alt=media&token=aa2c1434-b3aa-46bb-a2b9-6c390fd3ef07' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/FireHazards-3.png?alt=media&token=0e5c6000-9f70-4827-8683-bc7e88bf7649' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/FireHazards-4.png?alt=media&token=469267cd-abbf-46a7-92be-11071e02a752' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/FireHazards-5.png?alt=media&token=0c9c1901-39e5-4bf0-9aaf-5adc42a4b2d2' },
  ];
  

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <ScrollView>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image.url }} style={styles.image} />
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
      image: {
        width: windowWidth,
        height: windowHeight * 0.7,
        resizeMode: 'contain',
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