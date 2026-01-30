// ===========================================
// SERIAL WIFI CONFIG SUPPORT - Add to your INO
// ===========================================
// Add this code to your S3_MiniOS.ino to enable
// reading/writing WiFi config via USB serial
// from the web-based WiFi Config Tool.
// ===========================================

// Add to setup() after USBSerial.begin(115200):
//   setupSerialConfigHandler();

// Add to loop():
//   handleSerialConfig();

// -------------------------------------------
// SERIAL CONFIG HANDLER CODE
// -------------------------------------------

String serialBuffer = "";
bool receivingWifiConfig = false;
String wifiConfigBuffer = "";

void setupSerialConfigHandler() {
  USBSerial.println("Serial Config Handler Ready");
  USBSerial.println("Commands: WIDGET_READ_WIFI, WIDGET_WRITE_WIFI, WIDGET_STATUS");
}

void handleSerialConfig() {
  while (USBSerial.available()) {
    char c = USBSerial.read();
    
    if (c == '\n') {
      processSerialCommand(serialBuffer);
      serialBuffer = "";
    } else if (c != '\r') {
      serialBuffer += c;
    }
  }
}

void processSerialCommand(String command) {
  command.trim();
  
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
    USBSerial.println("READY_FOR_CONFIG");
    return;
  }
  
  if (receivingWifiConfig) {
    if (command == "END_WIFI_CONFIG") {
      receivingWifiConfig = false;
      saveWifiConfig(wifiConfigBuffer);
      USBSerial.println("CONFIG_SAVED");
    } else {
      wifiConfigBuffer += command + "\n";
    }
    return;
  }
  
  USBSerial.println("UNKNOWN_COMMAND: " + command);
}

void sendDeviceStatus() {
  USBSerial.println("WIDGET_STATUS_START");
  USBSerial.println("DEVICE:Widget OS Watch");
  USBSerial.println("VERSION:1.0.0");
  USBSerial.println("BOARD:" + String(SCREEN_WIDTH) + "x" + String(SCREEN_HEIGHT));
  USBSerial.println("SD_CARD:" + String(sdCardAvailable ? "YES" : "NO"));
  USBSerial.println("WIFI:" + String(WiFi.status() == WL_CONNECTED ? WiFi.SSID() : "Not Connected"));
  USBSerial.println("WIDGET_STATUS_END");
}

void sendWifiConfig() {
  if (!sdCardAvailable) {
    USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
    return;
  }
  
  File configFile = SD_MMC.open("/WATCH/wifi/config.txt", FILE_READ);
  if (!configFile) {
    USBSerial.println("ERROR:CONFIG_FILE_NOT_FOUND");
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

void saveWifiConfig(String config) {
  if (!sdCardAvailable) {
    USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
    return;
  }
  
  // Ensure directory exists
  if (!SD_MMC.exists("/WATCH/wifi")) {
    SD_MMC.mkdir("/WATCH/wifi");
  }
  
  File configFile = SD_MMC.open("/WATCH/wifi/config.txt", FILE_WRITE);
  if (!configFile) {
    USBSerial.println("ERROR:CANNOT_CREATE_FILE");
    return;
  }
  
  configFile.print("# Widget OS WiFi Configuration\n");
  configFile.print("# Updated via Serial Config Tool\n\n");
  configFile.print(config);
  configFile.close();
  
  USBSerial.println("CONFIG_WRITTEN");
  
  // Reload WiFi config
  loadWiFiConfigFromSD();
  USBSerial.println("CONFIG_RELOADED");
}

// ===========================================
// END OF SERIAL CONFIG HANDLER CODE
// ===========================================
