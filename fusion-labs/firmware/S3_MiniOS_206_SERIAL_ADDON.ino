// ============================================================
// WIDGET OS SERIAL CONFIG & FACE SUPPORT - S3_MiniOS_206 VERSION
// ============================================================
// Copy and paste this code into your S3_MiniOS_206.ino file
// This adds support for:
// 1. WiFi config read/write via USB serial
// 2. Watch face install via USB serial
// 3. Hold-to-change face gesture (5 seconds)
// 
// Board: WOS-206A (2.06" AMOLED, 410x502, CO5300)
// ============================================================

// ============================================
// GLOBAL VARIABLES - Add near the top of your INO
// ============================================

// Serial Config Handler
String serialInputBuffer = "";
bool receivingWifiConfig = false;
String wifiConfigBuffer = "";

// Serial Face Handler  
bool receivingFaceData = false;
String faceIdBuffer = "";
String faceDataBuffer = "";
bool waitingForFaceId = false;

// Hold-to-Change Face Detection
unsigned long faceHoldStartTime = 0;
bool faceHoldActive = false;
const unsigned long FACE_HOLD_DURATION = 5000; // 5 seconds
bool inFaceSelectionMode = false;
int faceSelectionIndex = 0;
lv_obj_t* faceSelectionScreen = nullptr;
lv_obj_t* faceSelectionLabel = nullptr;
lv_obj_t* holdProgressArc = nullptr;

// ============================================
// ADD TO setup() - After USBSerial.begin(115200);
// ============================================

void setupSerialConfigHandler() {
  USBSerial.println("=================================");
  USBSerial.println("Widget OS Serial Config Ready");
  USBSerial.println("Board: WOS-206A (2.06\" AMOLED)");
  USBSerial.println("=================================");
  USBSerial.println("Commands:");
  USBSerial.println("  WIDGET_PING       - Test connection");
  USBSerial.println("  WIDGET_STATUS     - Get device info");
  USBSerial.println("  WIDGET_READ_WIFI  - Read WiFi config");
  USBSerial.println("  WIDGET_WRITE_WIFI - Write WiFi config");
  USBSerial.println("  WIDGET_LIST_FACES - List installed faces");
  USBSerial.println("  WIDGET_WRITE_FACE - Install new face");
  USBSerial.println("  WIDGET_SET_FACE   - Set active face");
  USBSerial.println("=================================");
}

// ============================================
// ADD TO loop() - Near the beginning
// ============================================

void handleSerialInput() {
  while (USBSerial.available()) {
    char c = USBSerial.read();
    
    if (c == '\n') {
      processSerialCommand(serialInputBuffer);
      serialInputBuffer = "";
    } else if (c != '\r') {
      serialInputBuffer += c;
      
      // Prevent buffer overflow
      if (serialInputBuffer.length() > 2048) {
        serialInputBuffer = "";
        USBSerial.println("ERROR:BUFFER_OVERFLOW");
      }
    }
  }
}

// ============================================
// SERIAL COMMAND PROCESSOR
// ============================================

void processSerialCommand(String command) {
  command.trim();
  
  // Handle WiFi config data receiving
  if (receivingWifiConfig) {
    if (command == "END_WIFI_CONFIG") {
      receivingWifiConfig = false;
      saveWifiConfigToSD(wifiConfigBuffer);
      wifiConfigBuffer = "";
    } else {
      wifiConfigBuffer += command + "\n";
    }
    return;
  }
  
  // Handle Face data receiving
  if (receivingFaceData) {
    if (waitingForFaceId) {
      faceIdBuffer = command;
      waitingForFaceId = false;
      faceDataBuffer = "";
      USBSerial.println("READY_FOR_FACE_DATA");
      return;
    }
    if (command == "END_FACE_DATA") {
      receivingFaceData = false;
      saveFaceToSD(faceIdBuffer, faceDataBuffer);
      faceIdBuffer = "";
      faceDataBuffer = "";
    } else {
      faceDataBuffer += command + "\n";
    }
    return;
  }
  
  // Standard commands
  if (command == "WIDGET_PING") {
    USBSerial.println("WIDGET_PONG");
    return;
  }
  
  if (command == "WIDGET_STATUS") {
    sendDeviceStatus();
    return;
  }
  
  if (command == "WIDGET_READ_WIFI") {
    sendWifiConfig();
    return;
  }
  
  if (command == "WIDGET_WRITE_WIFI") {
    receivingWifiConfig = true;
    wifiConfigBuffer = "";
    USBSerial.println("READY_FOR_WIFI_CONFIG");
    return;
  }
  
  if (command == "WIDGET_LIST_FACES") {
    listInstalledFaces();
    return;
  }
  
  if (command == "WIDGET_WRITE_FACE") {
    receivingFaceData = true;
    waitingForFaceId = true;
    USBSerial.println("WAITING_FOR_FACE_ID");
    return;
  }
  
  if (command.startsWith("WIDGET_SET_FACE:")) {
    String faceId = command.substring(16);
    setActiveFace(faceId);
    return;
  }
  
  // Unknown command
  if (command.length() > 0) {
    USBSerial.println("UNKNOWN_COMMAND:" + command);
  }
}

