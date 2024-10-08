import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ImageBackground, TextInput } from 'react-native';
import LoadingScreen from './LoadingScreen';
import { RadioButton } from 'react-native-paper'; // Import RadioButton from react-native-paper
import * as ImagePicker from 'expo-image-picker';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this line
    const [bottomContent, setBottomContent] = useState('default');
    const [bottomHeight, setBottomHeight] = useState(windowHeight / 2.5);
    const bottomContentRef = useRef(bottomContent);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [signUpBottomHeight, setSignUpBottomHeight] = useState(windowHeight / 1.25); // Add this line
    const [gender, setGender] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [isCustomSelected, setIsCustomSelected] = useState(false);
    const [bgImage, setBgImage] = useState(require('../assets/bgoutside.png'));
    const [phoneNumber, setPhoneNumber] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
      setIsLoading(true); // Start loading
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          // User is signed in.
          if (user.emailVerified) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
            setIsAuthenticated(true);
          } else {
            alert('Please verify your email before logging in.');
          }
        } else {
          // User is signed out.
          setIsAuthenticated(false);

          // Try to log in the user automatically
          const email = await AsyncStorage.getItem('email');
          const password = await AsyncStorage.getItem('password');
          if (email && password) {
            try {
              await firebase.auth().signInWithEmailAndPassword(email, password);
              if (firebase.auth().currentUser.emailVerified) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
                setIsAuthenticated(true);
              } else {
                alert('Please verify your email before logging in.');
              }
            } catch (error) {
              console.error('Error while logging in:', error);
            }
          }
        }
        setIsLoading(false); // Stop loading
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (month && day && year) {
        setBirthday(`${month}-${day}-${year}`);
      }
    }, [month, day, year]);
    
    const handleSignUpButtonPress = async () => {
      if (username === '' || email === '' || password === '') {
        alert('Username, email and password cannot be empty.');
      } else {
        try {
          setButtonDisabled(true); // Disable the button
          await handleSignUp(gender, fullName, username, email, password, birthday, phoneNumber);
          setTimeout(() => setButtonDisabled(false), 1000); // Enable the button after 1 second
        } catch (error) {
          console.error('Error during sign up:', error);
          setButtonDisabled(false); // Enable the button if there was an error
        }
      }
    };

    const handleSignUp = async (gender, fullName, username, email, password, birthday, phoneNumber) => {
      try {
        if (!email) {
          alert('Email cannot be null or undefined.');
          return;
        }
    
        // Remove trailing spaces
        email = email.trim();
    
        // Check if email contains non-ASCII characters
        const asciiRegex = /^[\x00-\x7F]*$/;
        if (!asciiRegex.test(email)) {
          alert('Email cannot contain non-ASCII characters.');
          return;
        }
    
        // Check if email is too long
        if (email.length > 254) {
          alert('Email cannot be more than 254 characters.');
          return;
        }
    
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert('The email address is badly formatted.');
          return;
        }    

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (password.length < 6) {
          alert('Password must be at least 6 characters long.');
          return;
        }

        if (username.length > 10) {
          alert('Username cannot be more than 10 characters.');
          return;
        }
            
        await user.sendEmailVerification();
        alert('A verification email has been sent to your email. Please verify your email before logging in.');
    
        // Store user data in Firebase Firestore
        await firebase.firestore().collection('users').doc(email).set({
          gender,
          fullName,
          username,
          email,
          birthday,
          phoneNumber,
          imageUri: imageUri || null,
          country: "Philippines",
          isNotified: false,
          language: "FIL",
          emailAlerts: false,
          pushAlerts: false,
          smsAlerts: false,
          dailyAlerts: false,
          weeklyAlerts: false,
          monthlyAlerts: false,
          minMagnitude: "4.0",
          timePeriod: "all_week",
          password: password,
          imageUri,
        });
    
        console.log('User inserted successfully');
      } catch (error) {
        console.error('Error while signing up:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('The email address is already in use by another account.');
        } else if (error.code === 'auth/invalid-email') {
          alert('The email address is badly formatted.');
        } else if (error.code === 'auth/operation-not-allowed') {
          alert('Email/password accounts are not enabled. Enable email/password in Firebase Console.');
        } else if (error.code === 'auth/weak-password') {
          alert('The password is not strong enough.');
        }
      }
    
      setIsLoading(false);
    
      setTimeout(() => {
        setButtonDisabled(false);
      }, 1000);
    };

    const handleLogin = async () => {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Your login session has expired. Please login again.');
        return;
      }

      console.log('Email: ', email);
      
      try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
          await AsyncStorage.setItem('userLoggedIn', 'true'); // Set the flag
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
      
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });

          setIsAuthenticated(true);
        } else {
          alert('Please verify your email before logging in.');
          setIsLoading(false);
          setButtonDisabled(false);
          return;
        }
      } catch (error) {
        console.error('Error while logging in:', error);
        console.log('Error code:', error.code); // Print out the error code
        console.log('Error message:', error.message); // Print out the error message
    
        if (error.code === 'auth/user-not-found') {
          alert('The email does not exist. Please check and try again.');
        } else if (error.code === 'auth/wrong-password') {
          alert('The password is incorrect. Please check and try again.');
        } else if (error.code === 'auth/invalid-credential') {
          alert('The supplied auth credential is incorrect, malformed or has expired. Please check and try again.');
        } else if (error.code === 'auth/invalid-email') {
          alert('The email address is badly formatted. Please check and try again.');
        } else if (error.code === 'auth/user-disabled') {
          alert('The user corresponding to the given email has been disabled.');
        } else if (error.code === 'auth/too-many-requests') {
          alert('Too many unsuccessful login attempts. Please try again later.');
        }
      }

      setIsLoading(false);
      setButtonDisabled(false);
    };




  useEffect(() => {
    // If the user is authenticated, show the login form
    if (!isAuthenticated) {
      setBottomContent('login');
      setBottomHeight(windowHeight / 1.6);
    } else {
      // If the user is not authenticated, show the sign-up form
      setBottomContent('createAccount');
      setSignUpBottomHeight(windowHeight / 1.25); // Adjust this value as needed
    }
  }, [isAuthenticated]);

  useEffect(() => {
    bottomContentRef.current = bottomContent;
  }, [bottomContent]);

  useEffect(() => {
    setBgImage(bottomContent === 'createAccount' ? require('../assets/bg1.png') : require('../assets/bgoutside.png'));
  }, [bottomContent]);
  

