import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet, Dimensions, useWindowDimensions, LayoutChangeEvent, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapaScreen from "@/components/mapa/mapa.web";
import TreeList from "@/components/TreeList";
import { supabase } from "@/lib/supabase";
import PieChart from "@/components/graficasSvg/Piechar";
import BarChart from "@/components/graficasSvg/Barchar";
import { Bar } from "victory-native";
import { Link } from "expo-router";



const chartData = [
  { value: 25, color: "#ff9999", label: "Riesgo" },
  { value: 35, color: "#66b3ff", label: "Sanos" },
  { value: 20, color: "#99ff99", label: "Muertos" },
];
const chartDataBar = [
  { value: 30, color: "#ff9999", label: "Barra A" },
  { value: 70, color: "#66b3ff", label: "Barra B" },
  { value: 50, color: "#99ff99", label: "Barra C" },
  { value: 80, color: "#ffcc66", label: "Barra D" },
];

// Reusable Card Component
const Card = ({ title, value }: { title: string; value: number }) => (
  <View style={styles.card}>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

interface SummaryData {
  totalTrees: number;
  healthyTrees: number;
  riskTrees: number;
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const headerRef = useRef<View>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const isMobile = width < 768;
  const minimumContainerHeight = 600;

  const fetchSummaryData = async () => {
    try {
      // Fetch all trees to process risk conditions
      const { data: trees, error } = await supabase.from("arbol").select("riesgo");
  
      if (error) {
        console.error("Error fetching tree data:", error);
        return;
      }
  
      // Check for valid risk conditions
      const highRiskTrees = trees.filter((tree) => {
        const validRisks = tree.riesgo.filter((risk: string) => risk !== "Ninguna condición visible");
        return validRisks.length >= 2; // Only count if there are 2 or more valid risks
      });
  
      // Fetch total and healthy tree counts
      const { data: totalTrees, error: totalTreesError } = await supabase
        .from("arbol")
        .select("*", { count: "exact" });
  
      const { data: healthyTrees, error: healthyTreesError } = await supabase
        .from("arbol")
        .select("*", { count: "exact" })
        .eq("estado_salud", "excelente");
  
      if (totalTreesError || healthyTreesError) {
        console.error(
          "Error fetching summary data:",
          totalTreesError || healthyTreesError
        );
        return;
      }
  
      // Update the summary data state
      setSummaryData({
        totalTrees: totalTrees?.length || 0,
        healthyTrees: healthyTrees?.length || 0,
        riskTrees: highRiskTrees.length, // Use filtered high-risk trees count
      });
    } catch (error) {
      console.error("Unexpected error fetching summary data:", error);
    }
  };
  
  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const { height: measuredHeight } = (event.nativeEvent as any).layout;
    setHeaderHeight(measuredHeight);
  };

  const calculateAvailableHeight = () => {
    const screenHeight = Dimensions.get("window").height;
    const availableSpace = screenHeight - headerHeight - 110; // Subtracted additional pixels
    return Math.max(availableSpace, minimumContainerHeight);
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header Section */}
        <View
          ref={headerRef}
          style={[styles.header, { padding: isMobile ? 0 : 16 }]}
          onLayout={handleHeaderLayout}
        >
          <ThemedView style={styles.headercontainer}>
            <ThemedText
              type="title"
              style={[styles.title, { fontSize: isMobile ? 32 : 48 }]}
            >
              Árboles del Departamento de Matemáticas
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.subtitle, { fontSize: isMobile ? 14 : 16 }]}
            >
              Explora, registra, y analiza la información de los árboles
              registrados.
            </ThemedText>
          </ThemedView>
        </View>
  
        {/* Dashboard Layout */}
        {isMobile ? (
          <View style={styles.mobileDashboard}>
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Link href="/TreeRegistration">
                  <Text style={styles.buttonIcon}>+</Text>
                  <Text style={styles.buttonText}>registrar arbol</Text>
                </Link>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Link href="/scanerCamara">
                  <Text style={styles.buttonIcon}>QR</Text>
                  <Text style={styles.buttonText}>escanear QR</Text>
                </Link>
              </TouchableOpacity>
            </View>
  
            {/* Healthy and Risk Counters */}
            <View style={styles.summaryRow}>
              <Card title="arboles sanos" value={summaryData?.healthyTrees || 0} />
              <Card title="en riesgo" value={summaryData?.riskTrees || 0} />
            </View>
  
            {/* Total Trees */}
            <Card title="total arboles" value={summaryData?.totalTrees || 0} />
  
            {/* Graph Placeholder */}
            <View style={styles.graphContainerMobile}>
              <ThemedText type="default">graph placeholder</ThemedText>
              <BarChart data={chartDataBar}  />
            </View>
  
            {/* Tree List */}
            <ThemedView style={styles.treeListContainer}>
              <TreeList />
            </ThemedView>
          </View>
        ) : (
          <View
            style={[styles.dashboardContainer, { minHeight: calculateAvailableHeight() }]}
          >
            {/* Left Container */}
            <ThemedView style={styles.leftContainer}>
              <MapaScreen />
            </ThemedView>
  
            {/* Right Container */}
            <ThemedView style={styles.rightContainer}>
              {/* Summary Cards */}
              <View style={styles.cardContainer}>
                <Card
                  title="Árboles en riesgo"
                  value={summaryData?.riskTrees || 0}
                />
                <Card
                  title="Árboles sanos"
                  value={summaryData?.healthyTrees || 0}
                />
                <Card
                  title="Conteo total de árboles"
                  value={summaryData?.totalTrees || 0}
                />
              </View>
  
              {/* Graph Placeholders */}
              <View
                style={isMobile ? styles.graphContainerMobile : styles.graphContainerDesktop}
              >
                {isMobile ? (
                  <ThemedText type="default">graph placeholder</ThemedText>
                ) : (
                  <>
                    <View style={styles.graphPlaceholder}>
                      {/*<Text style={styles.placeholderText}>Graph Placeholder 1</Text>*/}
                      <BarChart data={chartDataBar}  />
                    </View>
                    <View style={styles.graphPlaceholder}>
                      {/*<Text style={styles.placeholderText}>Graph Placeholder 2</Text>*/}
                      <PieChart data={chartData} />
                    </View>
                  </>
                )}
              </View>
  
              {/* Tree List */}
              <View style={styles.treeListContainer}>
                <TreeList />
              </View>
            </ThemedView>
          </View>
        )}
      </View>
    </ScrollView>
  );
   
  
}

