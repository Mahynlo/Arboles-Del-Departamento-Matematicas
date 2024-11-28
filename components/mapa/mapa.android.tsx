import React from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { Link } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import GalleryTree from "../arbol/GalleryTree";
import { BottomSheet } from '@rneui/themed';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';
 

  const markers = [
    { id: 1, coordinates: { latitude: 29.0807, longitude: -110.9609 }, title: "Árbol Del departamento", description: "Descripción del Árbol 1" },
    { id: 2, coordinates: { latitude: 29.080637, longitude: -110.960714 }, title: "Árbol 2", description: "Descripción del Árbol 2" },
    { id: 3, coordinates: { latitude: 29.080620, longitude: -110.960795 }, title: "Árbol 3", description: "Descripción del Árbol 3" },
    { id: 4, coordinates: { latitude: 29.0808, longitude: -110.9609 }, title: "Árbol 4", description: "Descripción del Árbol 4" },
  ];

export default function MapaScreen() {
  const [origin, setOrigin] = React.useState({
    latitude: 29.083197,
    longitude: -110.964019,
  });
  const [destination, setDestination] = React.useState({
    latitude: 29.080698,
    longitude: -110.960745,
  });
  const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);
  const [selectedMarker, setSelectedMarker] = React.useState<string | null>(null);
  const mapRef = React.useRef<MapView>(null);

  const Initial_Region = {
    latitude: origin.latitude,
    longitude: origin.longitude,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  };

  React.useEffect(() => {
    getLocalitationPermission();
  }, []);

  async function getLocalitationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso denegado');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setOrigin(current);
  }

  const handleMarkerPress = (marker: string) => {
    setSelectedMarker(marker);
    setIsBottomSheetVisible(true); // Abre el BottomSheet
  };

  const handleCloseInfo = () => {
    setIsBottomSheetVisible(false); // Cierra el BottomSheet
    setSelectedMarker(null);
  };

  const handleLocatePress = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso denegado');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setOrigin(current);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...current,
        latitudeDelta: 0.05,
        longitudeDelta: 0.04,
      }, 800);
    }
  };

  const MapScreen = () => {
    // Marcadores estáticos (opcionalmente puedes eliminarlos si los tomas directamente de la base de datos)
    const [trees, setTrees] = useState([]); // Estado para almacenar los árboles con sus coordenadas
  
    useEffect(() => {
      const fetchTrees = async () => {
        try {
          const { data, error } = await supabase
            .from('arbol')
            .select('id, nombre, latitud, longitud'); // Obtén los datos que necesitas, incluyendo coordenadas
  
          if (error) {
            throw error;
          }
  
          setTrees(data); // Guarda los árboles en el estado
        } catch (error) {
          Alert.alert('Error', 'No se pudieron cargar los árboles.');
          console.log(error);
        }
      };
      console.log(trees);
  
      fetchTrees(); // Llama a la función para obtener los datos cuando el componente se monte
    }, []); // Solo se ejecuta una vez cuando el componente se monta
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={Initial_Region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
      >

        {/* Muestra los marcadores obtenidos de Supabase */}
        {trees.map((tree) => (
          <Marker
            key={tree.id}
            coordinate={{ latitude: tree.latitud, longitude: tree.longitud }}
            title={tree.nombre}
            description={`ID: ${tree.id}`} // Puedes agregar más detalles si lo deseas
          />
        ))}

        {/* Marcadores originales */}
        <Marker
          draggable
          coordinate={origin}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
          title="Origen"
          description="Aquí estoy."
          onPress={() => handleMarkerPress('Origen')}
        >
          <Image
            source={require('@/assets/images/TreeIcon.png')}
            style={styles.markerImage}
          />
        </Marker>

        <Marker
          draggable
          coordinate={destination}
          onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
          title="Destino"
          description="Aquí es donde quiero ir."
          onPress={() => handleMarkerPress('Destino')}
        >
          <Image
            source={require('@/assets/images/TreeIcon.png')}
            style={styles.markerImage}
          />
        </Marker>

        <Polygon
          coordinates={[origin, destination]}
          strokeColor="green"
          strokeWidth={2}
        />
      </MapView>

      {/* Botones flotantes */}
      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.locateButton} onPress={handleLocatePress}>
          <Text style={styles.buttonText}>
            <TabBarIcon name="locate" color="#fff" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.alertButton}>
          <Link href="/TreeRegistration">
            <Text style={styles.buttonText}>
              <TabBarIcon name="leaf" color="#fff" />
            </Text>
          </Link>
        </TouchableOpacity>
      </View>
        

      {/* BottomSheet para información */}
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onBackdropPress={handleCloseInfo}
        scrollViewProps={{ showsVerticalScrollIndicator: true }} // Muestra la barra de scroll vertical
      >
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{selectedMarker} seleccionado 🌳</Text>
          <Text> <TabBarIcon name="information-circle-outline" color="black" /> </Text>
          <ThemedView style={styles.buttonGridContainer}>
            {/* Botón para Información del árbol */}
            <TouchableOpacity style={styles.animatedButton}>
              <Link href="/InfoTree">
                <Text style={styles.buttonText}>Info</Text>
              </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.animatedButtonclose} onPress={handleCloseInfo}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </ThemedView>

          <Text>Latitud: {origin.latitude}</Text>
          <Text>Longitud: {origin.longitude}</Text>
          <Text>Imágenes del Árbol</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  locateButton: {
    backgroundColor: '#42a5f5',
    borderRadius: 50,
    padding: 10,
    marginBottom: 10,
  },
  animatedButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  animatedButtonclose: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  alertButton: {
    backgroundColor: '#1abb3a',
    borderRadius: 50,
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 12,
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    width: "98%",
  },
  infoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  buttonGridContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 5,
    gap: 10,
  },
  returnBoton: {
    backgroundColor: '#1abb3a',
    borderRadius: 50,
  },

});



