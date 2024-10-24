import { CameraView, useCameraPermissions, Camera} from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View ,Alert,TouchableOpacity } from 'react-native';

type Prop = {
  type: string;
  data: string;
};

export default function ScanerCameraScreen() {
  const [permission,requestPermission] = useCameraPermissions();
  const [scanned,setScanned] = useState(false);

  useEffect(()=>{
    (async()=>{
      const {status} = await Camera.requestCameraPermissionsAsync()

      if(status  !== 'granted'){
        alert('Disculpe, necesitamos permisos de cámara para hacer esto');
      }

    })()
  },[])

  // se encarga de manejar el escaneo del código de qr
  const handleBarCodeScanned = ({ type, data }: Prop) => {
      setScanned(true);
      Alert.alert(
        `Código ${type} Scaneado`, 
        `Dados: ${data}`,      
        [
          {
            text: 'OK',      
            onPress: () => setScanned(false),  
          }
        ],
        { cancelable: false } 
      );
  };

  
  if (!permission?.granted) {
    // Camera permissions are still loading or denied.
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Permiso de camara no concedido.</Text>
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
  resultContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#00FF00',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});