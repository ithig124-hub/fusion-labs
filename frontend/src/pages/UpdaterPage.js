import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Usb, Download, Terminal, CheckCircle, AlertCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import ESPToolService from '@/services/ESPToolService';

// Board configurations
const BOARD_CONFIG = {
  '1.8': {
    boardId: 'WOS-180A',
    displayName: '1.8" AMOLED',
    resolution: '368 × 448',
    displayDriver: 'SH8601',
    firmwarePath: '/firmware/widget-os/180A/',
    accentColor: 'blue'
  },
  '2.06': {
    boardId: 'WOS-206A',
    displayName: '2.06" AMOLED',
    resolution: '410 × 502',
    displayDriver: 'CO5300',
    firmwarePath: '/firmware/widget-os/206A/',
    accentColor: 'purple'
  }
};

export const UpdaterPage = () => {
  const { boardSize } = useParams();
  const config = BOARD_CONFIG[boardSize] || BOARD_CONFIG['1.8'];
  const accentClasses = config.accentColor === 'purple' 
    ? { bg: 'bg-purple-600', hover: 'hover:bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]' }
    : { bg: 'bg-blue-600', hover: 'hover:bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]' };

  // State
  const [espService] = useState(() => new ESPToolService());
  const [status, setStatus] = useState('idle'); // idle, connecting, connected, validating, flashing, complete, error
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [progress, setProgress] = useState(0);
  const [firmware, setFirmware] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState(null);

  // Fetch firmware info
  useEffect(() => {
    const fetchFirmware = async () => {
      try {
        const response = await fetch(`${config.firmwarePath}latest.json`);
        if (response.ok) {
          const data = await response.json();
          setFirmware(data);
        }
      } catch (err) {
        console.error('Failed to fetch firmware info:', err);
      }
    };
    fetchFirmware();
  }, [config.firmwarePath]);

  // Log handler
  const handleLog = useCallback((entry) => {
    setLogs(prev => [...prev, entry]);
  }, []);

  useEffect(() => {
    espService.onLog = handleLog;
    return () => { espService.onLog = null; };
  }, [espService, handleLog]);

  // Check WebSerial support
  const isSupported = ESPToolService.isSupported();

  // Connect to device
  const handleConnect = async () => {
    setError(null);
    setStatus('connecting');
    setLogs([]);

    try {
      const result = await espService.connect();
      
      if (!result.isESP32S3) {
        throw new Error('Connected device is not an ESP32-S3. Please connect the correct watch.');
      }

      setDeviceInfo(result);
      setStatus('connected');
      toast.success('Device connected successfully!');
    } catch (err) {
      setError(err.message);
      setStatus('error');
      toast.error(err.message);
    }
  };

  // Flash firmware
  const handleFlash = async () => {
    if (!firmware) {
      toast.error('Firmware information not loaded');
      return;
    }

    setError(null);
    setStatus('validating');
    setProgress(0);

    try {
      // Validate board
      await espService.validateBoard(config.boardId, config.resolution);
      
      setStatus('flashing');
      
      // Flash firmware
      const firmwareUrl = `${config.firmwarePath}${firmware.bin}`;
      await espService.flash(firmwareUrl, (percent) => {
        setProgress(percent);
      });

      // Reset device
      await espService.reset();
      
      setStatus('complete');
      toast.success('Firmware updated successfully!');
    } catch (err) {
      setError(err.message);
      setStatus('error');
      toast.error(err.message);
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    await espService.disconnect();
    setStatus('idle');
    setDeviceInfo(null);
    setProgress(0);
  };

  // Status icon
  const StatusIcon = () => {
    switch (status) {
      case 'connecting':
      case 'validating':
      case 'flashing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Usb className="w-5 h-5" />;
    }
  };

  // Status text
  const statusText = {
    idle: 'Ready to connect',
    connecting: 'Connecting...',
    connected: 'Device connected',
    validating: 'Validating board...',
    flashing: `Flashing... ${progress}%`,
    complete: 'Update complete!',
    error: 'Error occurred'
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
            <span className={`font-mono text-sm ${accentClasses.text}`}>{config.boardId}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-mono mb-3">
            Widget OS <span className={accentClasses.text}>Updater</span>
          </h1>
          <p className="text-zinc-400">
            {config.displayName} • {config.resolution} • {config.displayDriver}
          </p>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <Alert className="mb-8 bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              WebSerial is not supported in your browser. Please use <strong>Chrome</strong> or <strong>Edge</strong> on desktop.
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions Card */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 mb-8">
          <h2 className="text-lg font-semibold mb-4 font-mono">Before You Start</h2>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${config.accentColor === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5`}>1</span>
              <span><strong className="text-white">Connect via USB.</strong> Use a data cable, not charge-only.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${config.accentColor === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5`}>2</span>
              <span><strong className="text-white">Ensure battery is charged.</strong> At least 50% recommended.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${config.accentColor === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5`}>3</span>
              <span><strong className="text-white">Enter bootloader mode.</strong> Hold <code className="px-2 py-0.5 bg-zinc-800 rounded text-sm">BOOT</code> button while connecting USB, or hold BOOT + press RESET.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-full ${config.accentColor === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center text-xs font-mono flex-shrink-0 mt-0.5`}>4</span>
              <span><strong className="text-white">Do not disconnect</strong> during the update process.</span>
            </li>
          </ul>
        </div>

        {/* Firmware Info */}
        {firmware && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-mono">Available Update</h2>
              <span className={`px-3 py-1 text-xs font-mono rounded-full ${config.accentColor === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                v{firmware.version}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <span className="text-zinc-500">Board:</span>
                <span className="ml-2 text-zinc-200">{firmware.board}</span>
              </div>
              <div>
                <span className="text-zinc-500">Build:</span>
                <span className="ml-2 text-zinc-200">{firmware.build}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-500">File:</span>
                <span className="ml-2 text-zinc-200">{firmware.bin}</span>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status Card */}
        <div className={`p-6 rounded-2xl border mb-8 ${status === 'error' ? 'bg-red-500/5 border-red-500/30' : status === 'complete' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.02] border-white/10'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <StatusIcon />
              <span className="font-mono">{statusText[status]}</span>
            </div>
            {deviceInfo && (
              <span className="text-sm text-zinc-500 font-mono">{deviceInfo.chip}</span>
            )}
          </div>

          {/* Progress Bar */}
          {(status === 'flashing' || status === 'complete') && (
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/30">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {status === 'idle' && (
              <Button
                onClick={handleConnect}
                disabled={!isSupported}
                data-testid="connect-btn"
                className={`h-12 px-8 rounded-full ${accentClasses.bg} ${accentClasses.hover} text-white font-medium transition-all ${accentClasses.glow}`}
              >
                <Usb className="w-5 h-5 mr-2" />
                Connect Device
              </Button>
            )}

            {status === 'connected' && (
              <>
                <Button
                  onClick={handleFlash}
                  data-testid="flash-btn"
                  className={`h-12 px-8 rounded-full ${accentClasses.bg} ${accentClasses.hover} text-white font-medium transition-all ${accentClasses.glow}`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Flash Firmware
                </Button>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  data-testid="disconnect-btn"
                  className="h-12 px-8 rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Disconnect
                </Button>
              </>
            )}

            {(status === 'complete' || status === 'error') && (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                data-testid="reset-btn"
                className="h-12 px-8 rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>

        {/* Console Log */}
        <div className="rounded-2xl bg-black border border-white/10 overflow-hidden">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-4 py-3 flex items-center justify-between text-zinc-400 hover:text-white transition-colors"
            data-testid="toggle-logs-btn"
          >
            <span className="flex items-center gap-2 font-mono text-sm">
              <Terminal className="w-4 h-4" />
              Console Output
              {logs.length > 0 && <span className="text-xs text-zinc-600">({logs.length})</span>}
            </span>
            {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showLogs && (
            <div className="border-t border-white/5 p-4 max-h-64 overflow-y-auto font-mono text-xs space-y-1" data-testid="console-logs">
              {logs.length === 0 ? (
                <span className="text-zinc-600">No logs yet. Connect a device to begin.</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-emerald-400' : 
                    log.type === 'warning' ? 'text-amber-400' :
                    log.type === 'progress' ? 'text-blue-400' :
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

        {/* Safety Note */}
        <div className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-sm text-amber-200/80">
            <strong>Safety:</strong> The bootloader validates firmware before flashing. If you connect the wrong board, 
            the update will fail safely without damaging your device.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/widget-os" className="text-zinc-500 hover:text-white transition-colors font-mono text-sm">
              ← Widget OS
            </Link>
            <span className="text-zinc-600 font-mono text-sm">{config.boardId} Updater</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UpdaterPage;
