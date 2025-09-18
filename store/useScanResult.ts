import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface ScanResult {
  id: string;
  timestamp: number;
  numbers: string[];
  thumbnailUri?: string;
}

type PermissionStatus = "granted" | "denied" | "undetermined";

interface ScanStore {
  scanResults: ScanResult[];
  selectedScanId: string | null;
  camerPermission: PermissionStatus;
  cameraError: string | null;
  addScanResult: (result: ScanResult) => void;
  loadScanResults: (results: ScanResult[]) => void;
  selectScan: (id: string | null) => void;
  setCameraPermissionStatus: (status: PermissionStatus) => void;
  setCameraError: (error: string | null) => void;
  clearCamerError: () => void;
}

export const useScanStore = create<ScanStore>((set, get) => ({
  scanResults: [],
  selectedScanId: null,
  camerPermission: "undetermined",
  cameraError: null,
  addScanResult: async (result) => {
    const updated = [result, ...get().scanResults];
    set({ scanResults: updated });
    await AsyncStorage.setItem("scanResults", JSON.stringify(updated));
  },
  loadScanResults: (results) => set({ scanResults: results }),
  selectScan: (id) => set({ selectedScanId: id }),
  setCameraPermissionStatus: (status) => set({ camerPermission: status }),
  setCameraError: (error) => set({ cameraError: error }),
  clearCamerError: () => set({ cameraError: null }),
}));

// Load scanResults from AsyncStorage on app start
AsyncStorage.getItem("scanResults").then((data) => {
  if (data) {
    try {
      const results = JSON.parse(data);
      if (Array.isArray(results)) {
        useScanStore.getState().loadScanResults(results);
      }
    } catch {}
  }
});
