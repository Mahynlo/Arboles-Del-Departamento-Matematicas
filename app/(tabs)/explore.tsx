import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import PieChart from "@/components/graficasSvg/Piechar";
import BarChart from "@/components/graficasSvg/Barchar";

export default function TabTwoScreen() {
  const [arbol, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("arbol").select("*");

      if (error) {
        console.log(error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  console.log(arbol);
  const chartData = [
    { value: 25, color: "#ff9999", label: "Segmento A" },
    { value: 35, color: "#66b3ff", label: "Segmento B" },
    { value: 20, color: "#99ff99", label: "Segmento C" },
    { value: 20, color: "#ffcc66", label: "Segmento D" },
    { value: 70, color: "#ffcc", label: "Segmento j" },
  ];
  const chartDataBar = [
    { value: 30, color: "#ff9999", label: "Barra A" },
    { value: 70, color: "#66b3ff", label: "Barra B" },
    { value: 50, color: "#99ff99", label: "Barra C" },
    { value: 200, color: "#ffcc66", label: "Barra D" },
  ];
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
        <BarChart data={chartDataBar} />

        <PieChart data={chartData} />
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
