# Fusion Labs Website PRD

## What's Implemented (Jan 30, 2025)

### Pages
| Route | Description |
|-------|-------------|
| `/` | Home - Fusion Labs landing |
| `/widget-os` | Widget OS - specs, features, acknowledgments |
| `/widget-os/wifi-config` | WiFi Configuration Tool |
| `/widget-os/faces` | **Watch Face Library** |
| `/widget-os/1.8` | Firmware updater 1.8" |
| `/widget-os/2.06` | Firmware updater 2.06" |
| `/fusion-os` | Fusion OS - simulator, dev status |

### Watch Face Library Features
- **8+ Pre-made faces**: Minimal Dark, Gradient Pink, Widget Classic, Digital Block, Roman Classic, Gradient Green, Gradient Orange, Neon Blue
- **Live animated previews** with real-time clock
- **Category filtering**: All, Minimal, Digital, Classic, Colorful, Neon, Custom
- **Search** by name/author
- **Upload custom images** as watch faces
- **Color customizer** - modify any face colors (background, primary, accent)
- **Flash to watch** via USB serial
- **Download face.json** for manual SD card install
- **Hold 5 seconds** on watch to change faces (like Apple Watch)

### File Structure
```
/public/fusion-labs/
├── docs/
│   ├── WIDGET_OS_README.md
│   ├── FUSION_OS_README.md
│   ├── FIRMWARE_UPDATE_PROTOCOL.md
│   ├── CHANGELOG.md
│   ├── SERIAL_CONFIG_FIRMWARE.ino   ← WiFi config support
│   └── SERIAL_FACE_FIRMWARE.ino     ← Watch face support
└── firmware/widget-os/
    ├── 180A/
    └── 206A/
```

### Firmware Code to Add
1. `SERIAL_CONFIG_FIRMWARE.ino` - USB WiFi config read/write
2. `SERIAL_FACE_FIRMWARE.ino` - USB face install + hold-to-change gesture

## External Links
- GitHub: https://github.com/ithig124-hub
- YouTube: https://www.youtube.com/@IthiDezNuts
- Fusion OS: https://github.com/ithig124-hub/ESP32_Watch

## Deployment
Click **Deploy** in Emergent → Get public URL!
