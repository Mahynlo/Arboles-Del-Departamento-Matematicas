import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

// Define the type for tree data
interface Tree {
    id_arbol: number; // Primary key in your table
    nombre: string;
    latitud: number;
    longitud: number;
}

export default function TreeList(): JSX.Element {
    const [trees, setTrees] = useState<Tree[]>([]); // Array of Tree objects
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch tree data from Supabase
    const fetchTreeData = async (): Promise<void> => {
        setLoading(true);
        try {
            console.log('Fetching tree data...');
            const { data, error } = await supabase
                .from('arbol')
                .select('id_arbol, nombre, latitud, longitud'); // Adjusted to match your table columns

            console.log('Supabase response:', data, error); // Debug response

            if (error) {
                console.error('Error fetching tree data:', error);
                Alert.alert('Error', 'Failed to fetch tree data.');
                return;
            }

            setTrees(data || []); // Use empty array as fallback
            console.log('Tree data set to state:', data); // Debug state update
        } catch (err) {
            console.error('Unexpected error:', err);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
            console.log('Loading state set to false'); // Debug loading state
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchTreeData();
    }, []);

    // Log the current state when it updates
    useEffect(() => {
        console.log('Updated tree state:', trees);
    }, [trees]);

    // Render individual tree item
    const renderItem = ({ item }: { item: Tree }) => {
        console.log('Rendering item:', item); // Debug individual items
        return (
            <View style={styles.treeItem}>
                <Text style={styles.treeName}>{item.nombre}</Text>
                <Text style={styles.treeCoords}>
                    Latitude: {item.latitud}, Longitude: {item.longitud}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tree List</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={trees}
                    keyExtractor={(item) => item.id_arbol.toString()} // Use id_arbol as the unique key
                    renderItem={renderItem}
                    ListEmptyComponent={<Text>No trees found.</Text>} // Display if no data
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    treeItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    treeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    treeCoords: {
        fontSize: 14,
        color: '#666',
    },
});