const styles = StyleSheet.create({
  graphContainerMobile: {
    width: "100%",
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  graphContainerDesktop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  graphPlaceholder: {
    flex: 1,
    height: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  placeholderText: {
    color: "#888",
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
    textAlign: "center",
  },
  buttonIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  graphContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  treeListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  
  scrollContainer: {
    flexGrow: 1,
    minHeight: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#DFECF2",
    padding: 16,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 16,
    backgroundColor: "#DFECF2",
    borderRadius: 12,
  },
  headercontainer: {
    backgroundColor: "#DFECF2",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    color: "#666",
    textAlign: "left",
    marginVertical: 8,
  },
  dashboardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 16,
  },
  leftContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  rightContainer: {
    flex: 0.45,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  /* Card Styles */
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
  },

  /* Graph Styles */
  //  graphContainer: {
  //    flexDirection: "row",
  //    justifyContent: "space-between",
  //    marginBottom: 10,
  //  },
  // graphPlaceholder: {
  //   flex: 1,
  //   height: 120,
  //   backgroundColor: "#e0e0e0",
  //   borderRadius: 8,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginHorizontal: 5,
  // },
  // placeholderText: {
  //   color: "#888",
  //   fontSize: 14,
  // },

  /* Tree List Styles */
  // treeListContainer: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   borderRadius: 8,
  //   padding: 10,
  //   shadowColor: "#000",
  //   shadowOpacity: 0.1,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 4,
  //   elevation: 3,
  // },

  mobileDashboard: {
    flexDirection: "column",
    gap: 12,
  },
  mobileContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 16,
    minHeight: 400,
  },
  containerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});


// import React, { useState, useEffect, useRef } from "react";
// import { ScrollView, View, StyleSheet, Dimensions, useWindowDimensions, LayoutChangeEvent, Text, TouchableOpacity } from "react-native";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import MapaScreen from "@/components/mapa/mapa.web";
// import TreeList from "@/components/TreeList";
// import { supabase } from "@/lib/supabase";
// import PieChart from "@/components/graficasSvg/Piechar";
// import BarChart from "@/components/graficasSvg/Barchar";

// // Reusable Card Component
// const Card = ({ title, value }: { title: string; value: number }) => (
//   <View style={styles.card}>
//     <Text style={styles.cardValue}>{value}</Text>
//     <Text style={styles.cardTitle}>{title}</Text>
//   </View>
// );

// interface PieChartData {
//   value: number;
//   color: string;
//   label: string;
// }

// interface BarChartData {
//   value: number;
//   color: string;
//   label: string;
// }

// interface SummaryData {
//   totalTrees: number;
//   healthyTrees: number;
//   riskTrees: number;
// }

