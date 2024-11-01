import { Image, StyleSheet, Platform, TouchableOpacity, Pressable } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Arboles Del Departamento De Datematicas</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Example steps */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Acerca del proyecto</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'ctrl + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>

      {/* Navigation buttons */}
      <ThemedView style={styles.stepContainer}>
        <ButtonLink href="/about" title="Go to About screen" />
        <ButtonLink href="/scanerCamara" title="Go to Camara screen" />
        <ButtonLink href="/mapa" title="IR a Mapa" />
        <ButtonLink href="/generadorQr" title="Generar QR" />
        <ButtonLink href="/TreeRegistration" title="Registro de arbol" />
      </ThemedView>
    </ParallaxScrollView>
  );
}

interface ButtonLinkProps {
  href: string;
  title: string;
}

function ButtonLink({ href, title }: ButtonLinkProps) {
  const Wrapper = Platform.OS === 'web' ? Pressable : TouchableOpacity;

  return (
    <Wrapper style={styles.button}>
      <Link href={href as any} style={styles.linkText}>
        {title}
      </Link>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    ...Platform.select({
      web: {
        width: '30%',
        left: '35%',
        padding: 10,
        borderRadius: 5,
      },
      default: {
        width: '70%',
        right: 50,
        alignSelf: 'center',
      },
    }),
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: Platform.OS === 'web' ? 'underline' : 'none',

  },
});
