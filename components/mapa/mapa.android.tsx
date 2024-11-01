import * as React from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { Link } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

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
  const [infoPosition] = React.useState(new Animated.Value(1));
  const [buttonsPosition] = React.useState(new Animated.Value(0));
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

  async function getLocalitationPermission() { // Función para obtener la ubicación
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { // Si no se otorga el permiso entonces
      alert('Permiso denegado');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = { // Crea un objeto con la ubicación actual
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setOrigin(current);
  }

  const handleMarkerPress = (marker: string) => { // Función para mostrar la información
    setSelectedMarker(marker);
    setShowInfo(true);
    Animated.timing(buttonsPosition, { // Anima los botones hacia abajo
      toValue: -100,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(infoPosition, { // Anima la información hacia arriba
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleCloseInfo = () => { // Función para cerrar la información
    Animated.timing(infoPosition, { // Anima la información hacia abajo
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => { // Cuando termine la animación entonces
      setShowInfo(false); // Oculta la información
      setSelectedMarker(null); // Quita el marcador seleccionado
      infoPosition.setValue(1); // Reinicia la posición de la información

      Animated.timing(buttonsPosition, { // Anima los botones hacia arriba
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  };

  const handleLocatePress = async () => {// Función para localizar el usuario
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso denegado');
      return;
    }

    const location = await Location.getCurrentPositionAsync({}); // Obtiene la ubicación actual
    const current = { // Crea un objeto con la ubicación actual
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setOrigin(current); // Actualiza el origen
    if (mapRef.current) { // Si el mapa existe entonces
      mapRef.current.animateToRegion({ // Anima el mapa a la ubicación actual
        ...current, // Con la ubicación actual
        latitudeDelta: 0.05,
        longitudeDelta: 0.04,
      }, 800);
    }
  };

  const infoTranslateY = infoPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 100],
  });

  const buttonsTranslateY = buttonsPosition.interpolate({
    inputRange: [-100, 0],
    outputRange: [-180, 0],
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        let newPosition = Math.max(0, 1 - gestureState.dy / 200);
        infoPosition.setValue(newPosition);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          handleCloseInfo();
        } else {
          Animated.spring(infoPosition, {
            toValue: 1,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Agrega la referencia aquí
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
        />
        <Marker
          draggable
          coordinate={destination}
          onDragEnd={(direction) => setDestination(direction.nativeEvent.coordinate)}
          title="Destino"
          description="Aquí es donde quiero ir."
          onPress={() => handleMarkerPress('Destino')}
        />
        <Polygon
          coordinates={[origin, destination]}
          strokeColor="green"
          strokeWidth={2}
        />
      </MapView>

      <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: buttonsTranslateY }] }]}>
        <TouchableOpacity style={styles.locateButton} onPress={handleLocatePress}>
          <Text style={styles.buttonText}>
            <TabBarIcon name="locate" color="#fff" />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.alertButton}>
          <Link href="/">
            <Text style={styles.buttonText}>
              <TabBarIcon name="add" color="#fff" />
            </Text>
          </Link>
        </TouchableOpacity>
      </Animated.View>

      {showInfo && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.infoContainer, { transform: [{ translateY: infoTranslateY }] }]}
        >
          <Text style={styles.infoText}>{selectedMarker} seleccionado 🌳</Text>
          <TouchableOpacity onPress={handleCloseInfo}>
            <TouchableOpacity style={styles.animatedButton} onPress={handleLocatePress}>
              <Link href="/">
                <Text style={styles.buttonText}>Info</Text>
              </Link>
            </TouchableOpacity>
            <Text style={styles.closeButton}>Cerrar</Text>
          </TouchableOpacity>
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
  locateButton: {
    bottom: -60,
    left: 150,
    backgroundColor: '#dfca8e',
    padding: 10,
    borderRadius: 60,
  },
  animatedButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 10,
  },
  alertButton: {
    bottom: 70,
    left: 150,
    backgroundColor: '#1c99cb',
    padding: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    width: '95%',
    height: 300,
    alignItems: 'center',
  },
  infoText: {
    color: '#000',
  },
  closeButton: {
    color: '#1e90ff',
    marginTop: 5,
  },
});
