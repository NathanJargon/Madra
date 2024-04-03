import React, { useState, useEffect } from 'react';
import { BackHandler, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Alert } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MadramaniaQuiz({ route, navigation }) {
  const { lesson } = route.params
  const [QuizNumber, setQuizNumber] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  let questions;
  
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Madramania2');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  switch (lesson) {
      case 'Hydrometeorological':
          questions = [
              {
                  question: 'What is a tropical cyclone called in the northwest Pacific region?',
                  choices: ['Hurricane', 'Typhoon', 'Tropical depression', 'Super typhoon'],
                  correctAnswer: 'Typhoon',
              },
              {
                  question: 'What is the purpose of the Public Storm Warning Signal (PSWS) issued by PAGASA?',
                  choices: ['To classify tropical cyclones', 'To inform the public about the names of tropical cyclones', 'To monitor low-pressure areas', 'To alert the public about the projected impacts of a storm'],
                  correctAnswer: 'To alert the public about the projected impacts of a storm',
              },
              {
                  question: 'What is a primary characteristic of thunderstorms?',
                  choices: ['Cold and dry air', 'Gentle breeze', 'Sunny weather', 'Heavy rain, wind, lightning, and thunder'],
                  correctAnswer: 'Heavy rain, wind, lightning, and thunder',
              },
              {
                  question: 'What is a precautionary measure recommended before and during a thunderstorm?',
                  choices: ['Head to the beach', 'Use corded phones', 'Seek shelter under trees', 'Ensure all windows and doors are securely closed'],
                  correctAnswer: 'Ensure all windows and doors are securely closed',
              },
              {
                  question: 'What are common causes of flooding?',
                  choices: ['Strong winds and hurricanes', 'Heavy rainfall, tsunamis, and storm surges', 'Extreme heatwaves', 'Earthquakes and volcanic eruptions'],
                  correctAnswer: 'Heavy rainfall, tsunamis, and storm surges',
              },
              {
                  question: 'Which factor contributes to reducing runoff and potential flooding in urban areas?',
                  choices: ['Concrete and flat topographies', 'Impermeable materials like clay', 'Presence of vegetation', 'Low-lying areas such as plains and deltas'],
                  correctAnswer: 'Presence of vegetation',
              },
              {
                  question: 'What factors influence the occurrence and severity of a storm surge?',
                  choices: ['Wind direction and cloud cover', 'Water temperature and humidity levels', 'Storm strength and speed, coastline features, and continental shelf characteristics', 'Ocean currents and lunar phases'],
                  correctAnswer: 'Storm strength and speed, coastline features, and continental shelf characteristics',
              },
              {
                  question: 'What is the primary oceanic characteristic associated with La Niña?',
                  choices: ['Abnormally warm seawater temperatures', 'Reduced cloud formation and rainfall', 'Upwelling of cold, nutrient-rich waters', 'Increased air pressure in the central and eastern Pacific'],
                  correctAnswer: 'Upwelling of cold, nutrient-rich waters',
              },
          ];
          break;
      case 'Other Geological':
          questions = [
              {
                  question: 'What is an aquifer?',
                  choices: ['A type of asteroid', 'A rocky and metallic object that orbits the sun', 'Porous and permeable rock that holds water', 'Loose materials such as broken pieces of rocks'],
                  correctAnswer: 'Porous and permeable rock that holds water',
              },
              {
                  question: 'Where are most asteroids concentrated?',
                  choices: ['Between Earth and Mars', 'Beyond the orbit of Pluto', 'In the asteroid belt between Mars and Jupiter', 'Near the sun\'s surface'],
                  correctAnswer: 'In the asteroid belt between Mars and Jupiter',
              },
              {
                  question: 'What is an avalanche?',
                  choices: ['A mass of materials rapidly moving down a slope', 'Prolonged absence of precipitation', 'Removal and transport of weathered materials', 'Seaward movement of the coast'],
                  correctAnswer: 'A mass of materials rapidly moving down a slope',
              },
              {
                  question: 'What causes coastal erosion?',
                  choices: ['Removal of material from the coast by wave action', 'Presence of fissures in the ground', 'Growth of vegetation along the coastline', 'Subsidence of the ocean floor'],
                  correctAnswer: 'Removal of material from the coast by wave action',
              },
              {
                  question: 'What is debris?',
                  choices: ['A type of drought', 'Loose materials such as broken pieces of rocks', 'Porous and permeable rock', 'A type of sinkhole'],
                  correctAnswer: 'Loose materials such as broken pieces of rocks',
              },
              {
                  question: 'What is erosion?',
                  choices: ['Downward movement of soil, rock, and organic materials', 'Removal and transport of weathered materials', 'Loss of surface elevation due to subsurface support', 'Rapid movement of water down a slope'],
                  correctAnswer: 'Removal and transport of weathered materials',
              },
              {
                  question: 'What causes ground subsidence?',
                  choices: ['Presence of near-earth objects', 'Loss of subsurface support', 'Accumulation of materials in karst terrain', 'Movement of materials under the effects of gravity'],
                  correctAnswer: 'Loss of subsurface support',
              },
              {
                  question: 'What defines a landslide?',
                  choices: ['Movement of materials under the effects of gravity', 'Prolonged absence of precipitation', 'Rapid movement of water down a slope', 'Movement of asteroids towards Earth\'s orbit'],
                  correctAnswer: 'Movement of materials under the effects of gravity',
              },
              {
                  question: 'What are near-earth objects (NEOs)?',
                  choices: ['Rocks found between Earth and Mars', 'Icy comets found near the sun', 'Asteroids and comets located beyond Jupiter', 'Rocky or metallic asteroids and icy comets between Jupiter and Mars'],
                  correctAnswer: 'Rocky or metallic asteroids and icy comets between Jupiter and Mars',
              },
              {
                  question: 'What causes a sinkhole?',
                  choices: ['Ground subsidence in karst terrain', 'Presence of fissures in the ground', 'Accumulation of debris along the coastline', 'Removal of surface elevation due to tidal currents'],
                  correctAnswer: 'Ground subsidence in karst terrain',
              },
          ];
          break;
      case 'Volcanic':
          questions = [
              {
                  question: 'What is lava?',
                  choices: ['Solid rock ejected from a volcano', 'Molten rock or magma that reaches the Earth\'s surface', 'A type of volcanic gas', 'A type of volcanic ash'],
                  correctAnswer: 'Molten rock or magma that reaches the Earth\'s surface',
              },
              {
                  question: 'What determines the fluidity or viscosity of lava flows?',
                  choices: ['Their speed', 'Their color', 'Their makeup, temperature, and gas levels', 'Their height'],
                  correctAnswer: 'Their makeup, temperature, and gas levels',
              },
              {
                  question: 'Which of the following is NOT a type of lava flow?',
                  choices: ['Pahoehoe', 'Basaltic', 'Aa', 'Pillow'],
                  correctAnswer: 'Basaltic',
              },
              {
                  question: 'What is a common negative impact of lava flows?',
                  choices: ['Rapid movement endangering lives', 'Easy to monitor compared to other volcanic hazards', 'Destruction of structures and livelihoods', 'Cooling effect on surrounding areas'],
                  correctAnswer: 'Destruction of structures and livelihoods',
              },
              {
                  question: 'How can the negative effects of lava flows be mitigated?',
                  choices: ['By diverting them using water jets', 'By wearing protective suits', 'By using explosives to alter their source', 'By building artificial barriers'],
                  correctAnswer: 'By building artificial barriers',
              },
              {
                  question: 'What is a common type of volcanic gas?',
                  choices: ['Oxygen', 'Carbon monoxide', 'Sulfur dioxide', 'Nitrogen'],
                  correctAnswer: 'Sulfur dioxide',
              },
              {
                  question: 'Which of the following is a negative impact of sulfur dioxide?',
                  choices: ['Reduces acidity of rain', 'Causes skin moisturization', 'Can irritate the eyes and respiratory system', 'Has a pleasant smell'],
                  correctAnswer: 'Can irritate the eyes and respiratory system',
              },
              {
                  question: 'How can the negative effects of volcanic gases be mitigated?',
                  choices: ['By increasing public awareness', 'By using explosives to disperse the gases', 'By diverting the gases using water jets', 'By wearing thicker clothing'],
                  correctAnswer: 'By increasing public awareness',
              },
              {
                  question: 'What are pyroclastic flows primarily composed of?',
                  choices: ['Water', 'Rocks and gases', 'Ice', 'Sand'],
                  correctAnswer: 'Rocks and gases',
              },
              {
                  question: 'How are tephra falls different from ballistic projectiles?',
                  choices: ['Tephra falls are slower than ballistic projectiles', 'Ballistic projectiles are smaller than tephra falls', 'Tephra falls are influenced by wind direction, unlike ballistic projectiles', 'Ballistic projectiles are a type of volcanic gas'],
                  correctAnswer: 'Tephra falls are influenced by wind direction, unlike ballistic projectiles',
              },
          ];
          break;
      case 'Earthquake':
          questions = [
              {
                  question: 'What is bedrock?',
                  choices: ['A hard, unweathered rock underlying loose surface materials like soil', 'The configuration of a surface including its relief and the position of its natural (and man-made) features', 'The phenomenon in which surface waves alter their height upon entering shallower water', 'The lower wall of an inclined fault'],
                  correctAnswer: 'A hard, unweathered rock underlying loose surface materials like soil',
              },
              {
                  question: 'What is topography?',
                  choices: ['A hard, unweathered rock underlying loose surface materials like soil', 'The configuration of a surface including its relief and the position of its natural (and man-made) features', 'The phenomenon in which surface waves alter their height upon entering shallower water', 'The lower wall of an inclined fault'],
                  correctAnswer: 'The configuration of a surface including its relief and the position of its natural (and man-made) features',
              },
              {
                  question: 'What is wave shoaling?',
                  choices: ['A hard, unweathered rock underlying loose surface materials like soil', 'The configuration of a surface including its relief and the position of its natural (and man-made) features', 'The phenomenon in which surface waves alter their height upon entering shallower water', 'The lower wall of an inclined fault'],
                  correctAnswer: 'The phenomenon in which surface waves alter their height upon entering shallower water',
              },
              {
                  question: 'What is footwall?',
                  choices: ['A hard, unweathered rock underlying loose surface materials like soil', 'The configuration of a surface including its relief and the position of its natural (and man-made) features', 'The phenomenon in which surface waves alter their height upon entering shallower water', 'The lower wall of an inclined fault'],
                  correctAnswer: 'The lower wall of an inclined fault',
              },
              {
                  question: 'What is the epicenter?',
                  choices: ['A hard, unweathered rock underlying loose surface materials like soil', 'The area on the Earth\'s surface directly above the earthquake\'s focus', 'The phenomenon in which surface waves alter their height upon entering shallower water', 'The lower wall of an inclined fault'],
                  correctAnswer: 'The area on the Earth\'s surface directly above the earthquake\'s focus',
              },
              {
                  question: 'What is pore water pressure?',
                  choices: ['A pressure of groundwater held within a soil or rock, in gaps between particles', 'The observable fracturing and movement of the Earth\'s surface along a fault line', 'The gradual, almost imperceptible downward displacement of sloping rock or soil caused by buildup of significant strain', 'A type of tsunami that affects a wide geographical area, typically within 1,000 km or 1-3 hours of the wave travel time'],
                  correctAnswer: 'A pressure of groundwater held within a soil or rock, in gaps between particles',
              },
              {
                  question: 'What is a regional tsunami?',
                  choices: ['A type of drought', 'Loose materials such as broken pieces of rocks', 'Porous and permeable rock', 'A type of sinkhole'],
                  correctAnswer: 'A type of tsunami that affects a wide geographical area, typically within 1,000 km or 1-3 hours of the wave travel time',
              },
              {
                  question: 'What is creep?',
                  choices: ['A gradual, almost imperceptible downward displacement of sloping rock or soil caused by buildup of significant strain', 'A type of asteroid', 'The observable fracturing and movement of the Earth\'s surface along a fault line', 'A mass of materials rapidly moving down a slope'],
                  correctAnswer:
  
   'A gradual, almost imperceptible downward displacement of sloping rock or soil caused by buildup of significant strain',
              },
              {
                  question: 'What is compaction?',
                  choices: ['A downward movement of soil, rock, and organic materials', 'Removal and transport of weathered materials', 'A pressure of groundwater held within a soil or rock, in gaps between particles', 'The observable fracturing and movement of the Earth\'s surface along a fault line'],
                  correctAnswer: 'A pressure of groundwater held within a soil or rock, in gaps between particles',
              },
              {
                  question: 'What is ground rupture?',
                  choices: ['The observable fracturing and movement of the Earth\'s surface along a fault line', 'The gradual, almost imperceptible downward displacement of sloping rock or soil caused by buildup of significant strain', 'A type of asteroid', 'A mass of materials rapidly moving down a slope'],
                  correctAnswer: 'The observable fracturing and movement of the Earth\'s surface along a fault line',
              },
          ];
          break;
      case 'Fire':
          questions = [
              {
                  question: 'What are the three essential components necessary for fire according to the fire triangle concept?',
                  choices: ['Nitrogen, Heat, Fuel', 'Oxygen, Heat, Fuel', 'Oxygen, Heat, Water', 'Carbon dioxide, Heat, Fuel'],
                  correctAnswer: 'Oxygen, Heat, Fuel',
              },
              {
                  question: 'What is the primary cause of fire incidents in the Philippines?',
                  choices: ['Neglected cooking stove', 'Static electricity', 'Faulty electrical wiring', 'Cigarette butt'],
                  correctAnswer: 'Faulty electrical wiring',
              },
              {
                  question: 'Which phase of fire occurs when additional fuel is being consumed by the ignited fire, causing it to expand and spread?',
                  choices: ['Ignition', 'Growth', 'Fully developed', 'Decay'],
                  correctAnswer: 'Growth',
              },
              {
                  question: 'What is the primary purpose of a fire alarm system?',
                  choices: ['To extinguish fires automatically', 'To detect fires early', 'To provide lighting during fires', 'To alert people to evacuate'],
                  correctAnswer: 'To detect fires early',
              },
              {
                  question: 'Which of the following is NOT a precautionary measure against fire incidents?',
                  choices: ['Conducting fire risk assessments', 'Proper disposal of cigarette butts', 'Leaving cooking stoves unattended', 'Installing fire extinguishers'],
                  correctAnswer: 'Leaving cooking stoves unattended',
              },
              {
                  question: 'What is the first phase of fire, characterized by the combination of fuel, oxygen, and heat?',
                  choices: ['Growth', 'Fully developed', 'Ignition', 'Decay'],
                  correctAnswer: 'Ignition',
              },
              {
                  question: 'What should individuals do if caught on fire?',
                  choices: ['Run outside', 'Attempt to extinguish the fire', 'Panic and scream for help', 'Stop, drop, and roll'],
                  correctAnswer: 'Stop, drop, and roll',
              },
              {
                  question: 'What is the correct sequence for using a fire extinguisher according to the PASS system?',
                  choices: ['Pull, Aim, Squeeze, Sweep', 'Press, Aim, Squeeze, Sweep', 'Push, Alert, Spray, Swipe', 'Pull, Assess, Spray, Sweep'],
                  correctAnswer: 'Pull, Aim, Squeeze, Sweep',
              },
              {
                  question: 'What happens during the fully developed phase of a fire?',
                  choices: ['The fire starts to diminish', 'Oxygen and fuel are depleted', 'All available fuels are ignited, sustaining maximum fire size', 'A sudden inflow of air leads to fire explosions'],
                  correctAnswer: 'All available fuels are ignited, sustaining maximum fire size',
              },
              {
                  question: 'What is the purpose of a fire risk assessment?',
                  choices: ['To ignite fires intentionally', 'To understand an area\'s situation and identify preventive measures', 'To increase the temperature of materials', 'To decrease the oxygen concentration in an area'],
                  correctAnswer: 'To understand an area\'s situation and identify preventive measures',
              },
          ];
          break;
      default:
          questions = [];
  }
  
  const handleChoiceSelection = (choice) => {
    if (choice === questions[QuizNumber].correctAnswer) {
      setCorrectAnswersCount(correctAnswersCount + 1);
    }

    setQuizNumber(QuizNumber + 1);

    if (QuizNumber === questions.length - 1) {
      let scoreMessage = '';
      if (correctAnswersCount >= 8) {
        scoreMessage = 'Excellent job!';
      } else if (correctAnswersCount >= 5) {
        scoreMessage = 'Good job!';
      } else {
        scoreMessage = 'You can do better next time!';
      }

      Alert.alert(
        "Quiz Finished",
        `You answered correctly to ${correctAnswersCount} out of ${questions.length} questions. ${scoreMessage}`,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") },
          { text: "Try Again", onPress: () => {
            setQuizNumber(0);
            setCorrectAnswersCount(0);
          }}
        ],
        { cancelable: false }
      );
    }
  };


  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>
          {QuizNumber < questions.length ? (
            <>
              <View style={styles.rectangleBox}>
                <Text style={styles.boxTitle}>LESSON: {lesson.toUpperCase()} HAZARDS</Text>
              </View>
              <Text style={styles.boxSmallTitle}>{QuizNumber + 1}/{questions.length}</Text>
              <View style={styles.box}>
                <Text style={styles.centeredText}>{questions[QuizNumber].question}</Text>
              </View>
              {questions[QuizNumber].choices.map((choice, index) => (
                <TouchableOpacity key={index} style={styles.proceedButton} onPress={() => handleChoiceSelection(choice)}>
                  <Text style={styles.proceedButtonText}>{choice}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : null}
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
    borderColor: 'white',
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
    color: 'white',
  },
    boxSmallTitle: {
     fontSize: windowWidth * 0.03,
     textAlign: 'center',
     color: 'white',
     fontWeight: 'bold',
   },
  proceedButton: {
    width: '80%',
    height: '8%',
    marginBottom: windowHeight * 0.01,
    backgroundColor: '#318E99',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedButtonText: {
    textAlign: 'center',
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
    borderColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  centeredText: {
    textAlign: 'center',
    color: '#0C6B5F',
    fontSize: windowWidth * 0.035, // Adjust the font size as needed
  },
});