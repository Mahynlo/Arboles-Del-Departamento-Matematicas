import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';

interface BarChartData {
  value: number;
  color: string;
  label: string;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number; // Ancho total del gráfico
  height?: number; // Altura total del gráfico
  barWidth?: number; // Ancho de las barras
}

const BarChart: React.FC<BarChartProps> = ({ data, width = 300, height = 200, barWidth = 30 }) => {
  const maxValue = Math.max(...data.map(item => item.value)); // Encuentra el valor máximo para la escala
  const spacing = (width - barWidth * data.length) / (data.length + 1); // Espaciado entre las barras

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Eje Y (Cantidad de Árboles) */}
        <Line x1="20" y1="0" x2="20" y2={height} stroke="black" strokeWidth="2" />
        
        {/* Eje X (Meses o etiquetas) */}
        <Line x1="20" y1={height} x2={width} y2={height} stroke="black" strokeWidth="2" />

        {/* Etiquetas del eje Y */}
        {Array.from({ length: 6 }, (_, i) => {
          const value = (maxValue / 5) * i; // Divide el valor máximo en 5 partes
          return (
            <SvgText key={i} x="10" y={height - (i * (height / 5))} fontSize="12" textAnchor="middle" fill="black">
              {Math.round(value)} {/* Redondeamos el valor */}
            </SvgText>
          );
        })}

        {/* Dibujar barras */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height; // Escala la altura de la barra
          const x = spacing * (index + 1) + barWidth * index; // Posición X de cada barra
          const y = height - barHeight; // Posición Y de la barra

          return (
            <React.Fragment key={index}>
              <Rect x={x} y={y} width={barWidth} height={barHeight} fill={item.color} />
              {/* Etiqueta de cada barra */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 10}
                fontSize="12"
                textAnchor="middle"
                fill="black"
                fontWeight="bold"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default BarChart;