import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import GestionarPersonasDependientes from "../screens/GestionarPersonasDependientes";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, TouchableOpacity} from "react-native";
import CreatePersonaDependiente from "../screens/CreatePersonaDependiente";
import ShowPersonaDependiente from "../screens/ShowPersonaDependiente";
import EditPersonaDependiente from "../screens/EditPersonaDependiente";
import GestionarAuxiliares from "../screens/GestionarAuxiliares";
import CreateAuxiliar from "../screens/CreateAuxiliar";
import ShowAuxiliar from "../screens/ShowAuxiliar";
import EditAuxiliar from "../screens/EditAuxiliar";
import AuxiliaresDisponibles from "../screens/AuxiliaresDisponibles";
import GestionarFamiliares from "../screens/GestionarFamiliares";
import CreateFamiliar from "../screens/CreateFamiliar";
import ShowFamiliar from "../screens/ShowFamiliar";
import EditFamiliar from "../screens/EditFamiliar";
import CreateRegistro from "../screens/CreateRegistro";
import EditRegistro from "../screens/EditRegistro";
import CreateObservacion from "../screens/CreateObservacion";
import CreateAviso from "../screens/CreateAviso";
import Observaciones from "../screens/Observaciones";
import Avisos from "../screens/Avisos";
import ShowRegistro from "../screens/ShowRegistro";
import {AuthContext} from "../helpers/AuthContext";


const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const GestionarPersonasDependientesStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign: "center"
        }}>
            <Stack.Screen options={{
                title: "Personas dependientes",
            }}
                name="GestionarPersonasDependientes"
                component={GestionarPersonasDependientes}
            />
            <Stack.Screen options={{
                title: "Añadir persona dependiente",
            }}
                name="CreatePersonaDependiente"
                component={CreatePersonaDependiente}
            />
            <Stack.Screen options={{
                title: "Detalles de la persona dependiente",
            }}
                name="ShowPersonaDependiente"
                component={ShowPersonaDependiente}
            />
            <Stack.Screen options={{
                title: "Editar datos de la persona dependiente",
            }}
                name="EditPersonaDependiente"
                component={EditPersonaDependiente}
            />
            <Stack.Screen options={{
                title: "Detalles del auxiliar",
            }}
                name="ShowAuxiliar"
                component={ShowAuxiliar}
            />

            <Stack.Screen options={{
                title: "Editar datos del auxiliar",
            }}
                          name="EditAuxiliar"
                          component={EditAuxiliar}
            />
            <Stack.Screen options={{
                title: "Auxiliares",
            }}
                          name="GestionarAuxiliares"
                          component={GestionarAuxiliares}
            />
            <Stack.Screen options={{
                title: "Auxiliares disponibles",
            }}
                name="AuxiliaresDisponibles"
                component={AuxiliaresDisponibles}
            />
            <Stack.Screen
                name="CreateFamiliar"
                component={CreateFamiliar}
            />
            <Stack.Screen
                name="ShowFamiliar"
                component={ShowFamiliar}
            />
            <Stack.Screen options={{
                title: "Editar datos del familiar",
            }}
                          name="EditFamiliar"
                          component={EditFamiliar}
            />
            <Stack.Screen options={{
                title: "Familiares",
            }}
                          name="GestionarFamiliares"
                          component={GestionarFamiliares}
            />
            <Stack.Screen options={{
                title: "Iniciar Registro diario",
            }}
                          name="CreateRegistro"
                          component={CreateRegistro}
            />

            <Stack.Screen options={{
                title: "Modificar Registro Diario",
            }}
                          name="EditRegistro"
                          component={EditRegistro}
            />

            <Stack.Screen options={{
                title: "Añadir Observación",
            }}
                          name="CreateObservacion"
                          component={CreateObservacion}
            />

            <Stack.Screen options={{
                title: "Ver observaciones",
            }}
                          name="Observaciones"
                          component={Observaciones}
            />


            <Stack.Screen options={{
                title: "Añadir aviso",
            }}
                          name="CreateAviso"
                          component={CreateAviso}
            />

            <Stack.Screen options={{
                title: "Ver avisos",
            }}
                          name="Avisos"
                          component={Avisos}
            />

            <Stack.Screen options={{
                title: "Ver Registros diarios",
            }}
                          name="ShowRegistro"
                          component={ShowRegistro}
            />
        </Stack.Navigator>
    );
};

const GestionarAuxiliaresStack = () => {
    return(
        <Stack.Navigator screenOptions={{
            headerTitleAlign: "center"
        }}>
            <Stack.Screen options={{
                title: "Auxiliares",
            }}
                name="GestionarAuxiliares"
                component={GestionarAuxiliares}
            />
            <Stack.Screen options={{
                title: "Añadir auxiliar",
            }}
                name="CreateAuxiliar"
                component={CreateAuxiliar}
            />
            <Stack.Screen options={{
                title: "Detalles del auxiliar",
            }}
                name="ShowAuxiliar"
                component={ShowAuxiliar}
            />
            <Stack.Screen options={{
                title: "Editar datos del auxiliar",
            }}
                name="EditAuxiliar"
                component={EditAuxiliar}
            />
        </Stack.Navigator>
    )
}

const GestionarFamiliaresStack = () => {
    return(
        <Stack.Navigator screenOptions={{
            headerTitleAlign: "center"
        }}>
            <Stack.Screen options={{
                title: "Familiares",
            }}
                name="GestionarFamiliares"
                component={GestionarFamiliares}
            />
            <Stack.Screen options={{
                title: "Añadir familiar",
            }}
                name="CreateFamiliar"
                component={CreateFamiliar}
            />
            <Stack.Screen options={{
                title: "Detalles del familiar",
            }}
                name="ShowFamiliar"
                component={ShowFamiliar}
            />
            <Stack.Screen options={{
                title: "Editar datos del familiar",
            }}
                name="EditFamiliar"
                component={EditFamiliar}
            />
        </Stack.Navigator>
    )
}

const TabNavigator = () => {

    const { authState } = useContext(AuthContext);

    return(
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {backgroundColor: 'white'}
        }}>
            <Tab.Screen name="Home2" component={Home} options={{
                title: "Home",
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="home-outline" color={color} size={size} />
                )
            }}/>
            <Tab.Screen name="Pers. dependientes" component={GestionarPersonasDependientesStack} options={{
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="people" color={color} size={size} />
                )
            }}/>
            {authState.rol === "COORDINADOR" &&
                <>
                    <Tab.Screen name="Auxiliares" component={GestionarAuxiliaresStack} options={{
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="people" color={color} size={size} />
                        )
                    }}/>
                    <Tab.Screen name="Familiares" component={GestionarFamiliaresStack} options={{
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="people" color={color} size={size} />
                        )
                    }}/>
                </>
            }

        </Tab.Navigator>
        );
}

export default TabNavigator;
