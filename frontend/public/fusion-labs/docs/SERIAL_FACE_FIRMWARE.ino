// ===========================================
// SERIAL WATCH FACE SUPPORT - Add to your INO
// ===========================================
// Add this code to your S3_MiniOS.ino to enable
// installing watch faces via USB serial from the
// web-based Watch Face Library.
// ===========================================

// Add these commands to processSerialCommand():
//   if (command == "WIDGET_LIST_FACES") { listInstalledFaces(); return; }
//   if (command == "WIDGET_WRITE_FACE") { receivingFaceData = true; return; }
//   if (command == "WIDGET_SET_FACE") { setActiveFace(command); return; }

// Add to your globals:
bool receivingFaceData = false;
String faceIdBuffer = "";
String faceDataBuffer = "";
bool waitingForFaceId = false;

// -------------------------------------------
// WATCH FACE SERIAL HANDLER CODE
// -------------------------------------------

void handleFaceSerialData(String line) {
  if (waitingForFaceId) {
    faceIdBuffer = line;
    waitingForFaceId = false;
    faceDataBuffer = "";
    USBSerial.println("READY_FOR_FACE_DATA");
    return;
  }
  
  if (line == "END_FACE_DATA") {
    receivingFaceData = false;
    saveFaceToSD(faceIdBuffer, faceDataBuffer);
    faceIdBuffer = "";
    faceDataBuffer = "";
    return;
  }
  
  faceDataBuffer += line + "\n";
}

void saveFaceToSD(String faceId, String faceJson) {
  if (!sdCardAvailable) {
    USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
    return;
  }
  
  // Create face directory
  String facePath = "/WATCH/FACES/custom/" + faceId;
  
  if (!SD_MMC.exists("/WATCH/FACES/custom")) {
    SD_MMC.mkdir("/WATCH/FACES/custom");
  }
  
  if (!SD_MMC.exists(facePath.c_str())) {
    SD_MMC.mkdir(facePath.c_str());
  }
  
  // Write face.json
  String jsonPath = facePath + "/face.json";
  File faceFile = SD_MMC.open(jsonPath.c_str(), FILE_WRITE);
  
  if (!faceFile) {
    USBSerial.println("ERROR:CANNOT_CREATE_FACE_FILE");
    return;
  }
  
  faceFile.print(faceJson);
  faceFile.close();
  
  USBSerial.println("FACE_SAVED:" + faceId);
  USBSerial.println("PATH:" + jsonPath);
  
  // Rescan faces to update list
  scanSDFaces();
  USBSerial.println("FACES_RESCANNED");
}

void listInstalledFaces() {
  USBSerial.println("FACE_LIST_START");
  
  // List built-in faces
  USBSerial.println("BUILTIN:MinimalDark");
  USBSerial.println("BUILTIN:DigitalSimple");
  USBSerial.println("BUILTIN:AnalogClassic");
  
  // List custom faces from SD
  if (sdCardAvailable) {
    File customDir = SD_MMC.open("/WATCH/FACES/custom");
    if (customDir && customDir.isDirectory()) {
      File faceDir = customDir.openNextFile();
      while (faceDir) {
        if (faceDir.isDirectory()) {
          String facePath = String(faceDir.path()) + "/face.json";
          if (SD_MMC.exists(facePath.c_str())) {
            File faceJson = SD_MMC.open(facePath.c_str(), FILE_READ);
            if (faceJson) {
              String jsonContent = faceJson.readString();
              faceJson.close();
              
              // Extract face name from JSON
              int nameStart = jsonContent.indexOf("\"name\":");
              if (nameStart > 0) {
                int valueStart = jsonContent.indexOf("\"", nameStart + 7) + 1;
                int valueEnd = jsonContent.indexOf("\"", valueStart);
                String faceName = jsonContent.substring(valueStart, valueEnd);
                USBSerial.println("CUSTOM:" + String(faceDir.name()) + ":" + faceName);
              }
            }
          }
        }
        faceDir = customDir.openNextFile();
      }
      customDir.close();
    }
    
    // List imported faces
    File importedDir = SD_MMC.open("/WATCH/FACES/imported");
    if (importedDir && importedDir.isDirectory()) {
      File faceDir = importedDir.openNextFile();
      while (faceDir) {
        if (faceDir.isDirectory()) {
          String facePath = String(faceDir.path()) + "/face.json";
          if (SD_MMC.exists(facePath.c_str())) {
            USBSerial.println("IMPORTED:" + String(faceDir.name()));
          }
        }
        faceDir = importedDir.openNextFile();
      }
      importedDir.close();
    }
  }
  
  USBSerial.println("FACE_LIST_END");
}

void setActiveFace(String faceId) {
  // Update user.json with new face selection
  if (!sdCardAvailable) {
    USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
    return;
  }
  
  // Read current user config
  File userFile = SD_MMC.open("/WATCH/CONFIG/user.json", FILE_READ);
  if (!userFile) {
    USBSerial.println("ERROR:USER_CONFIG_NOT_FOUND");
    return;
  }
  
  String userJson = userFile.readString();
  userFile.close();
  
  // Update watch_face field
  int faceStart = userJson.indexOf("\"watch_face\":");
  if (faceStart > 0) {
    int valueStart = userJson.indexOf("\"", faceStart + 13) + 1;
    int valueEnd = userJson.indexOf("\"", valueStart);
    userJson = userJson.substring(0, valueStart) + faceId + userJson.substring(valueEnd);
  }
  
  // Write updated config
  userFile = SD_MMC.open("/WATCH/CONFIG/user.json", FILE_WRITE);
  if (userFile) {
    userFile.print(userJson);
    userFile.close();
    USBSerial.println("FACE_SET:" + faceId);
    
    // Reload user config
    loadUserConfigFromSD();
    USBSerial.println("CONFIG_RELOADED");
  } else {
    USBSerial.println("ERROR:CANNOT_WRITE_CONFIG");
  }
}

// -------------------------------------------
// HOLD-TO-CHANGE FACE DETECTION
// -------------------------------------------
// Add this to your touch handling code in loop()

unsigned long faceHoldStartTime = 0;
bool faceHoldActive = false;
const unsigned long FACE_HOLD_DURATION = 5000; // 5 seconds

void checkFaceHoldGesture(bool touchActive, int touchX, int touchY) {
  // Only detect on main watch face screen
  if (currentCategory != 0) { // Assuming 0 is watch face
    faceHoldActive = false;
    return;
  }
  
  if (touchActive) {
    if (!faceHoldActive) {
      faceHoldStartTime = millis();
      faceHoldActive = true;
    } else {
      unsigned long holdDuration = millis() - faceHoldStartTime;
      
      // Visual feedback - show progress ring
      if (holdDuration > 500) {
        float progress = min((float)(holdDuration - 500) / (FACE_HOLD_DURATION - 500), 1.0f);
        // Draw progress ring around screen edge
        // lv_obj_set_style_arc_width(progressArc, 4, 0);
        // lv_arc_set_value(progressArc, (int)(progress * 100));
      }
      
      // Trigger face selection after hold duration
      if (holdDuration >= FACE_HOLD_DURATION) {
        faceHoldActive = false;
        enterFaceSelectionMode();
      }
    }
  } else {
    faceHoldActive = false;
    // Hide progress ring
  }
}

void enterFaceSelectionMode() {
  // Switch UI to face selection carousel
  USBSerial.println("FACE_SELECTION_MODE");
  // Implementation depends on your LVGL UI structure
  // Typically: create horizontal swipe list of faces
}

// ===========================================
// END OF WATCH FACE SERIAL HANDLER CODE
// ===========================================
