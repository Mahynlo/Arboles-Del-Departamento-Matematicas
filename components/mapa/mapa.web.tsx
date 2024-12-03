// import React, { useEffect, useState } from "react";
// import { Platform, View, StyleSheet, TouchableOpacity, Text } from "react-native";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { Link, useRouter } from "expo-router";
// import { TabBarIcon } from "@/components/navigation/TabBarIcon";
// import { supabase } from "../../lib/supabase";
// import GalleryTree from "../arbol/GalleryTree";

// const Mapbox = Platform.OS === "web" ? require("mapbox-gl") : null;
// const Token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

// if (Platform.OS === "web") {
//     Mapbox.accessToken = Token;
// }

// interface Tree {
//     id_arbol: number;
//     nombre: string;
//     nombre_cientifico: string;
//     tipo_sitio: string;
//     dendometria: string;
//     estado_salud: string;
//     conflictos: string;
//     riesgo: string;
//     comentarios: string;
//     latitud: number;
//     longitud: number;
// }

// export default function MapaScreen(): JSX.Element {
//     const router = useRouter();
//     const [trees, setTrees] = useState<Tree[]>([]);
//     const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
//     const [map, setMap] = useState<Mapbox.Map | null>(null);

//     // Fetch tree data from Supabase
//     const fetchTreeData = async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('arbol')
//                 .select('*'); // Fetch all tree details

//             if (error) {
//                 console.error('Error fetching tree data:', error);
//                 return;
//             }

//             if (data) {
//                 const formattedTrees: Tree[] = data.map((tree: any) => ({
//                     id_arbol: tree.id_arbol,
//                     nombre: tree.nombre,
//                     nombre_cientifico: tree.nombre_cientifico || 'N/A',
//                     tipo_sitio: tree.tipo_sitio || 'N/A',
//                     dendometria: tree.dendometria || 'N/A',
//                     estado_salud: tree.estado_salud || 'N/A',
//                     conflictos: tree.conflictos || 'N/A',
//                     riesgo: tree.riesgo || 'N/A',
//                     comentarios: tree.comentarios || 'N/A',
//                     latitud: tree.latitud,
//                     longitud: tree.longitud,
//                 }));
//                 setTrees(formattedTrees);
//             }
//         } catch (err) {
//             console.error('Unexpected error fetching trees:', err);
//         }
//     };

//     // Initialize the map
//     const initializeMap = () => {
//         if (Platform.OS === "web" && Mapbox) {
//             const mapInstance = new Mapbox.Map({
//                 container: "map",
//                 style: "mapbox://styles/mapbox/streets-v11",
//                 center: [-110.967847, 29.098678],
//                 zoom: 11,
//             });

//             // Add markers dynamically
//             trees.forEach((tree) => {
//                 const markerElement = document.createElement("div");
//                 markerElement.style.width = "32px";
//                 markerElement.style.height = "32px";
//                 markerElement.style.backgroundImage = "url(https://semana.mat.uson.mx/~cursotacc/a219211930/prueba/TreeIcon.png)";
//                 markerElement.style.backgroundSize = "cover";

//                 const marker = new Mapbox.Marker(markerElement)
//                     .setLngLat([tree.longitud, tree.latitud])
//                     .setPopup(
//                         new Mapbox.Popup().setHTML(`
//                             <div>
//                                 <h1>${tree.nombre}</h1>
//                                 <button id="navigateButton-${tree.id_arbol}" style="padding:5px; margin-top:5px;">Ver Información</button>
//                             </div>
//                         `)
//                     )
//                     .addTo(mapInstance);

//                 marker.getPopup().on("open", () => {
//                     setSelectedTree(tree);
//                     setTimeout(() => {
//                         const navigateButton = document.getElementById(`navigateButton-${tree.id_arbol}`);
//                         if (navigateButton) {
//                             navigateButton.addEventListener("click", () => {
//                                 router.push("/InfoTree");
//                             });
//                         }
//                     }, 0);
//                 });

//                 marker.getPopup().on("close", () => {
//                     setSelectedTree(null);
//                 });
//             });

//             setMap(mapInstance);
//             return mapInstance;
//         }
//         return null;
//     };

//     useEffect(() => {
//         fetchTreeData();
//     }, []);

//     useEffect(() => {
//         if (trees.length > 0) {
//             const mapInstance = initializeMap();
//             return () => {
//                 if (mapInstance) mapInstance.remove();
//             };
//         }
//     }, [trees]);

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
//                     <Text style={styles.treeTitle}>{selectedTree.nombre}</Text>
                    
