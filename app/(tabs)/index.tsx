import { Image, StyleSheet, Platform, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { HelloWave } from '@/components/HelloWave';
import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Constants from 'expo-constants';
import Card from "../../components/Ui/Card";
import { PricingCard, lightColors } from '@rneui/themed';

export default function HomeScreen() {
  return (
    // <TreeList />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header Section */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Árboles del Departamento de Matemáticas
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Explora, registra, y analiza la información de los árboles registrados.
        </ThemedText>
        {/* <Image
          source={require('@/assets/images/Arbol_de_prueba.jpg')}
          style={styles.headerImage}
        /> */}
      </ThemedView>

      {/* Bento Box Section */}
      <ThemedView style={styles.bentoBoxContainer}>
        <ButtonLink
          href="/about"
          title="About"
          iconName="information-circle"
          color="#FF6347"
        />
        <ButtonLink
          href="/mapa"
          title="Mapa"
          iconName="map"
          color="#4682B4"
        />
        <ButtonLink
          href="/generadorQr"
          title="Generar QR"
          iconName="qr-code"
          color="#FFD700"
        />
        <ButtonLink
          href="/TreeRegistration"
          title="Registro de Árbol"
          iconName="leaf"
          color="#32CD32"
        />
        <ButtonLink
          href="/camaraFoto"
          title="Tomar Foto"
          iconName="camera"
          color="#8A2BE2"
        />
      </ThemedView>

      {/* Placeholder for Graphs */}
      <ThemedView style={styles.graphSection}>
        <ThemedText type="subtitle" style={styles.graphTitle}>
          Análisis y Estadísticas
        </ThemedText>
        {/* <View style={styles.graphPlaceholder}>
          <ThemedText>Gráficos vendrán aquí...</ThemedText>
        </View> */}
      </ThemedView>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <Link href="https://github.com/Mahynlo/Arboles-Del-Departamento-Matematicas/tree/main">
          <TabBarIcon name="logo-github" color="#fff" />
        </Link>
        <Link href="/" style={styles.footerLink}>
          Política de Privacidad
        </Link>
        <ThemedText style={styles.footerText}>
          © 2023 Departamento de Matemáticas
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

interface ButtonLinkProps {
  href: string;
  title: string;
  iconName?: ComponentProps<typeof Ionicons>['name'];
  color: string;
}

function ButtonLink({ href, title, iconName, color }: ButtonLinkProps) {
  return (
    <ThemedView style={[styles.buttonCard, { backgroundColor: color }]}>
      <Link href={href as any} style={styles.linkText}>
        {iconName && <TabBarIcon name={iconName} color="#fff" style={styles.icon} />}
        {title}
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#DFECF2',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#DFECF2',
    borderRadius: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
    resizeMode: 'cover',
  },
  bentoBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center', // Helps with tighter spacing
    justifyContent: 'center',
    gap: 4, // Very small gap
    marginBottom: 24,
    backgroundColor: '#DFECF2',
    width: '100%',
    paddingHorizontal: 0,
  },
  buttonCard: {
    width: '20%', // 4 columns
    paddingVertical: 10,
    // paddingHorizontal: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10, // Consistent small margin
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  graphSection: {
    padding: 16,
    backgroundColor: '#D0E1E9',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  graphPlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D0E1E9',
    borderRadius: 8,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#DFECF2',
  },
  footerLink: {
    color: '#000',
    fontSize: 14,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
});
