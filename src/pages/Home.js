import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Device from 'expo-device';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { SimpleLineIcons, MaterialCommunityIcons, FontAwesome , AntDesign} from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';




const Home = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoords, setNewMarkerCoords] = useState(null);
  const [noteText, setNoteText] = useState('');

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
        latitudeDelta: 0.02, 
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(initialRegion, 1000); 
    }
  }, [location]);

  const focusOnMarker = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  let initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.02, 
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

  const [menuVisible, setMenuVisible] = useState(false);

  handleLogout = async () => {
    try {
      await AsyncStorage.clear()
      navigation.navigate("Bienvenido")
    } catch (e) {
      console.log(e)
    }
  };



  return (
    <View style={styles.container}>
       <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <SimpleLineIcons style={styles.textmenu} name="menu" size={24} color="black" />
        </TouchableOpacity>

       <TouchableOpacity
              style={styles.menuButton2}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <AntDesign style={styles.textmenu} name="sharealt" size={28} color="black" />
        </TouchableOpacity>
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

      <Modal
      animationType="fade"
      transparent={true}
      visible={menuVisible}
      onRequestClose={() => setMenuVisible(false)}
     >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={() => setMenuVisible(false)}
      ></TouchableOpacity>
      <View style={styles.menuContainer}>
        <Image
        style={styles.tinyLogo}
        source={require('../../assets/img/1.png')}
        />
        <View style={styles.menuItem}>
          <Text style={styles.menuItemTitle}>CuidadSegura</Text>
        </View>
        <TouchableOpacity
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Mis incidentes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Comunidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>Terminos y condiciones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <Text style={styles.menuItemText3}>Cerrar sesión</Text>
        </TouchableOpacity>
        
      </View>
    </Modal>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => callPhoneNumber('555555555')}
        >
         <MaterialCommunityIcons name="police-badge" size={30} color="white" style={styles.buttonText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton2}
          onPress={() => callPhoneNumber('555555555')}
        >
          <FontAwesome name="ambulance" size={30} color="white" style={styles.buttonText}/>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.callButton3}
          onPress={() => callPhoneNumber('555555555')}
        >
         <FontAwesome name="fire-extinguisher" size={30} color="white" style={styles.buttonText}/>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },  
  menuButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    top: 50,
    left: 20,
    zIndex: 10,
  },
  menuButton2: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    top: 50,
    right: 20,
    zIndex: 10,
  },
  tinyLogo: {
    position: 'relative',
    width: '100%',
    height: 100,
    marginTop:30,
    
  },
  textmenu: {
    padding: 10,
    color: 'white'
  },
  buttonText: {
    padding:10
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderTopEndRadius: 30,
    borderBottomEndRadius: 10,
    top: 0,
    left: 0,
    width: 175,
    height: '100%',
    padding: 10,
    elevation: 4,
    zIndex: 100,
  },
  menuItem: {
    alignItems: 'center',
    marginTop:15,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 'auto',
    color: 'black',
  },  
  menuItemText3: {
    marginTop: 420,
    fontSize: 'auto',
    color: 'red',
  },  
  menuItemTitle: {
    fontSize: 20,
    color: 'black',
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
    margin: 30,
    backgroundColor: 'rgb(41, 128, 185)',
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
  },
  callButton2: {
    margin: 30,
    backgroundColor: 'rgb(39, 174, 96)',
    padding: 10,
    borderRadius: 100,
    
    alignItems: 'center',
  },
  callButton3: {
    margin: 30,
    backgroundColor: 'rgb(231,76,60)',
    padding: 10,
    borderRadius: 100,
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
  button: {
    alignItems: 'center',
    backgroundColor: '#FCFCFD',
    borderRadius: 4,
    borderWidth: 0,
    elevation: 3,
    shadowColor: 'rgba(45, 35, 66, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
    borderColor: 'transparent',
    boxSizing: 'border-box',
    color: '#36395A',
    cursor: 'pointer', // Not applicable in React Native
    display: 'flex',
    fontFamily: 'JetBrains Mono',
    height: 48,
    justifyContent: 'center',
    lineHeight: 1,
    overflow: 'hidden',
    paddingHorizontal: 16,
    position: 'relative',
    textAlign: 'left', // Not applicable in React Native
    textDecorationLine: 'none', // Not applicable in React Native
    transitionProperty: 'box-shadow, transform',
    transitionDuration: 150,
    userSelect: 'none', // Not applicable in React Native
    touchAction: 'manipulation', // Not applicable in React Native
    whiteSpace: 'nowrap',
    willChange: 'box-shadow, transform',
    fontSize: 18,
  },
  focusedButton: {
    shadowColor: '#D6D6E7',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1.5,
    borderColor: '#D6D6E7',
    elevation: 0,
  },
  hoveredButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    transform: [{ translateY: -2 }],
  },
  pressedButton: {
    shadowColor: '#D6D6E7',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
    transform: [{ translateY: 2 }],
  },
});

export default Home;
