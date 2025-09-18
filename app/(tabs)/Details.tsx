import { useScanStore } from "@/store/useScanResult";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Details = () => {
  const selectedScanId = useScanStore((s) => s.selectedScanId);
  const scanResults = useScanStore((s) => s.scanResults);
  const scan = scanResults.find((r) => r.id === selectedScanId);

  if (!scan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No scan selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Details</Text>
      {scan.thumbnailUri ? (
        <Image
          source={{ uri: scan.thumbnailUri }}
          style={styles.fullImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <Text style={styles.numbers}>{scan.numbers.join(" ")}</Text>
      <Text style={styles.timestamp}>
        {new Date(scan.timestamp).toLocaleString()}
      </Text>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00BFA6",
    marginBottom: 24,
    textAlign: "center",
  },
  fullImage: {
    width: "90%",
    height: 320,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#333",
    alignSelf: "center",
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  numbers: { color: "#fff", fontSize: 22, fontWeight: "600", marginBottom: 12 },
  timestamp: { color: "#aaa", fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
