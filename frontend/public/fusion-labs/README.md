# Fusion Labs - Widget OS Companion Website

A comprehensive web application for custom smartwatches running **Widget OS** or **Fusion OS**. Supports both 1.8" (WOS-180A) and 2.06" (WOS-206A) board sizes.

## 🌟 Features

- **Firmware Updater** - Flash new firmware via USB using WebSerial API
- **WiFi Configuration Tool** - Configure WiFi networks directly via USB (no SD card editing)
- **Watch Face Studio** - Create and install custom watch faces
- **Content Pages** - Information about Widget OS and Fusion OS
- **Interactive Simulator** - Preview watch features

## 📁 Project Structure

```
fusion-labs/
├── docs/
│   ├── FIRMWARE_UPDATE_PROTOCOL.md
│   ├── FIRMWARE_INTEGRATION_GUIDE.md
│   ├── GITHUB_PAGES_DEPLOYMENT.md
│   ├── SERIAL_CONFIG_FIRMWARE.ino
│   └── SERIAL_FACE_FIRMWARE.ino
├── firmware/
│   ├── S3_MiniOS.ino          # 1.8" board firmware with web serial support
│   ├── S3_MiniOS_206.ino      # 2.06" board firmware with web serial support
│   └── widget-os/
│       ├── widgetos_180.bin   # Compiled 1.8" firmware
│       └── widgetos_206.bin   # Compiled 2.06" firmware
└── images/
    └── ...                     # Marketing images and assets
```

## 🚀 Quick Start

### For Website Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/fusion-labs.git
cd fusion-labs

# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

### For Firmware Development

1. Open Arduino IDE
2. Install required libraries (see Libraries section below)
3. Open `firmware/S3_MiniOS.ino` (1.8") or `firmware/S3_MiniOS_206.ino` (2.06")
4. Select your board: `ESP32S3 Dev Module`
5. Configure USB CDC On Boot: `Enabled`
6. Compile and upload

## 📦 Required Arduino Libraries

- `LVGL` (v8.x)
- `ArduinoJson`
- `XPowersLib`
- `SensorLib`
- `Arduino_GFX_Library`
- `Arduino_DriveBus_Library`
- `Adafruit_XCA9554` (1.8" board only)

## 🔌 Web Serial Protocol

The firmware supports the following serial commands for web integration:

### Connection Test
```
TX: WIDGET_PING
RX: WIDGET_PONG
```

### Device Status
```
TX: WIDGET_STATUS
RX: WIDGET_STATUS_START
    DEVICE:Widget OS Watch
    VERSION:1.0.0
    BOARD:368x448
    DEVICE_ID:WOS-180A
    SD_CARD:YES
    WIFI:MyNetwork
    BATTERY:85%
    FACES:3
    WIDGET_STATUS_END
```

### WiFi Configuration
```
TX: WIDGET_READ_WIFI
RX: WIFI_CONFIG_START
    SSID=MyNetwork
    PASSWORD=MyPassword
    ...
    WIFI_CONFIG_END

TX: WIDGET_WRITE_WIFI
RX: READY_FOR_CONFIG
TX: SSID=NewNetwork
TX: PASSWORD=NewPassword
TX: END_WIFI_CONFIG
RX: CONFIG_WRITTEN
RX: CONFIG_RELOADED
```

### Watch Face Management
```
TX: WIDGET_LIST_FACES
RX: FACE_LIST_START
    FACE:default,Default,Built-in,1.0.0
    FACE:minimal,Minimal Dark,Built-in,1.0.0
    ...
    ACTIVE_FACE:default
    FACE_LIST_END

TX: WIDGET_WRITE_FACE
RX: SEND_FACE_ID
TX: my_custom_face
RX: READY_FOR_FACE_DATA
TX: {"name":"My Face","type":"analog",...}
TX: END_FACE_DATA
RX: FACE_SAVED:my_custom_face

TX: WIDGET_SET_FACE:my_custom_face
RX: FACE_SET:my_custom_face

TX: WIDGET_DELETE_FACE:my_custom_face
RX: FACE_DELETED:my_custom_face
```

## 🌐 Deploying to GitHub Pages

1. Update `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/fusion-labs",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. Install gh-pages:
```bash
npm install gh-pages --save-dev
```

3. Deploy:
```bash
npm run deploy
```

4. Enable GitHub Pages in repository settings (select `gh-pages` branch)

See `docs/GITHUB_PAGES_DEPLOYMENT.md` for detailed instructions.

## 📋 Adding New Firmware Binaries

1. Compile your firmware in Arduino IDE
2. Copy the `.bin` file to `public/fusion-labs/firmware/widget-os/`
3. Name format: `widgetos_180.bin` or `widgetos_206.bin`
4. Update the firmware version in the web UI if needed

See `docs/FIRMWARE_UPDATE_PROTOCOL.md` for the full flashing protocol.

## 🛠 Hardware Support

| Feature | WOS-180A (1.8") | WOS-206A (2.06") |
|---------|-----------------|------------------|
| Display | SH8601 368x448 | CO5300 410x502 |
| Touch | FT3168 | FT3168 |
| IMU | QMI8658 | QMI8658 |
| RTC | PCF85063 | PCF85063 |
| PMU | AXP2101 | AXP2101 |
| I/O Expander | XCA9554 | N/A |
| SD Card | SD_MMC 1-bit | SD_MMC 1-bit |

## 📱 SD Card Structure

The firmware automatically creates this structure on first boot:

```
/WATCH/
├── SYSTEM/
│   ├── device.json
│   ├── os.json
│   ├── build.txt
│   └── logs/boot.log
├── CONFIG/
│   ├── user.json
│   ├── display.json
│   └── power.json
├── FACES/
│   ├── custom/
│   └── imported/
├── IMAGES/
├── MUSIC/
├── CACHE/temp/
├── UPDATE/README.txt
└── wifi/config.txt
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **ithig124-hub** - Project creator and hardware designer
- **Waveshare** - ESP32-S3-Touch-AMOLED hardware
- **esptool-js** - WebSerial flashing library
- **LVGL** - Graphics library for embedded systems

---

**Fusion Labs** - Making smartwatch customization accessible to everyone.
