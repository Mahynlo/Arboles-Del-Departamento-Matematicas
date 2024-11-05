import React from "react";

import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Link } from "expo-router";

export default function SettingScreen() {
    return (
        <>
            {Platform.OS === 'web' ? (
                <View>
                    <ThemedView style={styles.stepContainer}>
                        <ThemedText type="subtitle">Configuracion</ThemedText>
                        <ThemedText>
                            <>
                                Esta es la página de configuración de la aplicación en su verion web.
                            </>
                        </ThemedText>
                    </ThemedView>
                    <TouchableOpacity style={styles.button}>
                        <Link href="/" style={styles.link}>
                            IR a Home
                        </Link>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <ThemedView style={styles.stepContainer}>
                        <ThemedText type="subtitle">Cinfiguracion</ThemedText>
                        <ThemedText>
                            <>
                                Esta es la página de configuración de la aplicación en su verion movil.
                            </>
                        </ThemedText>

                        {/* Botones en grid */}
                        <ThemedView style={styles.buttonGridContainer}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Boton 1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Boton 2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Boton 3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Boton 4</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.link}>Boton 5</Text>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>

                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    stepContainer: {
        padding: 10,
        borderBottomWidth: 1,
        color: '#fff',
        borderRadius: 10,
        margin: 10,
        backgroundColor: '#875926',

    },
    reactLogo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#875926',
    },
    button: {
        backgroundColor: '#1c4ccb',
        padding: Platform.OS === 'web' ? 10 : 20,
        borderRadius: 5,
        marginTop: 15,
        marginHorizontal: 10,
        marginVertical: 10,
        height: Platform.OS === 'web' ? 40 : null,
        width: Platform.OS === 'web' ? 200 : null,
    },
    link: {
        color: '#fff',
        textAlign: 'center',
        
    },
});
