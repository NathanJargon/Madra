import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Alert } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MadramaniaQuiz({ lesson }) {
  const [QuizNumber, setQuizNumber] = useState(0);

  let questions;
  switch (lesson) {
    case 'FirstAid':
        questions = [
          {
            question: 'What should you do during an earthquake?',
            choices: ['Run outside', 'Stand near windows', 'Drop, Cover, and Hold On', 'None of the above'],
            correctAnswer: 'Drop, Cover, and Hold On',
          },
          {
            question: 'Question 2?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 1',
          },
          {
            question: 'Question 3?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 2',
          },
          // ... add more questions here
          {
            question: 'Question 10?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 4',
          },
        ];
      break;
    case 'DosAndDonts':
        questions = [
          {
            question: 'What should you do during an earthquake?',
            choices: ['Run outside', 'Stand near windows', 'Drop, Cover, and Hold On', 'None of the above'],
            correctAnswer: 'Drop, Cover, and Hold On',
          },
          {
            question: 'Question 2?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 1',
          },
          {
            question: 'Question 3?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 2',
          },
          // ... add more questions here
          {
            question: 'Question 10?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 4',
          },
        ];
      break;
    case 'SafetyProtocols':
        questions = [
          {
            question: 'What should you do during an earthquake?',
            choices: ['Run outside', 'Stand near windows', 'Drop, Cover, and Hold On', 'None of the above'],
            correctAnswer: 'Drop, Cover, and Hold On',
          },
          {
            question: 'Question 2?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 1',
          },
          {
            question: 'Question 3?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 2',
          },
          // ... add more questions here
          {
            question: 'Question 10?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 4',
          },
        ];
      break;
    case 'StudyOfEarthquake':
        questions = [
          {
            question: 'What should you do during an earthquake?',
            choices: ['Run outside', 'Stand near windows', 'Drop, Cover, and Hold On', 'None of the above'],
            correctAnswer: 'Drop, Cover, and Hold On',
          },
          {
            question: 'Question 2?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 1',
          },
          {
            question: 'Question 3?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 2',
          },
          // ... add more questions here
          {
            question: 'Question 10?',
            choices: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
            correctAnswer: 'Choice 4',
          },
        ];
      break;
    default:
      questions = [];
  }

    const handleChoiceSelection = (choice) => {
      if (choice === questions[QuizNumber].correctAnswer) {
        setQuizNumber(QuizNumber + 1);
      } else {
        Alert.alert(
          "Incorrect Answer",
          "The answer you selected is incorrect.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }
    };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>
          <View style={styles.rectangleBox}>
            <Text style={styles.boxTitle}>LESSON: DO’S AND DONT’S</Text>
          </View>
          <Text style={styles.boxSmallTitle}>{QuizNumber + 1}/10</Text>
          <View style={styles.box}>
            <Text style={styles.centeredText}>{questions[QuizNumber].question}</Text>
          </View>
          {questions[QuizNumber].choices.map((choice, index) => (
            <TouchableOpacity key={index} style={styles.proceedButton} onPress={() => handleChoiceSelection(choice)}>
              <Text style={styles.proceedButtonText}>{choice}</Text>
            </TouchableOpacity>
          ))}
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
boxContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  boxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%', // Adjust the width as needed
  },
  box: {
    width: windowWidth * 0.8, // Adjust the width as needed
    height: windowHeight * 0.25, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderRadius: 20,
    justifyContent: 'center',
    borderColor: '#00605B',
    borderWidth: 4,
    alignItems: 'center',
    padding: 10,
    margin: windowWidth * 0.05,
  },
  boxTitle: {
    fontSize: windowWidth * 0.04,
    margin: windowWidth * 0.02,
    textAlign: 'center',
    fontWeight: 'bold',
  },
    boxSmallTitle: {
     fontSize: windowWidth * 0.03,
     textAlign: 'center',
     fontWeight: 'bold',
   },
  proceedButton: {
    width: '80%',
    height: '7%',
    marginBottom: windowHeight * 0.01,
    backgroundColor: '#318E99',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  headerBox: {
    width: '100%', // Full width
    height: windowHeight * 0.175, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    borderColor: '#318E99',
    borderBottomWidth: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
  rectangleBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  centeredText: {
    textAlign: 'center',
    fontSize: windowWidth * 0.035, // Adjust the font size as needed
  },
});