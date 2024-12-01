import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput,ScrollView } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Link } from "expo-router";
import { CheckBox, Avatar } from '@rneui/themed';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function SettingScreen() {
    const [selectedIndex, setIndex] = useState(0);
    const [username, setUsername] = useState("Usuario");
    const [correo, setCorreo] = useState("Correo Electronico");
    const colorScheme = useColorScheme();

    const handleThemeChange = (index: number) => {
        setIndex(index);
        // Aquí puedes integrar lógica para actualizar el tema global
        console.log("Tema seleccionado:", index === 0 ? "Oscuro" : index === 1 ? "Claro" : "Automático");
    };

    return (
        <>
            {Platform.OS === 'web' ? (
                <View>
                    <ThemedView style={styles.stepContainer}>
                        <ThemedText type="subtitle">Configuración</ThemedText>
                        <ThemedText>Esta es la página de configuración de la aplicación en su versión web.</ThemedText>
                    </ThemedView>
                    <TouchableOpacity style={styles.button}>
                        <Link href="/" style={styles.link}>Ir a Home</Link>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView>
                <View>
                    <ThemedView style={styles.stepContainer}>
                        <Text style={styles.subHeader}>Apariencia</Text>
                        <ThemedView style={styles.themeSelector}>
                            <CheckBox
                                title="Modo Oscuro"
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={selectedIndex === 0}
                                onPress={() => handleThemeChange(0)}
                            />
                            <CheckBox
                                title="Modo Claro"
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={selectedIndex === 1}
                                onPress={() => handleThemeChange(1)}
                            />
                            <CheckBox
                                title="Automático"
                                checkedIcon="dot-circle-o"
                                uncheckedIcon="circle-o"
                                checked={selectedIndex === 2}
                                onPress={() => handleThemeChange(2)}
                            />
                        </ThemedView>

                        <Text style={styles.subHeader}>Perfil de Usuario</Text>
                        <ThemedView style={styles.profileSection}>
                            <Avatar
                                size={84}
                                rounded
                                title="Rd"
                                containerStyle={{ backgroundColor: "blue" }}
                            />
                            <Text style={styles.label}>Nombre de usuario:</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Introduce tu nombre"
                            />
                            <TextInput
                                style={styles.input}
                                value={correo}
                                onChangeText={setCorreo}
                                placeholder="Introduce tu correo"
                            />
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Guardar Cambios</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.logoutButton]}>
                                <Text style={styles.link}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </ThemedView>

                        <Text style={styles.subHeader}>Opciones Avanzadas</Text>
                        <ThemedView style={styles.advancedOptions}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Restablecer Configuración</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Borrar Datos</Text>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                </View>
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    stepContainer: {
        padding: 15,
        margin: 10,
        borderRadius: 10,
        
    },
    subHeader: {
        backgroundColor: "#2089dc",
        color: "white",
        textAlign: "center",
        paddingVertical: 8,
        fontSize: 18,
        borderRadius: 5,
        marginBottom: 10,
    },
    themeSelector: {
        marginBottom: 20,
    },
    profileSection: {
        padding: 10,
        backgroundColor: '#eef2f5',
        borderRadius: 5,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
         backgroundColor: '#eef2f5',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    advancedOptions: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#1c4ccb',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
    },
    link: {
        color: '#fff',
        fontSize: 16,
    },
});

