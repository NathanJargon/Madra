import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, BackHandler, ScrollView } from 'react-native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PolicyScreen({ navigation }) {
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Settings');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
  <View style={styles.container}>
    <ImageBackground source={require('../assets/bg1.png')} style={styles.bottomContainer}>
      <ScrollView contentContainerStyle={styles.textContainer}>
      <Text style={styles.titleText}>Privacy and Policy</Text>
        <Text style={styles.boldText}>Philippine Data Privacy Act Compliance:</Text>
        <Text style={styles.regularText}>
          MADRA Mobile Application complies with the Republic Act No. 10173, also known as the "Data Privacy Act of 2012" of the Philippines. We are committed to ensuring the protection and security of all personal information collected from Users in accordance with this legislation.
        </Text>
        <Text style={styles.boldText}>Rights of Data Subjects</Text>
        <Text style={styles.boldText}>
          Under the Data Privacy Act, Users have the following rights regarding their personal information:
        </Text>
        <Text style={styles.boldText}>1. Right to be Informed:</Text>
        <Text style={styles.regularText}>Users have the right to be informed about the collection, processing, and purpose of their personal information.</Text>
        <Text style={styles.boldText}>2. Right to Access:</Text>
        <Text style={styles.regularText}>Users have the right to access their personal information held by MADRA and to know how it is being processed.</Text>
        <Text style={styles.boldText}>3. Right to Object:</Text>
        <Text style={styles.regularText}>Users have the right to object to the processing of their personal information, including processing for direct marketing, automated processing, or profiling.</Text>
        <Text style={styles.boldText}>4. Right to Rectification:</Text>
        <Text style={styles.regularText}>Users have the right to correct any inaccurate or incomplete personal information.</Text>
        <Text style={styles.boldText}>5. Right to Erasure or Blocking:</Text>
        <Text style={styles.regularText}>Users have the right to have their personal information removed or blocked from further processing under certain circumstances.</Text>
        <Text style={styles.boldText}>6. Right to Damages:</Text>
        <Text style={styles.regularText}>Users have the right to claim damages for any damages sustained due to inaccurate, incomplete, outdated, false, unlawfully obtained, or unauthorized use of personal information.</Text>
        <Text style={styles.boldText}>Data Protection Officer:</Text>
        <Text style={styles.regularText}>
          MADRA has appointed a Data Protection Officer (DPO) who is responsible for ensuring compliance with the Data Privacy Act. Users may contact the DPO at madrapplication@gmail.com for any concerns regarding the processing of their personal information.
        </Text>
        <Text style={styles.boldText}>Reporting Data Privacy Violations:</Text>
        <Text style={styles.regularText}>
          If Users believe that their personal information has been mishandled or unlawfully processed, they may file a complaint with the National Privacy Commission (NPC) of the Philippines. The NPC is the government agency tasked with ensuring compliance with the Data Privacy Act and investigating data privacy violations.
        </Text>
        <Text style={styles.endText}>
          Effective Date: This Data Privacy Act Compliance statement is part of our Privacy Policy and was last updated on March 15, 2024.
        </Text>
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
  titleText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.065, // Adjust as needed
    marginBottom: 10, // Add some bottom margin for spacing
  },
  bottomContainer: {
    width: windowWidth, // Full width
    height: '100%', // Adjust the height as needed
  },
  textContainer: {
    padding: 10, // Adjust as needed
    paddingBottom: 50, // Add bottom padding
    marginLeft: 10,
    marginTop: windowHeight * 0.05,
    alignItems: 'flex-start',
  },
  boldText: {
    fontWeight: 'bold',
    margin: 5,
    fontSize: windowWidth * 0.05, // Adjust as needed
  },
  endText: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: windowWidth * 0.05, 
  },
  regularText: {
    fontSize: windowWidth * 0.04, // Adjust as needed
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});