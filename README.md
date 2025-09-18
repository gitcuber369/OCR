# OCR Scanner App

## Overview

A minimal mobile app for scanning numbers from documents using the camera, cropping to a guide rectangle, running OCR, and storing results/history. Built with Expo, React Native, Zustand, and react-native-mlkit-ocr.

## Features

- Live camera preview with overlay rectangle guide
- Fixed aspect ratio rectangle with responsive sizing
- Subtle mask outside rectangle for visual guidance
- Capture button with camera permissions handling
- Graceful error handling for camera and permissions
- Cropping to exact rectangle bounds in pixels
- OCR digit extraction (including decimals)
- Filtering non-numeric content
- Scan results stored with unique ID, timestamp, numbers array, and thumbnail
- History and detail screens for scan results
- Empty states and error handling throughout UI
- Smooth navigation and minimal UI

## Setup Instructions

### Prerequisites

- Node.js & npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio or Xcode (for device/simulator)

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/gitcuber369/OCR.git
   cd OCR
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the app:
   ```sh
   expo start
   ```
4. Run on device/emulator:
   - Android: Scan QR or use emulator
   - iOS: Use simulator or Expo Go

### Permissions

- Camera permission is requested on first use with clear messaging.
- If denied, user is prompted to enable in settings.

## Technical Decisions

- **Camera:** `react-native-vision-camera` for fast, reliable preview and capture.
- **OCR:** `react-native-mlkit-ocr` for on-device text recognition.
- **Cropping:** `@react-native-community/image-editor` for pixel-accurate cropping.
- **State:** `Zustand` for simple, global state management.
- **Navigation:** Expo Router for file-based navigation.

## Rectangle-to-Image Mapping Logic

- Rectangle is centered and sized responsively.
- Cropping uses screen-to-image scaling:
  - `scaleX = imageWidth / screenWidth`
  - `scaleY = imageHeight / screenHeight`
  - Crop bounds calculated from overlay rectangle position and size.

## OCR & Number Extraction

- OCR runs on cropped image only.
- Extracts all digit sequences, including decimals, using regex: `/\d+(\.\d+)?/g`
- Filters out non-numeric content.
- Returns array of strings in reading order.

## Known Limitations

- History is not persisted after app restart (unless AsyncStorage is enabled).
- OCR accuracy depends on image quality and lighting.
- Only numbers are extracted; other text is ignored.
- iOS support is basic; Android is primary target.
- No cloud sync or export.

## Potential Improvements

- Persist history with AsyncStorage
- Add animations and UI polish
- Support for multi-page scans
- Export or share scan results
- Advanced error handling and analytics

## Demo

- Record a 30-90 second screen video showing:
  - Camera interface
  - Number capture
  - History screen
  - Detail screen

## License

MIT
