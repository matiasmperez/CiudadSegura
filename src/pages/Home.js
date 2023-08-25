import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Device from 'expo-device';
import * as Location from 'expo-location';
import { Linking } from 'react-native';


const Home = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'La función no funcionará en el emulador de Android'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se denegó el permiso para acceder a la ubicación');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (location) {
    initialRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }

  const callPhoneNumber = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      {(Platform.OS === 'ios' || Platform.OS === 'android') && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Mi Ubicación"
            />
          )}
        </MapView>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => callPhoneNumber('555555555')}
        >
          <Image
        style={styles.image}
        source={require('../../assets/img/policia.png')}
        />
          <Text style={styles.callButtonText}>Policia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton2}
          onPress={() => callPhoneNumber('555555555')}
        >
           <Image
        style={styles.image}
        source={require('../../assets/img/doctor.png')}
        />
          <Text style={styles.callButtonText}>Ambulancia</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.callButton3}
          onPress={() => callPhoneNumber('555555555')}
        >
          <Image
        style={styles.image}
        source={require('../../assets/img/bombero.png')}
        />
          <Text style={styles.callButtonText}>Bomberos</Text>
        </TouchableOpacity>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 30,
    height: 30,
    padding: '10%',
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 20,
  },
  callButton: {
    margin: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
  },
  callButton2: {
    margin: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
  },
  callButton3: {
    margin: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default Home;
