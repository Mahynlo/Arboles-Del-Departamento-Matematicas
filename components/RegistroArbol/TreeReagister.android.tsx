import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function TreeRegister() {
    const [treeName, setTreeName] = useState('');
    const [otherInfo, setOtherInfo] = useState('');
    const [color, setColor] = useState('');
    const [altura, setAltura] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [location, setLocation] = useState({ latitude: 37.78825, longitude: -122.4324 });
    const [isQRActive, setIsQRActive] = useState(false);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const qrRef = useRef<any>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permisos de acseso a la ubicacion denegados.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            setRegion({
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    const generateQRCode = () => {
        if (!treeName) {
            Alert.alert('Error', 'Por fabor ingrese un nombre para el árbol.');
            return;
        }
        setIsQRActive(true);
    };

    const saveQRCode = async () => {
        if (qrRef.current) {
            qrRef.current.toDataURL(async (data: string) => {
                alert("Nombre");
                const filePath = `${FileSystem.cacheDirectory}tree_qr_code.png`;

                try {
                    await FileSystem.writeAsStringAsync(filePath, data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Error', 'Permission to access media library is required.');
                        return;
                    }

                    const asset = await MediaLibrary.createAssetAsync(filePath);
                    await MediaLibrary.createAlbumAsync('TreeQRCode', asset, false);

                    Alert.alert('Success', 'QR Code saved to gallery!');
                } catch (error) {
                    console.log(error);
                    Alert.alert('Error', 'Failed to save QR Code.');
                }
            });
        }
    };

    const onMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Registrar Árbol</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre del Árbol"
                    value={treeName}
                    onChangeText={setTreeName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Color"
                    value={color}
                    onChangeText={setColor}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Altura"
                    value={altura}
                    onChangeText={setAltura}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Descripcion"
                    value={descripcion}
                    onChangeText={setDescripcion}
                />



                <Text style={styles.mapLabel}>Select Tree Location on Map:</Text>
                <MapView
                    style={styles.map}
                    region={region}
                    onPress={onMapPress}
                    showsUserLocation
                    showsMyLocationButton
                >
                    <Marker coordinate={location} title="Ubicacion del arbol" description={descripcion} >
                    <Image
            source={require('@/assets/images/TreeIcon.png')}
            style={styles.markerImage}
          />
                    </Marker>
                </MapView>

                <TouchableOpacity style={styles.button} onPress={generateQRCode}>
                    <Text style={styles.buttonText}>Generate QR Code</Text>
                </TouchableOpacity>

                {isQRActive && (
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            value={`Tree: ${treeName}\nLocation: ${location.latitude}, ${location.longitude}\nInfo: ${otherInfo}Color: ${color} Altura: ${altura}`}
                            size={256}
                            color="black"
                            backgroundColor="white"
                            getRef={(c) => (qrRef.current = c)}
                        />

                        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={saveQRCode}>
                            <Text style={styles.buttonText}>Save QR Code</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        fontSize: 18,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: 300,
        marginVertical: 15,
    },
    mapLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    qrCodeContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    markerImage: {
        width: 35,
        height: 35
      }
});