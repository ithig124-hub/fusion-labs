// ESPToolService - WebSerial firmware flashing for ESP32-S3 watches
import { ESPLoader, Transport } from 'esptool-js';

const ESP32_S3_USB_VID = 0x303A; // Espressif USB VID

export class ESPToolService {
  constructor() {
    this.port = null;
    this.transport = null;
    this.esploader = null;
    this.connected = false;
    this.logs = [];
    this.onLog = null;
  }

  log(message, type = 'info') {
    const entry = { message, type, timestamp: Date.now() };
    this.logs.push(entry);
    if (this.onLog) this.onLog(entry);
    console.log(`[ESPTool] ${message}`);
  }

  static isSupported() {
    return 'serial' in navigator;
  }

  async connect() {
    if (!ESPToolService.isSupported()) {
      throw new Error('WebSerial not supported. Use Chrome or Edge browser.');
    }

    try {
      this.log('Requesting serial port...');
      
      // Request port with ESP32-S3 USB filter
      this.port = await navigator.serial.requestPort({
        filters: [{ usbVendorId: ESP32_S3_USB_VID }]
      });

      this.log('Opening serial connection...');
      await this.port.open({ baudRate: 115200 });

      this.log('Creating transport layer...');
      this.transport = new Transport(this.port, true);

      this.log('Initializing ESP loader...');
      const flashOptions = {
        transport: this.transport,
        baudrate: 115200,
        terminal: {
          clean: () => {},
          writeLine: (data) => this.log(data, 'debug'),
          write: (data) => this.log(data, 'debug')
        }
      };

      this.esploader = new ESPLoader(flashOptions);
      
      this.log('Connecting to ESP32 (hold BOOT if needed)...');
      const chip = await this.esploader.main();
      
      this.log(`Connected to: ${chip}`, 'success');
      this.connected = true;
      
      return {
        chip,
        isESP32S3: chip.toLowerCase().includes('esp32-s3')
      };
    } catch (error) {
      this.log(`Connection failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async detectBoardId() {
    // Board detection based on chip features
    // In production, this would read from flash or OTP
    // For now, we'll rely on user selection + flash address validation
    this.log('Board detection requires firmware flash...');
    return null;
  }

  async validateBoard(expectedBoardId, resolution) {
    this.log(`Validating for board: ${expectedBoardId}`);
    
    if (!this.connected || !this.esploader) {
      throw new Error('Not connected to device');
    }

    const chipInfo = await this.esploader.chip;
    
    // Verify it's an ESP32-S3
    if (!chipInfo || !chipInfo.CHIP_NAME.toLowerCase().includes('esp32-s3')) {
      throw new Error(`Wrong chip type. Expected ESP32-S3, got: ${chipInfo?.CHIP_NAME || 'unknown'}`);
    }

    this.log(`Chip validated: ${chipInfo.CHIP_NAME}`, 'success');
    this.log(`Target board: ${expectedBoardId} (${resolution})`, 'info');
    
    return {
      valid: true,
      chip: chipInfo.CHIP_NAME,
      boardId: expectedBoardId
    };
  }

  async flash(firmwareUrl, onProgress) {
    if (!this.connected || !this.esploader) {
      throw new Error('Not connected to device');
    }

    try {
      this.log('Fetching firmware binary...');
      const response = await fetch(firmwareUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch firmware: ${response.status}`);
      }

      const firmwareBuffer = await response.arrayBuffer();
      const firmwareData = new Uint8Array(firmwareBuffer);
      
      this.log(`Firmware size: ${(firmwareData.length / 1024).toFixed(1)} KB`);
      
      // Convert to binary string for esptool-js
      let binaryString = '';
      for (let i = 0; i < firmwareData.length; i++) {
        binaryString += String.fromCharCode(firmwareData[i]);
      }

      // Flash configuration for ESP32-S3
      // 0x10000 is the standard app partition offset
      const flashAddress = 0x10000;
      
      this.log(`Erasing flash at 0x${flashAddress.toString(16)}...`);
      
      const fileArray = [{
        data: binaryString,
        address: flashAddress
      }];

      const flashOptions = {
        fileArray,
        flashSize: 'detect',
        flashMode: 'dio',
        flashFreq: '80m',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          const percent = Math.round((written / total) * 100);
          this.log(`Flashing: ${percent}%`, 'progress');
          if (onProgress) onProgress(percent);
        }
      };

      this.log('Starting flash operation...');
      await this.esploader.writeFlash(flashOptions);
      
      this.log('Flash complete!', 'success');
      return true;
    } catch (error) {
      this.log(`Flash failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async reset() {
    if (this.esploader) {
      try {
        this.log('Resetting device...');
        await this.esploader.hardReset();
        this.log('Device reset complete', 'success');
      } catch (error) {
        this.log(`Reset warning: ${error.message}`, 'warning');
      }
    }
  }

  async disconnect() {
    try {
      if (this.transport) {
        await this.transport.disconnect();
      }
      if (this.port) {
        await this.port.close();
      }
      this.connected = false;
      this.port = null;
      this.transport = null;
      this.esploader = null;
      this.log('Disconnected', 'info');
    } catch (error) {
      this.log(`Disconnect warning: ${error.message}`, 'warning');
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export default ESPToolService;
