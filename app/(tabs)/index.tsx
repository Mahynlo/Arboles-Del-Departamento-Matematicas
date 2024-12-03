import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet, Dimensions, useWindowDimensions, LayoutChangeEvent, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MapaScreen from "@/components/mapa/mapa.web";
import TreeList from "@/components/TreeList";
import { supabase } from "@/lib/supabase";

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
      const { data: totalTrees, error: totalTreesError } = await supabase
        .from("arbol")
        .select("*", { count: "exact" });
  
      const { data: healthyTrees, error: healthyTreesError } = await supabase
        .from("arbol")
        .select("*", { count: "exact" })
        .eq("estado_salud", "excelente"); // Use a valid enum value
  
      const { data: riskTrees, error: riskTreesError } = await supabase
        .from("arbol")
        .select("*", { count: "exact" })
        .contains("riesgo", ["Árbol inclinado"]); // Replace with actual risk condition(s)
  
      if (totalTreesError || healthyTreesError || riskTreesError) {
        console.error(
          "Error fetching summary data:",
          totalTreesError || healthyTreesError || riskTreesError
        );
        return;
      }
  
      setSummaryData({
        totalTrees: totalTrees?.length || 0,
        healthyTrees: healthyTrees?.length || 0,
        riskTrees: riskTrees?.length || 0,
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
        <View ref={headerRef} style={[styles.header, {padding: isMobile ? 0 : 16}]} onLayout={handleHeaderLayout}>
          <ThemedView style={styles.headercontainer}>
            <ThemedText type="title" style={[styles.title, {fontSize: isMobile ? 32 : 48 }]}>
              Árboles del Departamento de Matemáticas
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.subtitle, { fontSize: isMobile ? 14 : 16 }]}>
              Explora, registra, y analiza la información de los árboles registrados.
            </ThemedText>
          </ThemedView>
        </View>

        {/* Dashboard Layout */}
        {isMobile ? (
          <View style={styles.mobileDashboard}>
            <ThemedView style={[styles.mobileContainer, { minHeight: calculateAvailableHeight() }]}>
              <ThemedText type="title" style={styles.containerTitle}>
                Mobile Container 1
              </ThemedText>
            </ThemedView>
            <ThemedView style={[styles.mobileContainer, { minHeight: calculateAvailableHeight() }]}>
              <TreeList />
            </ThemedView>
          </View>
        ) : (
          <View style={[styles.dashboardContainer, { minHeight: calculateAvailableHeight() }]}>
            {/* Left Container */}
            <ThemedView style={styles.leftContainer}>
              <MapaScreen />
            </ThemedView>

            {/* Right Container */}
            <ThemedView style={styles.rightContainer}>
              <ThemedText type="title" style={styles.containerTitle}>
                Tree Summary
              </ThemedText>
              {summaryData ? (
                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryText}>Total Trees: {summaryData.totalTrees}</Text>
                  <Text style={styles.summaryText}>Healthy Trees: {summaryData.healthyTrees}</Text>
                  <Text style={styles.summaryText}>High-Risk Trees: {summaryData.riskTrees}</Text>
                </View>
              ) : (
                <ThemedText>Loading...</ThemedText>
              )}
            </ThemedView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    // padding: 16,
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
  summaryContainer: {
    marginTop: 16,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
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
