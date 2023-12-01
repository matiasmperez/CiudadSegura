import React from 'react';
import { View, Text, StyleSheet , TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const TerminosYCondiciones = ({ navigation }) => {

    
    const navegar = () => {
        navigation.navigate('Home');
    };

  return (
    <View style={styles.container}>

        <TouchableOpacity style={styles.menuButton} onPress={navegar}>
                <AntDesign style={styles.textmenu} name="back" size={24} color="black" />
            </TouchableOpacity>

      <Text style={styles.title}>Términos y Condiciones</Text>
      <Text style={styles.text}>
        Bienvenido a la sección de Términos y Condiciones. A continuación, se detallan los términos y condiciones de uso de nuestra aplicación.
      </Text>
      <Text style={styles.text}>
        1. El uso de esta aplicación está sujeto a los términos y condiciones especificados en este documento.
      </Text>
      <Text style={styles.text}>
        2. Los usuarios deben cumplir con todas las leyes y regulaciones aplicables al utilizar esta aplicación.
      </Text>
      <Text style={styles.text}>
        3. La aplicación no se hace responsable de la información proporcionada por los usuarios.
      </Text>
      <Text style={styles.text}>
        4. Los usuarios deben mantener sus credenciales de inicio de sesión de manera segura.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    top: 70,
    left: 20,
    zIndex: 10,
},
textmenu: {
    padding: 10,
    color: 'white',
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    padding:10,
    marginBottom: 12,
  },
});

export default TerminosYCondiciones;