// ============================================
// DEVICE STATUS - 206A VERSION
// ============================================

void sendDeviceStatus() {
  USBSerial.println("WIDGET_STATUS_START");
  USBSerial.println("DEVICE:Widget OS Watch");
  USBSerial.println("VERSION:1.0.0");
  USBSerial.println("BOARD:WOS-206A");
  USBSerial.println("SCREEN:410x502");
  USBSerial.println("DISPLAY:CO5300");
  USBSerial.println("SD_CARD:" + String(sdCardInitialized ? "YES" : "NO"));
  if (sdCardInitialized) {
    USBSerial.println("SD_SIZE_MB:" + String(sdCardSizeMB));
    USBSerial.println("SD_USED_MB:" + String(sdCardUsedMB));
  }
  USBSerial.println("WIFI:" + String(wifiConnected ? WiFi.SSID() : "Not Connected"));
  USBSerial.println("BATTERY:" + String(batteryPercent) + "%");
  USBSerial.println("CHARGING:" + String(isCharging ? "YES" : "NO"));
  USBSerial.println("RTC:" + String(hasRTC ? "YES" : "NO"));
  USBSerial.println("IMU:" + String(hasIMU ? "YES" : "NO"));
  USBSerial.println("CURRENT_FACE:" + String(userData.watch_face));
  USBSerial.println("WIDGET_STATUS_END");
}

// ============================================
// WIFI CONFIG READ/WRITE
// ============================================

void sendWifiConfig() {
  if (!sdCardInitialized) {
    USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
    return;
  }
  
  File configFile = SD_MMC.open("/WATCH/wifi/config.txt", FILE_READ);
  if (!configFile) {
    USBSerial.println("ERROR:CONFIG_FILE_NOT_FOUND");
    // Send empty config template
    USBSerial.println("WIFI_CONFIG:");
    USBSerial.println("# Widget OS WiFi Configuration");
    USBSerial.println("WIFI1_SSID=");
    USBSerial.println("WIFI1_PASS=");
    USBSerial.println("CITY=Perth");
    USBSerial.println("COUNTRY=AU");
    USBSerial.println("GMT_OFFSET=8");
    USBSerial.println("END_WIFI_CONFIG");
    return;
  }
  
  USBSerial.println("WIFI_CONFIG:");
  while (configFile.available()) {
    String line = configFile.readStringUntil('\n');
    line.trim();
    if (line.length() > 0 && !line.startsWith("#")) {
      USBSerial.println(line);
    }
  }
  configFile.close();
  USBSerial.println("END_WIFI_CONFIG");
}

void saveWifiConfigToSD(String config) {
  if (!sdCardInitialized) {
    USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
    return;
  }
  
  if (!SD_MMC.exists("/WATCH/wifi")) {
    SD_MMC.mkdir("/WATCH/wifi");
  }
  
  File configFile = SD_MMC.open("/WATCH/wifi/config.txt", FILE_WRITE);
  if (!configFile) {
    USBSerial.println("ERROR:CANNOT_CREATE_FILE");
    return;
  }
  
  configFile.println("# Widget OS WiFi Configuration");
  configFile.println("# Updated via USB Serial Config Tool");
  configFile.println("# " + String(__DATE__) + " " + String(__TIME__));
  configFile.println();
  configFile.print(config);
  configFile.close();
  
  USBSerial.println("WIFI_CONFIG_SAVED");
  loadWiFiConfigFromSD();
  USBSerial.println("WIFI_CONFIG_RELOADED");
  
  if (numWifiNetworks > 0) {
    USBSerial.println("ATTEMPTING_WIFI_RECONNECT");
    WiFi.disconnect();
    delay(500);
  }
}

// ============================================
// WATCH FACE MANAGEMENT
// ============================================

