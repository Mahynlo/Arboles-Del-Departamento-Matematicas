import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { Button } from '@rneui/themed';

function HeaderLinks() {
    const router = useRouter(); // Obtener la ruta actual

    // Función para determinar si la pestaña está activa
    const isActive = (href: string): boolean => usePathname() === href;

    return (
        <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginRight: 10,alignItems: 'center' }}>
            <Link href="/" style={{ marginHorizontal: 10 }}>
                <Text style={{
                    color: isActive('/') ? '#ffd33d' : '#000',
                    borderWidth: isActive('/') ? 2 : 0,  // Añade borde si está activo
                    borderColor: '#ffd33d',  // Color del borde
                    paddingHorizontal: 10,  // Espaciado horizontal
                    paddingVertical: 5,     // Espaciado vertical
                    borderRadius: 5,        // Bordes redondeados
                    fontSize: 16,           // Tamaño de la fuente
                }}>
                    Home
                </Text>
            </Link>
           
            <Link href="/explore" style={{ marginHorizontal: 10 }}>
                <Text
                    style={{
                        color: isActive('/explore') ? '#ffd33d' : '#000',
                        borderWidth: isActive('/explore') ? 2 : 0,
                        borderColor: '#ffd33d',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        fontSize: 16,           // Tamaño de la fuente
                    }}
                >
                    Explore
                </Text>
            </Link>
            <Link href="/about" style={{ marginHorizontal: 10 }}>
                <Text
                    style={{
                        color: isActive('/about') ? '#ffd33d' : '#000',
                        borderWidth: isActive('/about') ? 2 : 0,
                        borderColor: '#ffd33d',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        fontSize: 16,           // Tamaño de la fuente

                    }}
                >
                    About
                </Text>
            </Link>
            {/* Botones de Inicio de sesión y Creación de cuenta */}
            <Button
                title="Iniciar sesión"
                buttonStyle={{
                    backgroundColor: '#ffd33d', // Color del botón
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}
                containerStyle={{ marginLeft: 10 }}
                onPress={() => router.push('/auth')} // Redirigir al formulario de inicio de sesión
            />
            <Button
                title="Crear cuenta"
                buttonStyle={{
                    backgroundColor: '#28a745', // Color del botón
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}
                containerStyle={{ marginLeft: 10 }}
                onPress={() => router.push('/auth')} // Redirigir al formulario de creación de cuenta
            />
            
        </TouchableOpacity>
    );
}

export default HeaderLinks;