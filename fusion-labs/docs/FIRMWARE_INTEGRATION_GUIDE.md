# Widget OS Firmware - Serial Command Integration Guide

This document explains how to integrate the web serial features into your existing Widget OS firmware.

## Overview

The Fusion Labs website communicates with your watch via USB Serial using a simple text-based protocol. This guide shows you how to add this functionality to your existing firmware.

## Quick Integration Steps

### Step 1: Add Global Variables

Add these at the top of your `.ino` file, after your other global variables:

```cpp
// ═══════════════════════════════════════════════════════════════════════════════
//  FUSION LABS WEB SERIAL HANDLER - GLOBAL VARIABLES
// ═══════════════════════════════════════════════════════════════════════════════
String serialBuffer = "";
bool receivingWifiConfig = false;
String wifiConfigBuffer = "";
bool receivingFaceData = false;
String faceIdBuffer = "";
String faceDataBuffer = "";
bool waitingForFaceId = false;
char activeWatchFaceId[32] = "default";
```

### Step 2: Add the Serial Handler Function

Add this function to handle incoming serial commands:

```cpp
void handleSerialConfig() {
    while (USBSerial.available()) {
        char c = USBSerial.read();
        
        if (c == '\n') {
            processSerialCommand(serialBuffer);
            serialBuffer = "";
        } else if (c != '\r') {
            serialBuffer += c;
            
            // Prevent buffer overflow
            if (serialBuffer.length() > 4096) {
                serialBuffer = "";
                USBSerial.println("ERROR:BUFFER_OVERFLOW");
            }
        }
    }
}
```

### Step 3: Add the Command Processor

This function routes commands to the appropriate handlers:

```cpp
void processSerialCommand(String command) {
    command.trim();
    
    // Ping/Pong for connection test
    if (command == "WIDGET_PING") {
        USBSerial.println("WIDGET_PONG");
        return;
    }
    
    // Device status
    if (command == "WIDGET_STATUS") {
        sendDeviceStatus();
        return;
    }
    
    // WiFi config commands
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
    
    // Handle WiFi config data
    if (receivingWifiConfig) {
        if (command == "END_WIFI_CONFIG") {
            receivingWifiConfig = false;
            saveWifiConfig(wifiConfigBuffer);
        } else {
            wifiConfigBuffer += command + "\n";
        }
        return;
    }
    
    // Watch face commands
    if (command == "WIDGET_LIST_FACES") {
        listInstalledFaces();
        return;
    }
    
    if (command == "WIDGET_WRITE_FACE") {
        receivingFaceData = true;
        waitingForFaceId = true;
        USBSerial.println("SEND_FACE_ID");
        return;
    }
    
    if (command.startsWith("WIDGET_SET_FACE:")) {
        setActiveFace(command);
        return;
    }
    
    if (command.startsWith("WIDGET_DELETE_FACE:")) {
        deleteFace(command);
        return;
    }
    
    // Handle face data
    if (receivingFaceData) {
        handleFaceSerialData(command);
        return;
    }
    
    // Unknown command
    if (command.length() > 0) {
        USBSerial.println("UNKNOWN_COMMAND:" + command);
    }
}
```

### Step 4: Add Command Handler Functions

#### Device Status:
```cpp
void sendDeviceStatus() {
    USBSerial.println("WIDGET_STATUS_START");
    USBSerial.println("DEVICE:Widget OS Watch");
    USBSerial.println("VERSION:" WIDGET_OS_VERSION);
    USBSerial.printf("BOARD:%dx%d\n", LCD_WIDTH, LCD_HEIGHT);
    USBSerial.printf("DEVICE_ID:%s\n", DEVICE_ID);
    USBSerial.printf("SD_CARD:%s\n", (hasSD && sdCardInitialized) ? "YES" : "NO");
    USBSerial.printf("WIFI:%s\n", (WiFi.status() == WL_CONNECTED) ? WiFi.SSID().c_str() : "Not Connected");
    USBSerial.printf("BATTERY:%d%%\n", batteryPercent);
    USBSerial.printf("FACES:%d\n", numSDFaces);
    USBSerial.println("WIDGET_STATUS_END");
}
```

#### WiFi Config Read:
```cpp
void sendWifiConfig() {
    if (!hasSD || !sdCardInitialized) {
        USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
        return;
    }
    
    if (!SD_MMC.exists(SD_WIFI_CONFIG)) {
        USBSerial.println("ERROR:CONFIG_FILE_NOT_FOUND");
        return;
    }
    
    File configFile = SD_MMC.open(SD_WIFI_CONFIG, FILE_READ);
    if (!configFile) {
        USBSerial.println("ERROR:CANNOT_OPEN_FILE");
        return;
    }
    
    USBSerial.println("WIFI_CONFIG_START");
    while (configFile.available()) {
        String line = configFile.readStringUntil('\n');
        line.trim();
        if (line.length() > 0 && !line.startsWith("#")) {
            USBSerial.println(line);
        }
    }
    configFile.close();
    USBSerial.println("WIFI_CONFIG_END");
}
```

#### WiFi Config Write:
```cpp
void saveWifiConfig(String config) {
    if (!hasSD || !sdCardInitialized) {
        USBSerial.println("ERROR:SD_CARD_NOT_AVAILABLE");
        return;
    }
    
    // Ensure directory exists
    if (!SD_MMC.exists(SD_WIFI_PATH)) {
        SD_MMC.mkdir(SD_WIFI_PATH);
    }
    
    File configFile = SD_MMC.open(SD_WIFI_CONFIG, FILE_WRITE);
    if (!configFile) {
        USBSerial.println("ERROR:CANNOT_CREATE_FILE");
        return;
    }
    
    configFile.println("# Widget OS - WiFi Configuration");
    configFile.println("# Updated via Fusion Labs Web Serial Tool");
    configFile.println();
    configFile.print(config);
    configFile.close();
    
    USBSerial.println("CONFIG_WRITTEN");
    
    // Reload WiFi config
    loadWiFiConfigFromSD();
    USBSerial.println("CONFIG_RELOADED");
}
```

### Step 5: Update Your loop()

Add the serial handler call at the beginning of your `loop()` function:

```cpp
void loop() {
    lv_task_handler();
    
    // Handle web serial commands (Fusion Labs integration)
    handleSerialConfig();
    
    // ... rest of your loop code
}
```

## Testing the Integration

1. Upload the updated firmware to your watch
2. Open the Fusion Labs website
3. Go to the WiFi Config or Watch Face Studio page
4. Click "Connect" and select your watch from the list
5. You should see "WIDGET_PONG" response when connected

## Troubleshooting

### Device not detected?
- Ensure USB CDC On Boot is enabled in Arduino IDE
- Try a different USB cable (some are charge-only)
- Check that the correct COM port is available

### Commands not responding?
- Verify `USBSerial.begin(115200)` is in your `setup()`
- Check serial monitor for any error messages
- Ensure no other program is using the serial port

### SD Card errors?
- Verify SD card is properly formatted (FAT32)
- Check SD card connections
- Ensure `/WATCH/wifi/` directory exists

## Complete Reference Implementation

For a complete working implementation, see:
- `firmware/S3_MiniOS.ino` (1.8" board)
- `firmware/S3_MiniOS_206.ino` (2.06" board)

These files contain the full firmware with all web serial features integrated.
