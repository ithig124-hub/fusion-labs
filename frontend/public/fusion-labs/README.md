# Fusion Labs - Complete Project Structure

All project files are organized in this single folder.

## Structure

```
fusion-labs/
├── docs/
│   ├── WIDGET_OS_README.md      # Widget OS full documentation
│   ├── FUSION_OS_README.md      # Fusion OS documentation
│   └── FIRMWARE_UPDATE_PROTOCOL.md  # How to add new firmware
├── firmware/
│   └── widget-os/
│       ├── 180A/
│       │   ├── latest.json      # Version info for 1.8" board
│       │   └── S3_MiniOS.bin    # Firmware binary (placeholder)
│       └── 206A/
│           ├── latest.json      # Version info for 2.06" board
│           └── S3_MiniOS_206.bin # Firmware binary (placeholder)
├── images/                       # Marketing images
└── source/                       # Source code references
```

## Adding New Firmware

1. Compile your `.ino` file in Arduino IDE
2. Export the binary (Sketch → Export Compiled Binary)
3. Place the `.bin` file in the appropriate board folder
4. Update `latest.json` with new version info
5. See `docs/FIRMWARE_UPDATE_PROTOCOL.md` for full details

## Board IDs

- **WOS-180A**: 1.8" AMOLED (368×448) - SH8601 driver
- **WOS-206A**: 2.06" AMOLED (410×502) - CO5300 driver

## Links

- GitHub: https://github.com/ithig124-hub
- YouTube: https://www.youtube.com/@IthiDezNuts
- Fusion OS Source: https://github.com/ithig124-hub/ESP32_Watch
