import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import url from '../../constants/url';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog, { SlideAnimation } from 'react-native-popup-dialog';

const Comunidad = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [detalle, setDetalle] = useState('');
  const [jwt, setJwt] = useState(null);
  const [iduser, setIduser] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [fechaActual, setFechaActual] = useState('');
  const [noHayPublicaciones, setNoHayPublicaciones] = useState(true);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const obtenerFechaActual = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      const formattedDate = `${day}/${month}/${year}`;
      setFechaActual(formattedDate);
    };

    axios
      .get(url + 'api/publishes', {})
      .then((response) => {
        if (response.data.data.length === 0) {
          setNoHayPublicaciones(true);
        } else {
          setNoHayPublicaciones(false);
          setPosts(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error al obtener estadísticas:', error);
      });

    obtenerFechaActual();
  }, []);

  const handlePost = async () => {
    if (titulo && detalle) {
      const newPost = {
        _iduser: iduser,
        title: titulo,
        publish: detalle,
        date: fechaActual,
      };
      try {
        const response = await axios.post(url + 'api/publishes', newPost, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        // Actualiza la lista de publicaciones después de la creación exitosa
        setPosts([...posts, newPost]);
        setTitulo('');
        setDetalle('');
      } catch (error) {
        console.error('Error al crear una publicación:', error);
      }
    }
  };

  const handleDelete = (post) => {
    // Muestra el diálogo de confirmación para borrar la publicación
    setPostToDelete(post);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirmation = async () => {
    // Cierra el diálogo de confirmación
    setDeleteConfirmationVisible(false);

    if (postToDelete) {
      try {
        console.log(postToDelete._id)
        // Realiza la solicitud DELETE al servidor
        await axios.delete(url + `api/publishes/${postToDelete._id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        // Si la eliminación fue exitosa, actualiza el estado para reflejar la eliminación
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postToDelete._id));
        // Limpia la publicación que se va a eliminar
        setPostToDelete(null);
      } catch (error) {
        console.error('Error al eliminar la publicación:', error);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

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

  useEffect(() => {
    if (jwt && iduser) {
      fetchUser();
    }
  }, [jwt, iduser]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(url + `api/users/${iduser}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setNombreUsuario(response.data.data.nombre);
      setApellidoUsuario(response.data.data.apellido);
      setEmailUsuario(response.data.data.email);
    } catch (error) {
      console.error(error);
    }
  };

  const navegar = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={navegar}>
        <AntDesign style={styles.textmenu} name="back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 16, marginTop: 70 }}>
        Crear mi publicacion
      </Text>

      <View style={styles.inputContainer}>
        <Text style={{ marginBottom: 8 }}>
          Usuario: <Text style={{ fontWeight: 'bold' }}>{nombreUsuario}</Text>{' '}
          <Text style={{ fontWeight: 'bold' }}>{apellidoUsuario}</Text>{' '}
        </Text>
        <Text style={{ marginBottom: 8 }}>
          Email: <Text style={{ fontWeight: 'bold' }}>{emailUsuario}</Text>{' '}
        </Text>
        <Text style={{ marginBottom: 8 }}>
          Fecha: <Text style={{ fontWeight: 'bold' }}>{fechaActual}</Text>{' '}
        </Text>
        <TextInput
          placeholder="Titulo de la publicacion"
          value={titulo}
          onChangeText={(text) => setTitulo(text)}
          style={styles.input}
          onKeyPress={(event) => {
            if (event.nativeEvent.key === 'Enter') {
              Keyboard.dismiss(); // Cierra el teclado
            }
          }}
        />

        <TextInput
          placeholder="Escribe tu publicación..."
          value={detalle}
          onChangeText={(text) => setDetalle(text)}
          style={[styles.input, { height: 100 }]}
          multiline
          onKeyPress={(event) => {
            if (event.nativeEvent.key === 'Enter') {
              Keyboard.dismiss(); // Cierra el teclado
            }
          }}
        />
        <Button mode="contained" onPress={handlePost}>
          Publicar
        </Button>
      </View>

      <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 16, marginTop: 10 }}>
        Publicaciones
      </Text>

      <FlatList
        style={{ width: '90%' }}
        data={noHayPublicaciones ? [{}] : posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (noHayPublicaciones) {
            return <Text style={styles.noPostsMessage}>No hay publicaciones por el momento</Text>;
          } else {
            return (
              <Card
                style={{
                  marginVertical: 8,
                  padding: 10,
                  marginLeft: 5,
                  marginRight: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between', // Espacio entre el contenido y el botón
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: 8,
                  elevation: 2,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {item.title || 'Título no disponible'}
                  </Text>
                  <Text style={{ fontSize: 14 }}>{item.publish || 'Detalle no disponible'}</Text>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                    {item._iduser.nombre} {item.date || 'Fecha no disponible'}
                  </Text>
                </View>
                {item._iduser._id === iduser && (
                  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                    <AntDesign name="delete" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </Card>
            );
          }
        }}
      />

      {/* Diálogo de confirmación */}
      <Dialog
        visible={deleteConfirmationVisible}
        dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        onTouchOutside={() => setDeleteConfirmationVisible(false)}
      >
        <View style={{padding: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>¿Estás seguro de que deseas eliminar esta publicación?</Text>
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
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 20,
    marginBottom: 16,
    width: '90%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  noPostsMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20, // Ajusta este valor según tu diseño
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 10,
  },
});

export default Comunidad;
