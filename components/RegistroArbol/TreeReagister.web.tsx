import React from "react";
import { Platform, View, StyleSheet, Text } from "react-native";
import { ThemedView } from '@/components/ThemedView';

export default function TreeRegisterWeb() {
    return (
        <View>
            <ThemedView style={styles.contentContainer}>
                <Text>TreeRegisterWeb</Text>

                <Text>Usa la app para registrar arboless</Text>
            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        maxWidth: 800, // Limits width on larger screens
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        left: 400,
    },
});