void listInstalledFaces() {
  USBSerial.println("FACE_LIST_START");
  
  USBSerial.println("BUILTIN:Minimal:Minimal Dark");
  USBSerial.println("BUILTIN:Digital:Digital Simple");
  USBSerial.println("BUILTIN:Analog:Analog Classic");
  USBSerial.println("BUILTIN:Modular:Modular Compact");
  
  if (sdCardInitialized) {
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
              
              int nameStart = jsonContent.indexOf("\"name\"");
              if (nameStart >= 0) {
                int colonPos = jsonContent.indexOf(":", nameStart);
                int quoteStart = jsonContent.indexOf("\"", colonPos + 1) + 1;
                int quoteEnd = jsonContent.indexOf("\"", quoteStart);
                if (quoteStart > 0 && quoteEnd > quoteStart) {
                  String faceName = jsonContent.substring(quoteStart, quoteEnd);
                  USBSerial.println("CUSTOM:" + String(faceDir.name()) + ":" + faceName);
                }
              }
            }
          }
        }
        faceDir = customDir.openNextFile();
      }
      customDir.close();
    }
    
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

void saveFaceToSD(String faceId, String faceJson) {
  if (!sdCardInitialized) {
    USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
    return;
  }
  
  faceId.replace("/", "");
  faceId.replace("\\", "");
  faceId.replace("..", "");
  
  String facePath = "/WATCH/FACES/custom/" + faceId;
  
  if (!SD_MMC.exists("/WATCH/FACES/custom")) {
    SD_MMC.mkdir("/WATCH/FACES/custom");
  }
  
  if (!SD_MMC.exists(facePath.c_str())) {
    if (!SD_MMC.mkdir(facePath.c_str())) {
      USBSerial.println("ERROR:CANNOT_CREATE_FACE_DIR");
      return;
    }
  }
  
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
  
  scanSDFaces();
  USBSerial.println("FACES_RESCANNED");
  USBSerial.println("TOTAL_CUSTOM_FACES:" + String(numSDFaces));
}

void setActiveFace(String faceId) {
  USBSerial.println("SETTING_FACE:" + faceId);
  
  faceId.toCharArray(userData.watch_face, sizeof(userData.watch_face));
  prefs.putString("watch_face", faceId);
  
  if (sdCardInitialized) {
    saveUserConfigToSD();
  }
  
  USBSerial.println("FACE_SET:" + faceId);
  
  if (inFaceSelectionMode) {
    exitFaceSelectionMode();
  }
  
  USBSerial.println("UI_REFRESH_NEEDED");
}

// ============================================
// HOLD-TO-CHANGE FACE GESTURE DETECTION
// ============================================

void checkFaceHoldGesture(bool touchActive, int16_t touchX, int16_t touchY) {
  if (currentCategory != CAT_CLOCK || inFaceSelectionMode) {
    faceHoldActive = false;
    hideHoldProgress();
    return;
  }
  
  if (touchActive) {
    if (!faceHoldActive) {
      faceHoldStartTime = millis();
      faceHoldActive = true;
      USBSerial.println("FACE_HOLD_STARTED");
    } else {
      unsigned long holdDuration = millis() - faceHoldStartTime;
      
      if (holdDuration > 500) {
        float progress = (float)(holdDuration - 500) / (float)(FACE_HOLD_DURATION - 500);
        progress = min(progress, 1.0f);
        showHoldProgress(progress);
      }
      
      if (holdDuration >= FACE_HOLD_DURATION) {
        faceHoldActive = false;
        hideHoldProgress();
        enterFaceSelectionMode();
      }
    }
  } else {
    if (faceHoldActive) {
      faceHoldActive = false;
      hideHoldProgress();
      USBSerial.println("FACE_HOLD_CANCELLED");
    }
  }
}

void showHoldProgress(float progress) {
  if (holdProgressArc == nullptr) {
    holdProgressArc = lv_arc_create(lv_scr_act());
    lv_obj_set_size(holdProgressArc, 140, 140); // Slightly larger for 2.06" screen
    lv_obj_center(holdProgressArc);
    lv_arc_set_rotation(holdProgressArc, 270);
    lv_arc_set_bg_angles(holdProgressArc, 0, 360);
    lv_obj_remove_style(holdProgressArc, NULL, LV_PART_KNOB);
    lv_obj_set_style_arc_width(holdProgressArc, 10, LV_PART_MAIN);
    lv_obj_set_style_arc_width(holdProgressArc, 10, LV_PART_INDICATOR);
    lv_obj_set_style_arc_color(holdProgressArc, lv_color_hex(0x333333), LV_PART_MAIN);
    lv_obj_set_style_arc_color(holdProgressArc, lv_color_hex(0x3B82F6), LV_PART_INDICATOR);
  }
  
  lv_arc_set_value(holdProgressArc, (int)(progress * 100));
  lv_obj_clear_flag(holdProgressArc, LV_OBJ_FLAG_HIDDEN);
}

void hideHoldProgress() {
  if (holdProgressArc != nullptr) {
    lv_obj_add_flag(holdProgressArc, LV_OBJ_FLAG_HIDDEN);
  }
}

