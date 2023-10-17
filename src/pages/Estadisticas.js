import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import url from '../../constants/url';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Estadisticas = ({ navigation }) => {
  const [jwt, setJwt] = useState(null);
  const [iduser, setIduser] = useState(null);
  const [estadisticas, setEstadisticas] = useState([]);

  useEffect(() => {
    axios
      .get(url + 'api/ciudades', {})
      .then((response) => {
        setEstadisticas(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error('Error al obtener estadísticas:', error);
      });
  }, [jwt]);

  useEffect(() => {
    getData();
  });

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

  const navegar = () => {
    navigation.navigate('Home');
  };

  // Función para agrupar las estadísticas por ciudad
  const groupEstadisticasByCiudad = (estadisticas) => {
    const groupedEstadisticas = {};

    estadisticas.forEach((estadistica) => {
      const ciudad = estadistica.ciudad;
      if (!groupedEstadisticas[ciudad]) {
        groupedEstadisticas[ciudad] = [];
      }
      groupedEstadisticas[ciudad].push(estadistica);
    });

    return groupedEstadisticas;
  };

  const groupedEstadisticas = groupEstadisticasByCiudad(estadisticas);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={navegar}>
        <AntDesign style={styles.textmenu} name="back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 16, marginTop: 70 }}>
        Estadísticas de incidentes
      </Text>

      <FlatList
      style={styles.flatContainer}
        data={Object.keys(groupedEstadisticas)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.ciudadContainer}>
            <Text style={styles.ciudadTitle}>Ciudad: {item}</Text>
            {groupedEstadisticas[item].map((estadistica, estadisticaIndex) => (
              <View key={estadisticaIndex} style={styles.estadisticasContainer}>
                <Text>Fecha: {estadistica.fecha}</Text>
                <Text>Homicidio: {estadistica.Homicidio}</Text>
                <Text>Asalto a propiedad: {estadistica.Asaltoapropiedad}</Text>
                <Text>Hurto: {estadistica.Hurto}</Text>
                <Text>Vandalismo: {estadistica.Vandalismo}</Text>
                <Text>Delito sexual: {estadistica.Delitosexual}</Text>
                <Text>Incendio: {estadistica.Incendio}</Text>
                <Text>Saqueo: {estadistica.Saqueo}</Text>
                <Text>Otro: {estadistica.Otro}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menuButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    top: 0,
    left: 20,
    zIndex: 10,
  },
  textmenu: {
    padding: 10,
    color: 'white',
  },
  flatContainer: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 20,
    marginBottom: 16,
    width: '90%',
  },
  ciudadContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 20,
    marginBottom: 16,
    width: '90%',
  },
  ciudadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  estadisticasContainer: {
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
});

export default Estadisticas;
