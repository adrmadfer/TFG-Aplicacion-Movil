import React, {useContext, useEffect, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList} from 'react-native'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Layout from "./Layout";
import { useIsFocused } from "@react-navigation/native";
import AuxiliaresAsignados from "./AuxiliaresAsignados";
import FamiliaresAsignados from "./FamiliaresAsignados";
import {baseURL} from "../helpers/IPConfig";
import {AuthContext} from "../helpers/AuthContext";
import Swal from "sweetalert2";

const ShowPersonaDependiente = ({navigation, route}) => {

    const { authState } = useContext(AuthContext);
    const [personaDependiente, setPersonaDependiente] = useState({});
    const fechaActual = new Date(Date.now());
    const horaActual = fechaActual.getHours();
    const fechaString = fechaActual.toLocaleDateString();
    const [registro, setRegistro] = useState({});
    const [notificacion, setNotificacion] = useState({});
    const [notificacionAviso, setNotificacionAviso] = useState({});
    const [notificacionMedicacion, setNotificacionMedicacion] = useState({});
    const id = route.params.id
    const isFocused = useIsFocused();

    const [aviso, setAviso] = useState(0)
    const [aviso1, setAviso1] = useState(0)
    const [token, setToken] = useState();


    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")

        await setToken(token)

        await axios.get(`http://${baseURL}:3001/observaciones/notificacion/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setNotificacion(response.data);

            });

        await  axios.get(`http://${baseURL}:3001/avisos/notificacion/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setNotificacionAviso(response.data);

            });

       await axios.get(`http://${baseURL}:3001/registrosDiarios/showRegistro/${id}?fecha=${fechaString}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setRegistro(response.data);

            });

        await axios.get(`http://${baseURL}:3001/personasDependientes/show/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setPersonaDependiente(response.data);
            }).catch((e) => console.log(e))

        await axios.get(`http://${baseURL}:3001/notificaciones/createNotificacionMedicacion/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                console.log(response.data);
            });

        await axios.get(`http://${baseURL}:3001/notificaciones/notificacionMedicacion/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setNotificacionMedicacion(response.data);
            });
    }, [isFocused])

