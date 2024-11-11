import * as React from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet, TouchableOpacity, Animated, PanResponder, Image } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { Link } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import GalleryTree from "../arbol/GalleryTree";

export default function MapaScreen() {
  const [origin, setOrigin] = React.useState({
    latitude: 29.083197,
    longitude: -110.964019,
  });

  const [destination, setDestination] = React.useState({
    latitude: 29.080698,
    longitude: -110.960745,
  });

  const [showInfo, setShowInfo] = React.useState(false);
  const [infoPosition] = React.useState(new Animated.Value(0)); // Controla la posición de la vista de información (0 = cerrada, 0.5 = intermedia, 1 = abierta)
  const [buttonsPosition] = React.useState(new Animated.Value(0)); // Controla la posición de los botones
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
    setShowInfo(true);
  
    // Animación de los botones para ocultarlos
    Animated.timing(buttonsPosition, {
      toValue: -100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  
    // Animación suave para mostrar la vista de información en su posición intermedia
    Animated.spring(infoPosition, {
      toValue: 0.5, // Posición intermedia
      friction: 18, // Controla la velocidad y suavidad
      tension: 40, // Controla la aceleración inicial
      useNativeDriver: false,
    }).start();
  };

  const handleCloseInfo = () => {
    Animated.timing(infoPosition, {
      toValue: 0, // Se cierra la vista de información (posición cerrada)
      duration: 800,
      useNativeDriver: false,
    }).start(() => {
      setShowInfo(false);
      setSelectedMarker(null);
      infoPosition.setValue(0); // Restablece el valor de la animación
      Animated.timing(buttonsPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
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

  // Animación para mover la vista de la información de acuerdo al deslizamiento
  const infoTranslateY = infoPosition.interpolate({
    inputRange: [0.5, 1, 1], // Cerrada (0), Intermedia (0.5), Abierta (1)
    outputRange: [700, 100, 100], // Posición 300px abajo (cerrada), 100px (intermedia), 0px (abierta)
  });

  const buttonsTranslateY = buttonsPosition.interpolate({
    inputRange: [-400, 0], // Posición inicial de los botones
    outputRange: [-50, 0], // Posición inicial de los botones
  });

  // Configuración de PanResponder para el deslizamiento
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy !== 0,// Se activa cuando se desliza verticalmente
      onPanResponderMove: (_, gestureState) => {
        let newPosition = Math.max(0, Math.min(1, (infoPosition._value - gestureState.dy / 500))); // Ajuste suave entre 0 y 1
        infoPosition.setValue(newPosition);
      },
      onPanResponderRelease: (_, gestureState) => {
        //a medida que se desliza se abre y se cierra la vista de información
        if (gestureState.dy > 100) { // Deslizar hacia abajo más de 100px cierra la vista (de posición intermedia o abierta)
          if (infoPosition._value > 0.5) {
            handleCloseInfo(); // Si está en posición abierta o intermedia, se cierra
          }
        } else if (gestureState.dy < -200) { // Deslizar hacia arriba más de 100px abre la vista completamente
          Animated.spring(infoPosition, {
            toValue: 1, // Expande la vista de información a su posición abierta
            friction: 500, // Controla la velocidad y suavidad
            tension: 50, // Controla la aceleración inicial
            useNativeDriver: false, // No se puede usar con Animated.spring
          }).start();
        } else { // Regresa a su posición intermedia si está cerca de esa posición
          Animated.spring(infoPosition, {
            toValue: 0.5, // me da la posición intermedia
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

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
      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonsTranslateY }] }]}>
        <TouchableOpacity style={styles.locateButton} onPress={handleLocatePress}>
          <Text style={styles.buttonText}>
            <TabBarIcon name="locate" color="#fff" />
          </Text>
        </TouchableOpacity>
        {/* Botón para registrar un nuevo árbol */}
        <TouchableOpacity style={styles.alertButton}>
          <Link href="/TreeRegistration">
            <Text style={styles.buttonText}>
              <TabBarIcon name="leaf" color="#fff" />
            </Text>
          </Link>
        </TouchableOpacity>
      </Animated.View>

      {/* Vista de información */}
      {showInfo && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.infoContainer, { transform: [{ translateY: infoTranslateY }] }]}
        >
          <Text style={styles.infoText}>{selectedMarker} seleccionado 🌳</Text>
          <Text> <TabBarIcon name="information-circle-outline" color="black" /> </Text>
      
          <TouchableOpacity onPress={handleCloseInfo}>
            {/* Botón para Informacion de arbol */}
            <TouchableOpacity style={styles.animatedButton} onPress={handleLocatePress}>
              <Link href="/InfoTree">
                <Text style={styles.buttonText}>Info</Text>
              </Link>
            </TouchableOpacity>
            {/* Botón para cerrar la vista de información */}
            <TouchableOpacity style={styles.animatedButtonclose} onPress={handleCloseInfo}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
            
            <Text>Latitud: {origin.latitude}</Text>
            <Text>Longitud: {origin.longitude}</Text>
          </TouchableOpacity>
          <Text>Imagenes del Árbol</Text>
          <GalleryTree />
        </Animated.View>
      )}
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
    marginTop : 10,
  },
  animatedButtonclose: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 10,
    marginTop : 10,
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
    position: 'absolute',
    bottom: 100,
    width: '98%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
    height: 700,
    maxWidth: 400,
  },
  infoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    color: '#fff',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  reactLogo: {
    width: 300,
    height: 300,
  },
  markerImage: {
    width: 30,
    height: 30,
  },
});

