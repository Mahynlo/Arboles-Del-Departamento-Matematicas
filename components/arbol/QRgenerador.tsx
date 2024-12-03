import QRCode from 'react-native-qrcode-svg';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface QRProps {
    isVisible: boolean;
    qrvalue: string;
    onQRImpresion: (qrValue: string) => void;
    onClose: () => void;
}

export const QRgenerador = ({ isVisible, qrvalue, onQRImpresion, onClose }: QRProps) => {
    const qrRef = useRef<any>(null);
    const [isQRActive, setIsQRActive] = useState(false);

    useEffect(() => {
        if (qrvalue) {
            setIsQRActive(true);
        }
    }, [qrvalue]);

    const saveQRCode = async () => {
        if (qrRef.current) {
            qrRef.current.toDataURL(async (data: string) => {
                try {
                    // Decodificar el valor del QR para obtener los datos del árbol
                    const decodedValue = decodeURIComponent(qrvalue.replace('ARDEMA=', ''));
                    const treeData = JSON.parse(decodedValue);
                    const treeName = treeData?.nombre || 'TreeQRCode'; // Usar nombre o un valor por defecto
    
                    if (Platform.OS === 'web') {
                        // Web: Descargar el QR como imagen
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${data}`;
                        link.download = `Arbol_${treeName.replace(/\s+/g, '_')}_QR.png`; // Sustituir espacios por guiones bajos
                        link.click();
                    } else {
                        // Móvil: Guardar el QR en la galería
                        const filePath = `${FileSystem.documentDirectory}${treeName.replace(/\s+/g, '_')}_qr_code.png`;
    
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
                        onClose();
                    }
                } catch (error) {
                    console.log('Error saving QR code:', error);
                    Alert.alert('Error', 'Failed to save QR Code.');
                }
            });
        }
    };
    

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} animationType="slide">
            <ScrollView contentContainerStyle={styles.qrCodeContainer}>
                <Text style={styles.header}>Generate QR Code</Text>

                {isQRActive && (
                    <QRCode
                        value={qrvalue}
                        size={256}
                        color="black"
                        backgroundColor="white"
                        logo={{ uri: 'https://semana.mat.uson.mx/~cursotacc/a219211930/prueba/TreeIcon.png' }}
                        logoSize={30}
                        logoBackgroundColor="transparent"
                        getRef={(c) => (qrRef.current = c)}
                    />
                )}

                {isQRActive && (
                    <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={saveQRCode}>
                        <Text style={styles.buttonText}>Guardar QR</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.button} onPress={onClose}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    qrCodeContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1c99cb',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
