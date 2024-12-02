import React from "react";
import { Image, StyleSheet, Platform, TouchableOpacity, Pressable, Button, Text } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useLocalSearchParams } from 'expo-router'; // Cambiado a useSearchParams
import { QRgenerador } from "@/components/arbol/QRgenerador";

interface TreeData {
    id_arbol?: number;
    nombre?: string;
    nombre_cientifico?: string;
    tipo_sitio?: string;
    dendometria?: string;
    estado_salud?: string;
    conflictos?: string;
    riesgo?: string;
    comentarios?: string;
    latitud?: number;
    longitud?: number;
}

export default function InformacionTree() {
    const localSearchParams = useLocalSearchParams();
    const tree = localSearchParams.tree; // Extrae el parámetro 'tree'


    const treeData: TreeData = tree ? JSON.parse(tree as string) : {};
    const qrValue = `ARDEMA=${encodeURIComponent(JSON.stringify(treeData))}`

    const [isVisible, setIsVisible] = React.useState(false);

    const handleOpenQR = () => setIsVisible(true);
    const handleCloseMap = () => setIsVisible(false);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/Arbol_de_prueba.jpg')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Árbol {treeData?.nombre || 'desconocido'}</ThemedText>
                <HelloWave />
            </ThemedView>
            {/* Botón para abrir regresar al Mapa */}
            {Platform.OS === "web" ? (
                <TouchableOpacity style={styles.animatedButton}>
                <Link href={"/"}>
                    <Text style={styles.link}>Regresar al Mapa</Text>
                </Link>
            </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.animatedButton}>
                <Link href={"/mapa"}>
                    <Text style={styles.link}>Regresar al Mapa</Text>
                </Link>
            </TouchableOpacity>
            )}


            <ThemedView style={styles.stepContainer}>
                <Button title="Generar QR" onPress={handleOpenQR} />
                {isVisible && (
                    <QRgenerador
                        qrvalue={qrValue}
                        isVisible={isVisible}
                        onQRImpresion={(qrValue) => console.log(qrValue)}
                        onClose={handleCloseMap}
                    />
                )}
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Información General</ThemedText>

                <ThemedText>
                    <ThemedText type="defaultSemiBold">Nombre Científico:</ThemedText> {treeData?.nombre_cientifico || 'Desconocido'}
                </ThemedText>
                <ThemedText>
                    <ThemedText type="defaultSemiBold">Tipo de Sitio:</ThemedText> {treeData?.tipo_sitio || 'Desconocido'}
                </ThemedText>
                <ThemedText>
                    <ThemedText type="defaultSemiBold">Dendometría:</ThemedText> {treeData?.dendometria || 'Desconocido'}
                </ThemedText>
                <ThemedText>
                    <ThemedText type="defaultSemiBold">Estado de Salud:</ThemedText> {treeData?.estado_salud || 'Desconocido'}
                </ThemedText>
                <ThemedText>
                    <ThemedText type="defaultSemiBold">Conflictos:</ThemedText> {treeData?.conflictos || 'Desconocido'}
                </ThemedText>
                <ThemedText>
                    <ThemedText type="defaultSemiBold">Riesgo:</ThemedText> {treeData?.riesgo || 'Desconocido'}
                </ThemedText>
                <ThemedText>
                    <ThemedText type="defaultSemiBold">Comentarios:</ThemedText> {treeData?.comentarios || 'Desconocido'}
                </ThemedText>
                <ThemedText type="subtitle">Galeria</ThemedText>
                <ThemedText type="subtitle">Opciones</ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 280,
        width: '100%',
        resizeMode: 'cover',
    },
    button: {
        fontSize: 40,
        textDecorationLine: 'underline',
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 10,
    },
    link: {
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'none',
    },
    animatedButton: { backgroundColor: '#1e90ff', padding: 10, borderRadius: 10, marginTop: 10 },
    buttonText: { fontSize: 18, color: '#fff' },
});
