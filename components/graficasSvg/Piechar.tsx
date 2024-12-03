import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText, Path } from 'react-native-svg';

interface PieChartData {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieChartData[];
  radius?: number; // Radio del gráfico
  labelRadius?: number; // Distancia de las etiquetas desde el centro
}

const PieChart: React.FC<PieChartProps> = ({ data, radius = 80, labelRadius = 100 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  return (
    <View style={styles.container}>
      <Svg height="250" width="250" viewBox="0 0 200 200">
        <G x="100" y="100">
          {data.map((item, index) => {
            const endAngle = startAngle + (item.value / total) * 360;
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            // Coordenadas del inicio y fin del arco
            const startX = radius * Math.cos((Math.PI * startAngle) / 180);
            const startY = radius * Math.sin((Math.PI * startAngle) / 180);

            const endX = radius * Math.cos((Math.PI * endAngle) / 180);
            const endY = radius * Math.sin((Math.PI * endAngle) / 180);

            // Path para el sector del gráfico
            const pathData = `M 0,0 L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;

            // Calcular posición de la etiqueta
            const labelAngle = startAngle + (endAngle - startAngle) / 2; // Ángulo central del segmento
            const labelX = labelRadius * Math.cos((Math.PI * labelAngle) / 180);
            const labelY = labelRadius * Math.sin((Math.PI * labelAngle) / 180);

            startAngle = endAngle; // Actualizamos el ángulo para el siguiente sector

            return (
              <G key={index}>
                {/* Dibuja el sector del pastel */}
                <Path d={pathData} fill={item.color} />
                {/* Etiqueta del sector */}
                <SvgText
                  x={labelX}
                  y={labelY}
                  fontSize="20"
                  textAnchor="middle"
                  fill="black"
                  fontWeight="bold"
                >
                  {item.label}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default PieChart;
