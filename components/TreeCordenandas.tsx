import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Image, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedView } from './ThemedView';

interface MapProps {
    isVisible: boolean;
    onCordenadas: (latitude: number, longitude: number) => void;
    onClose: () => void;
}

export const TreeCordenandas = ({ isVisible, onCordenadas, onClose }: MapProps) => {
    const [location, setLocation] = useState({ latitude: 29.11, longitude: -110.97 });
    const [mapVisible, setMapVisible] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permisos de acceso a la ubicación denegados.');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            })();
        }
    }, [isVisible]);

    const onMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
    };

    const handleSaveLocation = () => {
        // Llamamos a onCordenadas para enviar las coordenadas al componente principal
        const { latitude, longitude } = location;
        onCordenadas(latitude, longitude);
        onClose(); // Cerrar el mapa después de seleccionar la ubicación
    };

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} animationType="slide">
            <View style={styles.container}>
                <Text style={styles.header}>Selecciona la ubicación del árbol</Text>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    onPress={onMapPress}
                    showsUserLocation
                    showsMyLocationButton
                >
                    <Marker coordinate={location} draggable onDragEnd={onMapPress}>
                        <Image source={require('@/assets/images/TreeIcon.png')} style={styles.markerImage} />
                    </Marker>
                </MapView>
                <View style={styles.coordsContainer}>
                    <Text style={styles.coordsText}>Latitud: {location.latitude.toFixed(10)}</Text>
                    <Text style={styles.coordsText}>Longitud: {location.longitude.toFixed(10)}</Text>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
                    <Text style={styles.saveButtonText}>Guardar Ubicación</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        width: '100%',
        height: '100%',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: '78%',
        marginBottom: 16,
    },
    markerImage: {
        width: 40,
        height: 40,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    coordsContainer: {
        position: 'absolute',
        top: 60,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
        zIndex: 1,
    },
    coordsText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});

