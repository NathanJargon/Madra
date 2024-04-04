import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Linking, TouchableOpacity } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HelpCenter() {
  const dialNumber = (number) => {
    const url = `tel:${number}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle url: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.transparentBox}>
          <Text style={styles.boldText}>
            911 is the National Emergency Hotline
          </Text>
          <Text style={styles.boldText}>
            RED CROSS
          </Text>
          <TouchableOpacity onPress={() => dialNumber('87902300')}>
            <Text style={styles.infoText}>
              Emergency Response Unit: 134 (Staff), 132 (Manager), 133 (Radio Room)
              (02) 8790-2300 local 604
            </Text>
          </TouchableOpacity>
          <Text style={styles.boldText}>
            Philippine National Police (PNP)
          </Text>
          <TouchableOpacity onPress={() => dialNumber('87220650')}>
            <Text style={styles.infoText}>
              Emergency Hotline: 117
              (02) 8722-0650
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dialNumber('09178475757')}>
            <Text style={styles.infoText}>
              Text hotline: 0917-847-5757
            </Text>
          </TouchableOpacity>
          <Text style={styles.boldText}>
            Bureau of Fire Protection (BFP)
          </Text>
          <TouchableOpacity onPress={() => dialNumber('84260219')}>
            <Text style={styles.infoText}>
              Direct line: (02) 8426-0219
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dialNumber('84260246')}>
            <Text style={styles.infoText}>
              Direct line: (02) 8426-0246
            </Text>
          </TouchableOpacity>
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
  bottomContainer: {
    width: windowWidth,
    height: '100%',
    justifyContent: 'center', // Add this to center the content vertically
    alignItems: 'center', // Add this to center the content horizontally
  },
  infoText: {
    color: '#127B6E',
    fontSize: 16,
    marginVertical: 20, // Increase this to add more space
    alignSelf: 'center',
    maxWidth: '90%',
    textAlign: 'center',
    fontFamily: 'glacial-indifference-regular',
  },
  boldText: {
    color: '#0C6B5F',
    maxWidth: '100%',
    fontSize: 20, // Adjust the size as needed
    fontFamily: 'media-sans-bold', // Replace with your preferred font
    marginVertical: 20, // Increase this to add more space
    textAlign: 'center',
  },
  transparentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '100%',
    height: '100%',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center', // Add this to center the content vertically
    alignItems: 'center', // Add this to center the content horizontally
  },
});