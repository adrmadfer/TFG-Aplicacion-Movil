import React, {useContext, useEffect, useState} from 'react'
import {StyleSheet, Text, FlatList, Pressable, TouchableOpacity} from 'react-native'
import axios from "axios";
import PersonaDependiente from "../components/PersonaDependiente";
import Layout from "./Layout";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {baseURL} from "../helpers/IPConfig";
import {AuthContext} from "../helpers/AuthContext";

const GestionarPersonasDependientes = ({navigation}) => {

    const { authState } = useContext(AuthContext);
    const [lista, setLista] = useState([])
    const isFocused = useIsFocused();

    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")

        if(authState.rol === "COORDINADOR") {
            await axios.get(`http://${baseURL}:3001/personasDependientes`,
                {headers: {accessToken: token}})
                .then((response) => {
                    setLista(response.data)
                }).catch((e) => console.log(e))
        } else {
            axios.get(`http://${baseURL}:3001/personasDependientes/personasAsignadas/`,
                {headers: {accessToken: token}})
                .then((response) => {
                    setLista(response.data);

                }).catch((e) => console.log(e))
        }

    }, [isFocused])

    const renderItem = ({item}) => {
        return <PersonaDependiente item={item} />
    }

    return (
        <Layout>

            {authState.rol === "COORDINADOR" && (
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreatePersonaDependiente")}>
                    <Text style={styles.text}>Añadir</Text>
                </TouchableOpacity>
            )}

            <FlatList style={{
                width: '90%',
                marginVertical: '5%'
            }}
                data={lista}
                renderItem={renderItem}
            />
        </Layout>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#33FF49',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default GestionarPersonasDependientes;
