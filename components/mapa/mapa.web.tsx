// import React, { useEffect, useState } from "react";
// import { Platform, View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { Link, useRouter } from 'expo-router';
// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import Constants from "expo-constants";
// import GalleryTree from "../arbol/GalleryTree";
// const Mapbox = Platform.OS === "web" ? require("mapbox-gl") : null;
// const Token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

// if (Platform.OS === "web") {
//     Mapbox.accessToken = Token;
// }

// const markers = [
//     { id: 1, coordinates: [-110.9609, 29.0807], title: "Árbol 1", description: "Descripción del Árbol 1" },
//     { id: 2, coordinates: [-110.960714, 29.080637], title: "Árbol 2", description: "Descripción del Árbol 2" },
//     { id: 3, coordinates: [-110.960795, 29.080620], title: "Árbol 3", description: "Descripción del Árbol 3" },
//     { id: 4, coordinates: [-110.9609, 29.0808], title: "Árbol 4", description: "Descripción del Árbol 4" },
// ];

// export default function MapaScreen() {
//     const router = useRouter();
//     interface Tree {
//         id: number;
//         coordinates: number[];
//         title: string;
//         description: string;
//     }
    
//     const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
//     const [map, setMap] = useState<typeof Mapbox.Map | null>(null);

//     useEffect(() => {
//         if (Platform.OS === "web" && Mapbox) {
//             const mapInstance = new Mapbox.Map({
//                 container: "map",
//                 style: "mapbox://styles/mapbox/streets-v11",
//                 center: [-110.967847, 29.098678],
//                 zoom: 11,
//             });

//             markers.forEach(markerData => {
//                 const markerElement = document.createElement('div');
//                 markerElement.style.width = '32px';
//                 markerElement.style.height = '32px';
//                 markerElement.style.backgroundImage = 'url(./assets/images/TreeIcon.png)';
//                 markerElement.style.backgroundSize = 'cover';

//                 const marker = new Mapbox.Marker(markerElement)
//                     .setLngLat(markerData.coordinates)
//                     .setPopup(new Mapbox.Popup().setHTML(`
//                         <div>
//                             <h1>${markerData.title}</h1>
//                             <button id="navigateButton-${markerData.id}" style="padding:5px; margin-top:5px;">Ver Información</button>
//                         </div>
//                     `))
//                     .addTo(mapInstance);

//                 marker.getPopup().on('open', () => {
//                     setSelectedTree(markerData);
//                     setTimeout(() => {
//                         const navigateButton = document.getElementById(`navigateButton-${markerData.id}`);
//                         if (navigateButton) {
//                             navigateButton.addEventListener("click", () => {
//                                 router.push("/InfoTree");
//                             });
//                         }
//                     }, 0);
//                 });

//                 marker.getPopup().on('close', () => {
//                     setSelectedTree(null);
//                 });
//             });

//             setMap(mapInstance);

//             return () => {
//                 mapInstance.remove();
//             };
//         }
//     }, [router]);

//     const zoomIn = () => {
//         if (map) map.zoomIn();
//     };

//     const zoomOut = () => {
//         if (map) map.zoomOut();
//     };

//     return (
//         <View style={styles.container}>
//             <div id="map" style={styles.mapWeb} />

//             {selectedTree && (
//                 <View style={styles.infoPanel}>
//                     <Text style={styles.treeTitle}>{selectedTree.title}</Text>
//                     <Text style={styles.treeDescription}>{selectedTree.description}</Text>
//                     <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/InfoTree")}>
//                         <Text style={styles.infoButtonText}>Ir a InfoTree</Text>
//                     </TouchableOpacity>
//                     <Text>Latitud: {selectedTree.coordinates[1]}</Text>
//                     <Text>Longitud: {selectedTree.coordinates[0]}</Text>
//                     <Text>Imagenes del Arbol</Text>
//                     <GalleryTree /> 
//                 </View>
//             )}

