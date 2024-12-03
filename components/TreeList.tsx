// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
// import { supabase } from '../lib/supabase';

// // Define the type for tree data
// interface Tree {
//     id_arbol: number; // Primary key in your table
//     nombre: string;
//     latitud: number;
//     longitud: number;
// }

// export default function TreeList(): JSX.Element {
//     const [trees, setTrees] = useState<Tree[]>([]); // Array of Tree objects
//     const [loading, setLoading] = useState<boolean>(true);

//     // Fetch tree data from Supabase
//     const fetchTreeData = async (): Promise<void> => {
//         setLoading(true);
//         try {
//             console.log('Fetching tree data...');
//             const { data, error } = await supabase
//                 .from('arbol')
//                 .select('id_arbol, nombre, latitud, longitud'); // Adjusted to match your table columns

//             console.log('Supabase response:', data, error); // Debug response

//             if (error) {
//                 console.error('Error fetching tree data:', error);
//                 Alert.alert('Error', 'Failed to fetch tree data.');
//                 return;
//             }

//             setTrees(data || []); // Use empty array as fallback
//             console.log('Tree data set to state:', data); // Debug state update
//         } catch (err) {
//             console.error('Unexpected error:', err);
//             Alert.alert('Error', 'An unexpected error occurred.');
//         } finally {
//             setLoading(false);
//             console.log('Loading state set to false'); // Debug loading state
//         }
//     };

//     // Fetch data on component mount
//     useEffect(() => {
//         fetchTreeData();
//     }, []);

//     // Log the current state when it updates
//     useEffect(() => {
//         console.log('Updated tree state:', trees);
//     }, [trees]);

//     // Render individual tree item
//     const renderItem = ({ item }: { item: Tree }) => {
//         console.log('Rendering item:', item); // Debug individual items
//         return (
//             <View style={styles.treeItem}>
//                 <Text style={styles.treeName}>{item.nombre}</Text>
//                 <Text style={styles.treeCoords}>
//                     Latitude: {item.latitud}, Longitude: {item.longitud}
//                 </Text>
//             </View>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Tree List</Text>
//             {loading ? (
//                 <Text>Loading...</Text>
//             ) : (
//                 <FlatList
//                     data={trees}
//                     keyExtractor={(item) => item.id_arbol.toString()} // Use id_arbol as the unique key
//                     renderItem={renderItem}
//                     ListEmptyComponent={<Text>No trees found.</Text>} // Display if no data
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#f0f0f0',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     treeItem: {
//         padding: 15,
//         marginBottom: 10,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: '#ddd',
//     },
//     treeName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     treeCoords: {
//         fontSize: 14,
//         color: '#666',
//     },
// });
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, useWindowDimensions } from "react-native";
import { supabase } from "../lib/supabase";

// Define the type for tree data
interface Tree {
  id_arbol: number;
  nombre: string;
  dendometria: number;
  estado_salud: string;
  conflictos: string[];
  created_at: string;
}

export default function TreeList(): JSX.Element {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  // Fetch tree data from Supabase
  const fetchTreeData = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("arbol")
        .select("id_arbol, nombre, dendometria, estado_salud, conflictos, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tree data:", error);
        Alert.alert("Error", "Failed to fetch tree data.");
        return;
      }

      setTrees(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreeData();
  }, []);

  const renderItem = ({ item }: { item: Tree }) => (
    <View style={styles.treeItem}>
      <Text style={styles.treeName}>{item.nombre}</Text>
      <Text style={styles.treeInfo}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
      <Text style={styles.treeInfo}>{item.dendometria} meters</Text>
      <Text style={styles.treeInfo}>Salud: {item.estado_salud}</Text>
      <Text style={styles.treeInfo}>
        Conflictos: {item.conflictos.length > 0 ? item.conflictos.join(", ") : "None"}
      </Text>
    </View>
  );

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setContainerHeight(height);
      }}
    >
      {/* <Text style={styles.title}>Chronological Tree List</Text> */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={trees}
          keyExtractor={(item) => item.id_arbol.toString()} // Use id_arbol as the unique key
          renderItem={renderItem}
          ListEmptyComponent={<Text>No trees found.</Text>} // Display if no data
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner UI
          style={
            isMobile
              ? styles.mobileList
              : [styles.desktopList, { maxHeight: containerHeight ? containerHeight * 0.8 : 300 }] // Dynamic maxHeight
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the component fits the container
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  treeItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  treeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  treeInfo: {
    fontSize: 14,
    color: "#666",
  },
  listContent: {
    paddingBottom: 10, // Adds spacing at the bottom of the list
  },
  desktopList: {
    overflow: "scroll", // Make the list scrollable on desktop
  },
  mobileList: {
    flexGrow: 1, // Allow list to grow on mobile
  },
});
