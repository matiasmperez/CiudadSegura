
import { StyleSheet, } from 'react-native';
import { Login, Bienvenido, Register, Olvidopassword, Home, Modal} from './src/pages/'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App() {

  const Stack =  createNativeStackNavigator()
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRoutename='Bienvenido'>
        <Stack.Screen name="Bienvenido" component={Bienvenido} options={{
          headerShown: false,
        }}/>
         <Stack.Screen name="Login" component={Login} options={{
          headerShown: false,
        }}/>
         <Stack.Screen name="Register" component={Register} options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="Recuperacion" component={Olvidopassword} options={{
          headerShown: false,
        }}/>
        <Stack.Screen name="Home" component={Home} options={{
          headerShown: false,
        }}/>
      
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
