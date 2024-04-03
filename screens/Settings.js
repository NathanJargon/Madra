import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Modal } from 'react-native';
import { setupDatabase } from './Database';
import { firebase } from './FirebaseConfig';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../UserContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Settings({ navigation }) {
  const { info, setInfo } = useContext(UserContext);
  const [fullName, setFullName] = useState("LOADING...");
  const [email, setEmail] = useState("user@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("0999928751");
  const [username, setUsername] = useState('user');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLang, setModalVisibleLang] = useState(false);
  const [modalVisibleAlerts, setModalVisibleAlerts] = useState(false);
  const [modalVisibleDetails, setModalVisibleDetails] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('PH');
  const [selectedLanguage, setSelectedLanguage] = useState('FIL');
    const [minMagnitude, setMinMagnitude] = useState('4.0');
    const [timePeriod, setTimePeriod] = useState('past7days');
  const [imageUri , setImageUri] = useState(null);

    const [emailAlerts, setEmailAlerts] = useState(false);
    const [pushAlerts, setPushAlerts] = useState(false);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [dailyAlerts, setDailyAlerts] = useState(false);
    const [weeklyAlerts, setWeeklyAlerts] = useState(false);
    const [monthlyAlerts, setMonthlyAlerts] = useState(false);

    useEffect(() => {
      const loadUserData = async () => {
        try {
          const userFullName = await AsyncStorage.getItem('fullName');
          const userEmail = await AsyncStorage.getItem('email');
          const userPhoneNumber = await AsyncStorage.getItem('phoneNumber');

          if (info.fullName) {
            setFullName(info.fullName);
          } else if (userFullName) {
            setFullName(userFullName);
          } else {
            setFullName('user');
          }

          if (info.email) {
            setEmail(info.email);
          } else if (userEmail) {
            setEmail(userEmail);
          } else {
            setEmail('user@gmail.com');
          }

          if (info.phoneNumber) {
            setPhoneNumber(info.phoneNumber);
          } else if (userPhoneNumber) {
            setPhoneNumber(userPhoneNumber);
          } else {
            setPhoneNumber('12396162');
          }
        } catch (e) {
          console.error('Failed to load user data from storage.', e);
        }
      };

      loadUserData();
    }, [info]);

    useEffect(() => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        firebase.firestore().collection('users').doc(user.email).get()
          .then((doc) => {
            if (doc.exists) {
              setEmailAlerts(doc.data().emailAlerts);
              setPushAlerts(doc.data().pushAlerts);
              setSmsAlerts(doc.data().smsAlerts);
              setDailyAlerts(doc.data().dailyAlerts);
              setWeeklyAlerts(doc.data().weeklyAlerts);
              setMonthlyAlerts(doc.data().monthlyAlerts);
            } else {
              console.log("No such document!");
            }
          }).catch((error) => {
            console.log("Error getting document:", error);
          });
      }
    }, [email]);

    const toggleEmailAlerts = () => {
      setEmailAlerts(prevState => {
        const newValue = !prevState;
        updateUserAlertSetting('emailAlerts', newValue);
        return newValue;
      });
    };

    const togglePushAlerts = () => {
      setPushAlerts(prevState => {
        const newValue = !prevState;
        updateUserAlertSetting('pushAlerts', newValue);
        return newValue;
      });
    };

    const toggleSMSAlerts = () => {
      setSmsAlerts(prevState => {
        const newValue = !prevState;
        updateUserAlertSetting('smsAlerts', newValue);
        return newValue;
      });
    };

    const toggleDailyAlerts = () => {
      setDailyAlerts(prevState => {
        const newValue = !prevState;
        updateUserAlertSetting('dailyAlerts', newValue);
        return newValue;
      });
    };

    const toggleWeeklyAlerts = () => {
      setWeeklyAlerts(prevState => {
        const newValue = !prevState;
        updateUserAlertSetting('weeklyAlerts', newValue);
        return newValue;
      });
    };

    const toggleMonthlyAlerts = () => {
      setMonthlyAlerts(prevState => {
        const newValue = !prevState;
        updateUserAlertSetting('monthlyAlerts', newValue);
        return newValue;
      });
    };

    const updateUserAlertSetting = async (field, value) => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        try {
          await firebase.firestore().collection('users').doc(user.email).update({
            [field]: value
          });
          console.log(`User ${field} status updated successfully`);
        } catch (error) {
          console.log(`Error updating user ${field} status:`, error);
        }
      }
    };

    useEffect(() => {
      // This code will run whenever minMagnitude or timePeriod changes
      console.log('MinMagnitude has been updated to:', minMagnitude);
      console.log('TimePeriod has been updated to:', timePeriod);
    }, [minMagnitude, timePeriod]);

    const updateMinMagnitude = async (value) => {
      // Update the minMagnitude state
      setMinMagnitude(value);

      // Update the minMagnitude field in Firebase for the current user
      const user = firebase.auth().currentUser;
      if (user != null) {
        firebase.firestore().collection('users').doc(user.email).update({
          minMagnitude: value
        })
        .then(() => console.log('User minimum magnitude updated successfully'))
        .catch(error => console.log('Error updating user minimum magnitude:', error));
      }
    };

    const updateTimePeriod = async (value) => {
      // Update the timePeriod state
      setTimePeriod(value);
      await AsyncStorage.setItem('timePeriod', value);
      // Update the timePeriod field in Firebase for the current user
      const user = firebase.auth().currentUser;
      if (user != null) {
        firebase.firestore().collection('users').doc(user.email).update({
          timePeriod: value
        })
        .then(() => console.log('User time period updated successfully'))
        .catch(error => console.log('Error updating user time period:', error));
      }
    };


    const updateUserCountryAndLanguage = async (email, selectedCountry, selectedLanguage) => {
      const selectedCountryObject = countries.find(country => country.code === selectedCountry);

      try {
        await firebase.firestore().collection('users').doc(email).update({
          country: selectedCountryObject ? selectedCountryObject.name : '',
          language: selectedLanguage
        });
        console.log('User country and language updated successfully');
      } catch (error) {
        console.log('Error updating user country and language:', error);
      }
    };


    const countries = [
      { code: 'PH', name: 'Philippines' },
      { code: 'US', name: 'United States' },
      { code: 'IN', name: 'India' },
      { code: 'BR', name: 'Brazil' },
      { code: 'RU', name: 'Russia' },
      { code: 'DE', name: 'Germany' },
      { code: 'JP', name: 'Japan' },
      { code: 'UK', name: 'United Kingdom' },
      { code: 'FR', name: 'France' },
      { code: 'ZA', name: 'South Africa' },
      { code: 'CN', name: 'China' },
      { code: 'CA', name: 'Canada' },
      { code: 'AU', name: 'Australia' },
      { code: 'IT', name: 'Italy' },
      { code: 'ES', name: 'Spain' },
      { code: 'MX', name: 'Mexico' },
      { code: 'NZ', name: 'New Zealand' },
      { code: 'AR', name: 'Argentina' },
      { code: 'KE', name: 'Kenya' },
      { code: 'EG', name: 'Egypt' },
      { code: 'SG', name: 'Singapore' },
      { code: 'TW', name: 'Taiwan' },
    ];

  const selectedCountryObject = countries.find(country => country.name === selectedCountry);
  
    const languages = [
        { code: 'PH', name: 'Filipino', shortName: 'FIL' },
        { code: 'US', name: 'English', shortName: 'ENG' },
        { code: 'IN', name: 'Hindi', shortName: 'HIN' },
        { code: 'BR', name: 'Portuguese', shortName: 'POR' },
        { code: 'RU', name: 'Russian', shortName: 'RUS' },
        { code: 'DE', name: 'German', shortName: 'GER' },
        { code: 'JP', name: 'Japanese', shortName: 'JPN' },
        { code: 'FR', name: 'French', shortName: 'FRA' },
        { code: 'ZA', name: 'Afrikaans', shortName: 'AFR' },
        { code: 'CN', name: 'Mandarin', shortName: 'MAN' },
    ];


    useEffect(() => {
        const loadUserData = async () => {
          try {
            const minManitude = await AsyncStorage.getItem('minMagnitude');
            const monthlyAlerts = await AsyncStorage.getItem('monthlyAlerts');
            const pushAlerts = await AsyncStorage.getItem('pushAlerts');
            const smsAlerts = await AsyncStorage.getItem('smsAlerts');
            const timePeriod = await AsyncStorage.getItem('timePeriod');
            const weeklyAlerts = await AsyncStorage.getItem('weeklyAlerts');
            const dailyAlerts = await AsyncStorage.getItem('dailyAlerts');
            const emailAlerts = await AsyncStorage.getItem('emailAlerts');
            const imageUri = await AsyncStorage.getItem('imageUri');
            const userEmail = await AsyncStorage.getItem('email');
            const userName = await AsyncStorage.getItem('username');
            const userFullName = await AsyncStorage.getItem('fullName');
            const userCountry = await AsyncStorage.getItem('country');
            const userLanguage = await AsyncStorage.getItem('language');
            const isNotified = await AsyncStorage.getItem('isNotified');

            if (isNotified) setIsNotified(isNotified === 'true');
            if (minManitude) setMinMagnitude(minManitude);
            if (monthlyAlerts) setMonthlyAlerts(monthlyAlerts === 'true');
            if (pushAlerts) setPushAlerts(pushAlerts === 'true');
            if (smsAlerts) setSmsAlerts(smsAlerts === 'true');
            if (timePeriod) setTimePeriod(timePeriod);
            if (weeklyAlerts) setWeeklyAlerts(weeklyAlerts === 'true');
            if (dailyAlerts) setDailyAlerts(dailyAlerts === 'true');
            if (emailAlerts) setEmailAlerts(emailAlerts === 'true');

            if (userEmail) setEmail(userEmail);
            if (userFullName) setFullName(userFullName);
            if (userName) setUsername(userName);
            if (userLanguage) setSelectedLanguage(userLanguage);
            if (userCountry) {
              let countryInitials;
              if (userCountry.split(' ').length > 1) {
                // If the country name has more than one word, take the first letter of each word
                countryInitials = userCountry.split(' ').map(word => word.charAt(0)).join('');
              } else {
                // If the country name is a single word, take the first two letters
                countryInitials = userCountry.substring(0, 2);
              }
              setSelectedCountry(countryInitials.toUpperCase());
            }
          } catch (e) {
            console.error('Failed to load user data from storage.', e);
          }
        };

      loadUserData();
    }, []);
    
    useEffect(() => {
      const user = firebase.auth().currentUser;
    
      if (user != null) {
        setEmail(user.email);
        const unsubscribe = firebase.firestore().collection('users').doc(user.email).onSnapshot(async doc => {
          if (doc.exists) {
            const userData = doc.data();
            setUsername(userData.username);
            setFullName(userData.fullName);
            setEmail(userData.email); // Add this line
            setPhoneNumber(userData.phoneNumber); // Add this line
            const userImageUri = userData.imageUri;
            if (userImageUri) {
              setImageUri(userImageUri);
            }
            // Find the country object from the countries array
            const countryObject = countries.find(country => country.name === userData.country);
    
            // Set the selectedCountry state to the country code
            setSelectedCountry(countryObject ? countryObject.code : 'PH');
    
            setSelectedLanguage(userData.language);
    
            // Save the user data to AsyncStorage
            await AsyncStorage.setItem('imageUri', userData.imageUri);
            await AsyncStorage.setItem('email', userData.email);
            await AsyncStorage.setItem('username', userData.username);
            await AsyncStorage.setItem('fullName', userData.fullName);
            await AsyncStorage.setItem('country', userData.country);
            await AsyncStorage.setItem('language', userData.language);
            await AsyncStorage.setItem('isNotified', userData.isNotified ? 'true' : 'false');
            await AsyncStorage.setItem('minMagnitude', userData.minMagnitude || '5.0'); // Default to '5.0' if not present
            await AsyncStorage.setItem('monthlyAlerts', userData.monthlyAlerts ? 'true' : 'false');
            await AsyncStorage.setItem('pushAlerts', userData.pushAlerts ? 'true' : 'false');
            await AsyncStorage.setItem('smsAlerts', userData.smsAlerts ? 'true' : 'false');
            await AsyncStorage.setItem('timePeriod', userData.timePeriod || 'all_day'); // Default to 'all_day' if not present
            await AsyncStorage.setItem('weeklyAlerts', userData.weeklyAlerts ? 'true' : 'false');
            await AsyncStorage.setItem('dailyAlerts', userData.dailyAlerts ? 'true' : 'false');
            await AsyncStorage.setItem('emailAlerts', userData.emailAlerts ? 'true' : 'false');

          }
        }, error => {
          console.error("Error getting document:", error);
        });
    
        // Clean up the onSnapshot listener when the component is unmounted
        return () => unsubscribe();
      }
    }, []);


    const [isNotified, setIsNotified] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const toggleNotification = async () => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        setIsNotified(prevState => {
          const newValue = !prevState;

          firebase.firestore().collection('users').doc(user.email).update({
            isNotified: newValue
          })
          .then(() => {
            console.log('User notification status updated successfully');
          })
          .catch(error => {
            console.error('Error updating user notification status:', error);
          });

          return newValue;
        });

        setIsButtonDisabled(true);
        setTimeout(() => setIsButtonDisabled(false), 1000); // Enable the button after 5 seconds
      } else {
        console.error('Cannot update notification status: No user is logged in');
      }
    };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <ImageBackground source={require('../assets/bg1.png')} style={[styles.modalView, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{color: '#B6E6CF', fontSize: windowWidth * 0.075, textAlign: 'center' }}>Choose a country</Text>
            <Text style={{color: '#B6E6CF', fontSize: windowWidth * 0.03, marginBottom: windowHeight * 0.025, textAlign: 'center', }}>This will set which country to fetch earthquakes!</Text>
            <ScrollView style={{ height: windowHeight * 0.3 }}>
              {countries.map((country, index) => (
                <View key={index} style={{ height: windowHeight * 0.09 }}>
                  <TouchableOpacity
                    style={styles.countryBox}
                    onPress={() => {
                      setSelectedCountry(country.code);
                      setModalVisible(!modalVisible);
                      updateUserCountryAndLanguage(email, country.code, selectedLanguage);
                    }}
                  >
                    <Text style={styles.modalText}>{country.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#127B6E" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleLang}
        onRequestClose={() => {
          setModalVisibleLang(!modalVisibleLang);
        }}
      >
        <View style={styles.centeredView}>
          <ImageBackground source={require('../assets/bg1.png')} style={[styles.modalView, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{color: '#B6E6CF', fontSize: windowWidth * 0.075, marginBottom: windowHeight * 0.025, textAlign: 'center', }}>Choose a language</Text>
            <ScrollView style={{ height: windowHeight * 0.3 }}>
              {languages.map((language, index) => (
                <View key={index} style={{ height: windowHeight * 0.09 }}>
                    <TouchableOpacity
                      style={styles.countryBox}
                      onPress={() => {
                        setSelectedLanguage(language.shortName);
                        setModalVisibleLang(!modalVisibleLang);
                        updateUserCountryAndLanguage(email, language.name, selectedLanguage);
                      }}
                    >
                      <Text style={styles.modalText}>{language.name}</Text>
                    </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#127B6E" }}
              onPress={() => {
                setModalVisibleLang(!modalVisibleLang);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleAlerts}
          onRequestClose={() => {
            setModalVisibleAlerts(!modalVisibleAlerts);
          }}
        >
          <View style={styles.centeredView}>
          <ImageBackground source={require('../assets/bg1.png')} style={[styles.modalView, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{color: '#B6E6CF', fontSize: windowWidth * 0.075, marginBottom: windowHeight * 0.025, textAlign: 'center', }}>Customize Alerts</Text>

              <Text style={{color: '#B6E6CF', fontWeight: 'bold',  fontSize: windowWidth * 0.05, marginBottom: windowHeight * 0.025, textAlign: 'center', }}>Alert Type</Text>
              <TouchableOpacity onPress={toggleEmailAlerts}>
                <Text style={[styles.alertText, {backgroundColor: (emailAlerts) ? '#0C6B5F' : 'transparent'}]}>Email Alerts: {emailAlerts ? 'On' : 'Off'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePushAlerts}>
                <Text style={[styles.alertText, {backgroundColor: (pushAlerts) ? '#0C6B5F' : 'transparent'}]}>Push Notifications: {pushAlerts ? 'On' : 'Off'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSMSAlerts}>
                <Text style={[styles.alertText, {backgroundColor: (smsAlerts) ? '#0C6B5F' : 'transparent'}]}>SMS Alerts: {smsAlerts ? 'On' : 'Off'}</Text>
              </TouchableOpacity>

              <Text style={{color: '#B6E6CF', fontWeight: 'bold', fontSize: windowWidth * 0.05, margin: windowHeight * 0.025, textAlign: 'center', }}>Alert Frequency</Text>
              <TouchableOpacity onPress={toggleDailyAlerts}>
                <Text style={[styles.alertText, {backgroundColor: (dailyAlerts) ? '#0C6B5F' : 'transparent'}]}>Daily Alerts: {dailyAlerts ? 'On' : 'Off'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleWeeklyAlerts}>
                <Text style={[styles.alertText, {backgroundColor: (weeklyAlerts) ? '#0C6B5F' : 'transparent'}]}>Weekly Alerts: {weeklyAlerts ? 'On' : 'Off'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleMonthlyAlerts}>
                <Text style={[styles.alertText, { marginBottom: windowHeight * 0.02, backgroundColor: (monthlyAlerts) ? '#0C6B5F' : 'transparent'}]}>Monthly Alerts: {monthlyAlerts ? 'On' : 'Off'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...styles.openButton, backgroundColor: "#127B6E" }}
                onPress={() => {
                  setModalVisibleAlerts(!modalVisibleAlerts);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </Modal>


    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleDetails}
      onRequestClose={() => {
        setModalVisibleLang(!modalVisibleDetails);
      }}
    >
      <View style={styles.centeredView}>
          <ImageBackground source={require('../assets/bg1.png')} style={[styles.modalView, { justifyContent: 'center', alignItems: 'center', width: windowWidth * .85, }]}>
          <Text style={{color: '#B6E6CF', fontSize: windowWidth * 0.075, marginBottom: windowHeight * 0.01, textAlign: 'center', }}>Customize Earthquake Details</Text>

          <Text style={{color: '#B6E6CF', fontWeight: 'bold', fontSize: windowWidth * 0.05, margin: windowHeight * 0.025, textAlign: 'center', }}>Minimum Magnitude</Text>

            <TouchableOpacity
              onPress={() => updateMinMagnitude('4.0')}
            >
              <Text style={[styles.alertText, {backgroundColor: (minMagnitude === '4.0') ? '#0C6B5F' : 'transparent'}]}>Set to 4.0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateMinMagnitude('5.0')}
            >
              <Text style={[styles.alertText, {backgroundColor: (minMagnitude === '5.0') ? '#0C6B5F' : 'transparent'}]}>Set to 5.0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateMinMagnitude('6.0')}
            >
              <Text style={[styles.alertText, {backgroundColor: (minMagnitude === '6.0') ? '#0C6B5F' : 'transparent'}]}>Set to 6.0</Text>
            </TouchableOpacity>

          <Text style={{color: '#B6E6CF', fontWeight: 'bold', fontSize: windowWidth * 0.05, margin: windowHeight * 0.025, textAlign: 'center', }}>Time Period</Text>
          <TouchableOpacity onPress={() => updateTimePeriod('all_day')}>
            <Text style={[styles.alertText, {backgroundColor: (timePeriod === 'all_day') ? '#0C6B5F' : 'transparent'}]}>Daily Period</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateTimePeriod('all_week')}>
            <Text style={[styles.alertText, {backgroundColor: (timePeriod === 'all_week') ? '#0C6B5F' : 'transparent'}]}>Weekly Period</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateTimePeriod('all_month')}>
            <Text style={[styles.alertText, {backgroundColor: (timePeriod === 'all_month') ? '#0C6B5F' : 'transparent'}]}>Monthly period</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateTimePeriod('all_year')}>
            <Text style={[styles.alertText, {backgroundColor: (timePeriod === 'all_year') ? '#0C6B5F' : 'transparent', marginBottom: windowHeight * 0.02}]}>Yearly Period</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: "#127B6E" }}
            onPress={() => {
              setModalVisibleDetails(!modalVisibleDetails);
            }}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </Modal>




        <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
          <View style={styles.headerBox}>
            <View style={styles.headerContent}>
              <Text style={styles.centeredText}>SETTINGS</Text>
            </View>
          </View>
          <View style={styles.boxRow}>
            <ImageBackground source={require('../assets/settingsTop.png')} style={styles.box1}>
            <Image source={imageUri ? { uri: imageUri } : require('../assets/icons/profilelogo.png')} style={styles.boxImage} />
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
                    <TouchableOpacity onPress={toggleNotification} disabled={isButtonDisabled}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.05,  marginLeft: windowWidth * 0.1, color: 'white', }}>Madrification</Text>
                        <Image source={isNotified ? require('../assets/icons/on-button.png') : require('../assets/icons/off-button.png')} style={styles.innerBoxSwitch} />
                      </View>
                    </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisibleAlerts(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                  <Text style={[styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.03, color: 'white', marginLeft: windowWidth * 0.2, }]}>Customizable Alerts</Text>
                  <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisibleDetails(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                  <Text style={[styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.03, color: 'white', marginLeft: windowWidth * 0.2 }]}>Earthquake Details</Text>
                  <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                </View>
              </TouchableOpacity>
                </View>
                    <View style={styles.innerBox2}>
                      <Text style={styles.innerBoxHeader}>ACCOUNT</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                          <Image source={require('../assets/icons/user.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain'  }} />
                          <Text style={[styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.03, color: 'white', marginLeft: windowWidth * 0.005, }]}>Personal Information</Text>
                          <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                        </View>
                      </TouchableOpacity>
                          <TouchableOpacity onPress={() => setModalVisible(true)}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                              <Image source={require('../assets/icons/flag.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain' }} />
                              <Text style={[styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.03, color: 'white', marginLeft: windowWidth * 0.005, }]}>Country</Text>
                              <Text style={{ color: 'green', }}>{selectedCountry}</Text>
                              <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisibleLang(true)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                              <Image source={require('../assets/icons/internet.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain' }} />
                              <Text style={[styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.03, color: 'white', marginLeft: windowWidth * 0.025, }]}>Language</Text>
                              <Text style={{ color: 'green',}}>{selectedLanguage}</Text>
                              <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.innerBox3}>
                      <Text style={styles.innerBoxHeader}>GENERAL</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('About')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                            <Image source={require('../assets/icons/information-button.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain'   }} />
                            <Text style={[styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.03, color: 'white', marginRight: windowWidth * 0.25, }]}>About</Text>
                            <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigation.navigate('Policy')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                            <Image source={require('../assets/icons/lock.png')} style={{ width: windowWidth * 0.05, height: windowHeight * 0.035, marginLeft: windowWidth * 0.05, resizeMode: 'contain'   }} />
                            <Text style={[styles.innerBoxSmallText, { fontFamily: 'glacial-indifference-bold', fontSize: windowWidth * 0.03, color: 'white', marginLeft: windowWidth * 0.005, }]}>Privacy and Policy</Text>
                            <Image source={require('../assets/icons/forward.png')} style={styles.innerBoxImage} />
                          </View>
                      </TouchableOpacity>
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
    },
    innerBoxSwitch: {
      width: windowWidth * 0.1, // Adjust as needed
      height: windowHeight * 0.04, // Adjust as needed
      resizeMode: 'contain',
      marginLeft: windowWidth * 0.2, // Add some margin to the left
    },
  centeredText: {
    fontSize: windowWidth * 0.09, // adjust as needed
    fontFamily: 'glacial-indifference-bold',
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
    width: windowWidth * 0.25, // Adjust as needed
    height: windowHeight * 0.12, // Adjust as needed
    resizeMode: 'cover', // Or 'cover'
    borderRadius: 100,
    overflow: 'hidden',
  },
  boxText1: {
    fontSize: windowWidth * 0.05, // Adjust as needed
    width: windowWidth * 0.5,
    color: '#FFFFFF', // Adjust as needed
    marginTop: windowHeight * 0.01, // Adjust as needed
    fontFamily: 'glacial-indifference-bold',
  },
  boxText2: {
    fontSize: windowWidth * 0.025, // Adjust as needed
    color: '#FFFFFF', // Adjust as needed
    fontFamily: 'glacial-indifference-bold',
  },
  boxText3: {
    fontSize: windowWidth * 0.025, // Adjust as needed
    color: '#FFFFFF', // Adjust as needed
    fontFamily: 'glacial-indifference-bold',
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
      height: windowHeight * 0.175, // Adjust as needed
      backgroundColor: 'rgba(255, 255, 255, 0)', // Change the color as needed
      borderRadius: 10, // Adjust as needed
      justifyContent: 'flex-start', // Align items to the start
      alignItems: 'flex-start', // Align items to the left
      padding: 10, // Add some padding
    },
    innerBox2: {
      flexDirection: 'column', // Change this
      width: windowWidth * 0.8, // Adjust as needed
      height: windowHeight * 0.175, // Adjust as needed
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
      fontSize: windowWidth * 0.04, // Adjust as needed
      color: '#32DBC5', // Adjust as needed
      fontFamily: 'glacial-indifference-bold',
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: windowHeight * 0.01,
  },
  modalView: {
    margin: 20,
    width: windowWidth * .75,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    width: windowWidth * 0.15,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    color: 'white',
    fontWeight: "bold",
    fontSize: windowWidth * 0.055,
   },
  countryBox: { // Add this style
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    fontSize: windowWidth * 0.04,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: 20,
    padding: 10,
    margin: 2,
  },
});