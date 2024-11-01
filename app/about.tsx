import React from 'react';
import { ScrollView, StyleSheet, View, Text, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>
          About This App
        </ThemedText>

        <Text style={styles.text}>
          This app was developed to help users interact with a variety of features, including
          navigation, camera scanning, map exploration, and more. Our goal is to provide a
          smooth and engaging experience, accessible across both web and mobile platforms.
        </Text>

        <Text style={styles.sectionTitle}>Features:</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>- Easy navigation across screens</Text>
          <Text style={styles.featureItem}>- QR code generator and scanner</Text>
          <Text style={styles.featureItem}>- Map integration for exploration</Text>
          <Text style={styles.featureItem}>- Camera access for capturing moments</Text>
        </View>

        <Text style={styles.sectionTitle}>Platform Adaptability:</Text>
        <Text style={styles.text}>
          The app is designed to work seamlessly on both mobile and web platforms. The UI and
          features adapt based on the platform to ensure consistency and usability.
        </Text>

        <Text style={styles.footer}>
          Thank you for using our app! We hope it enhances your experience and meets your needs.
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
    fontWeight: 'bold',
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
