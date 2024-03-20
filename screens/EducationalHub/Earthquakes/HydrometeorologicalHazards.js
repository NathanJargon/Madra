import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HydrometeorologicalHazards({ navigation }) {
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
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-01.png?alt=media&token=e3112596-4cb1-424a-b25c-c3218b96ff85' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-02.png?alt=media&token=60f84a23-5015-461a-8aaf-8076f108ad64' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-03.png?alt=media&token=82783c26-c688-4252-9991-71faf1af7aba' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-04.png?alt=media&token=6b921009-ebe7-4fa8-92fb-7ed2c5321789' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-05.png?alt=media&token=aca73c13-93c8-40ae-8da2-dfff07b25556' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-06.png?alt=media&token=34813969-d95c-4cfb-a986-42ced5fcf046' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-07.png?alt=media&token=75707933-3133-4436-853b-41434fb3a7ab' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-08.png?alt=media&token=2f187a84-3794-4162-a5be-b9eceb99652e' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-09.png?alt=media&token=8f7d743b-eac6-435c-8c5f-5da4326976a8' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-10.png?alt=media&token=898eb1ca-4a14-42c1-8e10-13f3ddf8e1b3' },
    { url: 'https://firebasestorage.googleapis.com/v0/b/madra-7a862.appspot.com/o/HydrometeorologicalHazards-11.png?alt=media&token=a0263db8-f8e3-4112-96c0-a8f38a96af48' },
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
                  HYDROMETEOROLOGICAL HAZARDS
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