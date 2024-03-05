import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkyO_ePqJ-W1rbRZXO_zIlicLaAvtxvCY",
  authDomain: "madra-7a862.firebaseapp.com",
  projectId: "madra-7a862",
  storageBucket: "madra-7a862.appspot.com",
  messagingSenderId: "402249856162",
  appId: "1:402249856162:web:af2e1c3525cdb25d1b13fb",
  measurementId: "G-P31R4QKM0P"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}


export { firebase };