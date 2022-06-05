import React, {useContext, useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../helpers/AuthContext";
import {baseURL} from "../helpers/IPConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Layout from "./Layout";
import jsPDF from "jspdf";


const ShowRegistro = ({navigation, route}) => {

    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [registro, setRegistro] = useState([]);
    const [registrosMes, setRegistrosMes] = useState([]);
    const [personaDependiente, setPersonaDependiente] = useState({});
    const id = route.params.id
    const isFocused = useIsFocused();
    const { authState } = useContext(AuthContext);

    const fechaString = fechaSeleccionada.toLocaleDateString();
    const mes = fechaSeleccionada.getMonth()+1;

    useEffect(async () => {
        const token = await AsyncStorage.getItem("accessToken")

        // OBTENEMOS EL REGISTRO DEL DIA ACTUAL
        await axios.get(`http://${baseURL}:3001/registrosDiarios/showRegistro/${id}?fecha=${fechaString}`,
            {headers: {accessToken: token}})
            .then((response) => {
                setRegistro(response.data);
            }).catch((e) => console.log(e))


        await axios.get(`http://${baseURL}:3001/registrosDiarios/showRegistrosMes/${id}?mes=${mes}`,
            {headers: {accessToken: localStorage.getItem("accessToken"),}})
            .then((response) => {
                setRegistrosMes(response.data);
                console.log(response.data)
            }).catch((e) => console.log(e))


        await axios.get(`http://${baseURL}:3001/personasDependientes/show/${id}`,
            {headers: {accessToken: localStorage.getItem("accessToken"),}})
            .then((response) => {
                setPersonaDependiente(response.data);
            }).catch((e) => console.log(e))

    }, [isFocused])


    const showRegistro = async () => {
        await axios.get(`http://${baseURL}:3001/registrosDiarios/showRegistro/${id}?fecha=${fechaString}`,
            {headers: {accessToken: localStorage.getItem("accessToken"),}})
            .then((response) => {
                setRegistro(response.data);
            }).catch((e) => console.log(e))
    }

    /*
                   <View>
                       <NativeDatePickerAndroid value={fechaSeleccionada} onChange{setFechaSeleccionada}/>
                   </View>

                   <TouchableOpacity style={styles.buscarButton} onPress={showRegistro()}>
                       <Text style={styles.itemTitle}>Buscar</Text>
                   </TouchableOpacity>

                   */

    const generatePDF = () => {

        console.log(registrosMes)
        var doc = new jsPDF();

        for(var i = 0; i < registrosMes.length; i++) {

            const reg = registrosMes.at(i)

            const desayuno = (reg.desayuno === null) ? "" : reg.desayuno;
            const almuerzo = (reg.almuerzo === null) ? "" : reg.almuerzo;
            const merienda = (reg.merienda === null) ? "" : reg.merienda;
            const cena = (reg.cena === null) ? "" : reg.cena;
            const pasosDiarios = (reg.pasosDiarios === null) ? "" : reg.pasosDiarios;
            const actividadFisica = (reg.actividadFisica === null) ? "" : reg.actividadFisica;
            const tiempoAireLibre = (reg.tiempoAireLibre === null) ? "" : reg.tiempoAireLibre;
            const horasSueno = (reg.horasSueno === null) ? "" : reg.horasSueno;
            const relacionSocial = (reg.relacionSocial === null) ? "" : reg.relacionSocial;
            const medicacionManana = (reg.medicacionManana === false) ? "No" : "Si";
            const medicacionTarde = (reg.medicacionTarde === false) ? "No" : "Si";
            const medicacionNoche = (reg.medicacionNoche === false) ? "NO" : "Si";

            var splitDesayuno = doc.splitTextToSize(desayuno, 180)
            var splitMerienda = doc.splitTextToSize(merienda, 180)
            var splitCena = doc.splitTextToSize(cena, 180)
            var splitAlmuerzo = doc.splitTextToSize(almuerzo, 180)
            var splitActividad = doc.splitTextToSize(actividadFisica, 180)
            var splitRelacionSocial = doc.splitTextToSize(relacionSocial, 180)

            doc.setFontSize(14)
            doc.text(20, 25, 'Nombre: ' + personaDependiente.nombre +    '  Apellidos: ' + personaDependiente.apellidos)
            doc.setFontSize(25)
            doc.text(55, 35, 'Registro día: ' + reg.fecha)
            doc.setFontSize(10)
            doc.text(20, 45, 'ALIMENTACIÓN')
            doc.line(20, 47, 180, 47)
            doc.text(20, 52, 'Desayuno: ')
            doc.text(20, 57,  splitDesayuno)
            doc.text(20, 75, 'Almuerzo: ')
            doc.text(20, 80,  splitAlmuerzo)
            doc.text(20, 100, 'Merienda: ')
            doc.text(20, 105,  splitMerienda)
            doc.text(20, 120, 'Cena: ')
            doc.text(20, 125,  splitCena)
            doc.text(20, 150, 'MEDICACIÓN')
            doc.line(20, 152, 180, 152)
            doc.text(20, 157, '¿Ha tomado la medicación correspondiente a la mañana?:  ' + medicacionManana)
            doc.text(20, 162, '¿Ha tomado la medicación correspondiente a la tarde?: ' + medicacionTarde)
            doc.text(20, 167, '¿Ha tomado la medicación correspondiente a la noche?: ' + medicacionNoche)
            doc.text(20, 178, 'ACTIVIDAD FÍSICA')
            doc.line(20, 180, 180, 180)
            doc.text(20, 185, 'Actividad física realizada:')
            doc.text(20, 190, splitActividad)
            doc.text(20, 205, 'Pasos diarios: ' + pasosDiarios)
            doc.text(20, 213, 'OTROS')
            doc.line(20, 215, 180, 215)
            doc.text(20, 220, 'Horas de sueño: ' + horasSueno)
            doc.text(20, 225, 'Tiempo al aire libre: ' + tiempoAireLibre)
            doc.text(20, 240, 'Relaciones sociales: ')
            doc.text(20, 245, splitRelacionSocial)


            doc.addPage()

        }

        doc.save('Demo.pdf')
    }


    return (
        <FlatList ListHeaderComponent={
            <>
                <Layout>

                    {registro && Object.entries(registro).length !== 0 &&

                    <View style={styles.container}>
                        <Text style={styles.itemTitle}>Desayuno: {registro.desayuno}</Text>
                        <Text style={styles.itemTitle}>Almuerzo: {registro.almuerzo}</Text>
                        <Text style={styles.itemTitle}>Merienda: {registro.merienda}</Text>
                        <Text style={styles.itemTitle}>Cena: {registro.cena}</Text>
                        <Text style={styles.itemTitle}>Pasos diarios: {registro.pasosDiarios}</Text>
                        <Text style={styles.itemTitle}>Actividad física: {registro.actividadFisica}</Text>
                        <Text style={styles.itemTitle}>Horas de sueño: {registro.horasSueno}</Text>
                    </View>

                    }

                    {Object.entries(registro).length === 0 &&

                    <div className="no-registro">
                        NO HAY NINGÚN REGISTRO
                    </div>

                    }


                    { ((authState.rol === "FAMILIAR") || (authState.rol === "COORDINADOR")) &&

                    <TouchableOpacity style={styles.buscarButton} onPress={generatePDF}>
                        <Text style={styles.itemTitle}>Descargar registros del mes</Text>
                    </TouchableOpacity>

                    }


                </Layout>
            </>
        }

        />

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
    }
})

export default ShowRegistro;