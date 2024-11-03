import { Stack, Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform,TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();  

  // Condición para no mostrar Tabs en la web
  if (Platform.OS === 'web') {
    return(
      //se muestra el componente index
      <Stack>
        <Stack.Screen name="index" options={{
            title: 'Home', // Título de la barra de navegación
            headerStyle: { backgroundColor: '#3d80d4' },
            headerRight: () => (  // Se muestra en la barra de navegación
              <HeaderLinks/> // Componente de enlaces
            ),
          }
        } />
        <Stack.Screen name="mapa" options={
          {
            title: 'Mapa',
            headerStyle: { backgroundColor: '#3d80d4' },
            headerRight: () => ( 
              <HeaderLinks/>
            ),
          }
        }/>
        <Stack.Screen name="explore" options={{
            title: 'Explore',
            headerStyle: { backgroundColor: '#3d80d4' },
            headerRight: () => (
              <HeaderLinks/>
            ),
          }
        }/>
        
      </Stack>
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
            <HeaderLinksMovil/> // Solo se muestra en web
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
            <HeaderLinksMovil/> // Solo se muestra en web
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
            <HeaderLinksMovil/> // Solo se muestra en web
          ),
        }}
      />
      
    </Tabs>
  );
}


// Componente para los enlaces en el encabezado
function HeaderLinks() {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginRight: 10}}>
      <Link href="/" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}>Home</Text>
      </Link>
      <Link href="/mapa" style={{ marginHorizontal: 20 }}>
        <Text style={{ color: '#fff' }}>Mapa</Text>
      </Link>
      <Link href="/explore" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}>Explore</Text>
      </Link>
    </TouchableOpacity>
  );
}

// Componente para los enlaces en el encabezado en movil
function HeaderLinksMovil(){
  return (
    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginRight: 10 }}>
      <Link href="/explore" style={{ marginHorizontal: 10 }}>
        <Text style={{ color: '#fff' }}> <TabBarIcon name="settings-outline" color="#fff" /> </Text>
      </Link>
    </TouchableOpacity>
  );
}