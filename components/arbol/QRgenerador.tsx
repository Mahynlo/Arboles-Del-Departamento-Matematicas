import QRCode from 'react-native-qrcode-svg';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface QRProps {
    isVisible: boolean; // Estado para mostrar u ocultar el modal
    qrvalue: string; // Valor del QR
    onQRImpresion: (qrValue: string) => void; // Función para enviar el valor del QR al componente principal
    onClose: () => void; // Función para cerrar el modal
}

export const QRgenerador = ({ isVisible, qrvalue, onQRImpresion, onClose }: QRProps) => {
    const qrRef = useRef<any>(null);
    const [isQRActive, setIsQRActive] = useState(false); // Estado para controlar si el QR está activo o no

    useEffect(() => {
        if (qrvalue) {
            setIsQRActive(true); // Si qrvalue tiene un valor, activamos el QR
        }
    }, [qrvalue]); // Se ejecutará cada vez que el qrvalue cambie

    const saveQRCode = async () => {
        if (qrRef.current) {
            qrRef.current.toDataURL(async (data: string) => {
                const filePath = `${FileSystem.documentDirectory}tree_qr_code.png`; // Usamos documentDirectory para acceso más directo

                try {
                    // Aseguramos que los datos de la imagen se escriben correctamente
                    await FileSystem.writeAsStringAsync(filePath, data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Error', 'Permission to access media library is required.');
                        return;
                    }

                    const asset = await MediaLibrary.createAssetAsync(filePath);
                    await MediaLibrary.createAlbumAsync('TreeQRCode', asset, false); // Guardamos en un álbum

                    Alert.alert('Success', 'QR Code saved to gallery!');
                    onClose(); // Cerramos el modal
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

                {/* El QR se genera automáticamente con el valor pasado como prop */}
                {isQRActive && (
                    <QRCode
                        value={qrvalue} // Usamos el valor que pasas como prop
                        size={256}
                        color="black"
                        backgroundColor="white"
                        logo={{ uri: '../../assets/images/TreeIcon.png' }}
                        logoSize={30}
                        logoBackgroundColor='transparent'
                        getRef={(c) => (qrRef.current = c)}
                    />
                )}

                {/* Botón para guardar el QR */}
                {isQRActive && (
                    <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={saveQRCode}>
                        <Text style={styles.buttonText}>Guardar QR</Text>
                    </TouchableOpacity>
                )}

                {/* Botón para cerrar el modal */}
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