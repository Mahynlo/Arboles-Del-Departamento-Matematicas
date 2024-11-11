import { Image, StyleSheet, Platform, TouchableOpacity, Pressable } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import GalleryTree from '@/components/arbol/GalleryTree';

export default function InformacionTree() {
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
                <ThemedText type="title">Arbol numero (fulano)</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Informacion de estado</ThemedText>
                <ThemedText>
                    Edita <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> para ver cambios.
                    Presiona{' '}
                    <ThemedText type="defaultSemiBold">
                        {Platform.select({
                            ios: 'cmd + d',
                            android: 'cmd + m',
                            web: 'F12 (DevTools)'
                        })}
                    </ThemedText>{' '}
                    para abrir las herramientas de desarrollo.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Galeria</ThemedText>
                <GalleryTree />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Paso 3: Comienza desde cero</ThemedText>
                <ThemedText>
                    Cuando estés listo, ejecuta{' '}
                    <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> para obtener un{' '}
                    <ThemedText type="defaultSemiBold">app</ThemedText> limpio.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">
                    {Platform.OS === 'web' ? (
                        <Pressable style={styles.button}>
                            <Link href="/mapa" style={styles.link}>
                                IR a Mapa
                            </Link>
                        </Pressable>
                    ) : (
                        <TouchableOpacity style={styles.button}>
                            <Link href="/mapa" style={styles.link}>
                                IR a Mapa
                            </Link>
                        </TouchableOpacity>
                    )}
                </ThemedText>
            </ThemedView>
        </ParallaxScrollView>
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
        height: 280,
        width: '100%',
        resizeMode: 'cover',
    },
    button: {
        fontSize: 40,
        textDecorationLine: 'underline',
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 10,
    },
    link: {
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'none',
    },
});
