import { useScanStore } from "@/store/useScanResult";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";

const Scaner = () => {
  const setCameraError = useScanStore((s) => s.setCameraError);
  const cameraPermission = useScanStore((s) => s.camerPermission);
  const setCameraPermissionStatus = useScanStore(
    (s) => s.setCameraPermissionStatus
  );

  const device = useCameraDevice("back");

  useEffect(() => {
    (async () => {
      // 1. Get current status
      const status = await Camera.getCameraPermissionStatus();

      if (status === "not-determined") {
        // 2. Ask for permission
        const newStatus = await Camera.requestCameraPermission();
        setCameraPermissionStatus(newStatus);
      } else {
        // Already "authorized" or "denied"
        setCameraPermissionStatus(status);
      }
    })();
  }, []);

  const handleOpenCamera = () => {
    if (cameraPermission === "granted") {
      router.replace("/CameraScreen");
    } else if (cameraPermission === "denied") {
      setCameraError(
        "Camera permission denied. Please enable it in settings to continue."
      );
    } else {
      setCameraError("Camera permission is required to scan documents.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Documents</Text>

      <TouchableOpacity style={styles.button} onPress={handleOpenCamera}>
        <Ionicons
          name="camera"
          size={32}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>
        Tap to start scanning and extracting numbers
      </Text>
    </View>
  );
};

export default Scaner;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fefefe",
    marginBottom: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00BFA6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: "#00BFA6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  subtitle: { fontSize: 16, color: "#666" },
});
