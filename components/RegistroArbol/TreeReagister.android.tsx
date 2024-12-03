import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { supabase } from "../../lib/supabase";
import { ThemedView } from "../ThemedView";
import {
  ScannerCamera,
  savePicture,
} from "../../components/fotos/CapturarImagen";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { TreeCordenandas } from "../TreeCordenandas";
import { RadioButton, Checkbox } from "react-native-paper";
import Slider from "@react-native-community/slider";
import RNPickerSelect from "react-native-picker-select";
// import CheckBox from "@react-native-community/checkbox";

export default function TreeRegister() {
  const [nombre, setTreeName] = useState("");
  const [nombre_cientifico, setScientific] = useState("");
  const [comentarios, setComentarios] = useState("");
  // const [tipo_sitio, setSite] = useState('');
  // const [dendometria, setDendometry] = useState('');
  // const [estado_salud, setHealth] = useState('');
  // const [conflictos, setIssues] = useState('');
  // const [riesgo, setRisk] = useState('');
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [isQRActive, setIsQRActive] = useState(false);
  const [tipo_sitio, setSite] = useState<string>("");
  const [dendometria, setDendometry] = useState<number>(0);
  const [estado_salud, setHealth] = useState<string>("");
  const [conflictos, setConflicts] = useState<string[]>([]);
  const [riesgo, setRisk] = useState<string[]>([]);

  // para captura de la imagen
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  //cpmopnetente de ubicacion
  const [mapVisible, setMapVisible] = useState(false);

  const tipoSitioOptions: string[] = [
    "borde carretero",
    "camellon central",
    "camellon lateral",
    "rotonda",
    "banqueta",
    "servidumbre",
    "parque publico",
    "jardin privado",
    "terreno de cultivo",
  ];
  const estadoSaludOptions: string[] = [
    "excelente",
    "buena",
    "regular",
    "mala",
    "pesima",
    "muerto",
  ];
  const conflictosOptions: string[] = [
    "Servicios eléctricos",
    "Construcciones",
    "Señalética urbana",
    "Semáforo o cámara",
    "Paso Vehicular",
    "Paso Peatonal",
    "Vegetación inferior",
    "Falta de ventilación",
    "Banquetas o pavimentos rotos",
    "Dentro de cisternas",
  ];
  const riesgoOptions: string[] = [
    "Ninguna condición visible",
    "Árbol inclinado",
    "Rama rota y colgante",
    "Rama sobresale de la copa",
    "Ramas secas, diámetro mayor a 10 cm",
    "Cavidades en ramas",
    "Desmoches con brotes (chupones)",
    "Cavidades en tronco",
    "Cavidades en corona de raíz",
    "Hongos visibles",
    "Cortes de raíces",
    "Exposición al viento directo",
  ];

  const handleCordenadas = (latitude: number, longitude: number) => {
    console.log("Ubicación seleccionada:", latitude, longitude);
    // Aquí puedes hacer lo que necesites con las coordenadas
    setLocation({ latitude, longitude });
  };

  const handleCloseMap = () => {
    setMapVisible(false);
  };

  const qrRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permisos de acseso a la ubicacion denegados.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      //setRegion({
      //    ...region,
      //    latitude: location.coords.latitude,
      //    longitude: location.coords.longitude,
      //});
    })();
  }, []);

  const generateQRCode = () => {
    if (!nombre) {
      Alert.alert("Error", "Por favor ingrese un nombre para el árbol.");
      return;
    }
    setIsQRActive(true);
  };

  const saveQRCode = async () => {
    if (qrRef.current) {
      qrRef.current.toDataURL(async (data: string) => {
        alert("Nombre");
        const filePath = `${FileSystem.cacheDirectory}tree_qr_code.png`; // Ruta de la imagen en la carpeta de caché del dispositivo

        try {
          await FileSystem.writeAsStringAsync(filePath, data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Error",
              "Permission to access media library is required."
            );
            return;
          }

          const asset = await MediaLibrary.createAssetAsync(filePath);
          await MediaLibrary.createAlbumAsync("TreeQRCode", asset, false); // Crea un álbum en la galería del dispositivo

          Alert.alert("Success", "QR Code saved to gallery!");
        } catch (error) {
          console.log(error);
          Alert.alert("Error", "Failed to save QR Code.");
        }
      });
    }
  };

  const toggleCheckbox = (
    option: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    state: string[]
  ) => {
    if (state.includes(option)) {
      setState(state.filter((item) => item !== option));
    } else {
      setState([...state, option]);
    }
  };

  const onMapPress = (e: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const saveTreeToSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("arbol")
        .insert({
          nombre,
          nombre_cientifico,
          tipo_sitio,
          dendometria,
          estado_salud,
          conflictos,
          riesgo,
          comentarios,
          latitud: location.latitude,
          longitud: location.longitude,
        })
        .select("id_arbol") // Recupera el ID generado
        .single(); // Asegura que devuelve un solo registro;

      if (error) {
        Alert.alert(
          "Error",
          "No se pudo registrar el árbol en la base de datos."
        );
        console.log(error);
        return null; // Devuelve null si hay un error
      }

      Alert.alert("Éxito", "Árbol registrado en la base de datos.");
      return data.id_arbol; // Retorna el ID del árbol
    } catch (error) {
      console.error("Error general:", error);
      return null;
    }
  };

  const saveTreeAndPicture = async () => {
    const treeId = await saveTreeToSupabase(); // Registrar el árbol y obtener el ID
    console.log(treeId);
    if (!treeId) {
      Alert.alert("Error", "No se pudo registrar el árbol.");
      return;
    }

    if (capturedImage) {
      // Guardar la imagen utilizando el ID del árbol
      await savePicture(capturedImage, treeId);
      console.log(treeId);
    } else {
      Alert.alert("Error", "No se ha capturado una imagen.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.subHeader}>
          <TabBarIcon name="caret-forward-sharp" />
          Preguntas Referentes al arbol
        </Text>
        <ThemedView style={styles.stepContainermap}>
          <Text>Nombre del arbol:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Árbol"
            value={nombre}
            onChangeText={setTreeName}
          />

          <Text>Nombre Científico:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre Científico"
            value={nombre_cientifico}
            onChangeText={setScientific}
          />

          <Text>Tipo De Sitio:</Text>
          <RNPickerSelect
            onValueChange={(value) => setSite(value)}
            items={tipoSitioOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            placeholder={{ label: "Selecciona un tipo de sitio", value: null }}
            value={tipo_sitio}
          />

          <Text>Dendrometría (m):</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={20}
            step={3}
            value={dendometria}
            onValueChange={(value: number) => setDendometry(value)}
          />
          <Text>{dendometria} m</Text>

          <Text>Estado De Salud:</Text>
          <RNPickerSelect
            onValueChange={(value) => setHealth(value)}
            items={estadoSaludOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            placeholder={{
              label: "Selecciona un estado de salud",
              value: null,
            }}
            value={estado_salud}
          />

          <Text>Conflictos:</Text>
          {conflictosOptions.map((option) => (
            <View key={option} style={styles.checkboxContainer}>
              <Checkbox
                status={conflictos.includes(option) ? "checked" : "unchecked"}
                onPress={() => toggleCheckbox(option, setConflicts, conflictos)}
              />
              <Text>{option}</Text>
            </View>
          ))}

          <Text>Riesgo:</Text>
          {riesgoOptions.map((option) => (
            <View key={option} style={styles.checkboxContainer}>
              <Checkbox
                status={riesgo.includes(option) ? "checked" : "unchecked"}
                onPress={() => toggleCheckbox(option, setRisk, riesgo)}
              />
              <Text>{option}</Text>
            </View>
          ))}

          <Text>Comentarios:</Text>
          <TextInput
            style={styles.input}
            placeholder="Comentarios"
            value={comentarios}
            onChangeText={setComentarios}
          />
        </ThemedView>
        {/* Para la captura de la imagen */}

        <Text style={styles.subHeader}>
          <TabBarIcon name="caret-forward-sharp" />
          Captura de imagen del arbol
        </Text>
        <ThemedView style={styles.stepContainermap}>
          <Button title="Abrir Cámara" onPress={() => setCameraVisible(true)} />

          <Text style={styles.mapLabel}>Imagen capturada:</Text>
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={{ width: 300, height: 300, marginLeft: 30 }}
            />
          )}
          <ScannerCamera
            isVisible={isCameraVisible}
            onCapture={(uri) => setCapturedImage(uri)}
            onClose={() => setCameraVisible(false)}
          />
        </ThemedView>
        {/* Para la ubicacion del arbol */}

        <Text style={styles.subHeader}>
          <TabBarIcon name="caret-forward-sharp" />
          Ubicacion del arbol
        </Text>
        <ThemedView style={styles.stepContainermap}>
          <Text style={styles.mapLabel}>
            Selecciona la Ubicacion del Arbol:
          </Text>
          <Button
            title="Seleccionar Ubicación"
            onPress={() => setMapVisible(true)}
          />
          <TreeCordenandas
            isVisible={mapVisible}
            onCordenadas={handleCordenadas}
            onClose={handleCloseMap}
          />
          <Text>Ubicacion del arbol:</Text>
          <Text>Latitud: {location.latitude}</Text>
          <Text>Longitud: {location.longitude}</Text>

          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            // draggable={false} // Deshabilitar arrastrar el mapa
            showsMyLocationButton={true} // Mostrar el botón para localizar la ubicación
            showsUserLocation={false} // Deshabilitar mostrar la ubicación del usuario
            onPress={() => {}}
          >
            <Marker coordinate={location}>
              <Image
                source={require("@/assets/images/TreeIcon.png")}
                style={styles.markerImage}
              />
            </Marker>
          </MapView>
        </ThemedView>

        <ThemedView style={styles.stepContainerButton}>
          <TouchableOpacity style={styles.button} onPress={generateQRCode}>
            <Text style={styles.buttonText}>Generate QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={saveTreeAndPicture} style={styles.button}>
            <Text style={styles.button}>Guardar Árbol e Imagen</Text>
          </TouchableOpacity>
        </ThemedView>

        {isQRActive && (
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={`Nombre: ${nombre}\nNombre Científico: ${nombre_cientifico}\nTipo de Sitio: ${tipo_sitio}\nDendrometría: ${dendometria}\nEstado de Salud: ${estado_salud}\nConflictos: ${conflictos}\nRiesgo: ${riesgo}\nUbicación: ${location.latitude}, ${location.longitude}`}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    fontSize: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 15,
  },
  mapLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  stepContainerButton: {
    gap: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  slider: {
    marginVertical: 15,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  qrCodeContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  markerImage: {
    width: 35,
    height: 35,
  },
  subHeader: {
    backgroundColor: "#25be10",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  stepContainermap: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
});
