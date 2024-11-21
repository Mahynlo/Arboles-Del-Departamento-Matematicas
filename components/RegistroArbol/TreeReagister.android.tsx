import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { supabase } from '../../lib/supabase';
import { ThemedView } from '../ThemedView';
import { ScannerCamera } from "@/components/fotos/CapturarImagen";
import { TabBarIcon } from '../navigation/TabBarIcon';

export default function TreeRegister() {
    const [nombre, setTreeName] = useState('');
    const [nombre_cientifico, setScientific] = useState('');
    //const [descripcion, setDescription] = useState('');
    const [tipo_sitio, setSite] = useState('');
    const [dendometria, setDendometry] = useState('');
    const [estado_salud, setHealth] = useState('');
    const [conflictos, setIssues] = useState('');
    const [riesgo, setRisk] = useState('');
    const [location, setLocation] = useState({ latitude: 37.78825, longitude: -122.4324 });
    const [isQRActive, setIsQRActive] = useState(false);

    // para captura de la imagen 
    const [isCameraVisible, setCameraVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    //const [region, setRegion] = useState({
    //    latitude: 37.78825,
    //    longitude: -122.4324,
    //    latitudeDelta: 0.0922,
    //    longitudeDelta: 0.0421,
    //});

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
            //setRegion({
            //    ...region,
            //    latitude: location.coords.latitude,
            //    longitude: location.coords.longitude,
            //});
        })();
    }, []);

    const generateQRCode = () => {
        if (!nombre) {
            Alert.alert('Error', 'Por fabor ingrese un nombre para el árbol.');
            return;
        }
        setIsQRActive(true);
    };

    const saveQRCode = async () => {
        if (qrRef.current) {
            qrRef.current.toDataURL(async (data: string) => {
                alert("Nombre");
                const filePath = `${FileSystem.cacheDirectory}tree_qr_code.png`; // Ruta de la imagen en la carpeta de caché del dispositivo 

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
                    await MediaLibrary.createAlbumAsync('TreeQRCode', asset, false); // Crea un álbum en la galería del dispositivo

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

    const saveTreeToSupabase = async () => {
        const { data, error } = await supabase
            .from('arbol')
            .insert({
                nombre,
                nombre_cientifico,
                //descripcion,
                tipo_sitio,
                dendometria,
                estado_salud,
                conflictos,
                riesgo,
                //latitud: location.latitude,
                //longitud: location.longitude
            });

        if (error) {
            Alert.alert('Error', 'No se pudo registrar el árbol en la base de datos.');
            console.log(error);
        } else {
            Alert.alert('Éxito', 'Árbol registrado en la base de datos.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Registrar Árbol</Text>
                <Text style={styles.subHeader}><TabBarIcon name='caret-forward-sharp'/>Preguntas Referentes al arbol</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre del Árbol"
                    value={nombre}
                    onChangeText={setTreeName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nombre Científico"
                    value={nombre_cientifico}
                    onChangeText={setScientific}
                />

                {/*<TextInput
                    style={styles.input}
                    placeholder="Descripcion"
                    value={descripcion}
                    onChangeText={setDescription}
                />*/}

                <TextInput
                    style={styles.input}
                    placeholder="Tipo De Sitio"
                    value={tipo_sitio}
                    onChangeText={setSite}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Dendrometría"
                    value={dendometria}
                    onChangeText={setDendometry}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Estado De Salud"
                    value={estado_salud}
                    onChangeText={setHealth}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Conflictos"
                    value={conflictos}
                    onChangeText={setIssues}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Riesgo"
                    value={riesgo}
                    onChangeText={setRisk}
                />
                <Text style={styles.subHeader}><TabBarIcon name='caret-forward-sharp'/>Captura de imagen del arbol</Text>
                <Button title="Abrir Cámara" onPress={() => setCameraVisible(true)} />
                <Text>Imagen capturada:</Text>
                {capturedImage && (
                    <Image source={{ uri: capturedImage }} style={{ width: 300, height: 300 }} />
                )}
                <ScannerCamera
                    isVisible={isCameraVisible}
                    onCapture={(uri) => setCapturedImage(uri)}
                    onClose={() => setCameraVisible(false)}
                />
                <Text style={styles.subHeader}><TabBarIcon name='caret-forward-sharp'/>Ubicacion del arbol</Text>
                <Text style={styles.mapLabel}>Select Tree Location on Map:</Text>
                <MapView
                    style={styles.map}
                    //region={region}
                    onPress={onMapPress}
                    showsUserLocation
                    showsMyLocationButton
                >
                    <Marker coordinate={location} title="Ubicacion del arbol">{/*description={descripcion}*/}
                        <Image
                            source={require('@/assets/images/TreeIcon.png')}
                            style={styles.markerImage}
                        />
                    </Marker>
                </MapView>
                <ThemedView style={styles.stepContainerButton}>
                    <TouchableOpacity style={styles.button} onPress={generateQRCode}>
                        <Text style={styles.buttonText}>Generate QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={saveTreeToSupabase}>
                        <Text style={styles.buttonText}>Guardar en Base de Datos</Text>
                    </TouchableOpacity>
                </ThemedView>

                {isQRActive && (
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            value={`Nombre: ${nombre}\nNombre Científico: ${nombre_cientifico}\nTipo de Sitio: ${tipo_sitio}\nDendrometría: ${dendometria}\nEstado de Salud: ${estado_salud}\nConflictos: ${conflictos}\nRiesgo: ${riesgo}\nUbicación:`}//${location.latitude}, ${location.longitude}
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
    stepContainerButton: {
        gap: 12,
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
    },
    subHeader: {
        backgroundColor: "#25be10",
        color: "white",
        textAlign: "center",
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 18,
    }
});