import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wifi, Plus, Trash2, Save, Download, Upload, Usb, CheckCircle, AlertCircle, Globe, Clock, RefreshCw, Eye, EyeOff, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Serial Protocol Commands (for future firmware support)
const SERIAL_COMMANDS = {
  READ_WIFI: 'WIDGET_READ_WIFI',
  WRITE_WIFI: 'WIDGET_WRITE_WIFI',
  GET_STATUS: 'WIDGET_STATUS',
  PING: 'WIDGET_PING'
};

export const WifiConfigPage = () => {
  // Connection state
  const [port, setPort] = useState(null);
  const [connected, setConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [serialSupported, setSerialSupported] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  // WiFi config state
  const [networks, setNetworks] = useState([
    { ssid: '', password: '', showPassword: false }
  ]);
  const [location, setLocation] = useState({
    city: 'Perth',
    country: 'AU',
    gmtOffset: 8
  });

  // Status
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected, reading, writing
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setSerialSupported('serial' in navigator);
  }, []);

  const log = useCallback((message, type = 'info') => {
    const entry = { message, type, timestamp: Date.now() };
    setLogs(prev => [...prev, entry]);
    console.log(`[WiFi Config] ${message}`);
  }, []);

  // Connect to device
  const handleConnect = async () => {
    if (!serialSupported) {
      toast.error('WebSerial not supported. Use Chrome or Edge.');
      return;
    }

    try {
      setStatus('connecting');
      log('Requesting serial port...');

      const selectedPort = await navigator.serial.requestPort({
        filters: [{ usbVendorId: 0x303A }] // Espressif
      });

      await selectedPort.open({ baudRate: 115200 });
      setPort(selectedPort);
      setConnected(true);
      setStatus('connected');
      setDeviceInfo({ chip: 'ESP32-S3' });
      log('Connected to device', 'success');
      toast.success('Device connected!');

      // Try to read config (if firmware supports it)
      setTimeout(() => tryReadConfig(selectedPort), 500);

    } catch (error) {
      log(`Connection failed: ${error.message}`, 'error');
      setStatus('disconnected');
      toast.error(error.message);
    }
  };

  // Try to read WiFi config from device
  const tryReadConfig = async (serialPort) => {
    if (!serialPort?.writable || !serialPort?.readable) return;

    try {
      setStatus('reading');
      log('Attempting to read WiFi config from device...');

      const writer = serialPort.writable.getWriter();
      const reader = serialPort.readable.getReader();

      // Send read command
      const command = `${SERIAL_COMMANDS.READ_WIFI}\n`;
      await writer.write(new TextEncoder().encode(command));
      writer.releaseLock();

      // Read response with timeout
      let response = '';
      const timeout = setTimeout(() => {
        reader.releaseLock();
      }, 2000);

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          response += new TextDecoder().decode(value);
          if (response.includes('END_WIFI_CONFIG')) break;
        }
      } catch (e) {
        // Timeout or read error
      }

      clearTimeout(timeout);
      reader.releaseLock();

      if (response.includes('WIFI_CONFIG:')) {
        // Parse config from device
        const configMatch = response.match(/WIFI_CONFIG:([\s\S]*?)END_WIFI_CONFIG/);
        if (configMatch) {
          parseConfigFromDevice(configMatch[1]);
          log('Config loaded from device!', 'success');
          toast.success('WiFi config loaded from watch!');
        }
      } else {
        log('Device does not support serial config read (firmware update needed)', 'warning');
        toast.info('Manual mode: Edit config and download to SD card');
      }

      setStatus('connected');
    } catch (error) {
      log(`Read failed: ${error.message}`, 'warning');
      setStatus('connected');
    }
  };

  // Parse config text into state
  const parseConfigFromDevice = (configText) => {
    const lines = configText.split('\n');
    const newNetworks = [];
    const newLocation = { ...location };

    lines.forEach(line => {
      const [key, value] = line.split('=').map(s => s?.trim());
      if (!key || !value) return;

      const wifiMatch = key.match(/WIFI(\d+)_(SSID|PASS)/);
      if (wifiMatch) {
        const index = parseInt(wifiMatch[1]) - 1;
        const type = wifiMatch[2];
        if (!newNetworks[index]) {
          newNetworks[index] = { ssid: '', password: '', showPassword: false };
        }
        if (type === 'SSID') newNetworks[index].ssid = value;
        if (type === 'PASS') newNetworks[index].password = value;
      }

      if (key === 'CITY') newLocation.city = value;
      if (key === 'COUNTRY') newLocation.country = value;
      if (key === 'GMT_OFFSET') newLocation.gmtOffset = parseInt(value) || 0;
    });

    if (newNetworks.length > 0) {
      setNetworks(newNetworks.filter(n => n.ssid));
    }
    setLocation(newLocation);
    setHasChanges(false);
  };

  // Write config to device
  const handleWriteToDevice = async () => {
    if (!port?.writable) {
      toast.error('Device not connected');
      return;
    }

    try {
      setStatus('writing');
      log('Writing WiFi config to device...');

      const configText = generateConfigText();
      const writer = port.writable.getWriter();

      // Send write command with config
      const command = `${SERIAL_COMMANDS.WRITE_WIFI}\n${configText}\nEND_WIFI_CONFIG\n`;
      await writer.write(new TextEncoder().encode(command));
      writer.releaseLock();

      log('Config sent to device', 'success');
      toast.success('WiFi config saved to watch!');
      setHasChanges(false);
      setStatus('connected');
    } catch (error) {
      log(`Write failed: ${error.message}`, 'error');
      toast.error('Failed to write config. Try downloading to SD card instead.');
      setStatus('connected');
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    try {
      if (port) {
        await port.close();
      }
    } catch (e) {
      // Ignore close errors
    }
    setPort(null);
    setConnected(false);
    setStatus('disconnected');
    setDeviceInfo(null);
    log('Disconnected');
  };

  // Generate config.txt content
  const generateConfigText = () => {
    let config = '# Widget OS WiFi Configuration\n';
    config += '# Generated by Fusion Labs WiFi Config Tool\n\n';

    networks.forEach((network, i) => {
      if (network.ssid) {
        config += `WIFI${i + 1}_SSID=${network.ssid}\n`;
        config += `WIFI${i + 1}_PASS=${network.password}\n`;
      }
    });

    config += `\n# Location Settings\n`;
    config += `CITY=${location.city}\n`;
    config += `COUNTRY=${location.country}\n`;
    config += `GMT_OFFSET=${location.gmtOffset}\n`;

    return config;
  };

  // Download config file
  const handleDownload = () => {
    const config = generateConfigText();
    const blob = new Blob([config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded config.txt - Copy to /WATCH/wifi/ on SD card');
  };

  // Add network
  const addNetwork = () => {
    if (networks.length >= 5) {
      toast.error('Maximum 5 networks allowed');
      return;
    }
    setNetworks([...networks, { ssid: '', password: '', showPassword: false }]);
    setHasChanges(true);
  };

  // Remove network
  const removeNetwork = (index) => {
    setNetworks(networks.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Update network
  const updateNetwork = (index, field, value) => {
    const updated = [...networks];
    updated[index][field] = value;
    setNetworks(updated);
    setHasChanges(true);
  };

  // Toggle password visibility
  const togglePassword = (index) => {
    const updated = [...networks];
    updated[index].showPassword = !updated[index].showPassword;
    setNetworks(updated);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/widget-os" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Back to Widget OS</span>
            </Link>
            <span className="font-mono text-sm text-blue-400">WiFi Config Tool</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-mono mb-3">
            <Wifi className="w-8 h-8 inline mr-3 text-blue-500" />
            WiFi <span className="text-blue-500">Configuration</span>
          </h1>
          <p className="text-zinc-400">
            Configure WiFi networks and location settings for your Widget OS watch.
          </p>
        </div>

        {/* Connection Status */}
        <div className={`p-6 rounded-2xl border mb-8 ${
          connected ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.02] border-white/10'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {connected ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Usb className="w-5 h-5 text-zinc-400" />
              )}
              <span className="font-mono">
                {status === 'disconnected' && 'Not Connected'}
                {status === 'connecting' && 'Connecting...'}
                {status === 'connected' && 'Connected'}
                {status === 'reading' && 'Reading config...'}
                {status === 'writing' && 'Writing config...'}
              </span>
              {deviceInfo && (
                <span className="text-sm text-zinc-500">({deviceInfo.chip})</span>
              )}
            </div>

            {!connected ? (
              <Button
                onClick={handleConnect}
                disabled={!serialSupported}
                data-testid="connect-wifi-btn"
                className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-500"
              >
                <Usb className="w-4 h-4 mr-2" />
                Connect Watch
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => tryReadConfig(port)}
                  variant="outline"
                  className="h-10 px-4 rounded-full border-zinc-700"
                  data-testid="refresh-config-btn"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="h-10 px-4 rounded-full border-zinc-700"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>

          {!serialSupported && (
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-amber-300">
                WebSerial not supported. Use Chrome or Edge browser, or download config manually.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* WiFi Networks */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-mono flex items-center gap-2">
              <Wifi className="w-5 h-5 text-blue-500" />
              WiFi Networks
            </h2>
            <span className="text-sm text-zinc-500">{networks.length}/5 networks</span>
          </div>

          <div className="space-y-4">
            {networks.map((network, index) => (
              <div key={index} className="p-4 rounded-xl bg-black/30 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono text-zinc-400">Network {index + 1}</span>
                  {networks.length > 1 && (
                    <button
                      onClick={() => removeNetwork(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                      data-testid={`remove-network-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">SSID (Network Name)</label>
                    <Input
                      value={network.ssid}
                      onChange={(e) => updateNetwork(index, 'ssid', e.target.value)}
                      placeholder="Your WiFi Name"
                      className="bg-zinc-900 border-zinc-700"
                      data-testid={`ssid-input-${index}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Password</label>
                    <div className="relative">
                      <Input
                        type={network.showPassword ? 'text' : 'password'}
                        value={network.password}
                        onChange={(e) => updateNetwork(index, 'password', e.target.value)}
                        placeholder="WiFi Password"
                        className="bg-zinc-900 border-zinc-700 pr-10"
                        data-testid={`password-input-${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                      >
                        {network.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {networks.length < 5 && (
            <Button
              onClick={addNetwork}
              variant="outline"
              className="mt-4 w-full h-12 rounded-xl border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
              data-testid="add-network-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Network
            </Button>
          )}
        </div>

        {/* Location Settings */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 mb-8">
          <h2 className="text-xl font-semibold font-mono flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-blue-500" />
            Location Settings
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">City</label>
              <Input
                value={location.city}
                onChange={(e) => { setLocation({ ...location, city: e.target.value }); setHasChanges(true); }}
                placeholder="Perth"
                className="bg-zinc-900 border-zinc-700"
                data-testid="city-input"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Country Code</label>
              <Input
                value={location.country}
                onChange={(e) => { setLocation({ ...location, country: e.target.value.toUpperCase() }); setHasChanges(true); }}
                placeholder="AU"
                maxLength={2}
                className="bg-zinc-900 border-zinc-700"
                data-testid="country-input"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block flex items-center gap-1">
                <Clock className="w-3 h-3" /> GMT Offset
              </label>
              <Input
                type="number"
                value={location.gmtOffset}
                onChange={(e) => { setLocation({ ...location, gmtOffset: parseInt(e.target.value) || 0 }); setHasChanges(true); }}
                placeholder="8"
                min={-12}
                max={14}
                className="bg-zinc-900 border-zinc-700"
                data-testid="gmt-input"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          {connected ? (
            <Button
              onClick={handleWriteToDevice}
              disabled={status === 'writing'}
              data-testid="save-to-watch-btn"
              className="h-12 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              <Upload className="w-5 h-5 mr-2" />
              Save to Watch
            </Button>
          ) : null}

          <Button
            onClick={handleDownload}
            variant="outline"
            data-testid="download-config-btn"
            className="h-12 px-8 rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Download className="w-5 h-5 mr-2" />
            Download config.txt
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
          <h3 className="font-semibold mb-3">How to Use</h3>
          <div className="space-y-2 text-sm text-zinc-400">
            <p><strong className="text-white">Option 1 (Connected):</strong> Connect your watch via USB, edit settings, click "Save to Watch" to write directly.</p>
            <p><strong className="text-white">Option 2 (Manual):</strong> Edit settings, click "Download config.txt", copy the file to <code className="px-2 py-0.5 bg-zinc-800 rounded">/WATCH/wifi/</code> on your SD card.</p>
            <p className="text-zinc-500 mt-4">Note: Direct USB write requires firmware v1.1+ with serial config support. Use download method for v1.0.</p>
          </div>
        </div>

        {/* Console Log */}
        <div className="mt-8 rounded-2xl bg-black border border-white/10 overflow-hidden">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-4 py-3 flex items-center justify-between text-zinc-400 hover:text-white transition-colors"
            data-testid="toggle-wifi-logs-btn"
          >
            <span className="flex items-center gap-2 font-mono text-sm">
              <Terminal className="w-4 h-4" />
              Console
              {logs.length > 0 && <span className="text-xs text-zinc-600">({logs.length})</span>}
            </span>
            {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showLogs && (
            <div className="border-t border-white/5 p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <span className="text-zinc-600">No logs yet.</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-emerald-400' : 
                    log.type === 'warning' ? 'text-amber-400' :
                    'text-zinc-400'
                  }`}>
                    <span className="text-zinc-600 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    {log.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/widget-os" className="text-zinc-500 hover:text-white transition-colors font-mono text-sm">
              ← Widget OS
            </Link>
            <span className="text-zinc-600 font-mono text-sm">WiFi Config Tool</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WifiConfigPage;
