import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import url from '../../constants/url';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';

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
            
            {/* Gráfico de torta para cada localidad */}
            <PieChart
              data={
                [
                  {
                    name: 'Robo',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Robo, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                  {
                    name: 'Asalto a propiedad',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Asaltoapropiedad, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                  {
                    name: 'Hurto',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Hurto, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                  {
                    name: 'Vandalismo',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Vandalismo, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                  {
                    name: 'Delito sexual',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Delitosexual, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                  {
                    name: 'Incendio',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Incendio, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                  {
                    name: 'Saqueo',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Saqueo, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                  {
                    name: 'Otro',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Otro, 0),
                    color: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                  },
                ]
              }
              width={320}
              height={200}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
            />
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
    width: '95%',
  },
  ciudadContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    width: '100%',
  },
  ciudadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  estadisticasContainer: {
    backgroundColor: 'black',
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 5,
    marginBottom: 10,
  },
});

export default Estadisticas;
