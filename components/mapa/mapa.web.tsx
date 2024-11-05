import React, { useEffect } from "react";
import { Platform, View, StyleSheet, TouchableOpacity } from "react-native";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useRouter } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from "react-native/Libraries/NewAppScreen";
import Constants  from "expo-constants";

import {MAPBOX_MAP_TOKEN} from '@env'; // Importar variables de entorno

// Importar componentes específicos según la plataforma
const Mapbox = Platform.OS === "web" ? require("mapbox-gl") : null;
const Token = MAPBOX_MAP_TOKEN;

// Configuración inicial para cada plataforma
if (Platform.OS === "web") {
    Mapbox.accessToken = Token;
} else {
    Mapbox.default.setAccessToken(Token);
}

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

            // Crear un elemento de imagen para usar como marcador
            const markerElement = document.createElement('div');
            markerElement.style.width = '32px';
            markerElement.style.height = '32px';
            markerElement.style.backgroundImage = 'url(./assets/images/TreeIcon.png)'; // Ruta de tu imagen
            markerElement.style.backgroundSize = 'cover';

            // Crear el marcador en las coordenadas especificadas
            const marker = new Mapbox.Marker(markerElement)
            .setLngLat([-110.96098674615973, 29.080701943862167])
            .setPopup(new Mapbox.Popup().setHTML(`
                <div>
                    <h1>Localizacion del Árbol</h1>
                    <button id="navigateButton" style="padding:5px; margin-top:5px; ">Informacion</button>
                </div>
            `))
            .addTo(map);

            marker.getPopup().on('open', () => {
                // Usamos un setTimeout para asegurarnos de que el botón esté disponible en el DOM
                setTimeout(() => {
                    const navigateButton = document.getElementById("navigateButton");
                    if (navigateButton) {
                        navigateButton.addEventListener("click", () => {
                            if (window.location.pathname !== "/InfoTree") { // Evita redirecciones innecesarias al mismo lugar
                                router.push("/InfoTree");
                            }
                        });
                    }
                }, 0); // 0 ms asegura que se ejecute después de la inserción del popup
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

