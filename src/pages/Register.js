import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image} from 'react-native';
import Button from '../components/Button';
import Colors from '../../constants/colors';
import Input from '../components/Input';
import url from '../../constants/url';
import axios from 'axios'

const Register = (props) => {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [repeatpassword, setrepeatPassword] = useState ('');

  const handleRegister = () => {
    if (!nombre || !apellido|| !email || !telefono || !password || !repeatpassword) {
      alert('Los campos no pueden estar vacios');
      return;
    } else if( password !== repeatpassword ){
      alert('Las contraseñas no coinciden');
      return
    }
    

     axios.post(url + 'api/users/register', {
      email: email,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      password: password,
  })
      .then(function () {
        alert('Usuario registrado correctamente')
        handleClean()
        props.navigation.navigate("Login")
      })
      .catch(function (error) {
          console.log(error);
      });

   

  }

  const handleClean = () => {
    setNombre('')
    setApellido('')
    setEmail('')
    setTelefono('')
    setPassword('')
    setrepeatPassword('')
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
        <Text style={styles.title}>Registrarme</Text>
        <Text style={styles.subtitle}>Crear una cuenta nueva</Text>
          <Input placeholder="Nombre"  value={nombre} onChangeText={text => setNombre(text)}/>
          <Input placeholder="Apellido"  value={apellido} onChangeText={text => setApellido(text)}/>
          <Input
            placeholder="Correo electronico"
            keyboardType={'email-address'}
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <Input placeholder="Numero de telefono" keyboardType={'number'} value={telefono} onChangeText={text => setTelefono(text)}/>
          <Input placeholder="Contraseña" secureTextEntry={true} value={password} onChangeText={text => setPassword(text)}/>
          <Input placeholder="Repetir la contraseña" secureTextEntry={true} value={repeatpassword} onChangeText={text => setrepeatPassword(text)}/>
        <View style={{marginBottom: 10}}></View>
        <Button textColor="white" bgColor={Colors.primary} btnLabel="Registrarme" Press={handleRegister} />
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Tienes una cuenta? </Text>
          <View style={{marginBottom: 10}}></View>
          <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
            <Text style={[styles.registerText, styles.registerLink]}>Iniciar sesión</Text>
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
  tinyLogo: {
    width: 125,
    height: 125,
    
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

export default Register;
