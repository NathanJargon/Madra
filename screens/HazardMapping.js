import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, Linking, Animated } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from './FirebaseConfig';
import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HazardMapping({ navigation }) {
  const [showMap, setShowMap] = useState(false);
  const [earthquakes, setEarthquakes] = useState([]);
  const [userCountry, setUserCountry] = useState('Philippines');
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Add this line
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [selectedEarthquakeIndex, setSelectedEarthquakeIndex] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [displayedEarthquakes, setDisplayedEarthquakes] = useState([]);
  const [earthquakeCounts, setEarthquakeCounts] = useState({});
  const [legendPressTime, setLegendPressTime] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(10);

  const landslideProneAreas = [
    { latitude: 14.5499, longitude: 121.0589, radius: 5000 }, // Marikina City
    { latitude: 16.4023, longitude: 120.5960, radius: 8000 }, // Baguio City
    { latitude: 14.5896, longitude: 120.9744, radius: 6000 }, // Quezon City
    { latitude: 14.5636, longitude: 121.0381, radius: 4500 }, // Angono
    { latitude: 14.5654, longitude: 121.0262, radius: 4000 }, // Cainta
    { latitude: 10.2926, longitude: 123.9029, radius: 7000 }, // Lapu-Lapu City
    { latitude: 10.2379, longitude: 123.8267, radius: 6500 }, // Cebu City
    { latitude: 9.6477, longitude: 123.8559, radius: 5500 }, // Minglanilla
    { latitude: 9.6531, longitude: 123.8530, radius: 5500 }, // Talisay City
    { latitude: 10.3157, longitude: 123.8854, radius: 6000 }, // Cebu City
    { latitude: 7.1907, longitude: 125.4553, radius: 8000 }, // Davao City
    { latitude: 6.9105, longitude: 122.0738, radius: 7500 }, // Zamboanga City
    { latitude: 8.6116, longitude: 124.7136, radius: 7000 }, // Central Mindanao
    { latitude: 6.3724, longitude: 125.5560, radius: 7500 }, // Cotabato City
    { latitude: 7.1907, longitude: 125.4553, radius: 8000 }, // Davao City
    { latitude: 15.1726, longitude: 120.5916, radius: 5500 }, // San Fernando, Pampanga
    { latitude: 14.1008, longitude: 121.1027, radius: 5000 }, // Tagaytay City
    { latitude: 15.1677, longitude: 120.5946, radius: 5500 }, // Angeles City
    { latitude: 14.8058, longitude: 120.6850, radius: 6000 }, // Bulacan
    { latitude: 14.1367, longitude: 121.2497, radius: 5000 }, // Nasugbu, Batangas
    { latitude: 9.3077, longitude: 123.3051, radius: 7000 }, // Talisay City, Negros Occidental
    { latitude: 10.0106, longitude: 124.4515, radius: 7500 }, // Baybay City, Leyte
    { latitude: 9.8413, longitude: 124.1533, radius: 6500 }, // Tubigon, Bohol
    { latitude: 10.3044, longitude: 123.8944, radius: 6000 }, // Mandaue City, Cebu
    { latitude: 9.7862, longitude: 124.3390, radius: 6500 }, // Talibon, Bohol
    { latitude: 8.2346, longitude: 124.2453, radius: 7000 }, // Cagayan de Oro City
    { latitude: 7.1907, longitude: 125.4553, radius: 8000 }, // Davao City
    { latitude: 6.0905, longitude: 125.5596, radius: 7500 }, // General Santos City
    { latitude: 7.9807, longitude: 125.3276, radius: 7000 }, // Tagum City
    { latitude: 8.0044, longitude: 124.2833, radius: 7000 }, // El Salvador City
    { latitude: 14.6159, longitude: 120.9797, radius: 5500 }, // Antipolo City, Rizal
    { latitude: 13.3550, longitude: 123.7429, radius: 6000 }, // Legazpi City, Albay
    { latitude: 10.2879, longitude: 123.9785, radius: 6500 }, // Naga City, Cebu
    { latitude: 13.6198, longitude: 123.1810, radius: 7000 }, // Ligao City, Albay
    { latitude: 13.2291, longitude: 123.8196, radius: 5500 }, // Tabaco City, Albay
    { latitude: 10.7053, longitude: 122.9823, radius: 8000 }, // Iloilo City, Iloilo
    { latitude: 14.8039, longitude: 120.7105, radius: 7500 }, // Plaridel, Bulacan
    { latitude: 13.4891, longitude: 123.2711, radius: 7000 }, // Daet, Camarines Norte
    { latitude: 11.2114, longitude: 124.9976, radius: 8500 }, // Tacloban City, Leyte
    { latitude: 7.0684, longitude: 125.5723, radius: 9000 }, // Koronadal City, South Cotabato
    { latitude: 17.9443, longitude: 121.9066, radius: 7000 }, // Tuguegarao City, Cagayan
    { latitude: 15.1556, longitude: 120.6314, radius: 8000 }, // Tarlac City, Tarlac
    { latitude: 16.4704, longitude: 120.5824, radius: 7500 }, // Dagupan City, Pangasinan
    { latitude: 14.9595, longitude: 120.9445, radius: 8500 }, // San Jose del Monte City, Bulacan
    { latitude: 16.9892, longitude: 121.8119, radius: 9000 }, // Santiago City, Isabela
    { latitude: 7.0731, longitude: 125.6127, radius: 7000 }, // Koronadal City, South Cotabato
    { latitude: 7.8567, longitude: 123.4787, radius: 8000 }, // Pagadian City, Zamboanga del Sur
    { latitude: 8.1670, longitude: 124.2164, radius: 7500 }, // Cagayan de Oro City, Misamis Oriental
    { latitude: 7.8287, longitude: 123.4790, radius: 8500 }, // Zamboanga City, Zamboanga del Sur
    { latitude: 7.0982, longitude: 125.6307, radius: 9000 }, // General Santos City, South Cotabato
    { latitude: 8.2234, longitude: 126.4157, radius: 7000 }, // Bislig City, Surigao del Sur
    { latitude: 8.0254, longitude: 126.2964, radius: 8000 }, // Barobo, Surigao del Sur
    { latitude: 8.0017, longitude: 126.1031, radius: 7500 }, // Bayabas, Surigao del Sur
    { latitude: 7.8841, longitude: 126.0607, radius: 8500 }, // Trento, Agusan del Sur
    { latitude: 7.8192, longitude: 126.0467, radius: 9000 }, // Bunawan, Agusan del Sur
    { latitude: 8.2487, longitude: 125.9553, radius: 7000 }, // Bunawan, Agusan del Sur
    { latitude: 8.2432, longitude: 125.9511, radius: 8000 }, // Esperanza, Agusan del Sur
    { latitude: 8.2554, longitude: 125.9682, radius: 7500 }, // Prosperidad, Agusan del Sur
    { latitude: 9.9126, longitude: 125.7569, radius: 7500 },
    { latitude: 9.9000, longitude: 125.7500, radius: 7500 },
    { latitude: 9.9200, longitude: 125.7600, radius: 7500 },
    { latitude: 9.9300, longitude: 125.7700, radius: 7500 },
];

  
  const faultLines = [
    { latitude: 14.5499, longitude: 121.0589 }, // Marikina Fault Line
    { latitude: 14.5862, longitude: 121.0558 }, // Antipolo Fault
    { latitude: 16.6072, longitude: 120.8839 }, // Eastern Cordillera Fault
    { latitude: 14.5474, longitude: 121.0998 }, // Montalban Fault
    { latitude: 14.5479, longitude: 121.0543 }, // Marikina
    { latitude: 10.2379, longitude: 123.8267 }, // Cebu Fault
    { latitude: 10.3280, longitude: 123.9495 }, // Cebu South Coastal Fault
    { latitude: 9.2945, longitude: 123.2691 }, // Central Bohol Fault
    { latitude: 10.2379, longitude: 123.8267 }, // Lapu-Lapu Fault Line
    { latitude: 10.2926, longitude: 123.9029 }, // Lapu-Lapu City
    { latitude: 6.3724, longitude: 125.5560 }, // Cotabato Trench
    { latitude: 6.9105, longitude: 122.0738 }, // Zamboanga Fault
    { latitude: 7.1907, longitude: 125.4553 }, // Davao Fault
    { latitude: 8.6116, longitude: 124.7136 }, // Central Mindanao Fault
    { latitude: 6.3724, longitude: 125.5560 }, // Cotabato City
    { latitude: 15.2993, longitude: 120.9644 }, // Porac Fault
    { latitude: 14.1367, longitude: 121.2497 }, // Maragondon Fault
    { latitude: 14.8568, longitude: 120.5417 }, // Bustos Fault
    { latitude: 15.1135, longitude: 120.9772 }, // Guagua-Sasmuan Fault
    { latitude: 14.5708, longitude: 121.0223 }, // Montalban Fault
    { latitude: 10.1017, longitude: 123.6385 }, // Carcar Fault
    { latitude: 10.3157, longitude: 123.8854 }, // Cebu Fault
    { latitude: 9.9152, longitude: 123.3260 }, // Bohol Fault
    { latitude: 9.6703, longitude: 122.9633 }, // Basay Fault
    { latitude: 9.9463, longitude: 124.0311 }, // Anda Fault
    { latitude: 8.0602, longitude: 124.6610 }, // Cotabato Fault
    { latitude: 8.2346, longitude: 124.2453 }, // Cagayan de Oro Fault
    { latitude: 7.9807, longitude: 125.3276 }, // Tagum Fault
    { latitude: 7.0863, longitude: 124.9005 }, // Bukidnon Fault
    { latitude: 6.0851, longitude: 125.0952 }, // Sarangani Fault
    { latitude: 14.6020, longitude: 121.0794 }, // Marikina Fault Line
    { latitude: 14.6170, longitude: 121.0392 }, // West Valley Fault Line
    { latitude: 14.4142, longitude: 120.8830 }, // Lubang Fault Line
    { latitude: 14.0271, longitude: 120.8465 }, // Pampanga Segment of the Philippine Fault
    { latitude: 14.2401, longitude: 121.5001 }, // Eastern Philippine Fault
    { latitude: 16.4090, longitude: 120.5963 }, // San Fernando Fault Line, La Union
    { latitude: 14.8357, longitude: 120.6023 }, // Mariveles Fault System, Bataan
    { latitude: 10.3195, longitude: 123.9040 }, // Central Cebu Fault
    { latitude: 6.2247, longitude: 125.0712 }, // Cotabato Fault System, Cotabato
    { latitude: 8.3534, longitude: 124.5000 }, // Macajalar Bay Fault, Misamis Oriental
    { latitude: 16.2610, longitude: 121.0961 }, // Digdig Fault, Nueva Ecija
    { latitude: 16.2084, longitude: 120.8841 }, // Western Bataan Fault, Bataan
    { latitude: 15.6826, longitude: 120.3380 }, // Zambales Ophiolite Complex Fault
    { latitude: 17.3019, longitude: 121.7773 }, // Ilagan-Bacolod Fault, Isabela
    { latitude: 16.3037, longitude: 121.1228 }, // Cabanatuan-San Isidro Fault, Nueva Ecija
    { latitude: 8.2090, longitude: 124.2264 }, // Central Mindanao Fault, Misamis Oriental
    { latitude: 7.0761, longitude: 125.6111 }, // Sarangani Fault, South Cotabato
    { latitude: 7.1905, longitude: 125.4552 }, // Davao de Oro Fault, Davao de Oro
    { latitude: 7.0723, longitude: 125.6114 }, // Koronadal City Fault, South Cotabato
    { latitude: 7.0708, longitude: 125.6093 }, // Tupi-Polomolok Fault, South Cotabato
    { latitude: 8.2305, longitude: 126.4131 }, // Carrascal Fault, Surigao del Sur
    { latitude: 8.1068, longitude: 126.3949 }, // Hinatuan Fault, Surigao del Sur
    { latitude: 8.2227, longitude: 126.4153 }, // Lianga Fault, Surigao del Sur
    { latitude: 8.0255, longitude: 126.2962 }, // Tagbina Fault, Surigao del Sur
    { latitude: 8.0864, longitude: 126.2461 }, // Cateel Fault, Davao Oriental
    { latitude: 8.2515, longitude: 125.9487 }, // Bunawan Fault, Agusan del Sur
    { latitude: 8.2437, longitude: 125.9531 }, // Esperanza Fault, Agusan del Sur
    { latitude: 8.2562, longitude: 125.9673 }, // Prosperidad Fault, Agusan del Sur
    { latitude: 9.9150, longitude: 125.7550 },
    { latitude: 9.9050, longitude: 125.7650 },
    { latitude: 9.9250, longitude: 125.7450 },
];
  
  
const evacuationCenters = [
  { latitude: 14.5547, longitude: 121.0244, radius: 5000, hotline: '123-4567' }, // Quezon City
  { latitude: 14.5995, longitude: 120.9842, radius: 5000, hotline: '234-5678' }, // Manila
  { latitude: 10.3157, longitude: 123.8854, radius: 5000, hotline: '345-6789' }, // Cebu City
  { latitude: 7.1907, longitude: 125.4553, radius: 5000, hotline: '456-7890' }, // Davao City
  { latitude: 14.0906, longitude: 121.1410, radius: 5000, hotline: '567-8901' }, // Batangas City
  { latitude: 10.2926, longitude: 123.9029, radius: 5000, hotline: '678-9012' }, // Lapu-Lapu City, Cebu
  { latitude: 14.6326, longitude: 121.0424, radius: 5000, hotline: '789-0123' }, // Mandaluyong City, Metro Manila
  { latitude: 14.5794, longitude: 121.0359, radius: 5000, hotline: '890-1234' }, // San Juan City, Metro Manila
  { latitude: 14.6272, longitude: 120.9779, radius: 5000, hotline: '901-2345' }, // Makati City, Metro Manila
  { latitude: 14.6091, longitude: 120.9822, radius: 5000, hotline: '012-3456' }, // Pasay City, Metro Manila
  { latitude: 14.6615, longitude: 121.0590, radius: 5000, hotline: '123-4567' }, // Marikina City, Metro Manila
  { latitude: 10.6852, longitude: 122.9594, radius: 5000, hotline: '234-5678' }, // Iloilo City
  { latitude: 14.1800, longitude: 121.1638, radius: 5000, hotline: '345-6789' }, // Lipa City, Batangas
  { latitude: 10.2442, longitude: 123.8494, radius: 5000, hotline: '456-7890' }, // Mandaue City, Cebu
  { latitude: 14.0906, longitude: 121.1410, radius: 5000, hotline: '567-8901' }, // Batangas City
  { latitude: 14.5479, longitude: 120.9970, radius: 5000, hotline: '678-9012' }, // Pasig City, Metro Manila
  { latitude: 10.3213, longitude: 123.8926, radius: 5000, hotline: '789-0123' }, // Talisay City, Cebu
  { latitude: 10.6943, longitude: 122.5697, radius: 5000, hotline: '890-1234' }, // Bacolod City
  { latitude: 7.2041, longitude: 125.4554, radius: 5000, hotline: '901-2345' }, // Davao del Sur
  { latitude: 10.9767, longitude: 122.6336, radius: 5000, hotline: '012-3456' }, // Roxas City, Capiz
  { latitude: 16.6129, longitude: 120.3191, radius: 5000, hotline: '123-4567' }, // Baguio City, Benguet
  { latitude: 10.3174, longitude: 123.9075, radius: 5000, hotline: '234-5678' }, // Lapu-Lapu City, Cebu
  { latitude: 14.7468, longitude: 121.0498, radius: 5000, hotline: '345-6789' }, // Rodriguez, Rizal
  { latitude: 14.4316, longitude: 121.4480, radius: 5000, hotline: '456-7890' }, // Antipolo City, Rizal
  { latitude: 9.8345, longitude: 126.0339, radius: 5000, hotline: '567-8901' }, // Surigao City, Surigao del Norte
  { latitude: 8.2166, longitude: 124.2409, radius: 5000, hotline: '678-9012' }, // Cagayan de Oro City, Misamis Oriental
  { latitude: 6.1159, longitude: 125.1702, radius: 5000, hotline: '789-0123' }, // Koronadal City, South Cotabato
  { latitude: 10.2926, longitude: 123.9029, radius: 5000, hotline: '890-1234' }, // Lapu-Lapu City, Cebu
  { latitude: 8.4799, longitude: 124.6478, radius: 5000, hotline: '901-2345' }, // Iligan City, Lanao del Norte
  { latitude: 10.3004, longitude: 123.8854, radius: 5000, hotline: '012-3456' }, // Cebu City
  { latitude: 6.2544, longitude: 125.1270, radius: 5000, hotline: '123-4567' }, // Kidapawan City, North Cotabato
  { latitude: 7.1907, longitude: 125.4553, radius: 5000, hotline: '234-5678' }, // Davao City
  { latitude: 8.5662, longitude: 124.5455, radius: 5000, hotline: '345-6789' }, // Bukidnon
  { latitude: 6.9586, longitude: 122.0851, radius: 5000, hotline: '456-7890' }, // Zamboanga City
  { latitude: 10.6943, longitude: 122.5697, radius: 5000, hotline: '567-8901' }, // Bacolod City
  // Add more evacuation center locations here...
];


useEffect(() => {
  // Calculate the earthquake count per area
  const counts = {};
  earthquakes.forEach(earthquake => {
    const lat = earthquake.geometry.coordinates[1];
    const lon = earthquake.geometry.coordinates[0];
    // Round the latitude and longitude to group nearby earthquakes together
    const key = `${Math.round(lat)},${Math.round(lon)}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  setEarthquakeCounts(counts);
  
}, [earthquakes]);

useEffect(() => {
if (selectedMarkerIndex !== null) {
  setDisplayedEarthquakes([earthquakes[selectedMarkerIndex]]);
} else {
  setDisplayedEarthquakes(earthquakes);
}
}, [earthquakes, selectedMarkerIndex]);

useEffect(() => {
  if (mapReady && mapRef.current) {
    mapRef.current.fitToCoordinates([{ latitude: 13.41, longitude: 122.56 }], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
  }
}, [mapReady]);


const getCircleColor = (magnitude) => {
  if (magnitude < 2.5) {
    return 'rgba(0, 128, 0, 0.5)';
  } else if (magnitude < 5) {
    return 'rgba(255, 255, 0, 0.5)';
  } else {
    return 'rgba(255, 0, 0, 0.5)';
  }
};

const handleEarthquakeClick = (earthquake, index) => {
  setSelectedEarthquake(earthquake);
  setSelectedEarthquakeIndex(index);
  console.log('Earthquake:', earthquake);
  console.log('Index:', index);
  setTimeout(() => {
    setSelectedEarthquakeIndex(null);
  }, 5000);
  mapRef.current.animateToRegion({
    latitude: earthquake.geometry.coordinates[1],
    longitude: earthquake.geometry.coordinates[0],
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
};

const filteredEarthquakes = useMemo(() => {
  return earthquakes.filter(earthquake => earthquake.properties.place.includes(userCountry));
}, [earthquakes, userCountry]);

let mapType = "satellite"; // your mapType value

if (!mapType) {
  console.warn('mapType was null or undefined, setting it to "standard"');
  mapType = "standard";
}

const fetchData = async () => {
  if (userCountry) {
    setIsLoading(true); // Set loading to true when starting to fetch data
    const userEmail = await AsyncStorage.getItem('email'); // Fetch the userEmail
    const doc = await firebase.firestore().collection('users').doc(userEmail).get();
    let timePeriod = doc.data().timePeriod;
    timePeriod = timePeriod && timePeriod.trim();
    console.log(`Time period: '${timePeriod}'`);
    if (!timePeriod) {
      timePeriod = 'all_week'; // Default value if timePeriod is null or empty
    }
    let url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`;
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const filteredEarthquakes = data.features.filter(earthquake => earthquake.properties.place.includes(userCountry));
        setEarthquakes(filteredEarthquakes);
        setIsLoading(false); // Set loading to false when data is fetched
      });
  }
};

useEffect(() => {
  fetchData();
  const intervalId = setInterval(fetchData, 60000 * 30);

  return () => clearInterval(intervalId);
}, [userCountry]);

useEffect(() => {
  const loadUserData = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('email');
      const userCountry = await AsyncStorage.getItem('country');

      if (userEmail) setUserEmail(userEmail);
      if (userCountry) setUserCountry(userCountry);
    } catch (e) {
      console.error('Failed to load user data from storage.', e);
    }
  };

  loadUserData();
}, []);