return (
  isLoading ? <LoadingScreen /> : (
    <ImageBackground source={bgImage} style={styles.container}>
      <>
        {bottomContent === 'login' ? (
          <>
            <Text style={styles.outsideLoginText}>
              SETUP PROFILE
            </Text>
            <TouchableOpacity onPress={() => setBottomContent('createAccount')}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}>
                <Image
                  source={require('../assets/icons/profilelogo.png')}
                  style={{
                    width: windowWidth * 0.4,
                    height: windowHeight * 0.4,
                    marginBottom: -windowHeight * 0.1,
                    resizeMode: 'contain'
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setBottomContent('createAccount')}>
              <Text style={styles.outsideSmallLoginText}>
                SIGN UP+
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
          <TouchableOpacity onPress={() => setBottomContent('login')}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.outsideText}>
              SIGN UP
            </Text>
            <Text style={styles.smallSignUpText}>
              LOGIN+
            </Text>
          </View>
          </TouchableOpacity>
          </>
        )}
        <ImageBackground
          source={require('../assets/bg1.png')}
          style={bottomContent === 'login' ? {...styles.bottomContainer, height: bottomHeight} : {...styles.signUpContainer, height: signUpBottomHeight}}
        >
        {bottomContent === 'login' ? (
            <View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}>
                  <Image
                    source={require('../assets/icons/round-logo.png')}
                    style={{
                      width: windowWidth * 0.5,
                      height: windowHeight * 0.5,
                      marginBottom: -windowHeight * 0.09,
                      resizeMode: 'contain'
                    }}
                  />
                </View>
            <View style={{ marginBottom: windowHeight * 0.1 }}>
              <TextInput
                style={styles.input}
                placeholder="EMAIL"
                placeholderTextColor="white"
                onChangeText={text => setEmail(text)} 
              />
              <TextInput
                style={styles.input}
                placeholder="PASSWORD"
                placeholderTextColor="white"
                secureTextEntry
                onChangeText={text => setPassword(text)} 
              />
              <TouchableOpacity disabled={buttonDisabled} style={[styles.buttonLogin, {alignSelf: 'center'}]} onPress={handleLogin}>
                  <Text style={styles.buttonText}>LOGIN</Text>
              </TouchableOpacity>
              </View>
            </View>
        ) : (
          <View style={{ marginTop: windowHeight * 0.025 }}>
            <Text style={styles.label}>FULL NAME</Text>
            <View style={{ alignItems: 'center' }}>
              <TextInput
                style={styles.input}
                placeholder="TYPE HERE"
                placeholderTextColor="white"
                onChangeText={text => setFullName(text)} 
              />
            </View>
            <Text style={styles.label}>USERNAME</Text>
            <View style={{ alignItems: 'center' }}>
            <TextInput
              style={styles.input}
                placeholder="TYPE HERE"
                placeholderTextColor="white"
                onChangeText={text => setUsername(text)} 
            />
            </View>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={{ alignItems: 'center' }}>
            <TextInput
              style={styles.input}
                placeholder="TYPE HERE"
                placeholderTextColor="white"
                onChangeText={text => setEmail(text)} 
            />
            </View>
             <Text style={styles.label}>PASSWORD</Text>
             <View style={{ alignItems: 'center' }}>
             <TextInput
               style={styles.input}
                placeholder="TYPE HERE"
                placeholderTextColor="white"
               secureTextEntry
               onChangeText={text => setPassword(text)} 
             />
            </View>

            <Text style={styles.label}>BIRTHDAY</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={styles.inputDateMonth}
                placeholder="Month"
                placeholderTextColor="white"
                keyboardType="numeric"
                onChangeText={text => setMonth(text)} 
              />
              <TextInput
                style={styles.inputDateDay}
                placeholder="Day"
                placeholderTextColor="white"
                keyboardType="numeric"
                onChangeText={text => setDay(text)} 
              />
              <TextInput
                style={styles.inputDateYear}
                placeholder="Year"
                placeholderTextColor="white"
                keyboardType="numeric"
                onChangeText={text => setYear(text)} 
              />
            </View>

        <Text style={styles.label}>GENDER</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: windowHeight * 0.005 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value="male"
              status={ gender === 'male' ? 'checked' : 'unchecked' }
              onPress={() => {
                setGender('male');
                setIsCustomSelected(false);
              }}
            />
            <Text style={styles.radioButtonLabel}>Male</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value="female"
              status={ gender === 'female' ? 'checked' : 'unchecked' }
              onPress={() => {
                setGender('female');
                setIsCustomSelected(false);
              }}
            />
            <Text style={styles.radioButtonLabel}>Female</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value="custom"
              status={ gender === 'custom' ? 'checked' : 'unchecked' }
              onPress={() => {
                setGender('custom');
                setIsCustomSelected(true);
              }}
            />
            {!isCustomSelected && <Text style={styles.radioButtonLabel}>Custom</Text>}
            {isCustomSelected && (
              <TextInput
                style={styles.inputCustom}
                placeholder="Custom"
                placeholderTextColor="white"
                onChangeText={text => setGender(text)}
              />
            )}
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.smallText}>
            By signing up for an account, you acknowledge that you have read, understood, and agreed to comply with our sign-up policy. Thank you for choosing MADRA
          </Text>

          <TouchableOpacity disabled={buttonDisabled} style={styles.button} onPress={handleSignUpButtonPress}>
              <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
          </View>
        </View>
        )}
          </ImageBackground>
          </>
      </ImageBackground>
    ));
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  outsideSmallText: {
    color: 'white',
    fontSize: windowWidth * 0.025, // Adjust this value as needed
    marginBottom: windowHeight * 0.025,
    textAlign: 'center',
  },
  outsideSmallLoginText: {
    color: 'white',
    fontSize: windowWidth * 0.03, // Adjust this value as needed
    textAlign: 'center',
    marginTop: windowHeight * 0.005,
    marginBottom: windowHeight * 0.035,
    textDecorationLine: 'underline',
    fontFamily: 'media-sans-bold',
  },
  outsideLoginText: {
    color: 'white',
    fontFamily: 'media-sans-bold',
    fontSize: windowWidth * 0.1,
    textAlign: 'center',
    fontSize: windowWidth * 0.08,
    marginBottom: -windowHeight * 0.09,
  },
  outsideText: {
    color: 'white',
    fontSize: windowWidth * 0.15, // Adjust this value as needed
    textAlign: 'center',
    fontFamily: 'media-sans-bold',
  },
  radioButtonLabel: {
    color: '#00605B',
  },
  smallSignUpText: {
    color: 'white',
    fontFamily: 'media-sans-bold',
    width: windowWidth * 0.8,
    fontSize: windowWidth * 0.035, // Adjust this value as needed
    marginBottom: windowHeight * 0.025,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  smallText: {
    color: '#00605B',
    width: windowWidth * 0.8,
    fontSize: windowWidth * 0.025, // Adjust this value as needed
    marginTop: windowHeight * 0.01,
    marginBottom: windowHeight * 0.02,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: windowWidth * 0.09,
    fontFamily: 'media-sans-bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: windowWidth * 0.09,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    position: 'absolute',
    top: windowHeight / 20,
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: windowWidth / 0.9,
    height: windowWidth / 0.9,
    resizeMode: 'contain',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: windowWidth / 2 - (windowWidth / 7) / 0.8,
  },
  footerText: {
    marginRight: windowWidth / 50,
    fontSize: windowWidth * 0.05,
    color: 'white',
  },
  footerImage: {
    resizeMode: 'contain',
    width: windowWidth / 7,
    height: windowHeight / 5,
  },
  buttonLogin: {
    width: windowWidth / 3.5,
    height: windowHeight / 20,
    alignItems: 'center',
    justifyContent: 'center', // Add this line
    marginBottom: windowHeight / 60,
    borderRadius: 20,
    backgroundColor: '#00605B',
  },
  button: {
    width: windowWidth - 100,
    height: windowHeight / 20,
    alignItems: 'center',
    justifyContent: 'center', // Add this line
    marginBottom: windowHeight / 60,
    borderRadius: 20,
    backgroundColor: '#00605B',
  },
  buttonText: {
    fontSize: windowWidth * 0.05,
    color: 'white',
    fontFamily: 'montserrat-bold',
    textAlign: 'center', // Add this line
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
bottomContainer: {
  width: windowWidth,
  borderTopLeftRadius: 50,
  borderTopRightRadius: 50,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  borderTopWidth: 8, // Add this line to set the border width
  borderLeftWidth: 8,
  borderRightWidth: 8,
  borderColor: 'white', // Add this line to set the border color
},
  signUpContainer: {
    width: windowWidth,
    borderTopLeftRadius: 50, // Add this line
    borderTopRightRadius: 50, // Add this line
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderTopWidth: 15, // Add this line to set the border width
    borderLeftWidth: 15,
    borderRightWidth: 15,
  },
  label: {
    color: 'white',
    fontSize: windowWidth * 0.035,
    marginBottom: windowHeight * 0.01,
    fontFamily: 'montserrat-bold',
  },
  input: {
    width: windowWidth - 90,
    height: windowHeight / 20,
    marginBottom: windowHeight / 60,
    fontSize: windowWidth * 0.03,
    backgroundColor: '#00605B',
    color: 'white',
    borderRadius: 20,
    textAlign: 'center',
    fontFamily: 'montserrat-bold',
    padding: 10,
  },
   inputDateMonth: {
     width: windowWidth / 4, // Reduced width for date inputs
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
         fontSize: windowWidth * 0.03,
    backgroundColor: '#00605B',
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
     fontFamily: 'montserrat-bold',
   },
   inputDateDay: {
     width: windowWidth / 4 - 30, // Reduced width for date inputs
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
         fontSize: windowWidth * 0.03,
    backgroundColor: '#00605B',
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
     fontFamily: 'montserrat-bold',
   },
   inputDateYear: {
     width: windowWidth / 3, // Reduced width for date inputs
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
    backgroundColor: '#00605B',
        fontSize: windowWidth * 0.03,
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
     fontFamily: 'montserrat-bold',
   },
   inputCustom: {
     width: windowWidth / 2 - 90, // Reduced width for custom input
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
         fontSize: windowWidth * 0.03,
    backgroundColor: '#00605B',
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
     fontFamily: 'montserrat-bold',
   },
  signupContainer: {
    flexDirection: 'row',
    marginTop: windowHeight / 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: 'white',
    fontFamily: 'NeueMachina-Regular',
    marginRight: windowWidth * 0.009,
  },
  signupButton: {
    color: 'blue',
    fontFamily: 'NeueMachina-Ultrabold',
    textAlign: 'center',
  },

  backButtonImage: {
    width: windowWidth / 15,
    height: windowWidth / 5,
    marginBottom: windowHeight / 60,
    resizeMode: 'contain',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default HomeScreen;