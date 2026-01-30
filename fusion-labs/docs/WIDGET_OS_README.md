# Widget OS v1.0.0 - Complete Documentation

> **Your Favourite Widgets, Now On Your Wrists**

## Overview
Widget OS is a productivity-focused smartwatch operating system for ESP32-S3 AMOLED watches. Built for daily use with clean interface, essential features, and reliable performance.

---

## Supported Hardware

### WOS-180A (1.8" Display)
| Component | Specification |
|-----------|---------------|
| Display | SH8601 QSPI AMOLED, 368×448 pixels |
| Touch | FT3168 Capacitive |
| Processor | ESP32-S3 Dual-core 240MHz |
| IMU | QMI8658 (Accelerometer + Gyroscope) |
| RTC | PCF85063 Real-Time Clock |
| PMU | AXP2101 Power Management |
| Storage | SD Card (1-bit MMC mode) |

### WOS-206A (2.06" Display)
| Component | Specification |
|-----------|---------------|
| Display | CO5300 QSPI AMOLED, 410×502 pixels |
| Touch | FT3168 Capacitive |
| Processor | ESP32-S3 Dual-core 240MHz |
| IMU | QMI8658 (Accelerometer + Gyroscope) |
| RTC | PCF85063 Real-Time Clock |
| PMU | AXP2101 Power Management |
| Storage | SD Card (1-bit MMC mode) |

---

## Features

### Watch Faces
- Multiple built-in watch face styles
- Custom watch faces via SD card (`/WATCH/FACES/custom/`)
- Imported faces supported (`/WATCH/FACES/imported/`)
- Auto-detects screen size for compatible faces

### WiFi & Internet
- Configure up to 5 WiFi networks
- Auto-connect on boot
- **Weather**: Real-time data with forecasts (OpenWeatherMap API)
- **Stocks**: Live stock prices (Alpha Vantage API)
- **Currency**: Exchange rates (CoinAPI)
- NTP time synchronization

### Power Management
- Smart battery saver mode (auto-activates below threshold)
- Configurable screen timeout
- Adjustable brightness (0-255)
- Low battery warning (20%)
- Critical battery warning (10%)
- Battery usage statistics & estimates
- Deep sleep support

### Storage & Backup
- SD card auto-detection
- Auto-creates folder structure on first boot
- Manual backup button
- Auto-backup every 24 hours
- User data persistence across updates

### Activity Tracking
- Step counter via IMU
- Daily step goals
- Consecutive day streaks
- Distance calculation

### Built-in Apps
- Clock (multiple styles)
- Compass
- Timer/Stopwatch
- Torch/Flashlight
- Calendar
- Games (Blackjack, Clicker)
- Media player
- System info

---

## SD Card Structure

Auto-created on first boot:

```
/WATCH/
├── SYSTEM/
│   ├── device.json     # Device ID, screen size, hardware rev
│   ├── os.json         # OS name, version, build
│   └── logs/boot.log   # Boot logs
├── CONFIG/
│   ├── user.json       # Watch face, brightness, step goal
│   ├── display.json    # Timeout, theme, always-on
│   └── power.json      # Battery saver settings
├── FACES/
│   ├── custom/         # Your custom watch faces
│   └── imported/       # Downloaded faces
├── IMAGES/             # Your photos
├── MUSIC/              # Audio files
├── CACHE/temp/
├── UPDATE/
└── wifi/
    └── config.txt      # WiFi credentials
```

---

## WiFi Configuration

Create `/WATCH/wifi/config.txt` on your SD card:

```
WIFI1_SSID=YourHomeNetwork
WIFI1_PASS=YourPassword
WIFI2_SSID=WorkNetwork
WIFI2_PASS=WorkPassword
# Add up to 5 networks

# Weather location (optional)
CITY=Perth
COUNTRY=AU
GMT_OFFSET=8
```

---

## Firmware Update Instructions

1. Connect watch via USB (data cable, not charge-only)
2. Ensure battery is >50%
3. Enter bootloader mode:
   - Hold **BOOT** button while connecting USB, OR
   - Hold **BOOT** + press **RESET**
4. Open updater page for your board size
5. Click "Connect Device" and select the serial port
6. Click "Flash Firmware"
7. Wait for completion (do not disconnect!)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Won't turn on | Charge for 30+ minutes, then try power button |
| WiFi not connecting | Check config.txt syntax, use 2.4GHz networks only |
| SD card not detected | Format as FAT32, recommended under 32GB |
| Update failed | Ensure battery >50%, use Chrome/Edge browser |

---

## Version History

### v1.0.0 (Initial Release)
- Core watch functionality
- WiFi with weather/stocks/currency
- SD card storage system
- Power management
- Activity tracking
- Multiple watch faces
