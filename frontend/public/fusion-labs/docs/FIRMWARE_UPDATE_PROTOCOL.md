# Firmware Update Protocol

## Adding New Firmware Versions

### Step 1: Compile Your Firmware
In Arduino IDE:
1. Open your `.ino` file (S3_MiniOS.ino or S3_MiniOS_206.ino)
2. Set board to "ESP32S3 Dev Module"
3. Set partition scheme to "Huge APP (3MB No OTA/1MB SPIFFS)"
4. Click Sketch → Export Compiled Binary
5. Find the `.bin` file in your sketch folder

### Step 2: Name the Binary
- For 1.8" board: `S3_MiniOS.bin` (or `S3_MiniOS_v1.1.0.bin` for versioned)
- For 2.06" board: `S3_MiniOS_206.bin` (or `S3_MiniOS_206_v1.1.0.bin`)

### Step 3: Update latest.json
Edit `/fusion-labs/firmware/widget-os/[BOARD]/latest.json`:

```json
{
  "version": "1.1.0",
  "build": "stable",
  "board": "WOS-180A",
  "boardName": "1.8\" AMOLED (368x448)",
  "bin": "S3_MiniOS_v1.1.0.bin",
  "checksum": "sha256:abc123...",
  "releaseDate": "2025-02-01",
  "notes": "Fixed WiFi reconnection, added new watch face"
}
```

### Step 4: Upload Files
Place your `.bin` file in the same folder as `latest.json`:
```
/fusion-labs/firmware/widget-os/
├── 180A/
│   ├── latest.json
│   ├── S3_MiniOS.bin          (current stable)
│   └── S3_MiniOS_v1.1.0.bin   (new version)
└── 206A/
    ├── latest.json
    ├── S3_MiniOS_206.bin
    └── S3_MiniOS_206_v1.1.0.bin
```

### Step 5: Calculate Checksum (Optional but Recommended)
```bash
sha256sum S3_MiniOS_v1.1.0.bin
```
Add the hash to `latest.json` for integrity verification.

---

## Versioning Convention

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes, new hardware support
- **MINOR**: New features, improvements
- **PATCH**: Bug fixes, small tweaks

Examples:
- `1.0.0` → Initial release
- `1.1.0` → Added new watch faces
- `1.1.1` → Fixed WiFi bug
- `2.0.0` → Major UI overhaul

---

## Changelog Format

Maintain `/fusion-labs/docs/CHANGELOG.md`:

```markdown
# Changelog

## [1.1.0] - 2025-02-01
### Added
- New minimal watch face
- Step goal notifications

### Fixed
- WiFi auto-reconnect issue
- Battery percentage accuracy

### Changed
- Improved boot time by 2 seconds

## [1.0.0] - 2025-01-01
- Initial stable release
```

---

## Testing Before Release

1. **Flash test device** with new firmware
2. **Verify all features** work correctly
3. **Check boot time** and stability
4. **Test update process** from previous version
5. **Validate SD card** compatibility

---

## Rollback Procedure

If users report issues:
1. Keep previous stable `.bin` file available
2. Update `latest.json` to point back to stable version
3. Notify users in release notes

---

## Multiple Version Support

To maintain download links for older versions:

```json
{
  "version": "1.1.0",
  "bin": "S3_MiniOS_v1.1.0.bin",
  "previous_versions": [
    {"version": "1.0.0", "bin": "S3_MiniOS_v1.0.0.bin"}
  ]
}
```
