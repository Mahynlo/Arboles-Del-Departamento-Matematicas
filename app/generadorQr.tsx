import React, { useState,useRef } from 'react'; 
import { View, Text, TextInput, TouchableOpacity,Image, StyleSheet,Alert } from 'react-native'; 
import QRCode from 'react-native-qrcode-svg'; 
import * as FileSystem from 'expo-file-system'; // Importa FileSystem de expo
import * as MediaLibrary from 'expo-media-library';


export default function QRCodeGenerator() { 
    const [qrValue, setQRValue] = useState(''); 
    const [isActive, setIsActive] = useState(false); 
    
    const qrRef = useRef<any>(null); 

    const generateQRCode = () => { 
        if (!qrValue) return; 

        setIsActive(true); 
    }; 

    const handleInputChange = (text: React.SetStateAction<string>) => { 
        setQRValue(text); 

        if (!text) { 
            setIsActive(false); 
        } 
    }; 

    const saveQRCode = async () => {
        if (qrRef.current) {
          // Obtener el QR en formato base64
          qrRef.current.toDataURL(async (data: string) => {
            // Crear un archivo temporal en el almacenamiento interno de la aplicación
            const filePath = `${FileSystem.cacheDirectory}qr_code.png`;
    
            try {
              // Guardar la imagen base64 en un archivo
              await FileSystem.writeAsStringAsync(filePath, data, {
                encoding: FileSystem.EncodingType.Base64,
              });
    
              // Pedir permiso para acceder a la galería
              const { status } = await MediaLibrary.requestPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Error', 'Permission to access media library is required.');
                return;
              }
    
              // Guardar el archivo en la galería
              const asset = await MediaLibrary.createAssetAsync(filePath);
              await MediaLibrary.createAlbumAsync('QRCode', asset, false);
    
              Alert.alert('Success', 'QR Code saved to gallery!');
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Failed to save QR Code.');
            }
          });
        }
      };

    return ( 
        <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>QR Code Generator</Text>
        <Text style={styles.description}>
          Paste a URL or enter text to create a QR code
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter text or URL"
          value={qrValue}
          onChangeText={handleInputChange}
        />
        <TouchableOpacity style={styles.button} onPress={generateQRCode}>
          <Text style={styles.buttonText}>Generate QR Code</Text>
        </TouchableOpacity>

        {isActive && (
          <View style={styles.qrCode}>
            <QRCode
              value={qrValue}
              size={256}
              color="black"
              backgroundColor="white"
              getRef={(c) => (qrRef.current = c)}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={saveQRCode}
            >
              <Text style={styles.buttonText}>Save QR Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
} 

const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#eee', 
    }, 
    wrapper: { 
        maxWidth: 400, 
        backgroundColor: '#fff', 
        borderRadius: 7, 
        padding: 20, 
        shadowColor: 'rgba(0, 0, 0, 0.1)', 
        shadowOffset: { width: 0, height: 10 }, 
        shadowOpacity: 1, 
        shadowRadius: 30, 
    }, 
    title: { 
        fontSize: 21, 
        fontWeight: '500', 
        marginBottom: 10, 
    }, 
    description: { 
        color: '#575757', 
        fontSize: 16, 
        marginBottom: 20, 
    }, 
    input: { 
        fontSize: 18, 
        padding: 17, 
        borderWidth: 1, 
        borderColor: '#999', 
        borderRadius: 5, 
        marginBottom: 20, 
    }, 
    button: { 
        backgroundColor: '#3498DB', 
        borderRadius: 5, 
        padding: 15, 
        alignItems: 'center', 
    }, 
    buttonText: { 
        color: '#fff', 
        fontSize: 18, 
    }, 
    qrCode: { 
        marginTop: 30, 
        alignItems: 'center', 
    }, 
});