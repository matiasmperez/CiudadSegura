import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import Button from '../components/Button';
import Colors from '../../constants/colors';
import Input from '../components/Input';

const Olvidopassword = (props) => {

  const [email,setEmail] = useState('')

  const handleRecuperar = () => {
    if (!email ){
      alert('Los campos no pueden estar vacios');
      return
    }
    alert ('Email enviado')
    handleClean()
    navigation.navigate("Login")
  }

  const handleClean = () => {
    setEmail('')
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
        <Text style={styles.title}>Recuperación de contraseña</Text>
        <Text style={styles.subtitle}>Envio de email</Text>
        <Input placeholder="Ingresa tu correo electronico" keyboardType="email-address" value={email} onChangeText={text => setEmail(text)} />
        <View style={{marginBottom: 10}}></View>
        <Button textColor="white" bgColor={Colors.primary} btnLabel="Recuperar contraseña" Press={handleRecuperar} />
        <View style={{marginBottom: 10}}></View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Tengo una cuenta  </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
            <Text style={[styles.registerText, styles.registerLink]}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tinyLogo: {
    width: 125,
    height: 125,
    
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 12,
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

export default Olvidopassword;