/*
    //Mostrar notificación de una nueva observación al familiar
    if (Object.values(notificacion).at(1) && authState.rol === "FAMILIAR" && aviso.valueOf() === 0) {
        Swal.fire({
            icon: "info", title: "INFORMACIÓN",
            text: "Hay nuevas observaciones"
        }).then(() =>
            setAviso(1)
        )
    }

    //Mostrar notificación de un nuevo aviso al auxiliar
    if (Object.values(notificacionAviso).at(1) && authState.rol === "AUXILIAR" && aviso.valueOf() === 0) {
        Swal.fire({
            icon: "info", title: "INFORMACIÓN",
            text: "Hay un nuevo aviso"
        }).then(() =>
            setAviso(1)
        )

    }

 */

    // MOSTRAR AL AUXILIAR LA MEDICACION QUE TIENE QUE TOMAR EN FORMA DE NOTIFICACION
    if(authState.rol === "AUXILIAR") {
        const med = personaDependiente.pastillasDia;
        if(Object.values(notificacionMedicacion).at(2) === false && horaActual >= 6 && horaActual < 13 && aviso1.valueOf() === 0) {

            //console.log(personaDependiente.pastillasDia);
            Swal.fire({
                icon: "info",
                title: "AVISO",
                text: `Tiene que tomar la siguiente medicacion: ${med}`,
                showCancelButton: true,
                confirmButtonText: "Listo",
                cancelButtonText: "Cancelar",
            }) .then(resultado => {
                if (resultado.value) {

                    axios.get(`http://${baseURL}:3001/notificaciones/updateDia/${id}`,
                        {headers: {accessToken: token}})
                        .then((response) => {
                            console.log(response.data);
                        });
                    setAviso1(1)
                } else {
                    setAviso1(1)
                }
            });

        } else if(Object.values(notificacionMedicacion).at(3) === false && horaActual >= 13 && horaActual < 21 && aviso1.valueOf() === 0){

            console.log(token)

            Swal.fire({
                icon: "info",
                title: "AVISO",
                text: `Tiene que tomar la siguiente medicacion: ${personaDependiente.pastillasTarde}`,
                showCancelButton: true,
                confirmButtonText: "Listo",
                cancelButtonText: "Cancelar",
            }) .then(resultado => {
                if (resultado.value) {

                    axios.get(`http://${baseURL}:3001/notificaciones/updateTarde/${id}`,
                        {headers: {accessToken: token}})
                        .then((response) => {
                            console.log(response.data);
                        });

                    setAviso1(1)
                } else {
                    setAviso1(1)
                }
            });

        } else if(Object.values(notificacionMedicacion).at(4) === false && (horaActual >= 21 || horaActual < 5) && aviso1.valueOf() === 0) {

            Swal.fire({
                icon: "info",
                title: "AVISO",
                text: `Tiene que tomar la siguiente medicacion: ${personaDependiente.pastillasNoche}`,
                showCancelButton: true,
                confirmButtonText: "Listo",
                cancelButtonText: "Cancelar",

            })  .then(resultado => {
                if (resultado.value) {

                    axios.get(`http://${baseURL}:3001/notificaciones/updateNoche/${id}`,
                        {headers: {accessToken: token}})
                        .then((response) => {
                            console.log(response.data);
                        });
                    setAviso1(1)
                } else {
                    setAviso1(1)
                }
            });

        }
    }

    const deletePersonaDependiente = async () => {
        const token = await AsyncStorage.getItem("accessToken")
        await axios.delete(`http://${baseURL}/personasDependientes/delete/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    navigation.navigate("GestionarPersonasDependientes")
                }
            }).catch((e) => console.log(e))
    }

    return (
        <FlatList ListHeaderComponent={
            <>
                <Layout>
                    <View style={styles.container}>
                        <Text style={styles.itemTitle}>Nombre: {personaDependiente.nombre}</Text>
                        <Text style={styles.itemTitle}>Apellidos: {personaDependiente.apellidos}</Text>
                        <Text style={styles.itemTitle}>Enfermedad: {personaDependiente.enfermedad}</Text>
                        <Text style={styles.itemTitle}>Grado de dependencia: {personaDependiente.gradoDeDependencia}</Text>
                        <Text style={styles.itemTitle}>Pastillas de dia: {personaDependiente.pastillasDia}</Text>
                        <Text style={styles.itemTitle}>Pastillas de tarde: {personaDependiente.pastillasTarde}</Text>
                        <Text style={styles.itemTitle}>Pastillas de noche: {personaDependiente.pastillasNoche}</Text>
                    </View>

                    {authState.rol === "COORDINADOR" &&

                    (<TouchableOpacity style={styles.editButton}
                                       onPress={() => navigation.navigate("EditPersonaDependiente", {id: route.params.id})}>
                        <Text style={styles.itemTitle}>Editar</Text>
                    </TouchableOpacity>)
                    }

                    {authState.rol === "COORDINADOR" &&
                    (<TouchableOpacity style={styles.deleteButton} onPress={deletePersonaDependiente}>
                        <Text style={styles.itemTitle}>Eliminar</Text>
                    </TouchableOpacity>)

                    }



                    {authState.rol === "AUXILIAR" && Object.entries(registro).length === 0 && (
                        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("CreateRegistro", {id: route.params.id})}>
                            <Text style={styles.itemTitle}>Iniciar Registro Diario</Text>
                        </TouchableOpacity>

                    )}

                    {authState.rol === "AUXILIAR"  && Object.entries(registro).length !== 0 && (
                        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditRegistro", {id: route.params.id})}>
                            <Text style={styles.itemTitle}>Modificar Registro Diario</Text>
                        </TouchableOpacity>

                    )}

                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("ShowRegistro", {id: route.params.id})}>
                        <Text style={styles.itemTitle}>Ver Registros Diarios</Text>
                    </TouchableOpacity>

                    {authState.rol === "AUXILIAR" && (
                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("CreateObservacion", {id: route.params.id})}>
                        <Text style={styles.itemTitle}>Añadir Observación</Text>
                    </TouchableOpacity>

                    )}

                    <TouchableOpacity style={styles.showButton} onPress={() => navigation.navigate("Observaciones", {id: route.params.id})}>
                        <Text style={styles.itemTitle}> Ver Observaciones</Text>
                    </TouchableOpacity>

                    {authState.rol === "FAMILIAR" && (
                        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("CreateAviso", {id: route.params.id})}>
                            <Text style={styles.itemTitle}>Añadir Aviso</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.showButton} onPress={() => navigation.navigate("Avisos", {id: route.params.id})}>
                        <Text style={styles.itemTitle}> Ver Avisos</Text>
                    </TouchableOpacity>


                </Layout>
            </>
        }
                  ListFooterComponent={
            <>

                {authState.rol !== "AUXILIAR" &&

                <AuxiliaresAsignados id={route.params.id}/>
                }

                {authState.rol !== "FAMILIAR" &&
                <FamiliaresAsignados id={route.params.id}/>
                }


            </>

        }
        />
        /*
        <ScrollView>
            <Layout>
                <View style={styles.container}>
                    <Text style={styles.itemTitle}>Nombre: {personaDependiente.nombre}</Text>
                    <Text style={styles.itemTitle}>Apellidos: {personaDependiente.apellidos}</Text>
                    <Text style={styles.itemTitle}>Enfermedad: {personaDependiente.enfermedad}</Text>
                    <Text style={styles.itemTitle}>Grado de dependencia: {personaDependiente.gradoDeDependencia}</Text>
                    <Text style={styles.itemTitle}>Pastillas de dia: {personaDependiente.pastillasDia}</Text>
                    <Text style={styles.itemTitle}>Pastillas de tarde: {personaDependiente.pastillasTarde}</Text>
                    <Text style={styles.itemTitle}>Pastillas de noche: {personaDependiente.pastillasNoche}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditPersonaDependiente", {id: route.params.id})}>
                    <Text style={styles.itemTitle}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={deletePersonaDependiente}>
                    <Text style={styles.itemTitle}>Eliminar</Text>
                </TouchableOpacity>

                <AuxiliaresAsignados />
            </Layout>
        </ScrollView>
    */

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
    showButton: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#0336db',
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
    }
})

export default ShowPersonaDependiente;
