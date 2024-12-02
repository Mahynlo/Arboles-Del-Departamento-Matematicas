import { Stack, Tabs, usePathname } from 'expo-router';
import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform, TouchableOpacity, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import HeaderLinks from '@/components/navigation/HeaderLinks'; // Importar componente de enlaces en el encabezado

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const title = "ARDEMA TREE PROJECT";

  // Condición para no mostrar Tabs en la web
  if (Platform.OS === 'web') {
    return (
      //se muestra el componente index
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{
            title: title, // Título de la barra de navegación
            headerLeft: () => null, // No mostrar botón de regreso
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
              fontFamily: 'YourCustomFont', // Asegúrate de que la fuente esté cargada
            },
            headerStyle: { backgroundColor: '#fff' },
            headerRight: () => (  // Se muestra en la barra de navegación
              <HeaderLinks /> // Componente de enlaces
            ),
          }
          } />
          <Stack.Screen name="mapa" options={
            {
              title: title,
              headerLeft: () => null, // No mostrar botón de regreso
              headerTitleStyle: {// Estilo del título
                fontSize: 20,
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'YourCustomFont', // Asegúrate de que la fuente esté cargada
              },
              headerStyle: { backgroundColor: 'fff' },
              headerRight: () => (
                <HeaderLinks />
              ),

            }
          } />
          <Stack.Screen name="explore" options={{
            title: title,
            headerLeft: () => null, // No mostrar botón de regreso
            headerTitleStyle: {// Estilo del título
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
              fontFamily: 'YourCustomFont', // Asegúrate de que la fuente esté cargada
            },
            headerStyle: { backgroundColor: '#fff' },
            headerRight: () => (
              <HeaderLinks />
            ),
          }
          } />

        </Stack>
      </ThemeProvider>
    )
  }
  // vista para movil tabs 
  return (
    <Tabs
      screenOptions={{

        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#3d80d4',

        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#1b3658',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
          headerRight: () => (
            <HeaderLinksMovil /> // Solo se muestra en web
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          //href: null, // No mostrar en la barra de navegación
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
          headerRight: () => (
            <HeaderLinksMovil /> // Solo se muestra en web
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          //href: null, // No mostrar en la barra de navegación
          title: 'Explore',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
          headerRight: () => (
            <HeaderLinksMovil /> // Solo se muestra en web
          ),
        }}
      />

    </Tabs>
  );
}


// Componente para los enlaces en el encabezado en movil
function HeaderLinksMovil() {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginRight: 10 }}>
      <Link href="/settings" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}> <TabBarIcon name="settings-outline" color="#fff" /> </Text>
      </Link>
    </TouchableOpacity>
  );
}
