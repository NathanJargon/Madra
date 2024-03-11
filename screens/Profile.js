import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Modal, TextInput } from 'react-native';
import { setupDatabase } from './Database';
import { firebase } from './FirebaseConfig';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Profile({ navigation }) {
  const [fullName, setFullName] = useState('USER');
  const [email, setEmail] = useState('user@gmail.com');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [inputValue, setInputValue] = useState('');
    const handleExit = () => {
      setModalVisible(false);
    };
  const [currentValue, setCurrentValue] = useState('');

  const updateUserCountryAndLanguage = async (username, selectedCountry, selectedLanguage) => {
    const db = await setupDatabase();
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Users SET country = ?, language = ? WHERE username = ?`,
        [selectedCountry, selectedLanguage, username],
        () => console.log('User country and language updated successfully'),
        (_, error) => console.log('Error updating user country and language:', error)
      );
    });
  };

    const handleSave = () => {
      const db = initDB();
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE Users SET ${selectedField} = ? WHERE email = ?`,
          [inputValue, email],
          () => {
            console.log('User data updated successfully');
            setModalVisible(false);
          },
          (_, error) => console.log('Error updating user data:', error)
        );
      });
    };

    const handleQuit = async () => {
      try {
        await AsyncStorage.clear();
        navigation.navigate('Auth'); 
      } catch(e) {
        // handle error
        console.log(e);
      }
    }

    const handleRowPress = (field) => {
      setSelectedField(field);
      const db = initDB();
      db.transaction(tx => {
        tx.executeSql(
          `SELECT ${field} FROM Users WHERE email = ?`,
          [email],
          (_, { rows }) => {
            if (rows.length > 0) {
              setCurrentValue(rows.item(0)[field]); // Set the current value
            }
          },
          (_, error) => console.log('Error fetching data:', error)
        );
      });
      setModalVisible(true);
    };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
        }, reject);
      });

      if (user) {
        const userEmail = user.email;
        const db = await setupDatabase();
        db.transaction(tx => {
          tx.executeSql(
            'SELECT email, phoneNumber, username, fullname FROM Users WHERE email = ?',
            [userEmail],
            (_, { rows }) => {
              if (rows.length > 0) {
                console.log('The logged email exists in the database');
              } else {
                console.log('The logged email does not exist in the database');
              }
            },
            (_, error) => console.log('Error fetching data:', error)
          );
        });
      } else {
        console.log('No user is logged in');
      }
    };

    fetchUser();
  }, []);


  return (
    <ImageBackground source={require('../assets/bg1.png')} style={styles.backgroundImage}>
      <View style={styles.centerBox}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{selectedField ? selectedField.toUpperCase() : 'Empty'}</Text>
              <TextInput
                style={{ height: windowHeight * 0.05, borderColor: 'gray', borderWidth: 2, borderRadius: 10, width: '80%', textAlign: 'center'}}
                onChangeText={text => setInputValue(text)}
                value={inputValue}
                placeholder={currentValue ? currentValue : 'EMPTY'}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.openButton} onPress={handleSave}>
                  <Text style={styles.textStyle}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.openButton} onPress={handleExit}>
                  <Text style={styles.textStyle}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        <Image source={require('../assets/icons/setting.png')} style={styles.settingsIcon} />
        <Image source={require('../assets/icons/edit.png')} style={styles.editIcon} />
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{fullName}</Text>
          <Text style={styles.emailText}>{email}</Text>
          <View style={styles.line} />

        <TouchableOpacity onPress={() => handleRowPress('fullName')}>
          <View style={styles.rowContainer}>

            <Image source={require('../assets/icons/edit.png')} style={styles.sideImage} />
            <TouchableOpacity onPress={() => handleRowPress(fullName)}>
              <Text style={styles.centerText}>PROFILE NAME</Text>
            </TouchableOpacity>
            <Image source={require('../assets/icons/forward.png')} style={styles.sideImage} />

          </View>
        </TouchableOpacity>


          <View style={styles.line} />

            <TouchableOpacity onPress={() => handleRowPress('username')}>
              <View style={styles.rowContainer}>
                <Image source={require('../assets/icons/user.png')} style={styles.sideImage} />
                <Text style={styles.centerText}>USERNAME</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.sideImage} />
              </View>
            </TouchableOpacity>

          <View style={styles.line} />

            <TouchableOpacity onPress={() => handleRowPress('password')}>
              <View style={styles.rowContainer}>
                <Image source={require('../assets/icons/padlock.png')} style={styles.sideImage} />
                <Text style={styles.centerText}>PASSWORD</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.sideImage} />
              </View>
            </TouchableOpacity>

          <View style={styles.line} />

            <TouchableOpacity onPress={() => handleRowPress('phoneNumber')}>
              <View style={styles.rowContainer}>
                <Image source={require('../assets/icons/phone-call.png')} style={styles.sideImage} />
                <Text style={styles.centerText}>PHONE NUMBER</Text>
                <Image source={require('../assets/icons/forward.png')} style={styles.sideImage} />
              </View>
            </TouchableOpacity>
          <View style={styles.line} />

          <TouchableOpacity onPress={handleQuit}>
            <View style={styles.rowContainer}>
              <Image source={require('../assets/icons/logout.png')} style={styles.sideImage} />
              <Text style={styles.centerText}>LOG OUT</Text>
              <Image source={require('../assets/icons/forward.png')} style={styles.sideImage} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.circleBox} />
      <Image source={require('../assets/icons/profilelogo.png')} style={styles.profileLogo} />
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLogo: {
    position: 'absolute',
    top: windowHeight * 0.09, // Increase this value as needed
    width: windowWidth * 0.4, // Adjust as needed
    height: windowHeight * 0.4, // Adjust as needed
    resizeMode: 'contain',
  },
  circleBox: {
    position: 'absolute',
    top: windowHeight * 0.175, // Same as profileLogo
    width: windowWidth * 0.45, // Same as profileLogo
    height: windowHeight * 0.2, // Same as profileLogo
    borderRadius: (windowWidth * 0.4) / 2, // Half of the width or height to make it a circle
    backgroundColor: 'white', // Change the color as needed
  },
  centerBox: {
    marginTop: windowHeight * 0.2, // Increase this value as needed
    width: windowWidth * 0.8, // Adjust the width as needed
    height: windowHeight * 0.55, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: "2%",
    left: "5%",
    width: "9%", // Adjust as needed
    height: "9%", // Adjust as needed
    resizeMode: 'contain',
  },
  editIcon: {
    position: 'absolute',
    top: "2%",
    right: "5%",
    width: "9%", // Adjust as needed
    height: "9%", // Adjust as needed
    resizeMode: 'contain',
  },
  infoContainer: {
  marginTop: '15%',
    alignItems: 'center',
  },
  nameText: {
    fontSize: windowWidth * 0.065, // Adjust as needed
    fontWeight: 'bold', // Adjust as needed
    textAlign: 'center',
  },
  emailText: {
    fontSize: windowWidth * 0.03, // Adjust as needed
    textAlign: 'center',
    marginBottom: windowHeight * 0.015,
  },
  line: {
    width: windowWidth * .65, // Adjust as needed
    height: 4, // Adjust as needed
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Adjust as needed
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: windowWidth * 0.65, // Adjust as needed
  },
  sideImage: {
    width: windowWidth * 0.05, // Adjust as needed
    height: windowHeight * 0.06, // Adjust as needed
    resizeMode: 'contain',
  },
  centerText: {
    fontSize: windowWidth * 0.04, // Adjust as needed
    textAlign: 'center',
    fontWeight: 'bold',
  },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
  openButton: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    elevation: 2,
    width: '50%', // Adjust as needed
    alignItems: 'center',
    marginTop: windowHeight * 0.03,
    margin: 10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: windowWidth * 0.045, // Adjust as needed
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Adjust as needed
  },
  modalText: {
    fontWeight: 'bold',
    textAlign: "center",
    fontSize: windowWidth * 0.045, // Adjust as needed
  },
});