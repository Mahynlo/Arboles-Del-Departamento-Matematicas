import React, { useEffect } from "react"; 
import { Platform, View, StyleSheet, TouchableOpacity } from "react-native";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Constants from "expo-constants";

<<<<<<< HEAD
=======

// Importar componentes específicos según la plataforma
>>>>>>> Gaspar
const Mapbox = Platform.OS === "web" ? require("mapbox-gl") : null;
const Token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

if (Platform.OS === "web") {
    Mapbox.accessToken = Token;
} else {
    Mapbox.default.setAccessToken(Token);
}

const markers = [
    { id: 1, coordinates: [-110.9609, 29.0807], title: "Árbol 1" },
    { id: 2, coordinates: [-111.1000, 29.0700], title: "Árbol 2" },
    { id: 3, coordinates: [-111.2000, 29.0600], title: "Árbol 3" },
    { id: 1, coordinates: [-110.9609, 29.0808], title: "Árbol 4" },
    
    // Agrega más marcadores aquí según sea necesario
];

export default function MapaScreen() {
    const router = useRouter();

    useEffect(() => {
        if (Platform.OS === "web") {
            const map = new Mapbox.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                center: [-111, 29],
                zoom: 8,
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
                            <button id="navigateButton-${markerData.id}" style="padding:5px; margin-top:5px;">Información</button>
                        </div>
                    `))
                    .addTo(map);

                marker.getPopup().on('open', () => {
                    setTimeout(() => {
                        const navigateButton = document.getElementById(`navigateButton-${markerData.id}`);
                        if (navigateButton) {
                            navigateButton.addEventListener("click", () => {
                                if (window.location.pathname !== "/InfoTree") {
                                    router.push("/InfoTree");
                                }
                            });
                        }
                    }, 0);
                });
            });
        }
    }, [router]);

    return (
        <View style={styles.container}>
            <div id="map" style={styles.mapWeb} />
            <TouchableOpacity style={styles.addButton}>
                <Link href="/TreeRegistration">
                    <TabBarIcon name="add" />
                </Link>
            </TouchableOpacity>
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
});