//                     <TouchableOpacity style={styles.infoButton}>
//                         <Link href={{ pathname: "/InfoTree", params: { tree: JSON.stringify(selectedTree) } }}>
//                             <Text style={styles.infoButtonText}>Ir a InfoTree</Text>
//                         </Link>
//                     </TouchableOpacity>
//                     <Text>-Información General</Text>
//                     <Text>Nombre Científico: {selectedTree.nombre_cientifico}</Text>
//                     <Text>Tipo de Sitio: {selectedTree.tipo_sitio}</Text>
//                     <Text>Dendometría: {selectedTree.dendometria}</Text>
//                     <Text>Estado de Salud: {selectedTree.estado_salud}</Text>
//                     <Text>Conflictos: {selectedTree.conflictos}</Text>
//                     <Text>Riesgo: {selectedTree.riesgo}</Text>
//                     <Text>Comentarios: {selectedTree.comentarios}</Text>
//                     <Text>-Ubicación</Text>
//                     <Text>Latitud: {selectedTree.latitud}</Text>
//                     <Text>Longitud: {selectedTree.longitud}</Text>
//                     <Text>Imágenes del Árbol</Text>
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
//     container: { flex: 1 },
//     mapWeb: { width: "100%", height: "100%" },
//     infoPanel: {
//         position: "absolute",
//         top: 10,
//         left: 5,
//         width: "30%",
//         height: "93%",
//         backgroundColor: "#fff",
//         padding: 15,
//         borderRadius: 5,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 5,
//     },
//     treeTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
//     treeDescription: { fontSize: 14, color: "#555", marginBottom: 10 },
//     infoButton: {
//         backgroundColor: "#1c99cb",
//         padding: 10,
//         borderRadius: 5,
//         alignItems: "center",
//     },
//     infoButtonText: { color: "#fff", fontWeight: "bold" },
//     addButton: {
//         position: "absolute",
//         right: 20,
//         bottom: 30,
//         backgroundColor: "#1c99cb",
//         padding: 10,
//         borderRadius: 50,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     zoomContainer: {
//         position: "absolute",
//         right: 28,
//         top: 500,
//         backgroundColor: "rgba(255, 255, 255, 0.9)",
//         borderRadius: 10,
//         overflow: "hidden",
//     },
//     zoomButton: {
//         padding: 10,
//         alignItems: "center",
//         justifyContent: "center",
//         borderBottomWidth: 1,
//         borderBottomColor: "#ddd",
//     },
//     zoomText: { fontSize: 18, fontWeight: "bold" },
// });

import React, { useEffect, useState } from "react";
import { Platform, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "../../lib/supabase";

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
    const [trees, setTrees] = useState<Tree[]>([]);
    const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
    const [map, setMap] = useState<Mapbox.Map | null>(null);

    // Fetch tree data from Supabase
    const fetchTreeData = async () => {
        try {
            const { data, error } = await supabase
                .from("arbol")
                .select("*"); // Fetch all tree details

            if (error) {
                console.error("Error fetching tree data:", error);
                return;
            }

            if (data) {
                const formattedTrees: Tree[] = data.map((tree: any) => ({
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
                setTrees(formattedTrees);
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

            // Add markers dynamically
            trees.forEach((tree) => addMarker(mapInstance, tree));

            setMap(mapInstance);
        }
    };

    const addMarker = (mapInstance: Mapbox.Map, tree: Tree) => {
        const markerElement = document.createElement("div");
        markerElement.style.width = "32px";
        markerElement.style.height = "32px";
        markerElement.style.backgroundImage = "url(https://semana.mat.uson.mx/~cursotacc/a219211930/prueba/TreeIcon.png)";
        markerElement.style.backgroundSize = "cover";

        new Mapbox.Marker(markerElement)
            .setLngLat([tree.longitud, tree.latitud])
            .setPopup(
                new Mapbox.Popup().setHTML(`
                    <div>
                        <h1>${tree.nombre}</h1>
                        <p>Nombre Científico: ${tree.nombre_cientifico}</p>
                    </div>
                `)
            )
            .addTo(mapInstance);
    };

    // **Added Functionality: Refresh Map Markers**
    const refreshMapMarkers = async () => {
        await fetchTreeData();
        if (map) {
            // Remove existing markers
            const markers = document.querySelectorAll(".mapboxgl-marker");
            markers.forEach((marker) => marker.remove());

            // Add new markers dynamically
            trees.forEach((tree) => addMarker(map, tree));
        }
    };

    useEffect(() => {
        fetchTreeData();
    }, []);

    useEffect(() => {
        if (trees.length > 0 && !map) {
            initializeMap();
        }
    }, [trees]);

    const zoomIn = () => {
        if (map) map.zoomIn();
    };

    const zoomOut = () => {
        if (map) map.zoomOut();
    };

    return (
        <View style={styles.container}>
            <div id="map" style={styles.mapWeb} />

            {/* Added Refresh Button */}
            <TouchableOpacity style={styles.refreshButton} onPress={refreshMapMarkers}>
                <Text style={styles.refreshText}>Refresh Map</Text>
            </TouchableOpacity>

            {/* Zoom Controls */}
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
    container: { flex: 1 },
    mapWeb: { width: "100%", height: "100%" },
    refreshButton: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#1c99cb",
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    refreshText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    zoomText: { fontSize: 18, fontWeight: "bold" },
});
