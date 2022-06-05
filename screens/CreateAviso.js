
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native'
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {Formik} from "formik";
import {Touchable} from "react-native-web";
import Layout from "./Layout";
import {baseURL} from "../helpers/IPConfig";


const CreateAviso = ({navigation, route}) => {

    const id = route.params.id


    // Valores y metodo para crear un aviso
    const initialValues = {
        aviso: "",
        PersonasDependienteId: id

    };

    const validationSchema = Yup.object().shape({
        aviso: Yup.string().required("Debes introducir un aviso"),

    });


    const addAviso =async (values) => {

        const data = {
            aviso: values.aviso,
            PersonasDependienteId: id,

        }

        const token = await AsyncStorage.getItem("accessToken")
        axios.post(`http://${baseURL}:3001/avisos/createAviso`, data,
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
                onSubmit={addAviso}
                validationSchema={validationSchema}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <Layout>
                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Aviso:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('aviso')}
                            onBlur={handleBlur('aviso')}
                            value={values.aviso}>
                        </TextInput>
                        <Text style={{color: "red", fontSize: 15}}>{touched.aviso && errors.aviso}</Text>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Añadir Aviso</Text>
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



export default CreateAviso;