// export default function HomeScreen() {
//   const { width } = useWindowDimensions();
//   const headerRef = useRef<View>(null);
//   const [headerHeight, setHeaderHeight] = useState(0);
//   const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
//   const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
//   const [barChartData, setBarChartData] = useState<BarChartData[]>([]);

//   const isMobile = width < 768;
//   const minimumContainerHeight = 600;

//   const fetchSummaryData = async () => {
//     try {
//       const { data: trees, error } = await supabase.from("arbol").select("riesgo, estado_salud");

//       if (error) {
//         console.error("Error fetching tree data:", error);
//         return;
//       }

//       const highRiskTrees = trees.filter((tree) => {
//         const validRisks = tree.riesgo.filter((risk: string) => risk !== "Ninguna condición visible");
//         return validRisks.length >= 2;
//       });

//       const healthyCount = trees.filter((tree) => tree.estado_salud === "excelente").length;
//       const totalTrees = trees.length;

//       setSummaryData({
//         totalTrees,
//         healthyTrees: healthyCount,
//         riskTrees: highRiskTrees.length,
//       });

//       // Prepare PieChart Data
//       const mediumCount = trees.filter((tree) => tree.estado_salud === "bueno").length;
//       const poorCount = trees.filter((tree) => tree.estado_salud === "malo").length;

//       const pieChartData = [
//         { value: healthyCount, color: "#66b3ff", label: "Healthy" },
//         { value: mediumCount, color: "#ff9999", label: "Medium" },
//         { value: poorCount, color: "#ffcc66", label: "Poor" },
//       ];
//       setPieChartData(pieChartData);

//       // Prepare BarChart Data
//       const riskCounts: Record<string, number> = {
//         "No Risk": trees.filter((tree) => tree.riesgo.includes("Ninguna condición visible")).length,
//         "Low Risk": trees.filter((tree) => tree.riesgo.includes("Riesgo bajo")).length,
//         "High Risk": trees.filter((tree) => tree.riesgo.includes("Riesgo alto")).length,
//       };

//       const barChartData = Object.keys(riskCounts).map((key) => ({
//         value: riskCounts[key],
//         color: key === "High Risk" ? "#ff3333" : key === "Low Risk" ? "#ffcc66" : "#99ff99",
//         label: key,
//       }));
//       setBarChartData(barChartData);
//     } catch (error) {
//       console.error("Unexpected error fetching summary data:", error);
//     }
//   };

//   const handleHeaderLayout = (event: LayoutChangeEvent) => {
//     const { height: measuredHeight } = (event.nativeEvent as any).layout;
//     setHeaderHeight(measuredHeight);
//   };

//   const calculateAvailableHeight = () => {
//     const screenHeight = Dimensions.get("window").height;
//     const availableSpace = screenHeight - headerHeight - 110;
//     return Math.max(availableSpace, minimumContainerHeight);
//   };

//   useEffect(() => {
//     fetchSummaryData();
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         {/* Header Section */}
//         <View
//           ref={headerRef}
//           style={[styles.header, { padding: isMobile ? 0 : 16 }]}
//           onLayout={handleHeaderLayout}
//         >
//           <ThemedView style={styles.headercontainer}>
//             <ThemedText
//               type="title"
//               style={[styles.title, { fontSize: isMobile ? 32 : 48 }]}
//             >
//               Árboles del Departamento de Matemáticas
//             </ThemedText>
//             <ThemedText
//               type="subtitle"
//               style={[styles.subtitle, { fontSize: isMobile ? 14 : 16 }]}
//             >
//               Explora, registra, y analiza la información de los árboles registrados.
//             </ThemedText>
//           </ThemedView>
//         </View>

//         {/* Dashboard Layout */}
//         {isMobile ? (
//           <View style={styles.mobileDashboard}>
//             {/* Action Buttons */}
//             <View style={styles.actionButtonsContainer}>
//               <TouchableOpacity style={styles.actionButton}>
//                 <Text style={styles.buttonIcon}>+</Text>
//                 <Text style={styles.buttonText}>Registrar Árbol</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.actionButton}>
//                 <Text style={styles.buttonIcon}>QR</Text>
//                 <Text style={styles.buttonText}>Escanear QR</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Healthy and Risk Counters */}
//             <View style={styles.summaryRow}>
//               <Card title="Árboles Sanos" value={summaryData?.healthyTrees || 0} />
//               <Card title="En Riesgo" value={summaryData?.riskTrees || 0} />
//             </View>

//             {/* Total Trees */}
//             <Card title="Total Árboles" value={summaryData?.totalTrees || 0} />

