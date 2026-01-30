# Fusion Labs Website PRD

## Original Problem Statement
Build a comprehensive website for Fusion Labs ESP32-S3 smartwatch firmware updates with:
- Multi-page structure (Home, Widget OS, Fusion OS, Updaters)
- WebSerial-based firmware flashing for 1.8" and 2.06" AMOLED watches
- Rich documentation from INO files
- Interactive Fusion OS simulator with character themes
- Organized file structure for docs and firmware

## User Personas
- **Kickstarter Backers**: Need easy firmware updates, clear instructions
- **DIY Electronics Enthusiasts**: Want technical specs, open-source access
- **First-time Users**: Require step-by-step guidance

## What's Been Implemented (Jan 30, 2025)

### Pages & Features
| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home - Hero, features, OS selection, future roadmap | ✅ |
| `/widget-os` | Widget OS - Full specs, features, apps, SD structure, manual | ✅ |
| `/fusion-os` | Fusion OS - Interactive simulator, 3 character themes, dev status | ✅ |
| `/widget-os/1.8` | 1.8" updater (WOS-180A, 368×448, SH8601) | ✅ |
| `/widget-os/2.06` | 2.06" updater (WOS-206A, 410×502, CO5300) | ✅ |

### Widget OS Page Content
- Hardware specs for both board sizes
- Core features (6 items with icons)
- Internet features (Weather, Stocks, Currency with APIs)
- Built-in apps grid (8 apps)
- SD Card folder structure diagram
- Quick start guide with WiFi config
- Troubleshooting section

### Fusion OS Page Content
- **Interactive Watch Simulator**:
  - Real-time clock display
  - 3 character themes (Luffy, Jin-Woo, Yugo)
  - Theme switching buttons
  - App menu toggle
  - Level, XP, health stats
- Character progression paths
- RPG features section
- Development status progress bars
- GitHub link to source code

### File Organization
```
/public/
├── docs/
│   ├── widget-os/README.md    # Complete Widget OS documentation
│   └── fusion-os/README.md    # Fusion OS overview
└── firmware/
    └── widget-os/
        ├── 180A/
        │   ├── latest.json
        │   └── S3_MiniOS.bin (placeholder)
        └── 206A/
            ├── latest.json
            └── S3_MiniOS_206.bin (placeholder)
```

### Technical Stack
- React + React Router
- Tailwind CSS + Shadcn UI
- esptool-js for WebSerial flashing
- Sonner for toast notifications
- LVGL-style watch simulator

## External Links
- GitHub: https://github.com/ithig124-hub
- YouTube: https://www.youtube.com/@IthiDezNuts
- Fusion OS Source: https://github.com/ithig124-hub/ESP32_Watch

## Backlog

### P0 (Critical)
- [ ] Upload actual compiled .bin firmware files

### P1 (High Priority)
- [ ] Watch face store/gallery
- [ ] Screen protector product page
- [ ] USB mass storage documentation

### P2 (Medium)
- [ ] Kickstarter campaign integration
- [ ] E-commerce store
- [ ] Community forum

## Notes
- Firmware .bin files are PLACEHOLDERS - need compiled versions from Arduino IDE
- WebSerial requires Chrome/Edge and actual ESP32 hardware
- Watch simulator is UI demo only - shows theme concept
