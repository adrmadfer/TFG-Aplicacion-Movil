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

const ShowPersonaDependiente = ({navigation, route}) => {

    const { authState } = useContext(AuthContext);
    const [personaDependiente, setPersonaDependiente] = useState({});
    const id = route.params.id
    const isFocused = useIsFocused();

    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")
        await axios.get(`http://${baseURL}:3001/personasDependientes/show/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setPersonaDependiente(response.data);
            }).catch((e) => console.log(e))
    }, [isFocused])

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



                    {authState.rol === "AUXILIAR" && (
                        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("CreateRegistro", {id: route.params.id})}>
                            <Text style={styles.itemTitle}>Iniciar Registro Diario</Text>
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
                <AuxiliaresAsignados id={route.params.id}/>
                <FamiliaresAsignados id={route.params.id}/>

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
