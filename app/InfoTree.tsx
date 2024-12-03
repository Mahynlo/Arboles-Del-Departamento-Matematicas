// import React from "react";
// import { Image, StyleSheet, Platform, TouchableOpacity, Pressable, Button, Text } from 'react-native';
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { Link, useLocalSearchParams } from 'expo-router'; // Cambiado a useSearchParams
// import { QRgenerador } from "@/components/arbol/QRgenerador";

// interface TreeData {
//     id_arbol?: number;
//     nombre?: string;
//     nombre_cientifico?: string;
//     tipo_sitio?: string;
//     dendometria?: string;
//     estado_salud?: string;
//     conflictos?: string;
//     riesgo?: string;
//     comentarios?: string;
//     latitud?: number;
//     longitud?: number;
// }

// export default function InformacionTree() {
//     const localSearchParams = useLocalSearchParams();
//     const tree = localSearchParams.tree; // Extrae el parámetro 'tree'


//     const treeData: TreeData = tree ? JSON.parse(tree as string) : {};
//     const qrValue = `ARDEMA=${encodeURIComponent(JSON.stringify(treeData))}`

//     const [isVisible, setIsVisible] = React.useState(false);

//     const handleOpenQR = () => setIsVisible(true);
//     const handleCloseMap = () => setIsVisible(false);

//     return (
//         <ParallaxScrollView
//             headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//             headerImage={
//                 <Image
//                     source={require('@/assets/images/Arbol_de_prueba.jpg')}
//                     style={styles.reactLogo}
//                 />
//             }>
//             <ThemedView style={styles.titleContainer}>
//                 <ThemedText type="title">Árbol {treeData?.nombre || 'desconocido'}</ThemedText>
//                 <HelloWave />
//             </ThemedView>
//             {/* Botón para abrir regresar al Mapa */}
//             {Platform.OS === "web" ? (
//                 <TouchableOpacity style={styles.animatedButton}>
//                 <Link href={"/"}>
//                     <Text style={styles.link}>Regresar al Mapa</Text>
//                 </Link>
//             </TouchableOpacity>
//             ) : (
//                 <TouchableOpacity style={styles.animatedButton}>
//                 <Link href={"/mapa"}>
//                     <Text style={styles.link}>Regresar al Mapa</Text>
//                 </Link>
//             </TouchableOpacity>
//             )}


//             <ThemedView style={styles.stepContainer}>
//                 <Button title="Generar QR" onPress={handleOpenQR} />
//                 {isVisible && (
//                     <QRgenerador
//                         qrvalue={qrValue}
//                         isVisible={isVisible}
//                         onQRImpresion={(qrValue) => console.log(qrValue)}
//                         onClose={handleCloseMap}
//                     />
//                 )}
//             </ThemedView>

//             <ThemedView style={styles.stepContainer}>
//                 <ThemedText type="subtitle">Información General</ThemedText>

//                 <ThemedText>
//                     <ThemedText type="defaultSemiBold">Nombre Científico:</ThemedText> {treeData?.nombre_cientifico || 'Desconocido'}
//                 </ThemedText>
//                 <ThemedText>
//                     <ThemedText type="defaultSemiBold">Tipo de Sitio:</ThemedText> {treeData?.tipo_sitio || 'Desconocido'}
//                 </ThemedText>
//                 <ThemedText>
//                     <ThemedText type="defaultSemiBold">Dendometría:</ThemedText> {treeData?.dendometria || 'Desconocido'}
//                 </ThemedText>
//                 <ThemedText>
//                     <ThemedText type="defaultSemiBold">Estado de Salud:</ThemedText> {treeData?.estado_salud || 'Desconocido'}
//                 </ThemedText>
//                 <ThemedText>
//                     <ThemedText type="defaultSemiBold">Conflictos:</ThemedText> {treeData?.conflictos || 'Desconocido'}
//                 </ThemedText>
//                 <ThemedText>
//                     <ThemedText type="defaultSemiBold">Riesgo:</ThemedText> {treeData?.riesgo || 'Desconocido'}
//                 </ThemedText>
//                 <ThemedText>
//                     <ThemedText type="defaultSemiBold">Comentarios:</ThemedText> {treeData?.comentarios || 'Desconocido'}
//                 </ThemedText>
//                 <ThemedText type="subtitle">Galeria</ThemedText>
//                 <ThemedText type="subtitle">Opciones</ThemedText>
//             </ThemedView>
//         </ParallaxScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     titleContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//     },
//     stepContainer: {
//         gap: 8,
//         marginBottom: 8,
//     },
//     reactLogo: {
//         height: 280,
//         width: '100%',
//         resizeMode: 'cover',
//     },
//     button: {
//         fontSize: 40,
//         textDecorationLine: 'underline',
//         backgroundColor: '#1e90ff',
//         padding: 10,
//         borderRadius: 10,
//     },
//     link: {
//         color: '#fff',
//         fontSize: 16,
//         textDecorationLine: 'none',
//     },
//     animatedButton: { backgroundColor: '#1e90ff', padding: 10, borderRadius: 10, marginTop: 10 },
//     buttonText: { fontSize: 18, color: '#fff' },
// });
import React from "react";
import {
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Text,
    View,
    ScrollView,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useLocalSearchParams } from "expo-router";
