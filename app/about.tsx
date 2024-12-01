import React from 'react';
import { ScrollView, StyleSheet, View, Text, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          Hcerca de esta aplicación 
        </ThemedText>

        <Text style={styles.text}>
          Bienvenido a nuestra aplicación de árboles del Departamento de Matemáticas. Esta aplicación
          tiene como objetivo proporcionar una experiencia interactiva y educativa para los usuarios 
          interesados en conocer más sobre los árboles del Departamento de Matemáticas asi como sus características y ubicaciones.
        </Text>

        <Text style={styles.sectionTitle}>Caracteristicas:</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>- Mapa interactivo de la ubicacion de los arboles.</Text>
          <Text style={styles.featureItem}>- Genreador de codigo QR para informacion de Árbol</Text>
          <Text style={styles.featureItem}>- Estadisticas de arboles.</Text>
          <Text style={styles.featureItem}>- Accseso a registro de arboles(Solo disponible en la version movil)</Text>
        </View>

        <Text style={styles.sectionTitle}>Adaptabilidad de la Plataforma:</Text>
        <Text style={styles.text}>
        La aplicación está diseñada para funcionar sin problemas tanto en plataformas móviles como web. La interfaz de usuario y las funciones se adaptan según la plataforma para garantizar la coherencia y la facilidad de uso.
        </Text>

        <Text style={styles.footer}>
        ¡Gracias por utilizar nuestra aplicación! Esperamos que mejore su experiencia y satisfaga sus necesidades.
        </Text>
        {/*SI estamos en la version web o en movil*/}
        {Platform.OS === "web" ? (
          <Text style={styles.footer}>
            Estamos en la versión web
          </Text>
        ) : (
          <Text style={styles.footer}>
            Estamos en la versión movil
          </Text>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    elevation: Platform.OS === 'android' ? 5 : 0,
  },
  title: {
    fontSize: 24,
    color:"#000",
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 15,
  },
  featuresList: {
    marginBottom: 15,
    paddingLeft: 10,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});
