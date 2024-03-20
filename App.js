import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, StatusBar, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { firebase } from './screens/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from './UserContext';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Import your screens
import HomeScreen from './screens/HomeScreen';
import Dashboard from './screens/Dashboard';
import FontLoader from './screens/FontLoader';
import Map from './screens/Map';
import Features from './screens/Features';
import Settings from './screens/Settings';
import LoadingScreen from './screens/LoadingScreen';
import Splash from './screens/Splash';
import Profile from './screens/Profile';
import EducationalHubInterface from './screens/EducationalHubInterface';

// Features
import HazardMapping from './screens/HazardMapping';
import EducationalHub from './screens/EducationalHub';
import Madramania from './screens/Madramania';
import EarthquakeUpdates from './screens/EarthquakeUpdates';
import HazardMap from './screens/HazardMap';

import GenInfo from './screens/EducationalHub/GenInfo';
import Hazards from './screens/EducationalHub/Hazards';
import StudentCenteredInfo from './screens/EducationalHub/StudentCenteredInfo';
import HelpCenter from './screens/EducationalHub/HelpCenter';

import EarthquakeHazards from './screens/EducationalHub/Earthquakes/EarthquakeHazards';
import HydrometeorologicalHazards from './screens/EducationalHub/Earthquakes/HydrometeorologicalHazards';
import FireHazards from './screens/EducationalHub/Earthquakes/FireHazards';
import OtherGeologicalHazards from './screens/EducationalHub/Earthquakes/OtherGeologicalHazards';
import VolcanicHazards from './screens/EducationalHub/Earthquakes/VolcanicHazards';

// Create the stack navigators
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const FeatureStack = createStackNavigator();
const SplashStack = createStackNavigator();
const EducationalHubStack = createStackNavigator();

function EducationalHubStackScreen() {
  return (
    <EducationalHubStack.Navigator>
      <FeatureStack.Screen
        name="Gen Info"
        component={GenInfo}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
      />
        <EducationalHubStack.Screen
        name="Student Centered Info"
        component={StudentCenteredInfo}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
        />
        <EducationalHubStack.Screen
        name="Hazards"
        component={Hazards}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
        />
        <EducationalHubStack.Screen
        name="Help Center"
        component={HelpCenter}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
        />
    </EducationalHubStack.Navigator>
  );
}


function FeatureStackScreen() {
  return (
    <FeatureStack.Navigator>
      <FeatureStack.Screen
        name="HazardMapping"
        component={HazardMapping}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
      />
        <FeatureStack.Screen
        name="EducationalHub"
        component={EducationalHub}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
        />
        <FeatureStack.Screen
        name="Madramania"
        component={Madramania}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
        />
        <FeatureStack.Screen
        name="EarthquakeUpdates"
        component={Map}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }}
        />
    </FeatureStack.Navigator>
  );
}


function AuthStackScreen() {
  return (
    <FontLoader>
    <AuthStack.Navigator initialRouteName="HomeScreen">
      <AuthStack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
        }} 
      />
      <AuthStack.Screen 
      name="Dashboard" 
      component={Dashboard} 
      options={{ 
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
      }} 
    />
    </AuthStack.Navigator>
    </FontLoader>
  );
}

function SplashStackScreen() {
  return (
    <FontLoader>
    <SplashStack.Navigator initialRouteName="Splash">
    <SplashStack.Screen
      name="Splash"
      component={Splash}
      options={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
      }}
    />
    </SplashStack.Navigator>
    </FontLoader>
  );
}



function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <ImageBackground source={require('./assets/bg1.png')} style={{ flexDirection: 'row', height: height * 0.08, }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            {options.tabBarIcon && options.tabBarIcon({ focused: isFocused })}
          </TouchableOpacity>
        );
      })}
    </ImageBackground>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator initialRouteName="TabNavigator">
      <MainStack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="EducationalHubInterface"
        component={EducationalHubInterface}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Gen Info"
        component={GenInfo}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Student Centered Info"
        component={StudentCenteredInfo}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Hazards"
        component={Hazards}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Help Center"
        component={HelpCenter}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="EarthquakeHazards"
        component={EarthquakeHazards}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="HydrometeorologicalHazards"
        component={HydrometeorologicalHazards}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="FireHazards"
        component={FireHazards}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="OtherGeologicalHazards"
        component={OtherGeologicalHazards}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="VolcanicHazards"
        component={VolcanicHazards}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator 
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }} 
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard} 
        options={{ 
          tabBarIcon: ({ focused }) => {
            return <Image source={focused ? require('./assets/icons/home-color.png') : require('./assets/icons/home.png')} style={{ width: width * 0.07, height: height * 0.07, resizeMode: 'contain' }} />;
          },
        }}
      />
      <Tab.Screen
        name="Features"
        component={Features}
        options={{
          tabBarIcon: ({ focused }) => {
            return <Image source={focused ? require('./assets/icons/open-menu-color.png') : require('./assets/icons/open-menu.png')} style={{ width: width * 0.07, height: height * 0.07, resizeMode: 'contain' }} />;
          },
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings} 
        options={{ 
          tabBarIcon: ({ focused }) => {
            return <Image source={focused ? require('./assets/icons/setting-color.png') : require('./assets/icons/setting.png')} style={{ width: width * 0.07, height: height * 0.07, resizeMode: 'contain' }} />;
          },
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={Map} 
        options={{ 
          tabBarIcon: ({ focused }) => {
            return <Image source={focused ? require('./assets/icons/marker-color.png') : require('./assets/icons/marker.png')} style={{ width: width * 0.07, height: height * 0.07, resizeMode: 'contain' }} />;
          },
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ 
          tabBarIcon: ({ focused }) => {
            return <Image source={focused ? require('./assets/icons/user-color.png') : require('./assets/icons/user.png')} style={{ width: width * 0.07, height: height * 0.07, resizeMode: 'contain' }} />;
          },
        }}
      />
     </Tab.Navigator>
  );
}

function App() {
  const [info, setInfo] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(result) {
    setUser(result);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    StatusBar.setHidden(true);
    const authSubscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

    // unsubscribe on unmount
    return authSubscriber;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, info, setInfo }}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="LoadingScreen" screenOptions={{ headerShown: false }}>
          <RootStack.Screen name='LoadingScreen' component={SplashStackScreen} />
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
          <RootStack.Screen name="Main" component={MainStackScreen} />
          <RootStack.Screen name="Feature" component={FeatureStackScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default App;