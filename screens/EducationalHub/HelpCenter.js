import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HelpCenter() {
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
          <Text style={styles.infoText}>
            Emergency Response Unit: 134 (Staff), 132 (Manager), 133 (Radio Room)
            (02) 8790-2300 local 604
          </Text>
          <Text style={styles.boldText}>
            Philippine National Police (PNP)
          </Text>
          <Text style={styles.infoText}>
            Emergency Hotline: 117
            (02) 8722-0650
            Text hotline: 0917-847-5757
          </Text>
          <Text style={styles.boldText}>
            Bureau of Fire Protection (BFP)
          </Text>
          <Text style={styles.infoText}>
            Direct line: (02) 8426-0219, (02) 8426-0246
          </Text>
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
    width: '90%',
    textAlign: 'center',
    fontFamily: 'glacial-indifference-regular',
  },
  boldText: {
    color: '#0C6B5F',
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