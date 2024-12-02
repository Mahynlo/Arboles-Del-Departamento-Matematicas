import { Camera,CameraView,useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert, Modal, Platform } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { supabase } from "../../lib/supabase";
import { Buffer } from 'buffer';

interface ScannerCameraProps {
  isVisible: boolean;
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export const savePicture = async (uri:string, treeId:number) => {
  if (!uri) {
    Alert.alert('Error', 'No se proporcionó una URI válida.');
    return;
  }

  try {
    // Solicitar permisos
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'No se tienen permisos para guardar en la galería.');
      return;
    }

    // Guardar en la galería
    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync('CameraExpo');
    if (!album) {
      await MediaLibrary.createAlbumAsync('CameraExpo', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    Alert.alert('Éxito', 'Imagen guardada en la galería.');

    // Subir a Supabase Storage
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('No se pudo obtener la imagen desde la URI.');
      }

      const blob = await response.blob();

      // Usar FileReader para convertir el blob a ArrayBuffer
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(blob);
      });

      // Crear una carpeta con el ID del árbol como nombre
      const fileName = `public/${treeId}/${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from('arboles_del_departamento')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading image: ', error);
        Alert.alert('Error', 'No se pudo subir la imagen a Supabase.');
      } else {
        Alert.alert('Éxito', 'Imagen subida a Supabase correctamente.');
      }
    } catch (uploadError) {
      console.error('Error al subir la imagen a Supabase:', uploadError);
      Alert.alert('Error', 'Ocurrió un error al subir la imagen a Supabase.');
    }
  } catch (error) {
    console.error('Error general:', error);
    Alert.alert('Error', 'No se pudo guardar la imagen.');
  }
};

export const ScannerCamera = ({ isVisible, onCapture, onClose }: ScannerCameraProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
      return photo.uri;
      //console.log("photo", photo);
    }else{
      return null;
    }
  };
  
  
  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        {capturedPhoto ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
            <View style={styles.previewButtonContainer}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => {
                  //savePicture(capturedPhoto);
                  onCapture(capturedPhoto); // Devuelve la imagen capturada
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>
                  <TabBarIcon name="save" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => setCapturedPhoto(null)}
              >
                <Text style={styles.buttonText}>
                  <TabBarIcon name="close-sharp" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView style={styles.camera} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.roundButton} onPress={takePicture}>
                <Text style={styles.buttonText}>
                  <TabBarIcon name="camera" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundButton} onPress={onClose}>
                <Text style={styles.buttonText}>
                  <TabBarIcon name="close" />
                </Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  roundButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  previewButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});