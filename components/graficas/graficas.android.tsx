import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CartesianChart, Bar } from "victory-native";

const DATA = [
  { x: "2024-10-01", y: 5 },
  { x: "2024-10-05", y: 12 },
  { x: "2024-10-10", y: 18 },
  { x: "2024-10-15", y: 9 },
  { x: "2024-10-20", y: 15 },
  { x: "2024-10-21", y: 15 },
  { x: "2024-10-22", y: 50 },
  { x: "2024-10-25", y: 100 },
  { x: "2024-10-25", y: 150 },
];

function MyChart() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Árboles</Text>
      <View style={styles.chartContainer}>
        <CartesianChart 
          data={DATA} 
          xKey="x" 
          yKeys={["y"]} 
          domainPadding={{ left: -30, right: 100 }} 
          padding={{ top: 10, bottom: 30, left: 30, right: 10 }}
          axisOptions={{}}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.y}
              chartBounds={chartBounds}
              color="green"
              roundedCorners={{ topLeft: 10, topRight: 10 }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    alignItems: "center", // Centra horizontalmente
    backgroundColor: "#f5f5f5", // Fondo claro
    padding: 16, // Margen interno
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16, // Espaciado debajo del título
  },
  chartContainer: {
    width: "100%", // Ancho ajustado al 90% del contenedor
    height: 300, // Altura fija para la gráfica
    backgroundColor: "white", // Fondo para destacar la gráfica
    borderRadius: 8, // Bordes redondeados
    padding: 8, // Espaciado interno
    elevation: 3, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MyChart;


