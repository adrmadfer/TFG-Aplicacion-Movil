import {useIsFocused} from "@react-navigation/native";
import {baseURL} from "../helpers/IPConfig";
import {StyleSheet, Text, TouchableOpacity,FlatList, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";
import React, {useContext, useEffect, useState} from "react";
import Layout from "./Layout";

const Avisos = ({navigation, route}) => {


    const id = route.params.id
    const { authState } = useContext(AuthContext);
    const [avisos, setAvisos] = useState([])
    const isFocused = useIsFocused();

    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")
        await axios.get(`http://${baseURL}:3001/avisos/showAvisos/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setAvisos(response.data)
            }).catch((e) => console.log(e))
    }, [isFocused])

    const deleteAviso = async (id) => {
        const token = await AsyncStorage.getItem("accessToken")

        await axios.delete(`http://${baseURL}:3001/avisos/deleteAviso/${id}`,
            {headers: {accessToken: token}})
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    setAvisos(
                        avisos.filter((val) => {
                            return val.id != id;
                        })
                    )
                }
            }).catch((e) => console.log(e))
    }

    const renderItem = ({item}) => {
        return <View style={styles.global}>

            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>{"Creado: " + item.createdAt}</Text>
                <Text style={styles.itemTitle}>{"Aviso: " + item.aviso}</Text>
            </View>

            {authState.rol === "FAMILIAR" && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAviso(item.id)}>
                    <Text style={styles.itemTitle}>Eliminar</Text>
                </TouchableOpacity>
            )}

        </View>
    }

    return(
        <Layout>
            <Text>Avisos</Text>

            <FlatList
                listKey="avisos"
                style={{
                    width: '90%',
                    marginVertical: '5%',
                }}
                data={avisos}
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

export default Avisos;