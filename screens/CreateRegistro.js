import {useNavigation} from "@react-navigation/native";
import {AuthContext} from "../helpers/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {baseURL} from "../helpers/IPConfig";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Formik} from "formik";
import Layout from "./Layout";
import {useContext} from "react";
import * as Yup from "yup";

const CreateRegistro = ({navigation, route}) => {

    const id = route.params.id
    const { authState } = useContext(AuthContext);

    const initialValues = {
        desayuno: "",
        almuerzo: "",
        merienda: "",
        cena: "",
        pasosDiarios: 0,
        actividadFisica: "",
        horasSueno: 0.0,
        tiempoAireLibre:"",
        relacionSocial: "",
        PersonasDependienteId: id
    };


    const validationSchema = Yup.object().shape({
        pasosDiarios: Yup.string().required("Debe ser un número"),
        horasSueno: Yup.string().required("Debe ser un número"),
    });



    const data2 = {
        auxiliarId : authState.id,
    }

    const crearRegistro = async (values) => {

        const data = {
            desayuno: values.desayuno,
            almuerzo: values.almuerzo,
            merienda: values.merienda,
            cena: values.cena,
            pasosDiarios: values.pasosDiarios,
            actividadFisica: values.actividadFisica,
            horasSueno: values.horasSueno,
            tiempoAireLibre: values.tiempoAireLibre,
            relacionSocial: values.relacionSocial,
            PersonasDependienteId: values.PersonasDependienteId,
        }
        const token = await AsyncStorage.getItem("accessToken")
        await axios.post(`http://${baseURL}:3001/registrosDiarios/addRegistro`, data,
            {headers: {accessToken: token}})
            .then((response) => {
                if(response.data.error) {
                    console.log(response.data.error)
                }
            }).catch(e => {
                console.log(e)
            })

        await axios.post(`http://${baseURL}:3001/registrosDiarios/addAuxiliarRegistro/${id}`, data2,
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
                onSubmit={crearRegistro}
                validationSchema={validationSchema}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <Layout>
                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Desayuno:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('desayuno')}
                            onBlur={handleBlur('desayuno')}
                            value={values.desayuno}>
                        </TextInput>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Almuerzo:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('almuerzo')}
                            onBlur={handleBlur('almuerzo')}
                            value={values.almuerzo}>
                        </TextInput>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Merienda:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('merienda')}
                            onBlur={handleBlur('merienda')}
                            value={values.merienda}>
                        </TextInput>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Cena:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('cena')}
                            onBlur={handleBlur('cena')}
                            value={values.cena}>
                        </TextInput>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Pasos Diarios:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('pasosDiarios')}
                            onBlur={handleBlur('pasosDiarios')}
                            value={values.pasosDiarios}
                            placeholder="(Ej. 2000">
                        </TextInput>
                        <Text style={{color: "red", fontSize: 15}}>{touched.pasosDiarios && errors.pasosDiarios}</Text>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Actividad Física:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('actividadFisica')}
                            onBlur={handleBlur('actividadFisica')}
                            value={values.actividadFisica}
                            placeholder="(Ej. Andar, ejercicio de fuerza...)">
                        </TextInput>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Horas de sueño:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('horasSueno')}
                            onBlur={handleBlur('horasSueno')}
                            value={values.horasSueno}
                            placeholder="(Ej. 7.5)">
                        </TextInput>
                        <Text style={{color: "red", fontSize: 15}}>{touched.horasSueno && errors.horasSueno}</Text>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Tiempo al aire libre:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('tiempoAireLibre')}
                            onBlur={handleBlur('tiempoAireLibre')}
                            value={values.tiempoAireLibre}>
                        </TextInput>

                        <Text style={{color: "black", fontSize: 15, marginVertical: '3%'}}>Relaciones Sociales:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={handleChange('relacionSocial')}
                            onBlur={handleBlur('relacionSocial')}
                            value={values.relacionSocial}>
                        </TextInput>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Guardar registro</Text>
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



export default CreateRegistro;