import React, { useState } from 'react';
import { View, Button, Text, Image } from 'react-native';
import { ScannerCamera } from "@/components/fotos/CapturarImagen";

const ParentScreen = () => {
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
    </View>
  );
};


export default ParentScreen;


