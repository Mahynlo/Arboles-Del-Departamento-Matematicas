import React from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';

const App: React.FC = () => {
  // Datos ficticios de árboles registrados
  const treeData = [
    { date: "2024-10-01", count: 5 },
    { date: "2024-10-05", count: 12 },
    { date: "2024-10-10", count: 18 },
    { date: "2024-10-15", count: 9 },
    { date: "2024-10-20", count: 15 },
    { date: "2024-10-25", count: 20 },
    { date: "2024-10-30", count: 25 },
  ];

  // Transformar datos para mostrar solo fechas y cantidades
  const formattedData = treeData.map((entry) => ({
    x: new Date(entry.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
    y: entry.count,
  }));

  return (
    <div style={styles.container}>
      <div style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          {/* Eje X */}
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 10, angle: 45, padding: 20 },
            }}
          />
          {/* Eje Y */}
          <VictoryAxis
            dependentAxis
            label="Cantidad de árboles"
            style={{
              axisLabel: { padding: 30 },
              tickLabels: { fontSize: 10 },
            }}
          />
          {/* Barras */}
          <VictoryBar
            data={formattedData}
            style={{
              data: { fill: "#4CAF50", width: 20 },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  chartContainer: {
    width: "90%",
    maxWidth: "800px",
    height: "500px",
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "8px",
  },
};

export default App;

