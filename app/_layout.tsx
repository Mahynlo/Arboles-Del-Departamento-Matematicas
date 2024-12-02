import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Platform, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import HeaderLinks from '@/components/navigation/HeaderLinks'; // Importar componente de enlaces en el encabezado

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const title= "ARDEMA TREE PROJECT";
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: Platform.OS === "web" ? title : 'About',
            headerLeft: () => null, // No mostrar botón de regreso
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
              fontFamily: 'YourCustomFont', // Asegúrate de que la fuente esté cargada
            },
            headerStyle: { backgroundColor: '#fff' },
            headerRight: () => (
              Platform.OS === 'web' ? <HeaderLinks /> : <HeaderLinksMovil /> // Solo se muestra en web
            ),

          }}
        />
        <Stack.Screen name="TreeRegistration" options={{
          title: 'Registro de Árbol',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',  
          },
        }} />
        <Stack.Screen name='settings' options={{
          title: 'Configuración',
        }} />
        <Stack.Screen name='InfoTree' options={{
          title: 'Información del Árbol',
        }} />
        <Stack.Screen name='scanerCamara' options={{
          title: 'Escaner de QR',
        }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}


function HeaderLinksMovil() {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginRight: 10 }}>
      <Link href="/settings" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}> <TabBarIcon name="settings-outline" color="#fff" /> </Text>
      </Link>
    </TouchableOpacity>
  );
}

