import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, FlatList, Pressable, TouchableOpacity} from 'react-native'
import axios from "axios";
import PersonaDependiente from "../components/PersonaDependiente";
import Layout from "./Layout";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GestionarPersonasDependientes = ({navigation}) => {

    const [lista, setLista] = useState([])
    const isFocused = useIsFocused();

    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")
        await axios.get('http://192.168.1.220:3001/personasDependientes',
            {headers: {accessToken: token}})
            .then((response) => {
                setLista(response.data)
            }).catch((e) => console.log(e))
    }, [isFocused])

    const renderItem = ({item}) => {
        return <PersonaDependiente item={item} />
    }

    return (
        <Layout>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreatePersonaDependiente")}>
                <Text style={styles.text}>Añadir</Text>
            </TouchableOpacity>
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
