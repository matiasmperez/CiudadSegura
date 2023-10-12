import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Ayuda = ({ navigation }) => {
    const items = [
        { label: 'Robo', color: 'red' },
        { label: 'Hurto', color: 'blue' },
        { label: 'Asalto a propiedad', color: 'green' },
        { label: 'Vandalismo', color: 'orange' },
        { label: 'Delito sexual', color: 'purple' },
        { label: 'Incendio', color: 'pink' },
        { label: 'Saqueo', color: 'cyan' },
        { label: 'Otro', color: 'gray' },
    ];


    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={{ fontSize: 16, color: item.color }}>{item.label}</Text>
        </View>
    );


    const navegar = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuButton} onPress={navegar}>
                <AntDesign style={styles.textmenu} name="back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 16, marginTop: 70 }}>
                Ayuda
            </Text>

            <Text style={styles.text}>
                Bienvenido a la sección de Ayuda. Aquí puedes encontrar información sobre el uso de la aplicacion y sus funcionalidades basicas.
            </Text>

            <Text style={styles.text}>
                A continuacion se muestran los colores de los delitos que se pueden previsualizar en el mapa:
            </Text>


            <FlatList
                
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

            <Text style={styles.text}>
                Para cargar un incidente es necesario pinchar el mapa, por consiguiente debe ingresar los datos.
            </Text>

            <Text style={styles.text}>
                En caso de una emergencia tiene los 3 botones de emergencia situados en la parte baja del mapa para realizar la llamada a las autoridades.
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 70, // Cambiar el margen superior a 70
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        padding: 10,
        fontSize: 16,
    },
    text2: {
        padding: 10,
        fontSize: 16,
    },
    item: {
        padding: 10,
        alignItems: 'center',
    },
});

export default Ayuda;