useEffect(() => {
  const fetchUserCountry = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const unsubscribe = firebase.firestore().collection('users').doc(user.email).onSnapshot(doc => {
        if (doc.exists) {
          const userData = doc.data();
          setUserEmail(userData.email);
          setUserCountry(userData.country); // Assuming 'country' is a field in your user document
          fetchData(); // Fetch data after setting the user location
        } else {
          console.log('No such document!');
        }
      }, error => {
        console.log('Error getting document:', error);
      });

      // Clean up the onSnapshot listener when the component is unmounted
      return () => unsubscribe();
    } else {
      console.log('No user is logged in');
    }
  };

  fetchUserCountry();
}, []);

const fadeAnim = useRef(new Animated.Value(1)).current;
const mapRef = useRef(null);

useEffect(() => {
  if (mapRef.current) {
    mapRef.current.fitToCoordinates([{ latitude: 13.41, longitude: 122.56 }], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
  }
}, [mapRef]);

useEffect(() => {
  const getShowMap = async () => {
    const storedShowMap = await AsyncStorage.getItem('showMap');
    setShowMap(storedShowMap === 'true');
  };
  getShowMap();
}, []);

useEffect(() => {
  if (showMap) {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();
  }
}, [showMap]);

const fadeOut = () => {
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 2000,
    useNativeDriver: true
  }).start(async () => {
    setShowMap(true);
    await AsyncStorage.setItem('showMap', 'true');
  });
};

useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
  })();
}, []);

async function getRoute(userLocation, closestCenter) {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.coords.latitude},${userLocation.coords.longitude}&destination=${closestCenter.latitude},${closestCenter.longitude}&key=AIzaSyAyYrujSoH2OcmWCxXlup_KSKE9coSDgnE`);
    const data = await response.json();
    if (data.routes.length) {
      const points = decodePolyline(data.routes[0].overview_polyline.points);
      return points;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}

const decodePolyline = (encoded) => {
  const poly = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    const latlng = {
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    };
    poly.push(latlng);
  }
  return poly;
};

// Add a state for the route
const [route, setRoute] = useState(null);

// Use the function to get the route and set it to your state
useEffect(() => {
  if (userLocation && closestCenter) {
    getRoute(userLocation, closestCenter).then(route => {
      if (route) {
        setRoute(route);
      }
    });
  }
}, [userLocation, closestCenter]);

  if (!mapType) {
    console.warn('mapType was null or undefined, setting it to "standard"');
    mapType = "standard";
  }

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  let closestCenter;
  let closestCenterHotline;
  if (userLocation) {
    const distances = evacuationCenters.map(center => getDistance(userLocation.coords.latitude, userLocation.coords.longitude, center.latitude, center.longitude));
    const minDistance = Math.min(...distances);
    closestCenter = evacuationCenters[distances.indexOf(minDistance)];
    closestCenterHotline = closestCenter.hotline;
  }

  const [selectedLegendIndex, setSelectedLegendIndex] = useState(null);
  const [selectedMapFeature, setSelectedMapFeature] = useState(null);

  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Set the opacity to 0.1
    setOpacity(0.1);
  
    // Set a timeout to change the opacity back to 1 after 2 seconds
    const timeout = setTimeout(() => {
      setOpacity(1);
    }, 2000);
  
    // Clear the timeout when the component is unmounted or before the next render
    return () => clearTimeout(timeout);
  }, [selectedLegendIndex]);

  const [boxHeight, setBoxHeight] = useState(windowHeight * 0.3); // replace windowHeight * 0.3 with your initial box height
  const [boxHeight1, setBoxHeight1] = useState(windowHeight * 0.325); // replace windowHeight * 0.3 with your initial box height
  const [isOriginalPosition, setIsOriginalPosition] = useState(true);


  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
    },
    infoText: {
      color: 'white',
      fontFamily: 'glacial-indifference-regular',
    },
    titleText: {
      color: '#B6E6CF',
      fontWeight: 'bold',
      fontFamily: 'glacial-indifference-regular',
      textAlign: 'center',
    },
    infoText1: {
      color: 'white',
      marginTop: 10,
      fontFamily: 'glacial-indifference-regular',
    },
    infoText2: {
      marginTop: 10,
      color: 'white',
      fontFamily: 'glacial-indifference-regular',
    },
    infoText3: {
      marginTop: 10,
      color: 'white',
      fontFamily: 'glacial-indifference-regular',
    },
    infoText4: {
      marginTop: 10,
      color: 'white',
      fontFamily: 'glacial-indifference-regular',
    },
    loadingImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
    backButton: {
      position: 'absolute',
      top: 10,
      left: 10,
      padding: 10,
      zIndex: 1,
    },
    backImage: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    infoBox: {
      position: 'absolute',
      top: windowHeight * 0.1,
      right: 10,
      width: windowWidth * 0.35, // adjust as needed
      height: boxHeight, // use the boxHeight state variable here
      backgroundColor: 'white', // change as needed
      padding: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    infoBox1: {
      position: 'absolute',
      top: windowHeight * 0.425,
      right: 10,
      width: windowWidth * 0.325, // adjust as needed
      height: boxHeight1, // adjust as needed
      backgroundColor: 'white', // change as needed
      padding: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    infoBox2: {
      position: 'absolute',
      bottom: 0,
      width: windowWidth, // adjust as needed
      height: windowHeight * 0.15, // adjust as needed
      backgroundColor: 'white', // change as needed
      padding: 10,
      overflow: 'hidden',
    },
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
      height: windowHeight * 0.4, // Adjust the height as needed
      backgroundColor: 'white', // Change the color as needed
        borderRadius: 20,
        overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    boxTitle: {
      fontSize: windowWidth * 0.05,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 20,
    },
    proceedButton: {
      width: '80%',
      height: '10%',
      margin: windowWidth * 0.05,
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
  });

  const [showSeismic, setShowSeismic] = useState(false);
  const [showLandslide, setShowLandslide] = useState(false);
  const [showFaultLines, setShowFaultLines] = useState(false);
  const [showEvacuation, setShowEvacuation] = useState(false);
  const [showEarthquake, setShowEarthquake] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/arrow_back.png')} style={styles.backImage} />
      </TouchableOpacity>
      <Animated.View style={[styles.container, { opacity: 1 }]}>
        {isLoading ? (
          <ImageBackground source={require('../assets/bg1.png')} style={styles.loadingContainer}>
            <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
          </ImageBackground>
      ) : (
          <>
              <MapView
                provider={PROVIDER_GOOGLE}
                mapType={mapType}
                ref={mapRef}
                onLayout={() => setMapReady(true)}
                style={{ flex: 1, width: '100%', height: '100%', }}
                initialRegion={{
                  latitude: 12.8797,
                  longitude: 121.7740,
                  latitudeDelta: 20, // adjust as needed
                  longitudeDelta: 20, // adjust as needed
                }}
                showsUserLocation={true} 
                liteMode={true} 
              >
                {showSeismic && Object.entries(earthquakeCounts).map(([key, count], index) => {
                  const [lat, lon] = key.split(',').map(Number);
                  return (
                    <Circle
                      key={index}
                      center={{ latitude: lat, longitude: lon }}
                      radius={count * 10000} // Increase the radius based on the earthquake count
                      strokeColor={selectedMapFeature === 'seismic' ? 'rgba(0, 255, 255, 1)' : 'rgba(0, 255, 255, 0.3)'}
                      fillColor={selectedMapFeature === 'seismic' ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 0, 0, 0.1)'}
                    />
                  );
                })}
                {showEarthquake && displayedEarthquakes.map((earthquake, index) => (
                <View key={index}>
                  <Marker
                    coordinate={{
                      latitude: earthquake.geometry.coordinates[1],
                      longitude: earthquake.geometry.coordinates[0],
                    }}
                    onPress={() => handleEarthquakeClick(earthquake, index)}
                    pinColor={selectedEarthquakeIndex === null ? 'red' : (index === selectedEarthquakeIndex ? 'red' : 'white')}
                  />
                  <Circle
                    center={{
                      latitude: earthquake.geometry.coordinates[1],
                      longitude: earthquake.geometry.coordinates[0],
                    }}
                    radius={(earthquake.properties.mag + 1) * 10000}
                    strokeColor={selectedEarthquakeIndex === null ? '#000' : (index === selectedEarthquakeIndex ? '#000' : 'white')}
                    fillColor={selectedEarthquakeIndex === null ? getCircleColor(earthquake.properties.mag) : (index === selectedEarthquakeIndex ? getCircleColor(earthquake.properties.mag) : 'rgba(255, 255, 255, 0.5)')}
                  />
                </View>
              ))}
                  {showLandslide && landslideProneAreas.map((coordinate, index) => (
                    <Marker
                      key={index}
                      coordinate={coordinate}
                    >
                      <Image
                        source={require('../assets/icons/landslide.png')} // replace with your image path
                        style={{ width: 50, height: 50,  opacity: 1 }} // replace with desired dimensions
                      />
                    </Marker>
                  ))}

                  {showFaultLines && (
                    <Polyline
                      coordinates={faultLines}
                      strokeColor='rgba(255, 0, 0, 1)'
                      strokeWidth={2}
                    />
                  )}
                {evacuationCenters.map((center, index) => (
                  <View key={index}>
                    <Marker
                      coordinate={{
                        latitude: center.latitude,
                        longitude: center.longitude,
                      }}
                      title={`Evacuation Center ${index + 1}`}
                      opacity={center === closestCenter ? 1 : 0} // Set opacity based on whether it's the closest center
                    >
                      <Image
                        source={require('../assets/icons/exit.png')} // replace with your image path
                        style={{ width: 50, height: 50, opacity: 1 }} // replace with desired dimensions
                      />
                    </Marker>
                  </View>
                ))}
                  {route && (
                    <Polyline
                      coordinates={route}
                      strokeColor="#0000FF" // blue
                      strokeWidth={10}
                    />
                  )}
              </MapView>

            <ImageBackground source={require('../assets/bg1.png')} style={styles.infoBox}>
              <Text style={styles.titleText}>EARTHQUAKES</Text>
              <ScrollView>
                {selectedEarthquake && (
                  <>
                  </>
                )}
                {earthquakes.map((earthquake, index) => (
                    <TouchableOpacity key={index} onPress={() => handleEarthquakeClick(earthquake, index)}>
                      <Text style={styles.infoText}>{earthquake.properties.title}</Text>
                      <Text></Text>
                    </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity 
                    style={{ 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }} 
                    onPress={() => {
                      setIsOriginalPosition(!isOriginalPosition);
                      setBoxHeight(isOriginalPosition ? boxHeight - 155 : windowHeight * 0.3);
                    }}
                  >
                    <Image 
                      source={require('../assets/icons/upload.png')} 
                      style={{ 
                        width: 20, 
                        height: 20 
                      }} 
                    /> 
                  </TouchableOpacity>
            </ImageBackground>

            <ImageBackground source={require('../assets/bg1.png')} style={styles.infoBox1}>
              <Text style={styles.titleText}>PRESS TO TOGGLE</Text>
              <ScrollView>
                <TouchableOpacity onPress={() => setShowLandslide(!showLandslide)}>
                  <Text style={styles.infoText1}>Landslide Prone Areas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowFaultLines(!showFaultLines)}>
                  <Text style={styles.infoText2}>Fault Lines</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowSeismic(!showSeismic)}>
                  <Text style={styles.infoText3}>Seismic Activities</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEarthquake(!showEarthquake)}>
                  <Text style={styles.infoText4}>Earthquakes</Text>
                </TouchableOpacity>
                </ScrollView>
                  <TouchableOpacity 
                    style={{ 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }} 
                    onPress={() => {
                      setIsOriginalPosition(!isOriginalPosition);
                      setBoxHeight1(isOriginalPosition ? boxHeight1 - 150 : windowHeight * 0.3);
                    }}
                  >
                    <Image 
                      source={require('../assets/icons/upload.png')} 
                      style={{ 
                        width: 20, 
                        height: 20 
                      }} 
                    /> 
                  </TouchableOpacity>
            </ImageBackground>

            <ImageBackground source={require('../assets/bg1.png')} style={styles.infoBox2}>
              <Text style={styles.titleText}>NEAREST LOCAL HOTLINE</Text>
              <Text 
                style={[ styles.infoText, { fontSize: windowWidth * 0.075, textAlign: 'center', margin: 10, color: 'white' } ]}
                onPress={() => Linking.openURL(`tel:${closestCenterHotline}`)}
              >
                LOCAL HOTLINE: {closestCenterHotline}
              </Text>
            </ImageBackground>
          </>
        )}
      </Animated.View>
    </View>
  );
}
