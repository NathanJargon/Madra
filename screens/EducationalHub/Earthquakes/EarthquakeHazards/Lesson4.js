import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Lesson4() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>       
            <ScrollView>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Mass wasting</Text>, also referred to as <Text style={styles.boldBlackText}>landslides</Text>, involves the downward displacement of rocks or sediments due to gravity. 
                    This process occurs subsequent to weathering or the detachment of material from its original location. Landslides can be induced by various factors 
                    including intense or prolonged rainfall, steep slopes, deforestation, and seismic activity such as earthquakes.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    An instance of earthquake-induced landslides occurred on July 6, 2017, following a magnitude 6.5 
                    earthquake hitting Leyte Island. The earthquake's epicenter was approximately 15.5 km northeast of Ormoc City. This 
                    seismic event led to both liquefaction and landslides, causing damages estimated to be at least Php 271 million. This lesson will emphasize the study of 
                    landslides triggered by earthquakes.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    The shaking generated by an earthquake and its subsequent aftershocks can result in the substantial movement of rock or sediment. 
                    Several factors must be taken into account for earthquakes to trigger landslides, including the earthquake's intensity, proximity to the fault, terrain, 
                    climate conditions, and the specific properties of the rock or soil.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                  In addition to the earthquake, the landslide was influenced by heavy and sustained rainfall as well as creep. <Text style={styles.boldBlackText}>Creep</Text> refers to the gradual and barely 
                  noticeable downward movement of inclined rock or soil, resulting from the accumulation of considerable strain over time.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    Certain terrains are more prone to earthquakes triggering landslides. These events are common in mountainous and hilly regions, 
                    particularly where slopes are excavated for road construction and other human activities. Slopes of moderate to steep inclines facilitate the 
                    movement of rock and sediment under the influence of gravity.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    The geological composition of an area influences the susceptibility to earthquake-induced landslides. 
                    Aged and weathered rocks are more prone to collapse under ground shaking compared to younger, less weathered ones. Loose and unconsolidated materials 
                    are also more vulnerable to displacement than solid rock. However, even hardened rock with fractures and weak planes can succumb to earthquake-induced landslides.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    The timing of landslides following an earthquake varies. Some occur suddenly, allowing little time for preparation or evacuation. However, 
                    in certain cases, there are warning signs to be aware of, including newly formed cracks or bulges in the ground, increased sediment in streams, tilting 
                    poles or walls, escalating rumbling sounds (indicating an impending landslide), and unusual noises like snapping trees or colliding rocks.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    An <Text style={styles.boldBlackText}>earthquake-induced landslide susceptibility map</Text> is a valuable tool for identifying at-risk regions. 
                    <Text style={styles.boldBlackText}>PHIVOLCS</Text> has created such maps for various Philippine regions, accessible on their website. These maps account for two key factors: critical acceleration and intensity.
                </Text>
                </View>

                <View style={styles.rectangleBox}>
                <Image 
                    style={styles.boxImage}
                    source={require('../../../../assets/map.png')}
                />
                </View>

                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Earthquake-induced landslide susceptibility map of the Philippines</Text>{'\n'}
                    <Text style={styles.linkText} onPress={() => Linking.openURL('https://www.phivolcs.dost.gov.ph/index.php/news/2-uncategorised/281-earthquake-hazard-maps-2')}>
                    Image from https://www.phivolcs.dost.gov.ph/index.php/news/2-uncategorised/281-earthquake-hazard-maps-2
                    </Text>
                </Text>
                </View>

                <View style={styles.rectangleBox}>
                <Image 
                    style={styles.boxImage}
                    source={require('../../../../assets/scale.jpg')}
                />
                </View>

                <View style={[styles.rectangleBox, { marginBottom: 15 }]}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>PhIVOLCS Earthquake Intensity Scale (PEIS)</Text>{'\n'}
                    <Text style={styles.linkText} onPress={() => Linking.openURL('http://www.phivolcs.dost.gov.ph/index.php?option=com_content&task=view&id=45&Itemid=100')}>
                    Image from  http://www.phivolcs.dost.gov.ph/index.php?option=com_content&task=view&id=45&Itemid=100
                    </Text>
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
  linkText: {
    color: 'blue',
    fontSize: 10,
  },
  boxImage: {
    width: windowWidth * 1,
    height: windowHeight * 0.5, 
    resizeMode: 'contain', 
    alignSelf: 'center',
  },
  boldBlackText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.0525,
    textAlign: 'justify',
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