// ============================================
// FACE SELECTION MODE (Apple Watch Style)
// ============================================

void enterFaceSelectionMode() {
  USBSerial.println("ENTERING_FACE_SELECTION_MODE");
  inFaceSelectionMode = true;
  faceSelectionIndex = 0;
  
  faceSelectionScreen = lv_obj_create(NULL);
  lv_obj_set_style_bg_color(faceSelectionScreen, lv_color_hex(0x000000), 0);
  
  lv_obj_t* title = lv_label_create(faceSelectionScreen);
  lv_label_set_text(title, "SELECT FACE");
  lv_obj_set_style_text_color(title, lv_color_hex(0xFFFFFF), 0);
  lv_obj_set_style_text_font(title, &lv_font_montserrat_18, 0);
  lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 30);
  
  faceSelectionLabel = lv_label_create(faceSelectionScreen);
  lv_obj_set_style_text_color(faceSelectionLabel, lv_color_hex(0xFFFFFF), 0);
  lv_obj_set_style_text_font(faceSelectionLabel, &lv_font_montserrat_24, 0);
  lv_obj_align(faceSelectionLabel, LV_ALIGN_CENTER, 0, 0);
  
  lv_obj_t* hint = lv_label_create(faceSelectionScreen);
  lv_label_set_text(hint, "< Swipe to browse >\nTap to select");
  lv_obj_set_style_text_color(hint, lv_color_hex(0x888888), 0);
  lv_obj_set_style_text_align(hint, LV_TEXT_ALIGN_CENTER, 0);
  lv_obj_align(hint, LV_ALIGN_BOTTOM_MID, 0, -40);
  
  updateFaceSelectionLabel();
  lv_scr_load(faceSelectionScreen);
}

void exitFaceSelectionMode() {
  USBSerial.println("EXITING_FACE_SELECTION_MODE");
  inFaceSelectionMode = false;
  
  if (faceSelectionScreen != nullptr) {
    lv_obj_del(faceSelectionScreen);
    faceSelectionScreen = nullptr;
    faceSelectionLabel = nullptr;
  }
}

void updateFaceSelectionLabel() {
  if (faceSelectionLabel == nullptr) return;
  String faceName = getFaceNameAtIndex(faceSelectionIndex);
  lv_label_set_text(faceSelectionLabel, faceName.c_str());
}

String getFaceNameAtIndex(int index) {
  const char* builtInFaces[] = {"Minimal", "Digital", "Analog", "Modular"};
  int numBuiltIn = 4;
  
  if (index < numBuiltIn) {
    return String(builtInFaces[index]);
  }
  
  int customIndex = index - numBuiltIn;
  if (customIndex < numSDFaces) {
    return String(sdFaces[customIndex].name);
  }
  
  return "Unknown";
}

int getTotalFaceCount() {
  return 4 + numSDFaces;
}

void handleFaceSelectionSwipe(int direction) {
  int totalFaces = getTotalFaceCount();
  faceSelectionIndex += direction;
  
  if (faceSelectionIndex < 0) {
    faceSelectionIndex = totalFaces - 1;
  } else if (faceSelectionIndex >= totalFaces) {
    faceSelectionIndex = 0;
  }
  
  updateFaceSelectionLabel();
  USBSerial.println("FACE_SELECTION_INDEX:" + String(faceSelectionIndex));
}

void handleFaceSelectionTap() {
  String faceId = getFaceIdAtIndex(faceSelectionIndex);
  USBSerial.println("FACE_SELECTED:" + faceId);
  setActiveFace(faceId);
  exitFaceSelectionMode();
}

String getFaceIdAtIndex(int index) {
  const char* builtInIds[] = {"Minimal", "Digital", "Analog", "Modular"};
  int numBuiltIn = 4;
  
  if (index < numBuiltIn) {
    return String(builtInIds[index]);
  }
  
  int customIndex = index - numBuiltIn;
  if (customIndex < numSDFaces) {
    return String(sdFaces[customIndex].path);
  }
  
  return "Minimal";
}

// ============================================
// INTEGRATION INSTRUCTIONS
// ============================================

/*
In setup(), after USBSerial.begin(115200):
  setupSerialConfigHandler();

In loop(), at the beginning:
  handleSerialInput();
  
In your touch handler, add:
  checkFaceHoldGesture(touchActive, touchX, touchY);
  
  if (inFaceSelectionMode) {
    // Handle swipe and tap for face selection
    // handleFaceSelectionSwipe(-1) for left
    // handleFaceSelectionSwipe(1) for right
    // handleFaceSelectionTap() for selection
  }
*/

// ============================================
// END OF SERIAL CONFIG & FACE SUPPORT CODE
// ============================================
