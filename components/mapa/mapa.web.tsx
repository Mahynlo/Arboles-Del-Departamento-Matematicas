import React, { useEffect, useState } from "react";
import { Platform, View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Constants from "expo-constants";

const Mapbox = Platform.OS === "web" ? require("mapbox-gl") : null;
const Token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

if (Platform.OS === "web") {
    Mapbox.accessToken = Token;
} else {
    Mapbox.default.setAccessToken(Token);
}

const markers = [
    { id: 1, coordinates: [-110.9609, 29.0807], title: "Árbol 1", description: "Descripción del Árbol 1" },
    { id: 2, coordinates: [-110.960714, 29.080637], title: "Árbol 2", description: "Descripción del Árbol 2" },
    { id: 3, coordinates: [-110.960795, 29.080620], title: "Árbol 3", description: "Descripción del Árbol 3" },
    { id: 4, coordinates: [-110.9609, 29.0808], title: "Árbol 4", description: "Descripción del Árbol 4" },
];

export default function MapaScreen() {
    const router = useRouter();
    const [selectedTree, setSelectedTree] = useState<{ id: number; coordinates: number[]; title: string; description: string } | null>(null); // Estado para el árbol seleccionado
    let map: any;

    useEffect(() => {
        if (Platform.OS === "web") {
            map = new Mapbox.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                center: [-110.967847,29.098678],
                zoom: 11,
            });

            markers.forEach(markerData => {
                const markerElement = document.createElement('div');
                markerElement.style.width = '32px';
                markerElement.style.height = '32px';
                markerElement.style.backgroundImage = 'url(./assets/images/TreeIcon.png)';
                markerElement.style.backgroundSize = 'cover';

                const marker = new Mapbox.Marker(markerElement)
                    .setLngLat(markerData.coordinates)
                    .setPopup(new Mapbox.Popup().setHTML(`
                        <div>
                            <h1>${markerData.title}</h1>
                            <button id="navigateButton-${markerData.id}" style="padding:5px; margin-top:5px;">Ver Información</button>
                        </div>
                    `))
                    .addTo(map);

                marker.getPopup().on('open', () => {
                    setSelectedTree(markerData); // Establecer el árbol seleccionado al hacer clic
                    setTimeout(() => {
                        const navigateButton = document.getElementById(`navigateButton-${markerData.id}`);
                        if (navigateButton) {
                            navigateButton.addEventListener("click", () => {
                                router.push("/InfoTree");
                            });
                        }
                    }, 0);
                });
                // Cuando el popup se cierra
            marker.getPopup().on('close', () => {
                setSelectedTree(null); // Cerrar el panel de información
            });
            });
        }
    }, [router]);

    const zoomIn = () => {
        if (map) map.zoomIn();
    };

    const zoomOut = () => {
        if (map) map.zoomOut();
    };
    

    return (
        <View style={styles.container}>
            {/* Contenedor del mapa */}
            <div id="map" style={styles.mapWeb} />

            {/* Panel de información del árbol seleccionado */}
            {selectedTree && (
                <View style={styles.infoPanel}>
                    <Text style={styles.treeTitle}>{selectedTree.title}</Text>
                    <Text style={styles.treeDescription}>{selectedTree.description}</Text>
                    <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/InfoTree")}>
                        <Text style={styles.infoButtonText}>Ir a InfoTree</Text>
                    </TouchableOpacity>
                    <Text>Latitud: {selectedTree.coordinates[1]}</Text>
                    <Text>Longitud: {selectedTree.coordinates[0]}</Text>
                    <Image
                        source={require('@/assets/images/Arbol_de_prueba.jpg')}
                        style={styles.reactLogo}
                    />  
                </View>
            )}


            {/* Botón para agregar un nuevo árbol */}
            <TouchableOpacity style={styles.addButton}>
                <Link href="/TreeRegistration">
                    <TabBarIcon name="add" />
                </Link>
            </TouchableOpacity>

            {/* Botones para acercar y alejar el mapa */}
            <View style={styles.zoomContainer}>
                <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>-</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapWeb: {
        width: "100%",
        height: "100%",
    },
    infoPanel: {
        position: 'absolute',
        top: 10,
        left: 5,
        width: "30%",
        height: "93%",
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    treeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    treeDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    infoButton: {
        backgroundColor: '#1c99cb',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    infoButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#1c99cb',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoomContainer: {
        position: 'absolute',
        right: 28,
        top: 500,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        overflow: 'hidden',
    },
    zoomButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    zoomText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reactLogo: {
        height: 280,
        width: '100%',
        resizeMode: 'cover',
    },
   
});





