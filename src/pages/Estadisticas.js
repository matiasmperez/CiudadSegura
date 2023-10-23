import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import url from '../../constants/url';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';

const Estadisticas = ({ navigation }) => {
  const [jwt, setJwt] = useState(null);
  const [iduser, setIduser] = useState(null);
  const [estadisticas, setEstadisticas] = useState([]);
  const [filtroCiudad, setFiltroCiudad] = useState(''); 

  useEffect(() => {
    axios
      .get(url + 'api/ciudades', {})
      .then((response) => {
        setEstadisticas(response.data.data);
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

  // Filtrar las ciudades que coinciden con la búsqueda
  const ciudadesFiltradas = Object.keys(groupedEstadisticas).filter(
    (ciudad) => ciudad.toLowerCase().includes(filtroCiudad.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={navegar}>
        <AntDesign style={styles.textmenu} name="back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 16, marginTop: 70 }}>
        Estadísticas de incidentes
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre de ciudad"
        value={filtroCiudad}
        onChangeText={(text) => setFiltroCiudad(text)}
      />

      <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 16, marginTop: 5 }}>
        Estos datos son de los ultimos 30 dias.
      </Text>

      <FlatList
        style={styles.flatContainer}
        data={ciudadesFiltradas}
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
                    color: incidentColors.Robo,
                  },
                  {
                    name: 'Asalto a propiedad',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Asaltoapropiedad, 0),
                    color: incidentColors['Asalto a propiedad'],
                  },
                  {
                    name: 'Hurto',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Hurto, 0),
                    color: incidentColors.Hurto,
                  },
                  {
                    name: 'Vandalismo',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Vandalismo, 0),
                    color: incidentColors.Vandalismo,
                  },
                  {
                    name: 'Delito sexual',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Delitosexual, 0),
                    color: incidentColors['Delito sexual'],
                  },
                  {
                    name: 'Incendio',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Incendio, 0),
                    color: incidentColors.Incendio,
                  },
                  {
                    name: 'Saqueo',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Saqueo, 0),
                    color: incidentColors.Saqueo,
                  },
                  {
                    name: 'Otro',
                    population: groupedEstadisticas[item].reduce((acc, estadistica) => acc + estadistica.Otro, 0),
                    color: incidentColors.Otro,
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
  searchInput: {
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default Estadisticas;
