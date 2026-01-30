# Changelog

All notable changes to Widget OS will be documented in this file.

## [1.0.0] - 2025-01-01

### Initial Release
- Core watch functionality
- LVGL-powered graphics engine
- Touch-based navigation
- Multiple built-in watch faces

### Features
- **WiFi Connectivity**
  - Configure up to 5 networks
  - Auto-connect on boot
  - NTP time synchronization

- **Internet Widgets**
  - Weather (OpenWeatherMap API)
  - Stocks (Alpha Vantage API)
  - Currency rates (CoinAPI)

- **Power Management**
  - Smart battery saver mode
  - Adjustable brightness (0-255)
  - Configurable screen timeout
  - Low/critical battery warnings

- **Storage System**
  - SD card support (FAT32)
  - Auto-creates folder structure
  - 24-hour auto-backup
  - User data persistence across updates

- **Activity Tracking**
  - Step counter via IMU
  - Daily step goals
  - Streak tracking

### Built-in Apps
- Clock (multiple styles)
- Compass
- Timer/Stopwatch
- Torch/Flashlight
- Calendar
- Games (Blackjack, Clicker)
- Media player
- System info

### Hardware Support
- WOS-180A: 1.8" SH8601 AMOLED (368×448)
- WOS-206A: 2.06" CO5300 AMOLED (410×502)
- ESP32-S3 dual-core processor
- FT3168 capacitive touch
- QMI8658 IMU
- PCF85063 RTC
- AXP2101 PMU

---

## Future Releases

### Planned for v1.1.0
- New watch face designs
- Improved WiFi reconnection
- Battery percentage accuracy fix
- Additional games

### Planned for v2.0.0
- Watch face store integration
- USB file transfer support
- Screen protector mode
