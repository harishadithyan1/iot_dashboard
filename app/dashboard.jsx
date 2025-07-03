import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart, StackedBarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";

const screenWidth = Dimensions.get("window").width;

const dashboard = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [latestValue, setLatestValue] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://192.168.29.126/"); 
        const json = await res.json();
        const value = json.value;

        setLatestValue(value);
        setDataPoints((prev) => [...prev.slice(-9), value]); 
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const normalizedValue = latestValue ? Math.min(latestValue / 1023, 1) : 0; 

  return (
    <ScrollView style={styles.container}>
        <Image 
              style={styles.logo} 
              resizeMode='contain'
              source={require("../assets/images/iologo.png")}/>
      <Text style={styles.title}>Live Sensor Dashboard</Text>

      <Text style={styles.label}>Current Value</Text>
      <Text style={styles.value}>
        {latestValue !== null ? latestValue : "Loading..."}
      </Text>

      {/* Progress Ring */}
      <View style={styles.ringContainer}>
        <Progress.Circle
          size={120}
          progress={normalizedValue}
          showsText
          color="#0ff"
          formatText={() =>
            latestValue !== null ? `${latestValue}` : "..."
          }
          thickness={10}
        />
      </View>
      <Text style={styles.subTitle}>Live Line Chart</Text>
      {dataPoints.length > 0 ? (
        <LineChart
          data={{
            labels: Array(dataPoints.length).fill(""),
            datasets: [{ data: dataPoints }],
          }}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.waitText}>Waiting for data...</Text>
      )}

      <Text style={styles.subTitle}>Stacked Bar Chart</Text>
      {dataPoints.length >= 3 ? (
        <StackedBarChart
          data={{
            labels: ["Set 1", "Set 2", "Set 3"],
            legend: ["Low", "Mid", "High"],
            data: [
              [dataPoints[0] || 0, dataPoints[1] || 0, dataPoints[2] || 0],
              [dataPoints[3] || 0, dataPoints[4] || 0, dataPoints[5] || 0],
              [dataPoints[6] || 0, dataPoints[7] || 0, dataPoints[8] || 0],
            ],
            barColors: ["#0ff", "#08f", "#0055ff"],
          }}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.waitText}>Loading bar chart data...</Text>
      )}
    </ScrollView>
  );
};

export default dashboard;

const chartConfig = {
  backgroundColor: "#1E2923",
  backgroundGradientFrom: "#08130D",
  backgroundGradientTo: "#1F1F1F",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 255, 180, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  logo:{
    height:100,
    width:100,
  },
  label: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
  value: {
    color: "#0ff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
  ringContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  subTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  waitText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});