//             {/* Graph Placeholder - Pie Chart */}
//             <View style={styles.graphContainerMobile}>
//               <PieChart data={pieChartData} radius={70} labelRadius={90} />
//             </View>

//             {/* Graph Placeholder - Bar Chart */}
//             <View style={styles.graphContainerMobile}>
//               <BarChart data={barChartData} width={280} height={150} barWidth={30} />
//             </View>

//             {/* Tree List */}
//             <ThemedView style={styles.treeListContainer}>
//               <TreeList />
//             </ThemedView>
//           </View>
//         ) : (
//           <View
//             style={[styles.dashboardContainer, { minHeight: calculateAvailableHeight() }]}
//           >
//             {/* Left Container */}
//             <ThemedView style={styles.leftContainer}>
//               <MapaScreen />
//             </ThemedView>

//             {/* Right Container */}
//             <ThemedView style={styles.rightContainer}>
//               {/* Summary Cards */}
//               <View style={styles.cardContainer}>
//                 <Card title="Árboles en Riesgo" value={summaryData?.riskTrees || 0} />
//                 <Card title="Árboles Sanos" value={summaryData?.healthyTrees || 0} />
//                 <Card title="Total Árboles" value={summaryData?.totalTrees || 0} />
//               </View>

//               {/* Graph Placeholders */}
//               <View style={styles.graphContainerDesktop}>
//                 <View style={styles.graphPlaceholder}>
//                   <PieChart data={pieChartData} radius={60} labelRadius={80} />
//                 </View>
//                 <View style={styles.graphPlaceholder}>
//                   <BarChart data={barChartData} width={250} height={150} barWidth={20} />
//                 </View>
//               </View>

//               {/* Tree List */}
//               <View style={styles.treeListContainer}>
//                 <TreeList />
//               </View>
//             </ThemedView>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   graphContainerMobile: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   graphContainerDesktop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   graphPlaceholder: {
//     flex: 1,
//     height: 120,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   placeholderText: {
//     color: "#888",
//     fontSize: 14,
//   },
//   actionButtonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 16,
//     marginBottom: 12,
//   },
//   actionButton: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F8F9FA",
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   buttonText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 8,
//     color: "#333",
//     textAlign: "center",
//   },
//   buttonIcon: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#007BFF",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   graphContainer: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   treeListContainer: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
  

//   /* Card Styles */
//   cardContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 15,
//     marginHorizontal: 5,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: "#333",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   cardValue: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#007BFF",
//     textAlign: "center",
//   },

//   /* Graph Styles */
//   //  graphContainer: {
//   //    flexDirection: "row",
//   //    justifyContent: "space-between",
//   //    marginBottom: 10,
//   //  },
//   // graphPlaceholder: {
//   //   flex: 1,
//   //   height: 120,
//   //   backgroundColor: "#e0e0e0",
//   //   borderRadius: 8,
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   //   marginHorizontal: 5,
//   // },
//   // placeholderText: {
//   //   color: "#888",
//   //   fontSize: 14,
//   // },

//   /* Tree List Styles */
//   // treeListContainer: {
//   //   flex: 1,
//   //   backgroundColor: "#fff",
//   //   borderRadius: 8,
//   //   padding: 10,
//   //   shadowColor: "#000",
//   //   shadowOpacity: 0.1,
//   //   shadowOffset: { width: 0, height: 2 },
//   //   shadowRadius: 4,
//   //   elevation: 3,
//   // },

//   mobileDashboard: {
//     flexDirection: "column",
//     gap: 12,
//   },
//   mobileContainer: {
//     width: "100%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     marginBottom: 16,
//     minHeight: 400,
//   },
//   containerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     minHeight: "100%",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#DFECF2",
//     padding: 16,
//   },
//   header: {
//     alignItems: "flex-start",
//     marginBottom: 16,
//     backgroundColor: "#DFECF2",
//     borderRadius: 12,
//   },
//   headercontainer: {
//     backgroundColor: "#DFECF2",
//   },
//   title: {
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#333",
//   },
//   subtitle: {
//     color: "#666",
//     textAlign: "left",
//     marginVertical: 8,
//   },
//   dashboardContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "stretch",
//     gap: 16,
//   },
//   // mobileDashboard: {
//   //   flexDirection: "column",
//   //   gap: 12,
//   // },
//   leftContainer: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   rightContainer: {
//     flex: 0.45,
//     backgroundColor: "#F8F9FA",
//     borderRadius: 12,
//     padding: 16,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   chartContainer: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 8,
//     padding: 16,
//     marginVertical: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   chartTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#333",
//   },
  
// });
