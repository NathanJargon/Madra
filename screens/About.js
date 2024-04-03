import React from 'react';
import { ScrollView, View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function About() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <ScrollView style={styles.transparentBox}>
          <Text style={styles.boldText}>
            MADRA: Multifunction Application for Disaster Readiness and Action
          </Text>
          <Text style={styles.infoText}>
            MADRA, the Multifunction Application for Disaster Readiness and Action, is a comprehensive tool designed to empower individuals and communities
            in preparing for and responding to earthquakes and other natural disasters. With a range of innovative features, MADRA offers users the ability
            to customize alerts, access vital hazard mapping data, and engage in educational resources tailored to earthquake preparedness. Let's explore the
            key features that make MADRA an indispensable tool for disaster readiness:
          </Text>
          <Text style={styles.boldText}>
            Madrafication (Notification) System:
          </Text>
          <Text style={styles.infoText}>
            MADRA's Madrafication System ensures that users stay informed in real-time about earthquake events with customizable alerts.
            Users can tailor their notification preferences based on factors such as proximity to the earthquake epicenter, magnitude threshold, and
            specific geographic areas of interest. Push notifications deliver timely alerts directly to users' mobile devices, providing essential details
            about earthquake magnitude, location, depth, and estimated intensity. These localized alerts empower users to take swift and appropriate action,
            enhancing community resilience in the face of seismic events.
          </Text>
          <Text style={styles.boldText}>
            Hazard Mapping:
          </Text>
          <Text style={styles.infoText}>
            MADRA incorporates advanced geospatial data integration to accurately assess and map hazard-prone areas.
            By integrating diverse datasets including topography, land use, geological formations, hydrological networks, and historical hazard events,
            MADRA provides a holistic understanding of multiple hazards. The interactive mapping interface enables stakeholders to visualize hazard maps,
            overlay different data layers, and customize maps based on specific parameters and scenarios. With open access to hazard mapping data and dynamic
            updates reflecting the latest information, MADRA facilitates informed decision-making and resource allocation for disaster preparedness and mitigation efforts.
          </Text>
          <Text style={styles.boldText}>
            Education Hub:
          </Text>
          <Text style={styles.infoText}>
            MADRA's Education Hub serves as a comprehensive resource for earthquake preparedness and disaster risk reduction. The General Information
            Section offers valuable insights into first aid techniques, essential safety protocols, and the science behind earthquakes. Users learn practical
            measures such as "Drop, Cover, and Hold On" during earthquakes, as well as the importance of securing heavy furniture and conducting emergency
            drills. Through integration with Disaster Risk Reduction and Management (DRRM) projects and subjects, MADRA fosters a deeper understanding of
            earthquake risks and effective response strategies.
          </Text>
          <Text style={styles.boldText}>
            MadraMania: Quiz and Testing:
          </Text>
          <Text style={styles.infoText}>
            Engaging users in interactive learning experiences, MadraMania quizzes cover various topics including earthquake science, safety protocols,
            first aid procedures, and DRRM principles. By participating in MadraMania activities, users assess their knowledge, skills, and preparedness levels,
            receiving valuable feedback and reinforcement of key concepts. MadraMania empowers users to actively contribute to their own preparedness efforts and
            community resilience through fun and educational quizzes.

          </Text>
          <Text style={styles.boldText}>
            MADRA stands as a beacon of preparedness, leveraging technology to equip individuals and communities with the tools and knowledge necessary to mitigate risks and respond effectively to earthquakes and other natural disasters.
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
  bottomContainer: {
    width: windowWidth,
    height: '100%',
    justifyContent: 'center', // Add this to center the content vertically
    alignItems: 'center', // Add this to center the content horizontally
  },
  infoText: {
    color: '#127B6E',
    fontSize: 16,
    marginVertical: 20, // Increase this to add more space
    alignSelf: 'center',
    width: '90%',
    textAlign: 'center',
    fontFamily: 'glacial-indifference-regular',
  },
  boldText: {
    color: '#0C6B5F',
    alignSelf: 'center',
    width: '90%',
    fontSize: 20, // Adjust the size as needed
    fontFamily: 'media-sans-bold', // Replace with your preferred font
    marginVertical: 20, // Increase this to add more space
    textAlign: 'center',
    paddingBottom: 20,
  },
  transparentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent black
    width: '100%', // Adjust the width as needed
    padding: 20, // Add padding as needed
    borderRadius: 10, // Add border radius as needed
  },
});