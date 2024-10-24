import * as React from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { Link } from 'expo-router';

export default function MapaScreen() {


  const [origin, setOrigin] = React.useState({
    latitude: 29.083197,
    longitude: -110.964019,
  });

  const [destination, setdestination] = React.useState({
    latitude: 29.080698,
    longitude: -110.960745,
  });

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
      longitude: location.coords.longitude
    };
    setOrigin(current);
  }

  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        initialRegion={Initial_Region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          draggable
          coordinate={origin}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
          title='Origen'
          description='Aqui estoy.'
        />
        <Marker
          draggable
          coordinate={destination}
          onDragEnd={(direction) => setdestination(direction.nativeEvent.coordinate)}
          title='Destino'
          description='Aqui es donde quiero ir.'
        />
        <Polygon
          coordinates={[origin, destination]}
          strokeColor="green"
          strokeWidth={2}
        />
      </MapView>
      {/* Botón de localizar */}
      <TouchableOpacity style={styles.locateButton} onPress={getLocalitationPermission}>
        <Text style={styles.buttonText}>Localizar</Text>
      </TouchableOpacity>


      {/* Botón para ir al registro */}
      <TouchableOpacity style={styles.alertButton}>
        <Link href="/TreeRegistration">
          <Text style={styles.buttonText}>Registro</Text>
        </Link>
      </TouchableOpacity>

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
  text: {
    color: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locateButton: {
    position: 'absolute',
    bottom: 50, // Esto lo posiciona en la parte inferior de la pantalla
    right: 20,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 50,
  },
  alertButton: {
    position: 'absolute',
    bottom: 50, // Esto lo posiciona en la parte inferior de la pantalla
    left: 20,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