//             <TouchableOpacity style={styles.addButton}>
//                 <Link href="/TreeRegistration">
//                     <TabBarIcon name="add" />
//                 </Link>
//             </TouchableOpacity>

//             <View style={styles.zoomContainer}>
//                 <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
//                     <Text style={styles.zoomText}>+</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
//                     <Text style={styles.zoomText}>-</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     mapWeb: {
//         width: "100%",
//         height: "100%",
//     },
//     infoPanel: {
//         position: 'absolute',
//         top: 10,
//         left: 5,
//         width: "30%",
//         height: "93%",
//         backgroundColor: '#fff',
//         padding: 15,
//         borderRadius: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 5,
//     },
//     treeTitle: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 5,
//     },
//     treeDescription: {
//         fontSize: 14,
//         color: '#555',
//         marginBottom: 10,
//     },
//     infoButton: {
//         backgroundColor: '#1c99cb',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     infoButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
//     addButton: {
//         position: 'absolute',
//         right: 20,
//         bottom: 30,
//         backgroundColor: '#1c99cb',
//         padding: 10,
//         borderRadius: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     zoomContainer: {
//         position: 'absolute',
//         right: 28,
//         top: 500,
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         borderRadius: 10,
//         overflow: 'hidden',
//     },
//     zoomButton: {
//         padding: 10,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     zoomText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     reactLogo: {
//         height: 280,
//         width: '100%',
//         resizeMode: 'cover',
//     },
// });

import React, { useEffect, useState } from "react";
import { Platform, View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, useRouter } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { supabase } from "../../lib/supabase";
import GalleryTree from "../arbol/GalleryTree";

const Mapbox = Platform.OS === "web" ? require("mapbox-gl") : null;
const Token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

if (Platform.OS === "web") {
    Mapbox.accessToken = Token;
}

interface Tree {
    id_arbol: number;
    nombre: string;
    nombre_cientifico: string;
    tipo_sitio: string;
    dendometria: string;
    estado_salud: string;
    conflictos: string;
    riesgo: string;
    comentarios: string;
    latitud: number;
    longitud: number;
}

