import React, {useEffect} from 'react';
import { View, Text, StyleSheet, ImageBackground , Image} from 'react-native';
import Colors from '../../constants/colors';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Bienvenido = ({ navigation }) => {

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('jwt');
        if (value !== null) {
          navigation.navigate('Home');
        }
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require("../../assets/img/fondo.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.content}>
        <Image
        style={styles.tinyLogo}
        source={require('../../assets/img/1.png')}
        />
          <Text style={styles.title}>CuidadSegura</Text>
          <Text style={styles.subtitle}>Seguridad que construimos juntos.</Text>
          <Button bgColor={Colors.secondary} textColor={Colors.white} btnLabel="Iniciar sesión" Press={handleLoginPress} />
          <View style={{marginBottom: 10}}></View>
          <Button bgColor={Colors.primary} textColor={Colors.white} btnLabel="Registrarme" Press={handleRegisterPress} />
          <View style={{marginBottom: 10}}></View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%', // Ensure the background image covers the entire width
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 125,
    height: 125,
    
  },
  content: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 500,
    height: 400,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default Bienvenido;
