import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Device from 'expo-device';
import * as Location from 'expo-location';
import { Linking } from 'react-native';


const Home = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [newMarkerCoords, setNewMarkerCoords] = useState(null); // Coordenadas del nuevo marcador
  const [noteText, setNoteText] = useState(''); // Texto de la nota para el marcador

  const mapRef = React.createRef(); 

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

  useLayoutEffect(() => {
    if (location && mapRef.current) {
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02, // Ajusta la latitudDelta y longitudDelta según tus necesidades
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(initialRegion, 1000); // Animación de 1 segundo
    }
  }, [location]);

  const focusOnMarker = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000); // Animación de 1 segundo
    }
  };

  let initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.02, // Ajusta la latitudDelta y longitudDelta según tus necesidades
    longitudeDelta: 0.02,
  };

  if (location) {
    initialRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
     
    };
  }

  const callPhoneNumber = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMapPress = event => {
    setNewMarkerCoords(event.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const saveNoteAndCloseModal = () => {
    // Aquí puedes realizar el guardado de la nota asociada al marcador
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {(Platform.OS === 'ios' || Platform.OS === 'android') && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Mi Ubicación"
              onPress={focusOnMarker}
            />
          )}
          {newMarkerCoords && (
            <Marker
              coordinate={newMarkerCoords}
              title="Nuevo Marcador"
            />
          )}
        </MapView>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.titulomodal}>
            Incidente
          </Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Agregar incidente"
            value={noteText}
            onChangeText={setNoteText}
          />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveNoteAndCloseModal}
          >
            <Text style={styles.saveButtonText}>Guardar Incidente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={saveNoteAndCloseModal}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
        </View>
      </Modal>

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
  titulomodal:{
    fontSize: 24,
    color: "white",
    marginBottom: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  noteInput: {
    width: 200,
    height: 40,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10
  },
  cancelButtonText: {
    color: 'white',
  },
});

export default Home;