import { QRgenerador } from "@/components/arbol/QRgenerador";

interface TreeData {
    id_arbol?: number;
    nombre?: string;
    nombre_cientifico?: string;
    tipo_sitio?: string;
    dendometria?: string;
    estado_salud?: string;
    conflictos?: string[];
    riesgo?: string[];
    comentarios?: string;
    latitud?: number;
    longitud?: number;
}

export default function InformacionTree() {
    const localSearchParams = useLocalSearchParams();
    const tree = localSearchParams.tree;

    const treeData: TreeData = tree ? JSON.parse(tree as string) : {};
    const qrValue = `ARDEMA=${encodeURIComponent(JSON.stringify(treeData))}`;

    const [isVisible, setIsVisible] = React.useState(false);

    const handleOpenQR = () => setIsVisible(true);
    const handleCloseMap = () => setIsVisible(false);

    // Format arrays for display with spaces
    const formatArray = (arr?: string[]) => (arr ? arr.join(", ") : "Desconocido");

    return (
        <ScrollView style={styles.pageContainer}>
            {/* Shorter Header Image */}
            <Image
                source={require("@/assets/images/Arbol_de_prueba.jpg")}
                style={styles.headerImage}
            />
            <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                    <ThemedText type="title" style={styles.title}>
                        Árbol {treeData?.nombre || "desconocido"}
                    </ThemedText>
                    <HelloWave />
                </View>
                {/* Tree Information Section */}
                <ThemedView style={styles.infoContainer}>
                    <ThemedText type="subtitle" style={styles.subtitle}>
                        Información General
                    </ThemedText>

                    <ThemedText style={styles.text}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Nombre Científico:
                        </ThemedText>{" "}
                        {treeData?.nombre_cientifico || "Desconocido"}
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Tipo de Sitio:
                        </ThemedText>{" "}
                        {treeData?.tipo_sitio || "Desconocido"}
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Dendometría:
                        </ThemedText>{" "}
                        {treeData?.dendometria || "Desconocido"}
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Estado de Salud:
                        </ThemedText>{" "}
                        {treeData?.estado_salud || "Desconocido"}
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Conflictos:
                        </ThemedText>{" "}
                        {formatArray(treeData?.conflictos)}
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Riesgo:
                        </ThemedText>{" "}
                        {formatArray(treeData?.riesgo)}
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        <ThemedText type="defaultSemiBold" style={styles.label}>
                            Comentarios:
                        </ThemedText>{" "}
                        {treeData?.comentarios || "Desconocido"}
                    </ThemedText>
                </ThemedView> 
                  {/* Generate QR Button */}
                <View style={styles.stepContainer}>
                    <TouchableOpacity style={styles.buttonSecondary} onPress={handleOpenQR}>
                        <Text style={styles.buttonText}>Generar QR</Text>
                    </TouchableOpacity>
                    {isVisible && (
                        <QRgenerador
                            qrvalue={qrValue}
                            isVisible={isVisible}
                            onQRImpresion={(qrValue) => console.log(qrValue)}
                            onClose={handleCloseMap}
                        />
                    )}
                </View>
                {/* Return to Map Button */}
                <TouchableOpacity style={styles.buttonPrimary}>
                    <Link href={Platform.OS === "web" ? "/" : "/mapa"}>
                        <Text style={styles.buttonText}>Regresar al Mapa</Text>
                    </Link>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    headerImage: {
        height: 180, // Shorter height for the header image
        width: "100%",
        resizeMode: "cover",
    },
    contentContainer: {
        padding: 15,
        backgroundColor: "#FFFFFF",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        color: "#000",
        fontSize: 24,
        fontWeight: "bold",
    },
    buttonPrimary: {
        backgroundColor: "#1E90FF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonSecondary: {
        backgroundColor: "#32CD32",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    stepContainer: {
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: "#F9F9F9",
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    subtitle: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    text: {
        color: "#000",
        fontSize: 16,
        marginBottom: 5,
    },
    label: {
        fontWeight: "bold", // Bold for property titles
        color: "#333", // Slightly darker text color for labels
    },
});
