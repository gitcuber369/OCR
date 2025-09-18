// ...existing imports and component code...
import ImageEditor from "@react-native-community/image-editor";
import { router } from "expo-router";
import { useScanStore } from "@/store/useScanResult";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MlkitOcr from "react-native-mlkit-ocr";
import {
  Camera,
  CameraDevice,
  useCameraDevices,
} from "react-native-vision-camera";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const RECT_WIDTH = Math.round(screenWidth * 0.8);
const RECT_HEIGHT = Math.round(RECT_WIDTH * 0.5); // 2:1 aspect ratio

const CameraScreen = () => {
  const addScanResult = useScanStore((s) => s.addScanResult);
  const camera = useRef<any>(null);
  const devices = useCameraDevices();
  const backCamera =
    devices?.find((d: CameraDevice) => d.position === "back") ?? null;
  const [ocrResult, setOcrResult] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async () => {
    if (!camera.current || typeof camera.current.takePhoto !== "function") {
      setError("Camera not ready or photo capture not supported.");
      return;
    }
    setCapturing(true);
    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: "quality",
        skipMetadata: true,
      });
      // Calculate cropping rectangle in image coordinates
      const imageWidth = photo.width;
      const imageHeight = photo.height;
      const scaleX = imageWidth / screenWidth;
      const scaleY = imageHeight / screenHeight;
      const cropData = {
        offset: {
          x: ((screenWidth - RECT_WIDTH) / 2) * scaleX,
          y: ((screenHeight - RECT_HEIGHT) / 2) * scaleY,
        },
        size: {
          width: RECT_WIDTH * scaleX,
          height: RECT_HEIGHT * scaleY,
        },
        displaySize: {
          width: RECT_WIDTH,
          height: RECT_HEIGHT,
        },
        resizeMode: "contain" as const,
      };
      // Ensure photo.path has file:// protocol
      const photoPath = photo.path.startsWith("file://")
        ? photo.path
        : `file://${photo.path}`;
      // Crop the image
      const croppedResult = await ImageEditor.cropImage(photoPath, cropData);
      // Ensure croppedResult.uri has file:// protocol
      const croppedUri =
        croppedResult.uri && croppedResult.uri.startsWith("file://")
          ? croppedResult.uri
          : `file://${croppedResult.uri}`;
      // Run OCR on cropped image
      const ocrTextBlocks = await MlkitOcr.detectFromFile(croppedUri);
      const numbers =
        ocrTextBlocks
          .map((block: any) => block.text)
          .join(" ")
          .match(/\d+(\.\d+)?/g) || [];
      setOcrResult(numbers);
      setModalVisible(true);
      // Save scan result to Zustand
      const scanResult = {
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        timestamp: Date.now(),
        numbers,
        thumbnailUri: croppedUri,
      };
      addScanResult(scanResult);
    } catch (e: any) {
      setError(
        "Failed to capture/crop/OCR image: " + (e?.message || "Unknown error")
      );
    }
    setCapturing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.replace("/(tabs)/Scaner")}
        >
          <Text style={styles.headerBackText}>{"← Home"}</Text>
        </TouchableOpacity>
      </View>

      {backCamera ? (
        <Camera
          ref={camera}
          style={styles.camera}
          device={backCamera}
          isActive={true}
          photo={true}
        />
      ) : (
        <View style={styles.loading}>
          <Text>Loading camera...</Text>
        </View>
      )}
      {/* Overlay Rectangle */}
      <View
        style={[
          styles.overlay,
          {
            width: RECT_WIDTH,
            height: RECT_HEIGHT,
            top: (screenHeight - RECT_HEIGHT) / 2,
            left: (screenWidth - RECT_WIDTH) / 2,
          },
        ]}
      />
      {/* Mask (top, bottom, left, right) */}
      <View
        style={[
          styles.mask,
          {
            top: 0,
            left: 0,
            right: 0,
            height: (screenHeight - RECT_HEIGHT) / 2,
          },
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            bottom: 0,
            left: 0,
            right: 0,
            height: (screenHeight - RECT_HEIGHT) / 2,
          },
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            top: (screenHeight - RECT_HEIGHT) / 2,
            left: 0,
            width: (screenWidth - RECT_WIDTH) / 2,
            height: RECT_HEIGHT,
          },
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            top: (screenHeight - RECT_HEIGHT) / 2,
            right: 0,
            width: (screenWidth - RECT_WIDTH) / 2,
            height: RECT_HEIGHT,
          },
        ]}
      />
      {/* Capture Button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
          disabled={capturing}
        >
          <Text style={styles.captureText}>
            {capturing ? "Capturing..." : "Capture"}
          </Text>
        </TouchableOpacity>
        {error ? (
          <Text style={{ color: "#d32f2f", marginTop: 12 }}>{error}</Text>
        ) : null}
      </View>

      {/* Minimal Modal for OCR Result */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Numbers Found</Text>
            <Text style={styles.modalNumbers}>{ocrResult.join(" ")}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 32,
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: "flex-start",
    paddingHorizontal: 16,
  },
  headerBackButton: {
    backgroundColor: "#222",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerBackText: {
    color: "#00BFA6",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  overlay: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#00BFA6",
    borderRadius: 16,
    zIndex: 10,
  },
  mask: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9,
  },
  captureContainer: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  captureButton: {
    backgroundColor: "#00BFA6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: "#00BFA6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  captureText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    minWidth: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    color: "#00BFA6",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalNumbers: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  modalCloseButton: {
    backgroundColor: "#00BFA6",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CameraScreen;
