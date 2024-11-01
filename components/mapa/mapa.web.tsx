import React, { useEffect } from "react";
import { Platform, View, StyleSheet, TouchableOpacity } from "react-native";
import "mapbox-gl/dist/mapbox-gl.css"; // Importa el CSS para Mapbox GL JS en la web
import { Link } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

// Importar componentes específicos según la plataforma
const Mapbox = Platform.OS === "web" ? require("mapbox-gl") : null;
// Configuración de acceso para Mapbox
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibWFsY29tbmF2YXJybyIsImEiOiJjbTJzN3BhcDIxYjAzMm1vZ3AxbjhpZnptIn0.x22BBCn00br6jKy6fhTMcA"; 

// Configuración inicial para cada plataforma
if (Platform.OS === "web") {
    Mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
} else {
    Mapbox.default.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

export default function MapaScreen() {
    useEffect(() => {
        if (Platform.OS === "web") {
            // Para la web, inicializamos el mapa en un elemento HTML
            const map = new Mapbox.Map({
                container: "map", // ID del contenedor del mapa
                style: "mapbox://styles/mapbox/streets-v11",
                center: [-111, 29], // Coordenadas iniciales
                zoom: 8, // Nivel de zoom inicial
            });

            // Crear el marcador en las coordenadas especificadas
            new Mapbox.Marker()
                .setLngLat([-110.96098674615973, 29.080701943862167])
                .setPopup(new Mapbox.Popup().setHTML('<div><h1>Localizacion del Árbol</h1><button id="navigateButton" style="padding:5px; margin-top:5px;">Informacion</button></div>'))
                .addTo(map);
            
        }
    }, []);

    return (
        <View style={styles.container}>
          {/* Renderizamos el contenedor del mapa, ajustando según la plataforma */}
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
