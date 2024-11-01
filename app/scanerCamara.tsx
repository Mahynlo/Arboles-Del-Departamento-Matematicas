import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Alert, Platform } from 'react-native';

type Prop = {
  type: string;
  data: string;
};

export default function ScanerCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') return; // Evita solicitud de permisos en web
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Disculpe, necesitamos permisos de cámara para hacer esto');
      }
    })();
  }, []);

  // Maneja el escaneo del código QR
  const handleBarCodeScanned = ({ type, data }: Prop) => {
    setScanned(true);
    Alert.alert(
      `Código ${type} Scaneado`,
      `Datos: ${data}`,
      [
        {
          text: 'OK',
          onPress: () => setScanned(false),
        },
      ],
      { cancelable: false }
    );
  };

  if (Platform.OS === 'web') {
    // Mensaje de no disponible para la web
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>La cámara no está disponible en la versión web.</Text>
      </View>
    );
  }

  if (!permission?.granted) {
    // Permisos de cámara no concedidos
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Permiso de cámara no concedido.</Text>
        <Button title="Solicitar Permisos" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <CameraView
      style={styles.camera}
      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
    >
      <View style={styles.layerContainer}>
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  layerContainer: {
    flex: 1,
  },
  layerTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  layerCenter: {
    flexDirection: 'row',
  },
  layerLeft: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  focused: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
  },
  layerRight: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  layerBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});
