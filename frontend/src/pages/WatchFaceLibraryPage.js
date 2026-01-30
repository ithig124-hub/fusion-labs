import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Watch, Upload, Download, Palette, Grid, Heart, Star, Search, Filter, Plus, Trash2, Edit, Eye, Usb, CheckCircle, ChevronDown, ChevronUp, Terminal, Paintbrush, Clock, Calendar, MapPin, Battery, Footprints, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Pre-made watch faces library
const PREMADE_FACES = [
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'minimal',
    supports: ['1.8', '2.06'],
    preview: 'https://customer-assets.emergentagent.com/job_60e9fd7e-902d-4a49-88d7-565643d05f9c/artifacts/jc9qyrjl_image.png',
    colors: { background: '#0a0a0a', primary: '#ffffff', accent: '#ef4444' },
    style: 'analog',
    features: ['time', 'date', 'day']
  },
  {
    id: 'gradient-pink',
    name: 'Gradient Pink',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'colorful',
    supports: ['1.8', '2.06'],
    preview: 'https://customer-assets.emergentagent.com/job_60e9fd7e-902d-4a49-88d7-565643d05f9c/artifacts/mabreztt_image.png',
    colors: { background: '#ec4899', primary: '#ffffff', accent: '#fbbf24' },
    style: 'digital',
    features: ['time', 'date', 'location', 'graph']
  },
  {
    id: 'widget-classic',
    name: 'Widget Classic',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'classic',
    supports: ['1.8', '2.06'],
    preview: 'https://customer-assets.emergentagent.com/job_60e9fd7e-902d-4a49-88d7-565643d05f9c/artifacts/5oz1bqgv_image.png',
    colors: { background: '#78716c', primary: '#ffffff', accent: '#f59e0b' },
    style: 'hybrid',
    features: ['time', 'date', 'weather']
  },
  {
    id: 'digital-block',
    name: 'Digital Block',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'digital',
    supports: ['1.8', '2.06'],
    preview: null,
    colors: { background: '#f5f5f4', primary: '#27272a', accent: '#ef4444' },
    style: 'digital',
    features: ['time', 'date', 'day']
  },
  {
    id: 'roman-classic',
    name: 'Roman Classic',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'classic',
    supports: ['1.8', '2.06'],
    preview: null,
    colors: { background: '#ffffff', primary: '#0a0a0a', accent: '#ef4444' },
    style: 'analog',
    features: ['time']
  },
  {
    id: 'gradient-green',
    name: 'Gradient Green',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'colorful',
    supports: ['1.8', '2.06'],
    preview: null,
    colors: { background: '#22c55e', primary: '#ffffff', accent: '#fbbf24' },
    style: 'digital',
    features: ['time', 'date', 'location']
  },
  {
    id: 'gradient-orange',
    name: 'Gradient Orange',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'colorful',
    supports: ['1.8', '2.06'],
    preview: null,
    colors: { background: '#f97316', primary: '#ffffff', accent: '#fbbf24' },
    style: 'digital',
    features: ['time', 'date', 'location']
  },
  {
    id: 'neon-blue',
    name: 'Neon Blue',
    author: 'Fusion Labs',
    version: '1.0.0',
    category: 'neon',
    supports: ['1.8', '2.06'],
    preview: null,
    colors: { background: '#0a0a0a', primary: '#3b82f6', accent: '#22d3ee' },
    style: 'digital',
    features: ['time', 'date', 'steps']
  }
];

const CATEGORIES = ['all', 'minimal', 'digital', 'classic', 'colorful', 'neon', 'custom'];

