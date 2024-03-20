import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Lesson2() {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../../assets/bottomcontainer.png')} style={styles.bottomContainer}>
        <View style={styles.boxContainer}>       
            <ScrollView>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Ground rupture</Text> refers to the observable fracturing and displacement of the Earth's surface along a fault line. 
                    This displacement can manifest as vertical, lateral, or a combination of both movements, depending on the specific fault type responsible.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Strike-slip faults</Text> are nearly vertical fractures in the Earth's crust that move rocks horizontally. When observing such faults, 
                    if the block on the opposite side shifts to the left, it indicates a <Text style={styles.boldBlackText}>sinistral fault (or left-lateral fault)</Text>. Conversely, if the block moves to 
                    the right, it indicates a <Text style={styles.boldBlackText}>dextral fault (or right-lateral fault)</Text>.
                </Text>
                </View>
                <View style={styles.rectangleBox}>
                <Text style={styles.boxText}>
                    <Text style={styles.boldBlackText}>Normal faults</Text> involve the hanging wall moving downward relative to the footwall. Conversely, reverse or thrust faults 
                    involve the hanging wall moving upward. These faults, categorized as <Text style={styles.boldBlackText}>dip-slip faults</Text>, result in vertical displacement of the ground.
                </Text>
                </View>
                <View style={[styles.rectangleBox, { marginBottom: 15 }]}>
                <Text style={styles.boxText}>
                    Effective engineering solutions for ground rupture prevention are currently unavailable. 
                    Structures located on or near fault lines are vulnerable to ground rupture. The most practical approach is to refrain from 
                    constructing buildings on faults or within the recommended minimum safety distance, which should be at least 5 meters from either side of an active fault trace.
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