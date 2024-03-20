import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Lesson1() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>       
            <ScrollView>
            <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Earthquakes</Text> result from the abrupt movement of large rock masses along fault lines in the Earth's crust and upper mantle. 
                    The Earth's surface is made up of tectonic plates, which are huge, irregular slabs of rock. 
                    The rough edges of these plates become stuck as they move, eventually releasing stored energy when the friction is overcome, causing <Text style={styles.boldBlackText}>seismic waves</Text>. 
                    These waves propagate through the Earth, emitting energy in all directions, leading to surface shaking. Two main types of seismic waves exist: <Text style={styles.boldBlackText}>body waves</Text>, 
                    which travel through the Earth's interior, and <Text style={styles.boldBlackText}>surface waves</Text>, which move along the Earth's surface.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Primary (P) waves</Text> are the initial seismic waves to reach the Earth's surface, 
                    causing light shaking by moving the ground back and forth in the direction they travel. 
                    <Text style={styles.boldBlackText}>Secondary (S) waves</Text>, which move perpendicular to their propagation direction, shake the ground more strongly than P waves but travel slower.  
                    <Text style={styles.boldBlackText}>Surface waves</Text>, including Love waves and Rayleigh waves, remain near the surface. 
                    <Text style={styles.boldBlackText}>Love waves</Text> move horizontally perpendicular to their direction of travel, 
                    while <Text style={styles.boldBlackText}>Rayleigh waves</Text> produce rotational ground shaking with no transverse motion.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    The intensity of an earthquake is determined by assessing both the energy it releases, known as its <Text style={styles.boldBlackText}>magnitude</Text>, 
                    and its impact on individuals and human-built structures, which we refer to as <Text style={styles.boldBlackText}>intensity</Text>.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Frequency</Text> refers to how often ground shaking occurs within a specific timeframe. 
                    <Text style={styles.boldBlackText}>High-frequency earthquakes</Text> primarily impact smaller buildings, as they experience rapid, successive waves, 
                    akin to a small boat being rocked by multiple waves, potentially leading to capsizing. Conversely, tall structures such as skyscrapers are more affected by <Text style={styles.boldBlackText}>low-frequency 
                    earthquake</Text> waves or prolonged, slow shaking, causing them to sway significantly.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Ground shaking</Text> stands as the foremost factor behind the damage inflicted upon human-made constructions during earthquakes. 
                    This shaking leads to the collapse of buildings and infrastructure, potentially causing injuries or fatalities. In instances where it ruptures water dams, 
                    flash floods may ensue. Furthermore, if the shaking disrupts electric and gas lines significantly, fire emerges as a secondary hazard. Moreover, ground shaking initiates 
                    additional earthquake-related dangers like <Text style={styles.boldBlackText}>landslides and liquefaction</Text>.
                </Text>
                </View>
                <View style={[styles.rectangleBox, { marginBottom: 15 }]}>
                <Text style={styles.boxText}>
                    A <Text style={styles.boldBlackText}>building code</Text> establishes construction standards to ensure buildings are constructed safely. When adhered to, it helps ensure buildings can withstand earthquakes with 
                    minimal damage, thus safeguarding occupants. While earthquake-resistant buildings are not impervious to earthquakes, they sustain less damage compared to conventional structures.
                </Text>
                </View>
            </ScrollView>
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
  boldBlackText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.0525,
    textAlign: 'justify',
    textAlign: 'center',
  },
  bottomContainer: {
    width: windowWidth, // Full width
    height: '100%', // Adjust the height as needed
  },
  rectangleBox: {
    paddingTop: 10,
    marginTop: 10,
    borderRadius: 0,
    overflow: 'hidden',
  },
  boxContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  boxText: {
    color: 'white',
    fontSize: windowWidth * 0.05,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlign: 'justify',
  },
});