// Watch Face Preview Component
const WatchFacePreview = ({ face, size = 'md', onClick, selected, onCustomize }) => {
  const sizeClasses = {
    sm: 'w-32 h-40',
    md: 'w-48 h-60',
    lg: 'w-64 h-80'
  };

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className={`relative ${sizeClasses[size]} cursor-pointer group`}
      onClick={() => onClick?.(face)}
    >
      {/* Watch Frame */}
      <div className={`absolute inset-0 rounded-[2rem] border-4 ${selected ? 'border-blue-500' : 'border-zinc-700'} bg-zinc-900 overflow-hidden transition-all group-hover:border-zinc-500`}>
        {/* Face Content */}
        <div 
          className="absolute inset-2 rounded-[1.5rem] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: face.colors.background }}
        >
          {face.preview ? (
            <img src={face.preview} alt={face.name} className="w-full h-full object-cover" />
          ) : (
            /* Generated Preview */
            <div className="w-full h-full flex flex-col items-center justify-center p-3">
              {face.style === 'analog' ? (
                /* Analog Face */
                <div className="relative w-full aspect-square">
                  <div 
                    className="absolute inset-4 rounded-full border-2"
                    style={{ borderColor: face.colors.primary + '40' }}
                  >
                    {/* Hour hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-1 h-8 -ml-0.5 origin-bottom rounded-full"
                      style={{ 
                        backgroundColor: face.colors.primary,
                        transform: `translateY(-100%) rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)`
                      }}
                    />
                    {/* Minute hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-0.5 h-10 -ml-0.5 origin-bottom rounded-full"
                      style={{ 
                        backgroundColor: face.colors.primary,
                        transform: `translateY(-100%) rotate(${time.getMinutes() * 6}deg)`
                      }}
                    />
                    {/* Second hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-0.5 h-12 -ml-0.5 origin-bottom rounded-full"
                      style={{ 
                        backgroundColor: face.colors.accent,
                        transform: `translateY(-100%) rotate(${time.getSeconds() * 6}deg)`
                      }}
                    />
                    {/* Center dot */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full"
                      style={{ backgroundColor: face.colors.accent }}
                    />
                  </div>
                </div>
              ) : (
                /* Digital Face */
                <>
                  <div 
                    className="text-3xl font-bold font-mono"
                    style={{ color: face.colors.primary }}
                  >
                    {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div 
                    className="text-xs mt-1"
                    style={{ color: face.colors.primary + 'aa' }}
                  >
                    {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  {face.features.includes('steps') && (
                    <div 
                      className="text-xs mt-2 flex items-center gap-1"
                      style={{ color: face.colors.accent }}
                    >
                      <Footprints className="w-3 h-3" /> 8,432
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Hover Actions */}
      <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onCustomize && (
          <button
            onClick={(e) => { e.stopPropagation(); onCustomize(face); }}
            className="flex-1 py-1 px-2 rounded bg-black/70 text-white text-xs flex items-center justify-center gap-1"
          >
            <Paintbrush className="w-3 h-3" /> Customize
          </button>
        )}
      </div>
    </div>
  );
};

// Face Customizer Modal
const FaceCustomizer = ({ face, onClose, onSave }) => {
  const [colors, setColors] = useState(face.colors);
  const [name, setName] = useState(face.name + ' (Custom)');

  const handleSave = () => {
    onSave({
      ...face,
      id: 'custom-' + Date.now(),
      name,
      colors,
      category: 'custom',
      author: 'You'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-mono">Customize Watch Face</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="flex justify-center">
            <WatchFacePreview 
              face={{ ...face, colors }} 
              size="lg" 
            />
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Face Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors.background}
                  onChange={(e) => setColors({ ...colors, background: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={colors.background}
                  onChange={(e) => setColors({ ...colors, background: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Primary Color (Text/Hands)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Accent Color (Second Hand/Highlights)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={colors.accent}
                  onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 h-12 rounded-full bg-blue-600 hover:bg-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save as New Face
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WatchFaceLibraryPage = () => {
  const [faces, setFaces] = useState(PREMADE_FACES);
  const [selectedFace, setSelectedFace] = useState(null);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customizingFace, setCustomizingFace] = useState(null);
  const [connected, setConnected] = useState(false);
  const [port, setPort] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const serialSupported = 'serial' in navigator;

  const log = useCallback((message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: Date.now() }]);
  }, []);

  // Filter faces
  const filteredFaces = faces.filter(face => {
    const matchesCategory = category === 'all' || face.category === category;
    const matchesSearch = face.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         face.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Connect to watch
  const handleConnect = async () => {
    try {
      const selectedPort = await navigator.serial.requestPort({
        filters: [{ usbVendorId: 0x303A }]
      });
      await selectedPort.open({ baudRate: 115200 });
      setPort(selectedPort);
      setConnected(true);
      log('Connected to watch', 'success');
      toast.success('Watch connected!');
    } catch (error) {
      log(`Connection failed: ${error.message}`, 'error');
      toast.error(error.message);
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    try {
      await port?.close();
    } catch (e) {}
    setPort(null);
    setConnected(false);
    log('Disconnected');
  };

  // Generate face.json
  const generateFaceJson = (face) => {
    return JSON.stringify({
      name: face.name,
      author: face.author,
      version: face.version,
      supports: face.supports,
      style: face.style,
      colors: face.colors,
      features: face.features
    }, null, 2);
  };

  // Download face package
  const handleDownloadFace = (face) => {
    const faceJson = generateFaceJson(face);
    const blob = new Blob([faceJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${face.id}_face.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${face.name} face.json - Copy to /WATCH/FACES/custom/${face.id}/`);
  };

  // Flash face to watch via serial
  const handleFlashFace = async (face) => {
    if (!connected) {
      toast.error('Connect your watch first');
      return;
    }

    try {
      log(`Flashing ${face.name} to watch...`);
      
      const faceJson = generateFaceJson(face);
      const command = `WIDGET_WRITE_FACE\n${face.id}\n${faceJson}\nEND_FACE_DATA\n`;
      
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode(command));
      writer.releaseLock();

      log(`${face.name} sent to watch`, 'success');
      toast.success(`${face.name} flashed to watch!`);
    } catch (error) {
      log(`Flash failed: ${error.message}`, 'error');
      toast.error('Flash failed - try downloading manually');
    }
  };

  // Handle custom image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        // Create custom face from uploaded image
        const newFace = {
          id: 'custom-upload-' + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          author: 'You',
          version: '1.0.0',
          category: 'custom',
          supports: ['1.8', '2.06'],
          preview: event.target.result,
          colors: { background: '#0a0a0a', primary: '#ffffff', accent: '#3b82f6' },
          style: 'custom',
          features: ['time'],
          isCustomUpload: true
        };
        setFaces(prev => [newFace, ...prev]);
        toast.success('Custom face added!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save customized face
  const handleSaveCustomFace = (customFace) => {
    setFaces(prev => [customFace, ...prev]);
    toast.success('Custom face saved!');
  };

  // Delete custom face
  const handleDeleteFace = (faceId) => {
    setFaces(prev => prev.filter(f => f.id !== faceId));
    if (selectedFace?.id === faceId) setSelectedFace(null);
    toast.success('Face removed');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/widget-os" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Back to Widget OS</span>
            </Link>
            <span className="font-mono text-sm text-blue-400">Watch Face Library</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-mono mb-3">
            <Watch className="w-8 h-8 inline mr-3 text-blue-500" />
            Watch Face <span className="text-blue-500">Library</span>
          </h1>
          <p className="text-zinc-400">
            Browse, customize, and install watch faces. Hold face for 5 seconds on watch to change.
          </p>
        </div>

        {/* Connection & Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          {!connected ? (
            <Button
              onClick={handleConnect}
              disabled={!serialSupported}
              data-testid="connect-face-btn"
              className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-500"
            >
              <Usb className="w-4 h-4 mr-2" />
              Connect Watch
            </Button>
          ) : (
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="h-10 px-6 rounded-full border-emerald-500/50 text-emerald-400"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Connected
            </Button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            data-testid="upload-face-btn"
            className="h-10 px-6 rounded-full border-zinc-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Custom
          </Button>

          {selectedFace && (
            <>
              <Button
                onClick={() => handleFlashFace(selectedFace)}
                disabled={!connected}
                data-testid="flash-face-btn"
                className="h-10 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Flash to Watch
              </Button>
              <Button
                onClick={() => handleDownloadFace(selectedFace)}
                variant="outline"
                data-testid="download-face-btn"
                className="h-10 px-6 rounded-full border-zinc-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download face.json
              </Button>
            </>
          )}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faces..."
              className="pl-10 bg-zinc-900 border-zinc-700 rounded-full"
              data-testid="search-faces-input"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
                data-testid={`category-${cat}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Face Info */}
        {selectedFace && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-8 flex items-center justify-between">
            <div>
              <span className="text-blue-400 font-mono text-sm">Selected:</span>
              <span className="text-white font-semibold ml-2">{selectedFace.name}</span>
              <span className="text-zinc-500 ml-2">by {selectedFace.author}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCustomizingFace(selectedFace)}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              >
                <Paintbrush className="w-4 h-4" />
              </button>
              {selectedFace.category === 'custom' && (
                <button
                  onClick={() => handleDeleteFace(selectedFace.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Face Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredFaces.map(face => (
            <div key={face.id} className="flex flex-col items-center">
              <WatchFacePreview
                face={face}
                size="md"
                selected={selectedFace?.id === face.id}
                onClick={setSelectedFace}
                onCustomize={setCustomizingFace}
              />
              <div className="mt-3 text-center">
                <h3 className="font-medium text-sm truncate max-w-[12rem]">{face.name}</h3>
                <p className="text-xs text-zinc-500">{face.author}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredFaces.length === 0 && (
          <div className="text-center py-16">
            <Watch className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">No faces found</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            How Watch Faces Work
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-zinc-400">
            <div>
              <h4 className="text-white font-medium mb-2">On Your Watch:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Hold for 5 seconds</strong> on the watch face to enter face selection</li>
                <li>Swipe left/right to browse installed faces</li>
                <li>Tap to select and apply</li>
                <li>Faces stored in <code className="px-1 bg-zinc-800 rounded">/WATCH/FACES/</code></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Installing Faces:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>USB Direct:</strong> Connect watch, select face, click "Flash to Watch"</li>
                <li><strong>Manual:</strong> Download face.json, copy to SD card in <code className="px-1 bg-zinc-800 rounded">/WATCH/FACES/custom/[face-id]/</code></li>
                <li>Each face folder needs: <code className="px-1 bg-zinc-800 rounded">face.json</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Console */}
        <div className="mt-8 rounded-2xl bg-black border border-white/10 overflow-hidden">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-4 py-3 flex items-center justify-between text-zinc-400 hover:text-white"
          >
            <span className="flex items-center gap-2 font-mono text-sm">
              <Terminal className="w-4 h-4" />
              Console
            </span>
            {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showLogs && (
            <div className="border-t border-white/5 p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <span className="text-zinc-600">No logs yet.</span>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className={l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-zinc-400'}>
                    [{new Date(l.timestamp).toLocaleTimeString()}] {l.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Customizer Modal */}
      {customizingFace && (
        <FaceCustomizer
          face={customizingFace}
          onClose={() => setCustomizingFace(null)}
          onSave={handleSaveCustomFace}
        />
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/widget-os" className="text-zinc-500 hover:text-white font-mono text-sm">
              ← Widget OS
            </Link>
            <span className="text-zinc-600 font-mono text-sm">Watch Face Library</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WatchFaceLibraryPage;
