import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';
import { initDB } from './Database';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Settings({ navigation }) {
  const [fullName, setFullName] = useState('USER');
  const [email, setEmail] = useState('user@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('09123456789');

  useEffect(() => {
    const db = initDB();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT fullName, email, phoneNumber FROM Users',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            setUsername(rows.item(0).username);
            setEmail(rows.item(0).email);
          }
        },
        (_, error) => console.log('Error fetching data:', error)
      );
    });
  }, []);

return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
          <View style={styles.headerBox}>
            <View style={styles.headerContent}>
              <Text style={styles.centeredText}>SETTINGS</Text>
            </View>
          </View>
          <View style={styles.boxRow}>
            <ImageBackground source={require('../assets/settingsTop.png')} style={styles.box1}>
              <Image source={require('../assets/icons/profilelogo.png')} style={styles.boxImage} />
              <View style={styles.textContainer}>
                  <Text style={styles.boxText1}>{fullName}</Text>
                  <Text style={styles.boxText2}>{email}</Text>
                  <Text style={styles.boxText3}>{phoneNumber}</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.boxRow}>
            <ImageBackground source={require('../assets/bg1.png')} style={styles.box2}>
              <View style={styles.innerBox1}>
                <Text style={styles.innerBoxHeader}>OPTIONS</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.innerBoxSmallText, { flex: 1, fontSize: windowWidth * 0.05,  marginLeft: windowWidth * 0.1, color: 'white', fontWeight: 'bold', }}>Madrification</Text>
                  <Image source={require('../assets/icons/off-button.png')} style={styles.innerBoxSwitch} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13, color: 'white', fontWeight: 'bold', }}>Customizable Alerts</Text>
                  <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13, color: 'white', fontWeight: 'bold',  }}>Push Notification</Text>
                  <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13, color: 'white',  fontWeight: 'bold', }}>Earthquake Details</Text>
                    <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.13, color: 'white',  fontWeight: 'bold', }}>Localize Alerts</Text>
                    <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                  </View>
                </View>
                    <View style={styles.innerBox2}>
                      <Text style={styles.innerBoxHeader}>ACCOUNT</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Image source={require('../assets/icons/user.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain'  }} />
                          <Text style={[styles.innerBoxSmallText, { marginLeft: windowWidth * 0.05, fontSize: windowWidth * 0.04, color: 'white',  fontWeight: 'bold' }]}>Personal Information</Text>
                          <Image source={require('../assets/icons/forward.png')} style={[styles.innerBoxImage, {marginLeft: windowWidth * 0.18, }]} />
                        </View>
                      </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={require('../assets/icons/flag.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain' }} />
                          <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.05, color: 'white', fontWeight: 'bold' }}>Country</Text>
                          <Text style={{ color: 'white', marginRight: 5, fontWeight: 'bold' }}>PH</Text>
                          <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image source={require('../assets/icons/internet.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain' }} />
                          <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.05, color: 'white', fontWeight: 'bold' }}>Language</Text>
                          <Text style={{ color: 'white', marginRight: 5, fontWeight: 'bold' }}>ENG</Text>
                          <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                        </View>
                    </View>
                    <View style={styles.innerBox3}>
                      <Text style={styles.innerBoxHeader}>GENERAL</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../assets/icons/information-button.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain'   }} />
                        <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.05, color: 'white',  fontWeight: 'bold', }}>About</Text>
                        <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../assets/icons/lock.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain'   }} />
                        <Text style={styles.innerBoxSmallText, { flex: 1, marginLeft: windowWidth * 0.05, color: 'white', fontWeight: 'bold',  }}>Privacy and Policy</Text>
                        <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                      </View>
                    </View>
            </ImageBackground>
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
    innerBoxSwitch: {
      width: windowWidth * 0.1, // Adjust as needed
      height: windowHeight * 0.04, // Adjust as needed
      resizeMode: 'contain',
      marginLeft: windowWidth * 0.02, // Add some margin to the left
    },
  centeredText: {
    fontSize: windowWidth * 0.09, // adjust as needed
    fontWeight: 'bold',
    color: '#62B7AF', // adjust as needed
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: windowHeight * 0.03,
  },
  box1: {
    flexDirection: 'row', // Keep this as 'row'
    width: windowWidth * 0.9, // Adjust the width as needed
    height: windowHeight * 0.15, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  borderWidth: 5,
  borderColor: 'white',
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'column', // Add this
    margin: windowWidth * 0.03,
    marginRight: windowWidth * 0.05,
  },
  boxImage: {
    width: windowWidth * 0.4, // Adjust as needed
    height: windowHeight * 0.13, // Adjust as needed
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
      borderWidth: 5,
      borderColor: 'white',
      overflow: 'hidden',
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
      color: '#32DBC5', // Adjust as needed
      fontWeight: 'bold', // Add some weight
      marginBottom: windowWidth * 0.02, // Add some margin to the bottom
    },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  headerBox: {
    width: '100%', // Full width
    height: windowHeight * 0.14, // Adjust the height as needed
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