# Fusion Labs Website PRD

## Original Problem Statement
Build comprehensive website for Fusion Labs ESP32-S3 smartwatch with:
- All files in ONE folder (`/fusion-labs/`)
- Widget OS with WiFi Configuration Tool
- Fusion OS with interactive simulator
- Firmware updaters via WebSerial

## What's Implemented (Jan 30, 2025)

### File Structure
```
/public/fusion-labs/
├── README.md
├── docs/
│   ├── WIDGET_OS_README.md
│   ├── FUSION_OS_README.md
│   ├── FIRMWARE_UPDATE_PROTOCOL.md
│   ├── CHANGELOG.md
│   └── SERIAL_CONFIG_FIRMWARE.ino  ← Add to INO for WiFi config support
└── firmware/widget-os/
    ├── 180A/ (WOS-180A)
    └── 206A/ (WOS-206A)
```

### Pages
| Route | Description |
|-------|-------------|
| `/` | Home - Fusion Labs landing |
| `/widget-os` | Widget OS - specs, features, acknowledgments |
| `/widget-os/wifi-config` | **WiFi Configuration Tool** |
| `/widget-os/1.8` | Firmware updater for 1.8" |
| `/widget-os/2.06` | Firmware updater for 2.06" |
| `/fusion-os` | Fusion OS - simulator, dev status |

### WiFi Configuration Tool Features
- Connect watch via USB (WebSerial)
- Add/edit up to 5 WiFi networks
- Location settings (City, Country, GMT offset)
- Show/hide passwords
- **Auto-read** config from device (needs firmware support)
- **Write directly** to SD card via serial
- **Download config.txt** for manual transfer
- Console logging

### Widget OS Page
- Tagline: "Your Favourite Widgets, Now On Your Wrists"
- Kickstarter support section
- Acknowledgments (LVGL, Espressif, Waveshare, Emergent, Little Sister, Open Source)
- "Made with ❤️ by makers, for makers"

### Fusion OS Page
- Interactive watch simulator (3 screens, 3 themes)
- Marketing images
- Dev status: Internet 70%, Display Troubleshooting -1000%

## Deployment
Click **Deploy** button in Emergent → Get public URL → Share with users

## Backlog
- [ ] Upload compiled .bin firmware files
- [ ] Add serial config support to firmware (see SERIAL_CONFIG_FIRMWARE.ino)
- [ ] Fix display troubleshooting (-1000% 😅)
