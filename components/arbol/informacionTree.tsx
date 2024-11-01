import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

export default function InformacionTree() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/adaptive-icon.png')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Árbol número (fulano)</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Información de estado</ThemedText>
                <ThemedText>
                    Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> para ver cambios.
                    Presiona{' '}
                    <ThemedText type="defaultSemiBold">
                        {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
                    </ThemedText>{' '}
                    para abrir las herramientas de desarrollo.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Paso 2: Explora</ThemedText>
                <ThemedText>
                    Toca la pestaña Explorar para aprender más sobre lo que incluye esta aplicación.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Paso 3: Comienza de nuevo</ThemedText>
                <ThemedText>
                    Cuando estés listo, ejecuta{' '}
                    <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> para empezar de nuevo.
                </ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    stepContainer: {
        marginBottom: 16,
    },
    reactLogo: {
        height: 280,
        width: '100%', // Ajuste para que se adapte a la pantalla
        resizeMode: 'cover', // Asegúrate de que la imagen cubra el área
    },
    button: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    link: {
        fontSize: 20,
        color: '#fff', // Color de texto del enlace
        textDecorationLine: 'none',
    },
});