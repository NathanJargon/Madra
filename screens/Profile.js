import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Modal, TextInput } from 'react-native';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

const id = uuidv4();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Profile({ navigation }) {
  const { info, setInfo } = useContext(UserContext);
  const [fullName, setFullName] = useState('LOADING...');
  const [email, setEmail] = useState('user@gmail.com');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleExit = () => {
    setModalVisible(false);
  };

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      uploadImage(result.assets[0].uri); // Call the uploadImage function here
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageName = uuidv4();
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    ref.put(blob).then(async (snapshot) => {
      const downloadURL = await snapshot.ref.getDownloadURL();
      firebase.firestore().collection('users').doc(email).update({
        imageUri: downloadURL
      });
      await AsyncStorage.setItem('imageUri', downloadURL);
      setImageUri(downloadURL);
    });
  };

  const retrieveImageUri = async () => {
    const storedImageUri = await AsyncStorage.getItem('imageUri');
    if (storedImageUri !== null) {
      setImageUri(storedImageUri);
    }
  };

  useEffect(() => {
    retrieveImageUri(); // Call the retrieveImageUri function here
  }, []);

  const updateUserCountryAndLanguage = async (email, selectedCountry, selectedLanguage) => {
    firebase.firestore().collection('users').doc(email).update({
      country: selectedCountry,
      language: selectedLanguage
    })
    .then(() => console.log('User country and language updated successfully'))
    .catch(error => console.log('Error updating user country and language:', error));
  };

    const handleSave = () => {
      firebase.firestore().collection('users').doc(email).update({
        [selectedField]: inputValue
      })
      .then(async () => {
        console.log('User data updated successfully');
        setModalVisible(false);
        // Update the corresponding state variable
        if (selectedField === 'fullName') {
          setFullName(inputValue);
          setInfo(prevInfo => ({ ...prevInfo, fullName: inputValue }));
          await AsyncStorage.setItem('fullName', inputValue);
        } else if (selectedField === 'email') {
          setEmail(inputValue);
          setInfo(prevInfo => ({ ...prevInfo, email: inputValue }));
          await AsyncStorage.setItem('email', inputValue);
        } else if (selectedField === 'phoneNumber') {
          setPhoneNumber(inputValue);
          setInfo(prevInfo => ({ ...prevInfo, phoneNumber: inputValue }));
          await AsyncStorage.setItem('phoneNumber', inputValue);
        }
      })
      .catch(error => {
        console.log('Error updating user data:', error);
        // Show an alert if there is an error
        alert('Error updating user data: ' + error.message);
      });
    };

    const handleQuit = async () => {
      try {
        await AsyncStorage.clear();
        await firebase.auth().signOut();
        navigation.navigate('Auth');
      } catch(e) {
        // handle error
        console.log(e);
      }
    }

    const handleRowPress = (field) => {
      setSelectedField(field);
      firebase.firestore().collection('users').doc(email).get()
        .then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            const fieldValue = userData[field] || ''; // Use an empty string if userData[field] is undefined
            setCurrentValue(fieldValue); // Set the current value
            setInputValue(fieldValue); // Set the input value
          } else {
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
      setModalVisible(true);
    };

    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          const userEmail = user.email;
          firebase.firestore().collection('users').doc(userEmail).onSnapshot(async doc => {
            if (doc.exists) {
              const userData = doc.data();
              setEmail(userData.email);
              setFullName(userData.fullName);
              // Store fullName and email in AsyncStorage
              await AsyncStorage.setItem('fullName', userData.fullName);
              await AsyncStorage.setItem('email', userData.email);
            } else {
              console.log('No such document!');
            }
          }, error => {
            console.log('Error getting document:', error);
          });
        } else {
          console.log('No user is logged in');
        }
      });

      // Clean up the observer when the component is unmounted
      return () => unsubscribe();
    }, []);

    useEffect(() => {
      const loadUserData = async () => {
        const storedFullName = await AsyncStorage.getItem('fullName');
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedFullName !== null) {
          setFullName(storedFullName);
        }
        if (storedEmail !== null) {
          setEmail(storedEmail);
        }
      };

      loadUserData();
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
        <TouchableOpacity onPress={openImagePicker} style={styles.profileLogo}>
          <Image source={imageUri ? { uri: imageUri } : require('../assets/icons/profilelogo.png')} style={styles.profileLogoImage} />
        </TouchableOpacity>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
    profileLogo: {
      position: 'absolute',
      top: windowHeight * 0.19, // Increase this value as needed
      width: windowWidth * 0.4, // Adjust as needed
      height: windowHeight * 0.4, // Adjust as needed
    },
    profileLogoImage: {
      width: '100%',
      height: '50%',
      resizeMode: 'cover', // Change this line
      borderRadius: 100,
      overflow: 'hidden',
    },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBox: {
    position: 'absolute',
    top: windowHeight * 0.18, // Same as profileLogo
    width: windowWidth * 0.45, // Same as profileLogo
    height: windowHeight * 0.22, // Same as profileLogo
    borderRadius: 100, // Half of the width or height to make it a circle
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