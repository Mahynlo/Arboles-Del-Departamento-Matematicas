import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
const spaceMono = require("../../assets/fonts/SpaceMono-Regular.ttf");
const DATA = [
  { month: 1, listenCount: 5 }, // Enero con 5 escuchas 
  { month: 2, listenCount: 12 }, // 
  { month: 3, listenCount: 18 },
  { month: 4, listenCount: 9 },
  { month: 5, listenCount: 15 },
];

function MyChart() {
  const font = useFont(spaceMono, 12); // Carga SpaceMono-Regular

  if (!font) {
    return <Text>Cargando fuente...</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Árboles</Text>
      <View style={styles.chartContainer}>
        <CartesianChart 
          data={DATA} 
          xKey="month" 
          yKeys={["listenCount"]} 
          domainPadding={{ left: -20, right: 100 }} 
          padding={{ top: 0, bottom: 3, left: 3, right: 3 }}
          axisOptions={{
            font,
            formatXLabel: (value) => {
              const date = new Date(2023, value - 1, 1);
              return date.toLocaleString("default", { month: "short" });
            },
            formatYLabel: (value) => `${value}`,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.listenCount}
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
    height: 400, // Altura fija para la gráfica
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


