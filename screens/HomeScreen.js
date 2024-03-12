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
    const [bgImage, setBgImage] = useState(require('../assets/bgoutside1.png'));
    const [phoneNumber, setPhoneNumber] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    
    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          // User is signed out.
          setIsAuthenticated(false);
        }
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
          await handleSignUp(gender, fullName, username, email, password, birthday, phoneNumber);
        } catch (error) {
          console.error('Error during sign up:', error);
        }
      }
    };

    const handleSignUp = async (gender, fullName, username, email, password, birthday, phoneNumber) => {
      try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
    
        await user.sendEmailVerification();
        alert('A verification email has been sent to your email. Please verify your email before logging in.');
    
        if (username.length > 10) {
          alert('Username cannot be more than 10 characters.');
          return;
        }
    
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
          language: "English",
        });
    
        console.log('User inserted successfully');
      } catch (error) {
        console.error('Error while signing up:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('The email address is already in use by another account.');
        }
      }
    
      setIsLoading(false);
    
      setTimeout(() => {
        setButtonDisabled(false);
      }, 1000);
    };

    const handleLogin = async () => {
      try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
          await AsyncStorage.setItem('userLoggedIn', 'true'); // Set the flag

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
    setBgImage(bottomContent === 'createAccount' ? require('../assets/bg1.png') : require('../assets/bgoutside1.png'));
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
                placeholderTextColor="#318E99"
                onChangeText={text => setEmail(text)} 
              />
              <TextInput
                style={styles.input}
                placeholder="PASSWORD"
                placeholderTextColor="#318E99"
                secureTextEntry
                onChangeText={text => setPassword(text)} 
              />
              <TouchableOpacity disabled={buttonDisabled} style={[styles.buttonLogin, {alignSelf: 'center'}]} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Login</Text>
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
                placeholderTextColor="#318E99"
                onChangeText={text => setFullName(text)} 
              />
            </View>
            <Text style={styles.label}>USERNAME</Text>
            <View style={{ alignItems: 'center' }}>
            <TextInput
              style={styles.input}
                placeholder="TYPE HERE"
                placeholderTextColor="#318E99"
                onChangeText={text => setUsername(text)} 
            />
            </View>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={{ alignItems: 'center' }}>
            <TextInput
              style={styles.input}
                placeholder="TYPE HERE"
                placeholderTextColor="#318E99"
                onChangeText={text => setEmail(text)} 
            />
            </View>
             <Text style={styles.label}>PASSWORD</Text>
             <View style={{ alignItems: 'center' }}>
             <TextInput
               style={styles.input}
                placeholder="TYPE HERE"
                placeholderTextColor="#318E99"
               secureTextEntry
               onChangeText={text => setPassword(text)} 
             />
            </View>

            <Text style={styles.label}>BIRTHDAY</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInput
                style={styles.inputDateMonth}
                placeholder="Month"
                placeholderTextColor="#318E99"
                keyboardType="numeric"
                onChangeText={text => setMonth(text)} 
              />
              <TextInput
                style={styles.inputDateDay}
                placeholder="Day"
                placeholderTextColor="#318E99"
                keyboardType="numeric"
                onChangeText={text => setDay(text)} 
              />
              <TextInput
                style={styles.inputDateYear}
                placeholder="Year"
                placeholderTextColor="#318E99"
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
                placeholderTextColor="#318E99"
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
              <Text style={styles.buttonText}>Sign Up</Text>
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
    fontSize: windowWidth * 0.035, // Adjust this value as needed
    textAlign: 'center',
    marginTop: windowHeight * 0.005,
    marginBottom: windowHeight * 0.035,
    textDecorationLine: 'underline',
  },
  outsideLoginText: {
    color: '#00605B',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.1,
    textAlign: 'center',
    fontSize: windowWidth * 0.08,
    marginBottom: -windowHeight * 0.09,
  },
  outsideText: {
    color: '#B6E6CF',
    fontSize: windowWidth * 0.15, // Adjust this value as needed
    textAlign: 'center',
  },
  radioButtonLabel: {
    color: 'white',
  },
  smallSignUpText: {
    color: 'white',
    width: windowWidth * 0.8,
    fontSize: windowWidth * 0.04, // Adjust this value as needed
    marginBottom: windowHeight * 0.025,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  smallText: {
    color: 'white',
    width: windowWidth * 0.8,
    fontSize: windowWidth * 0.025, // Adjust this value as needed
    marginBottom: windowHeight * 0.005,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: windowWidth * 0.09,
    fontFamily: 'NeueMachina-Ultrabold',
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
    width: windowWidth / 4,
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
    fontFamily: 'NeueMachina-Regular',
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
  },
  input: {
    width: windowWidth - 90,
    height: windowHeight / 20,
    marginBottom: windowHeight / 60,
    fontSize: windowWidth * 0.03,
    backgroundColor: '#FFFFFF',
    color: 'black',
    borderRadius: 20,
    textAlign: 'center',
    padding: 10,
  },
   inputDateMonth: {
     width: windowWidth / 4, // Reduced width for date inputs
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
         fontSize: windowWidth * 0.03,
    backgroundColor: '#FFFFFF',
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
   },
   inputDateDay: {
     width: windowWidth / 4 - 30, // Reduced width for date inputs
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
         fontSize: windowWidth * 0.03,
    backgroundColor: '#FFFFFF',
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
   },
   inputDateYear: {
     width: windowWidth / 3, // Reduced width for date inputs
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
    backgroundColor: '#FFFFFF',
        fontSize: windowWidth * 0.03,
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
   },
   inputCustom: {
     width: windowWidth / 2 - 90, // Reduced width for custom input
     height: windowHeight / 20,
     marginBottom: windowHeight / 60,
         fontSize: windowWidth * 0.03,
    backgroundColor: '#FFFFFF',
     color: 'black',
     borderRadius: 20,
     textAlign: 'center',
     padding: 10,
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