export default function MapaScreen(): JSX.Element {
    const router = useRouter();
    const [trees, setTrees] = useState<Tree[]>([]);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
    const [map, setMap] = useState<typeof Mapbox.Map | null>(null);

    // Fetch tree data from Supabase
    const fetchTreeData = async () => {
        try {
            const { data, error } = await supabase
                .from("arbol")
                .select("*"); // Select all columns

            if (error) {
                console.error("Error fetching tree data:", error);
                return;
            }

            if (data) {
                const formattedData: Tree[] = data.map((tree: any) => ({
                    id_arbol: tree.id_arbol,
                    nombre: tree.nombre,
                    nombre_cientifico: tree.nombre_cientifico || "N/A",
                    tipo_sitio: tree.tipo_sitio || "N/A",
                    dendometria: tree.dendometria || "N/A",
                    estado_salud: tree.estado_salud || "N/A",
                    conflictos: tree.conflictos || "N/A",
                    riesgo: tree.riesgo || "N/A",
                    comentarios: tree.comentarios || "N/A",
                    latitud: tree.latitud,
                    longitud: tree.longitud,
                }));
                setTrees(formattedData);
                console.log("Fetched trees:", formattedData);
            }
        } catch (err) {
            console.error("Unexpected error fetching trees:", err);
        }
    };

    // Initialize the map
    const initializeMap = () => {
        if (Platform.OS === "web" && Mapbox) {
            const mapInstance = new Mapbox.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                center: [-110.967847, 29.098678],
                zoom: 11,
            });

            // Add markers dynamically based on fetched tree data
            trees.forEach((tree) => {
                const markerElement = document.createElement("div");
                markerElement.style.width = "32px";
                markerElement.style.height = "32px";
                markerElement.style.backgroundImage =
                    "url(https://semana.mat.uson.mx/~cursotacc/a219211930/prueba/TreeIcon.png)";
                markerElement.style.backgroundSize = "cover";

                const marker = new Mapbox.Marker(markerElement)
                    .setLngLat([tree.longitud, tree.latitud])
                    .setPopup(
                        new Mapbox.Popup().setHTML(`
                            <div>
                                <h1>${tree.nombre}</h1>
                                <button id="navigateButton-${tree.id_arbol}" style="padding:5px; margin-top:5px;">Ver Información</button>
                            </div>
                        `)
                    )
                    .addTo(mapInstance);

                marker.getPopup().on("open", () => {
                    setSelectedTree(tree);
                    setTimeout(() => {
                        const navigateButton = document.getElementById(`navigateButton-${tree.id_arbol}`);
                        if (navigateButton) {
                            navigateButton.addEventListener("click", () => {
                                router.push("/InfoTree");
                            });
                        }
                    }, 0);
                });

                marker.getPopup().on("close", () => {
                    setSelectedTree(null);
                });
            });

            setMap(mapInstance);

            return mapInstance;
        }
        return null;
    };

    // Handle component mount and unmount
    useEffect(() => {
        fetchTreeData(); // Fetch trees when component mounts
    }, []);

    useEffect(() => {
        if (trees.length > 0) {
            const mapInstance = initializeMap();
            return () => {
                if (mapInstance) mapInstance.remove(); // Clean up the map on unmount
            };
        }
    }, [trees]); // Reinitialize the map whenever trees data changes

    const zoomIn = () => {
        if (map) map.zoomIn();
    };

    const zoomOut = () => {
        if (map) map.zoomOut();
    };

    return (
        <View style={styles.container}>
            <div id="map" style={styles.mapWeb} />

            {selectedTree && (
                <View style={styles.infoPanel}>
                    <ScrollView>
                        <Text style={styles.treeTitle}>{selectedTree.nombre}</Text>
                        <Text style={styles.treeSubtitle}>Scientific Name: {selectedTree.nombre_cientifico}</Text>
                        <Text style={styles.treeDetail}>Site Type: {selectedTree.tipo_sitio}</Text>
                        <Text style={styles.treeDetail}>Dendometry: {selectedTree.dendometria}</Text>
                        <Text style={styles.treeDetail}>Health Status: {selectedTree.estado_salud}</Text>
                        <Text style={styles.treeDetail}>Conflicts: {selectedTree.conflictos}</Text>
                        <Text style={styles.treeDetail}>Risk: {selectedTree.riesgo}</Text>
                        <Text style={styles.treeDetail}>Comments: {selectedTree.comentarios}</Text>
                        <Text style={styles.treeDetail}>Latitude: {selectedTree.latitud}</Text>
                        <Text style={styles.treeDetail}>Longitude: {selectedTree.longitud}</Text>
                        <Text>Images of the Tree:</Text>
                        <GalleryTree />
                        <TouchableOpacity style={styles.infoButton} onPress={() => router.push("/InfoTree")}>
//                         <Text style={styles.infoButtonText}>Ir a InfoTree</Text>
//                     </TouchableOpacity>
                    </ScrollView>
                </View>
            )}

            <TouchableOpacity style={styles.addButton}>
                <Link href="/TreeRegistration">
                    <TabBarIcon name="add" />
                </Link>
            </TouchableOpacity>

            <View style={styles.zoomContainer}>
                <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>-</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapWeb: {
        width: "100%",
        height: "100%",
    },
    infoPanel: {
        position: "absolute",
        top: 10,
        left: 5,
        width: "30%",
        height: "90%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    treeTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    treeSubtitle: {
        fontSize: 18,
        color: "#555",
        marginBottom: 10,
    },
    treeDetail: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
    infoButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    infoButton: {
        backgroundColor: '#1c99cb',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButton: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#1c99cb",
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    zoomContainer: {
        position: "absolute",
        right: 28,
        top: 500,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
        overflow: "hidden",
    },
    zoomButton: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    zoomText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});