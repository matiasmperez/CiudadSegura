import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity, Image, Modal, TextInput, Keyboard, Linking} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Device from 'expo-device';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper'
import { Share } from 'react-native';
import { SimpleLineIcons, MaterialCommunityIcons, FontAwesome , AntDesign} from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import url from '../../constants/url';
import axios from 'axios';
import Dialog, { SlideAnimation } from 'react-native-popup-dialog';




const Home = ({navigation}) => {
  const [jwt, setJwt] = useState(null); 
  const [iduser, setIduser] = useState(null); 
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMarkerCoords, setNewMarkerCoords] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [myIncidents, setmyIncidents] = useState([]);
  const [selectedIncidentForEdit, setSelectedIncidentForEdit] = useState(null);
  
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [policia,setPolicia] = useState("");
  const [ambulancia,setAmbulancia] = useState("");
  const [bomberos,setBomberos] = useState("");

  const incidentColors = {
    Robo: 'rgba(231, 76, 60, 0.65)', // Rojo para el tipo "Robo"
    Hurto: 'rgba(52, 152, 219, 0.65)', // Azul para el tipo "Hurto"
    'Asalto a propiedad': 'rgba(46, 204, 113, 0.65)', // Verde para el tipo "Asalto a propiedad"
    Vandalismo: 'rgba(230, 126, 34, 0.65)', // Naranja para el tipo "Vandalismo"
    'Delito sexual': 'rgba(186, 83, 158, 0.65)', // Violeta para el tipo "Delito sexual"
    Incendio: 'rgba(240, 98, 146, 0.65)', // Rosa para el tipo "Incendio"
    Saqueo: 'rgba(101, 198, 187, 0.65)', // Celeste para el tipo "Saqueo"
    Otro: 'rgba(169, 169, 169, 0.65)', // Gris para el tipo "Otro"
  };

  const handleDeleteIncident = (post) => {

    setPostToDelete(post);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirmation = async () => {
    // Cierra el diálogo de confirmación
    setDeleteConfirmationVisible(false);

    if (postToDelete) {
      try {

        await axios.delete(url + `api/incidentes/${postToDelete}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

      
      } catch (error) {
        console.error('Error al eliminar el incidente:', error);
      }
    }
  };

  handleIncidentSelection = (incidentType) => {
    setSelectedIncident(incidentType);
  };

  cerrarTeclado = () => {
    // Realiza alguna acción aquí si es necesario
    // Luego, cierra el teclado
    this.textInput.clear(); // Esto limpia el contenido del TextInput
    this.textInput.blur(); // Esto quita el foco y cierra el teclado
  }
  
  const saveEditedIncidentAndCloseModal = async () => {
    try {
      setSelectedIncidentForEdit(null);
      setModalVisible(false);
      setSelectedIncident(null);
      setNoteText('');
    } catch (error) {
      console.error(error);
    }
  };

  const navegar = () => {
    navigation.navigate("Comunidad");
  }
  const navegarEstadisticas = () => {
    navigation.navigate("Estadisticas");
  }
  const navegarAyuda = () => {
    navigation.navigate("Ayuda");
  }
  const navegarTerminos = () => {
    navigation.navigate("Terminos");
  }

  const [intervalId, setIntervalId] = useState(null); 

  useEffect(() => {

    getData();
    fetchIncidentsAndUpdate(); // Llamada inicial
    const updateInterval = setInterval(fetchIncidentsAndUpdate, 1000); // Actualiza cada 1 segundos

    fetchLocalidad();
    if (location && mapRef.current) {
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02, 
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(initialRegion, 500); 
    }


    const time = setInterval(() => {
      updateLocation(); 
      
    }, 5000);
    
    setIntervalId(time);

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval); // Limpia el intervalo al desmontar el componente
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [selectedIncident]); 

  useEffect(() => {
    
    if (jwt && iduser) {
      fetchIncidentsAndUpdate();
    }
  }, [jwt, iduser]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('jwt');
      const value2 = await AsyncStorage.getItem('id');
      if (value !== null && value2 !== null) {
        setJwt(value);
        setIduser(value2);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const centerMapOnLocation = () => {
    if (mapRef.current && location) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };  

  const fetchIncidentsAndUpdate = async () => {
    try {
      const response = await axios.get(url + 'api/incidentes', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
  
      const allIncidents = response.data.data;

  
      const filteredMyIncidents = iduser ? allIncidents.filter(incident => incident._idusuario === iduser) : [];
  
      setmyIncidents(filteredMyIncidents);
      setIncidents(allIncidents.filter(incident => incident._idusuario !== iduser));
    } catch (error) {
      console.error(error);
    }
  };
  
  const sendIncident = async () => {
    try {
      await axios.post(
        url + 'api/incidentes',
        {
          tipo: selectedIncident,
          latitude: newMarkerCoords.latitude,
          longitude: newMarkerCoords.longitude,
          detalle: noteText,
          _idusuario: iduser,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      alert("Incidente cargado correctamente");
      // Después de agregar un incidente, actualiza la lista de incidentes.
      fetchIncidents();
    } catch (error) {
      console.error(error);
    }
  };
  

  const updateLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Se denegó el permiso para acceder a la ubicación');
        return;
      }

      let updatedLocation = await Location.getCurrentPositionAsync({});
      setLocation(updatedLocation);

    } catch (error) {
      console.error(error);
    }
  };


  const mapRef = React.createRef(); 



  const focusOnMarker = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  let initialRegion = {
    latitude: -34.921388,
    longitude: -57.954587,
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

  const closeModal = () =>{
    setModalVisible(false);
  }

  const saveNoteAndCloseModal = () => {
    sendIncident();
    setModalVisible(false);
    setSelectedIncident(null);
    setNoteText('');
  };

  const fetchLocalidad = async () => {
    if (location && location.coords) {
      try {
        const response = await axios.post(url + "api/pais", {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setPolicia(response.data.data.policia);
        setAmbulancia(response.data.data.ambulancia)
        setBomberos(response.data.data.bombero)
      } catch (error) {
        console.error('Error al obtener la localidad:', error);
      }
    } else {
      console.error('Location es nulo o no tiene la propiedad coords.');
    }
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

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'CiudadSegura: Tu Compañero para una Ciudad Más Segura',
        message: 'Descarga CiudadSegura y únete a nuestra comunidad comprometida con la seguridad en la ciudad. ¡Juntos podemos crear un entorno más seguro para todos! ',
        url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
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
              onPress={onShare}
            >
              <AntDesign style={styles.textmenu} name="sharealt" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton3}
          onPress={centerMapOnLocation}
        >
          <FontAwesome style={styles.textmenu} name="location-arrow" size={12} color="black"></FontAwesome>
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
              image={require('../../assets/img/ubicacion.png')}
              pinColor=''
            />
          )}
          {incidents.map((incident) => (
  <Marker
    key={incident._id}
    coordinate={{
      latitude: parseFloat(incident.latitude),
      longitude: parseFloat(incident.longitude),
    }}
    title={incident.tipo + " - " + incident.fecha}
    description={incident.detalle }
  >
    <View style={{
      width: 25,
      height: 25,
      borderRadius: 20,
      backgroundColor: incidentColors[incident.tipo] || 'rgba(231, 76, 60, 0.65)', // Rojo predeterminado si no se encuentra el tipo
      border: 5,
      borderColor: 'red',
    }} />
  </Marker>
))}
          {myIncidents.map(incident => (
            <Marker
              key={incident._id}
              coordinate={{
                latitude: parseFloat(incident.latitude),
                longitude: parseFloat(incident.longitude),
              }}
              title={incident.tipo + " - " + incident.fecha}
              description={incident.detalle}
              onSelect={() => handleDeleteIncident(incident._id)}
            >
            </Marker>
          ))}
        </MapView>
      )}
      
      <Modal
       animationType="slide"
       transparent={true}
       visible={modalVisible || selectedIncidentForEdit !== null}
       onRequestClose={() => {
         setModalVisible(false);
         setSelectedIncidentForEdit(null);
       }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.titulomodal}>
            {selectedIncidentForEdit ? "Editar Incidente" : "Nuevo Incidente"}
          </Text>

          <View style={styles.checkboxContainer2}>

            <View style={styles.checkboxContainer}>

            <View style={styles.checkboxContainer2}>
              <BouncyCheckbox
                size={25}
                style={styles.checkbox}
                fillColor={selectedIncident === 'Robo' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "blue" }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ color: 'white', fontWeight: 'bold'}}
                onPress={() => handleIncidentSelection('Robo')}
          
              />
              <Text style={styles.label}>Robo</Text>
            </View>

            <View style={styles.checkboxContainer2}>
              <BouncyCheckbox
                size={25}
                style={styles.checkbox}
                fillColor={selectedIncident === 'Hurto' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "blue" }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ color: 'white', fontWeight: 'bold'}}
                onPress={() => handleIncidentSelection('Hurto')}
          
              />
              <Text style={styles.label}>Hurto</Text>
            </View>

            <View style={styles.checkboxContainer2}>
              <BouncyCheckbox
                size={25}
                style={styles.checkbox}
                fillColor={selectedIncident === 'Asalto a propiedad' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "blue" }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ color: 'white', fontWeight: 'bold'}}
                onPress={() => handleIncidentSelection('Asalto a propiedad')}
          
              />
              <Text style={styles.label}>Asalto a propiedad</Text>
            </View>

            <View style={styles.checkboxContainer2}>
              <BouncyCheckbox
                size={25}
                style={styles.checkbox}
                fillColor={selectedIncident === 'Vandalismo' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "blue" }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ color: 'white', fontWeight: 'bold'}}
                onPress={() => handleIncidentSelection('Vandalismo')}
          
              />
              <Text style={styles.label}>Vandalismo</Text>
            </View>

            </View>
            
            <View style={styles.checkboxContainer}>

            <View style={styles.checkboxContainer2}>
            <BouncyCheckbox
              size={25}
              style={styles.checkbox}
              fillColor={selectedIncident === 'Delito sexual' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "blue" }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ color: 'white', fontWeight: 'bold'}}
              onPress={() => handleIncidentSelection('Delito sexual')}
        
            />
            <Text style={styles.label}>Delito sexual</Text>
            </View>

            <View style={styles.checkboxContainer2}>
            <BouncyCheckbox
              size={25}
              style={styles.checkbox}
              fillColor={selectedIncident === 'Incendio' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "blue" }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ color: 'white', fontWeight: 'bold'}}
              onPress={() => handleIncidentSelection('Incendio')}
        
            />
            <Text style={styles.label}>Incendio</Text>
            </View>

            <View style={styles.checkboxContainer2}>
            <BouncyCheckbox
              size={25}
              style={styles.checkbox}
              fillColor={selectedIncident === 'Saqueo' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "blue" }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ color: 'white', fontWeight: 'bold'}}
              onPress={() => handleIncidentSelection('Saqueo')}
        
            />
            <Text style={styles.label}>Saqueo</Text>
            </View>

            <View style={styles.checkboxContainer2}>
            <BouncyCheckbox
              size={25}
              style={styles.checkbox}
              fillColor={selectedIncident === 'Otro' ? 'rgb(41, 128, 185)' : '#FFFFFF'}
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "blue" }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ color: 'white', fontWeight: 'bold'}}
              onPress={() => handleIncidentSelection('Otro')}
        
            />
            <Text style={styles.label}>Otro</Text>
            </View>
            </View>
          </View>

          <TextInput
      editable
      multiline
      numberOfLines={4}
      maxLength={200}
      style={styles.noteInput}
      placeholder="Detalles del incidente"
      value={noteText}
      onChangeText={setNoteText}
      onKeyPress={(event) => {
        if (event.nativeEvent.key === 'Enter') {
          Keyboard.dismiss(); // Cierra el teclado
        }
      }}
    />

    {selectedIncidentForEdit ? ( 
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveEditedIncidentAndCloseModal}
        >
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setSelectedIncidentForEdit(null);
            setModalVisible(false);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    ) : ( 
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveNoteAndCloseModal}
        >
          <Text style={styles.saveButtonText}>Guardar Incidente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    )}
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
          <Text style={styles.menuItemTitle}>CiudadSegura</Text>
        </View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={navegarEstadisticas}
        >
          <Text style={styles.menuItemText}>Estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={navegar}
        >
          <Text style={styles.menuItemText}>Comunidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={navegarAyuda}
        >
          <Text style={styles.menuItemText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={navegarTerminos}
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
          onPress={() => callPhoneNumber(policia)}
        >
         <MaterialCommunityIcons name="police-badge" size={30} color="white" style={styles.buttonText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton2}
          onPress={() => callPhoneNumber(ambulancia)}
        >
          <FontAwesome name="ambulance" size={30} color="white" style={styles.buttonText}/>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.callButton3}
          onPress={() => callPhoneNumber(bomberos)}
        >
         <FontAwesome name="fire-extinguisher" size={30} color="white" style={styles.buttonText}/>
        </TouchableOpacity>
      </View>

      <Dialog
        visible={deleteConfirmationVisible}
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        onTouchOutside={() => setDeleteConfirmationVisible(false)}
      >
        <View style={{padding: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>¿Estás seguro de que deseas eliminar este incidente?</Text>
          <Button title="Eliminar" onPress={handleDeleteConfirmation} style={{backgroundColor: "red", padding: 0, margin: 20, marginTop: 30}}><Text style={{color:"white",fontSize:16}}>Eliminar</Text></Button>
          <Button title="Cancelar" onPress={() => setDeleteConfirmationVisible(false)} style={{backgroundColor: "grey", padding: 0, margin: 20, marginTop: 10}}><Text style={{color:"white",fontSize:16}}>Cancelar</Text></Button>
        </View>
      </Dialog>

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
  menuButton3: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    top: 120,
    right: 30,
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
    color: 'black',
  },  
  menuItemText3: {
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
    width: 370,
    height: 100,
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
  checkboxContainer2: {
    flexDirection: 'row',
    margin: 10
  },
  checkboxContainer: {
    flexDirection: 'column',
    margin: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 0,
    fontSize: 18,
    color: 'white'
  },
});

export default Home;
