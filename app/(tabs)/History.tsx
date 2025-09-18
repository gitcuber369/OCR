import { useScanStore } from "@/store/useScanResult";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const History = () => {
  const scanResults = useScanStore((s) => s.scanResults);

  if (!scanResults.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No scans yet. Start scanning to see history!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      <FlatList
        data={scanResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              useScanStore.getState().selectScan(item.id);
              router.push("/Details");
            }}
          >
            {item.thumbnailUri ? (
              <Image
                source={{ uri: item.thumbnailUri }}
                style={styles.thumbnail}
              />
            ) : (
              <View style={styles.thumbnailPlaceholder} />
            )}
            <View style={styles.info}>
              <Text style={styles.numbers}>{item.numbers.join(" ")}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingTop: 48 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00BFA6",
    marginBottom: 24,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#00BFA6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#333",
  },
  thumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  info: { flex: 1 },
  numbers: { color: "#fff", fontSize: 18, fontWeight: "600" },
  timestamp: { color: "#aaa", fontSize: 14, marginTop: 4 },
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
