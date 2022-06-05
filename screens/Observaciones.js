import {useIsFocused} from "@react-navigation/native";
import {baseURL} from "../helpers/IPConfig";
import {StyleSheet, Text, TouchableOpacity,FlatList, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";
import React, {useContext, useEffect, useState} from "react";
import Layout from "./Layout";

const Observaciones = ({navigation, route}) => {


    const id = route.params.id
    const { authState } = useContext(AuthContext);
    const [observaciones, setObservaciones] = useState([])
    const isFocused = useIsFocused();

    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")
        await axios.get(`http://${baseURL}:3001/observaciones/showObservaciones/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setObservaciones(response.data)
            }).catch((e) => console.log(e))
    }, [isFocused])

    const deleteObservacion = async (id) => {
        const token = await AsyncStorage.getItem("accessToken")

        await axios.delete(`http://${baseURL}:3001/observaciones/deleteObservacion/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    setObservaciones(
                        observaciones.filter((val) => {
                            return val.id != id;
                        })
                    )
                }
            }).catch((e) => console.log(e))
    }

    const renderItem = ({item}) => {
        return <View style={styles.global}>

            <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.titulo}</Text>
            <Text style={styles.itemTitle}>{"Creada: " + item.createdAt}</Text>
            <Text style={styles.itemTitle}>{"Descripción: " + item.descripcion}</Text>
            <Text style={styles.itemTitle}>{"Creada por: " + item.username}</Text>
            </View>

            {authState.username === item.username && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteObservacion(item.id)}>
                    <Text style={styles.itemTitle}>Eliminar</Text>
                </TouchableOpacity>
            )}

        </View>
    }

    return(
        <Layout>
            <Text>Observaciones</Text>

            <FlatList
                listKey="observaciones"
                style={{
                    width: '90%',
                    marginVertical: '5%',
                }}
                data={observaciones}
                renderItem={renderItem}/>
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
    global: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemContainer: {
        width: '70%',
        backgroundColor: "#005A9C",
        marginBottom: '5%',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 3,
    },
    itemTitle: {
        color: "#ffffff",
    },
    deleteButton: {
        backgroundColor: '#FF0000',
        marginBottom: '5%',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 3
    }
});

export default Observaciones;