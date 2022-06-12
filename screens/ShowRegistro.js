import React, {useContext, useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../helpers/AuthContext";
import {baseURL} from "../helpers/IPConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Layout from "./Layout";

const ShowRegistro = ({navigation, route}) => {

    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [registro, setRegistro] = useState([]);
    const [registrosMes, setRegistrosMes] = useState([]);
    const [personaDependiente, setPersonaDependiente] = useState({});
    const id = route.params.id
    const isFocused = useIsFocused();
    const { authState } = useContext(AuthContext);

    const fechaString = fechaSeleccionada.toLocaleDateString();

    const [fecha,setFecha] = useState(fechaString);

    const mes = fechaSeleccionada.getMonth()+1;

    const [open, setOpen] = useState(false)


    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")

        // OBTENEMOS EL REGISTRO DEL DIA ACTUAL
        await axios.get(`http://${baseURL}:3001/registrosDiarios/showRegistro/${id}?fecha=${fechaString}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setRegistro(response.data);
            }).catch((e) => console.log(e))


        await axios.get(`http://${baseURL}:3001/registrosDiarios/showRegistrosMes/${id}?mes=${mes}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setRegistrosMes(response.data);
                console.log(response.data)
            }).catch((e) => console.log(e))


        await axios.get(`http://${baseURL}:3001/personasDependientes/show/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setPersonaDependiente(response.data);
            }).catch((e) => console.log(e))

    }, [isFocused])


    const showRegistro = async () => {
        const token = await AsyncStorage.getItem("accessToken")
        await axios.get(`http://${baseURL}:3001/registrosDiarios/showRegistro/${id}?fecha=${fecha}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setRegistro(response.data);
            }).catch((e) => console.log(e))
    }



    const medicacionManana = (registro.medicacionManana === false) ? "No" : "Si";
    const medicacionTarde = (registro.medicacionTarde === false) ? "No" : "Si";
    const medicacionNoche = (registro.medicacionNoche === false) ? "No" : "Si";

    return (
                <Layout>
                    <Text>Indique la fecha deseada para ver un registro:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setFecha(text)}
                        value={fecha}
                        placeholder="(23/5/2022)"
                    >
                    </TextInput>

                    <TouchableOpacity style={styles.buscarButton} onPress={showRegistro}>
                        <Text>Buscar</Text>
                    </TouchableOpacity>



                    {registro && Object.entries(registro).length !== 0 ? (
                            <View style={styles.container}>
                                <Text style={styles.itemTitle}>Desayuno: {registro.desayuno}</Text>
                                <Text style={styles.itemTitle}>Almuerzo: {registro.almuerzo}</Text>
                                <Text style={styles.itemTitle}>Merienda: {registro.merienda}</Text>
                                <Text style={styles.itemTitle}>Cena: {registro.cena}</Text>
                                <Text style={styles.itemTitle}>¿Ha tomado la medicacicón correspondiente a la mañana?: {medicacionManana}</Text>
                                <Text style={styles.itemTitle}>¿Ha tomado la medicacicón correspondiente a la tarde?: {medicacionTarde}</Text>
                                <Text style={styles.itemTitle}>¿Ha tomado la medicacicón correspondiente a la noche?: {medicacionNoche}</Text>
                                <Text style={styles.itemTitle}>Pasos diarios: {registro.pasosDiarios}</Text>
                                <Text style={styles.itemTitle}>Actividad física: {registro.actividadFisica}</Text>
                                <Text style={styles.itemTitle}>Horas de sueño: {registro.horasSueno}</Text>
                                <Text style={styles.itemTitle}>Tiempo aire libre: {registro.tiempoAireLibre}</Text>
                                <Text style={styles.itemTitle}>Relaciones sociales: {registro.relacionSocial}</Text>
                            </View>
                        ) : null





                    }

                    {Object.entries(registro).length === 0 ? (
                                <Text>No hay registros</Text>
                        ) : null

                    }

                </Layout>
    )


}


const styles = StyleSheet.create({
    container: {
        width: '90%',
        backgroundColor: "#005A9C",
        padding: 20,
        marginVertical: '5%',
        alignItems: "center",
        borderRadius: 5,
    },
    itemTitle: {
        color: "#ffffff",
    },
    editButton: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#FF9700',
        marginBottom: '5%'
    },

    buscarButton: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#00c4ff',
        marginBottom: '5%'
    },
    deleteButton: {
        marginBottom: '5%',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#FF0000',
    },
    input: {
        width: "90%",
        marginTop: '3%',
        marginBottom: '7%',
        fontSize: 14,
        borderWidth: 1,
        borderColor: "#10ac84",
        height: 30,
        color: "black",
        textAlign: "center",
        padding: 4,
        borderRadius: 5,
    },

})

export default ShowRegistro;
