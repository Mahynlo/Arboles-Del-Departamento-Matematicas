import { Image, StyleSheet, Platform, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/Arbol_de_prueba.jpg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Árboles Del Departamento De Matemáticas</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Acerca del proyecto</ThemedText>
        <ThemedText>
          {Platform.OS === 'web' ? (
            <>
              Puedes ver la información de los árboles registrados
            </>
          ) : (
            <>
              Registra un árbol o ve la información de un árbol ya registrado
            </>
          )}
        </ThemedText>
      </ThemedView>

      {/* Botones en grid */}
      <ThemedView style={styles.buttonGridContainer}>
        <ButtonLink href="/about" title="About" iconName="information-circle" color="#FF6347" />
        <ButtonLink href="/scanerCamara" title="Camera screen" iconName="camera" color="#8A2BE2" />
        <ButtonLink href="/mapa" title="Mapa" iconName="map" color="#4682B4" />
        <ButtonLink href="/generadorQr" title="Generar de QR" iconName="qr-code" color="#FFD700" />
        <ButtonLink href="/TreeRegistration" title="Registro de árbol" iconName="leaf" color="#32CD32" />
      </ThemedView>


      {Platform.OS === 'web' ? (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Acerca del proyecto</ThemedText>
          <ThemedText>
            <>
              Por aqui segura la pagina en la version web
            </>
          </ThemedText>
          <ThemedView style={styles.webSectionContainer}>
          <ThemedText type="subtitle">Versión Web</ThemedText>
          <ThemedText>Accede a la información completa de los árboles en la versión web.</ThemedText>
        </ThemedView>

          <ThemedView style={styles.footer}>
            <ThemedText type="subtitle" style={styles.footerText}>© 2023 Departamento de Matemáticas</ThemedText>
            <Link href="/" style={styles.footerLink}><TabBarIcon name="mail-outline" color="#fff" style={styles.icon} /></Link>
            <Link href="/" style={styles.footerLink}>Política de Privacidad</Link>
          </ThemedView>
        </ThemedView>


      ) : (
        <>

        </>
      )}



    </ParallaxScrollView>
  );
}

interface ButtonLinkProps {
  href: string;
  title: string;
  iconName?: ComponentProps<typeof Ionicons>['name'];
  color: string;
}

function ButtonLink({ href, title, iconName, color }: ButtonLinkProps) {
  const Wrapper = Platform.OS === 'web' ? Pressable : TouchableOpacity;

  return (
    <Wrapper style={[styles.button, { backgroundColor: color }]}>
      <Link href={href as any} style={styles.linkText}>
        {iconName && <TabBarIcon name={iconName} color="#fff" style={styles.icon} />} {/* Agrega el ícono */}
        {title}
      </Link>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 280,
    width: '100%',
    resizeMode: 'cover',
  },
  buttonGridContainer: {
    flexDirection: 'row', // Alinea los botones en una fila
    flexWrap: 'wrap', // Permite que los botones ocupen varias líneas
    //justifyContent: 'space-around', // Centra las filas en el contenedor
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start', // Centra los botones en web y los separa en móvil
    marginHorizontal: 3,
    gap: 12, // Espacio entre los botones
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    width: Platform.OS === 'web' ? '30%' : '48%', // Ajusta el ancho de los botones
  },
  icon: {
    marginBottom: Platform.OS === 'web' ? 0 : 8, // Espacio entre el icono y el texto solo en móvil
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    flexDirection: 'row',
    textDecorationLine: Platform.OS === 'web' ? 'none' : 'none',
  },
  footer: {
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
  footerLink: {
    color: '#1e90ff',
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  // Web-specific Section
  webSectionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
