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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
            title: 'About',
            headerStyle: { backgroundColor: '#f4511e' },
            headerRight: () => (
              Platform.OS === 'web' ? <HeaderLinks/> : <HeaderLinksMovil/> // Solo se muestra en web
            ),
          
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

// Componente para los enlaces en el encabezado
function HeaderLinks() {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginRight: 10 }}>
      <Link href="/" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}>Home</Text>
      </Link>
      <Link href="/mapa" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}>Mapa</Text>
      </Link>
      <Link href="/explore" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}>Explore</Text>
      </Link>
      
    </TouchableOpacity>
  );
}

function HeaderLinksMovil(){
  return (
    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginRight: 10 }}>
      <Link href="/settings" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}> <TabBarIcon name="settings-outline" color="#fff" /> </Text>
      </Link>
    </TouchableOpacity>
  );
}

