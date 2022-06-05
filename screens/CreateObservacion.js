import React, {useContext} from 'react'
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native'
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {Formik} from "formik";
import {Touchable} from "react-native-web";
import Layout from "./Layout";
import {baseURL} from "../helpers/IPConfig";
import {AuthContext} from "../helpers/AuthContext";

const CreateObservacion = ({navigation, route}) => {

    const { authState } = useContext(AuthContext);
    const id = route.params.id


    // Valores y metodo para crear una observacion
    const initialValues = {
        titulo: "",
        descripcion: "",
        username: "",
        PersonasDependienteId: id,
        UserId: ""

    };

    const validationSchema = Yup.object().shape({
        titulo: Yup.string().required("Debes introducir un título"),
        descripcion: Yup.string().required("Debes introducir una descripción"),
    });


    const addObservacion =async (values) => {

        const data = {
            titulo: values.titulo,
            descripcion: values.descripcion,
            username: authState.username,
            PersonasDependienteId: id,
            UserId: authState.id,
        }

        const token = await AsyncStorage.getItem("accessToken")
        axios.post(`http://${baseURL}:3001/observaciones/createObservacion`, data,
            {headers: {accessToken: token}})
            .then((response) => {
                if(response.data.error) {
                    console.log(response.data.error)
                } else {
                    navigation.goBack()
                }
            }).catch(e => {
            console.log(e)
        })
    }

    return (
        <ScrollView>
            <Formik
                initialValues={initialValues}
                onSubmit={addObservacion}
                validationSchema={validationSchema}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <Layout>
                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Titulo:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('titulo')}
                            onBlur={handleBlur('titulo')}
                            value={values.titulo}>
                        </TextInput>
                        <Text style={{color: "red", fontSize: 15}}>{touched.titulo && errors.titulo}</Text>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Descripción:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('descripcion')}
                            onBlur={handleBlur('descripcion')}
                            value={values.descripcion}>
                        </TextInput>
                        <Text style={{color: "red", fontSize: 15}}>{touched.descripcion && errors.descripcion}</Text>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Añadir Observación</Text>
                        </TouchableOpacity>
                    </Layout>
                )}
            </Formik>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    input: {
        width: "90%",
        marginBottom: 7,
        fontSize: 14,
        borderWidth: 1,
        borderColor: "dodgerblue",
        height: 30,
        color: "black",
        textAlign: "center",
        padding: 4,
        borderRadius: 5,
    },
    button: {
        marginVertical: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#33FF49',
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
});



export default CreateObservacion;


