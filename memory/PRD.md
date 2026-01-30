# Fusion Labs Website PRD

## Original Problem Statement
Build a comprehensive website for Fusion Labs ESP32-S3 smartwatch firmware updates with:
- Multi-page structure (Home, Widget OS, Fusion OS, Updaters)
- WebSerial-based firmware flashing for 1.8" and 2.06" AMOLED watches
- User manual content, specs, and future features roadmap
- Social links (GitHub, YouTube), placeholders for Kickstarter/Store

## User Personas
- **Kickstarter Backers**: Need easy firmware updates, clear instructions
- **DIY Electronics Enthusiasts**: Want technical specs, open-source access
- **First-time Users**: Require step-by-step guidance

## Core Requirements
- [x] Home page with Fusion Labs branding
- [x] Widget OS page with full specs & user manual
- [x] Fusion OS teaser (coming soon)
- [x] Firmware updater pages for 1.8" (WOS-180A) and 2.06" (WOS-206A)
- [x] WebSerial integration via esptool-js
- [x] GitHub: https://github.com/ithig124-hub
- [x] YouTube: https://www.youtube.com/@IthiDezNuts

## What's Been Implemented (Jan 30, 2025)

### Pages
| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home - Hero, features, OS selection, future roadmap | ✅ |
| `/widget-os` | Widget OS - Specs, features, manual, updater links | ✅ |
| `/fusion-os` | Fusion OS teaser with notify form | ✅ |
| `/widget-os/1.8` | 1.8" updater (WOS-180A, 368×448, SH8601) | ✅ |
| `/widget-os/2.06` | 2.06" updater (WOS-206A, 410×502, CO5300) | ✅ |

### Technical
- ESPToolService with WebSerial for ESP32-S3 flashing
- Board validation (WOS-180A / WOS-206A)
- Progress tracking, console logging
- Dark cyber-industrial UI theme
- JetBrains Mono + Inter typography
- Sonner toast notifications

### Firmware Structure
```
/public/firmware/widget-os/
├── 180A/
│   ├── latest.json
│   └── S3_MiniOS.bin (placeholder)
└── 206A/
    ├── latest.json
    └── S3_MiniOS_206.bin (placeholder)
```

## Backlog

### P0 (Critical)
- [ ] Upload actual compiled .bin firmware files

### P1 (High Priority)
- [ ] Watch face store/gallery
- [ ] Screen protector product page
- [ ] USB mass storage file upload documentation

### P2 (Medium)
- [ ] Mobile companion app info
- [ ] Developer SDK documentation
- [ ] Multi-language support

### P3 (Future)
- [ ] Kickstarter campaign integration
- [ ] E-commerce store
- [ ] Community forum

## Notes
- Firmware .bin files are placeholders - need compiled versions from Arduino IDE
- WebSerial requires Chrome/Edge and actual ESP32 hardware to test flashing
- Email notify on Fusion OS page is UI-only (no backend storage)
