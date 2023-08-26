import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import Button from '../components/Button';
import Colors from '../../constants/colors';
import Input from '../components/Input';
import axios from 'axios'
import url from '../../constants/url';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = (props) => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const handleLogin = () => {
    if (!email || !password){
      alert('Los campos no pueden estar vacios');
      return
    }

    axios.post(url + 'api/users/auth', {
      email: email,
      password: password,
  })
      .then(response => {
        handleClean()
        props.navigation.navigate("Home")
        storeData(response.data.jwt)
        


      })
      .catch(error => {
          alert('Usuario o contraseña incorrecto')
          handleClean()
      });
   
  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('jwt', value);
    } catch (e) {
      console.log(e)
    }
  };

  const handleClean = () => {
    setEmail('')
    setPassword('')
  }

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
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Ingresa con tu cuenta</Text>
        <Input placeholder="Ingresa tu correo electronico" keyboardType="email-address" value={email} onChangeText={text => setEmail(text)} />
        <Input placeholder="Ingresa tu contraseña" secureTextEntry={true} value={password} onChangeText={text => setPassword(text)} />
        <View style={{marginBottom: 10}}></View>
        <TouchableOpacity onPress={() => props.navigation.navigate("Recuperacion")}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <Button textColor="white" bgColor={Colors.primary} btnLabel="Ingresar" Press={handleLogin} />
        <View style={{marginBottom: 10}}></View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("Register")}>
            <Text style={[styles.registerText, styles.registerLink]}>Registrarme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: Colors.primary,
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tinyLogo: {
    width: 125,
    height: 125,
    
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  forgotPassword: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  registerLink: {
    color: Colors.primary,
  },
});

export default Login;
