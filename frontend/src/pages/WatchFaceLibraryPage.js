import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Watch, Upload, Download, Palette, Grid, Heart, Star, Search, Filter, Plus, Trash2, Edit, Eye, Usb, CheckCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Terminal, Paintbrush, Clock, Calendar, MapPin, Battery, Footprints, X, Settings, Move, RotateCcw, Layers, Type, Circle, Square, Droplet, Sun, Moon, Zap, Activity, CloudSun, Thermometer, Timer, Music, Phone, MessageCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Complications available
const COMPLICATIONS = [
  { id: 'date', name: 'Date', icon: Calendar, defaultPos: { x: 50, y: 75 } },
  { id: 'battery', name: 'Battery', icon: Battery, defaultPos: { x: 80, y: 50 } },
  { id: 'steps', name: 'Steps', icon: Footprints, defaultPos: { x: 50, y: 85 } },
  { id: 'weather', name: 'Weather', icon: CloudSun, defaultPos: { x: 20, y: 50 } },
  { id: 'heart', name: 'Heart Rate', icon: Activity, defaultPos: { x: 50, y: 25 } },
  { id: 'timer', name: 'Timer', icon: Timer, defaultPos: { x: 80, y: 80 } },
  { id: 'music', name: 'Now Playing', icon: Music, defaultPos: { x: 20, y: 80 } },
  { id: 'notifications', name: 'Notifications', icon: Bell, defaultPos: { x: 20, y: 20 } },
];

// Pre-made face templates
const FACE_TEMPLATES = [
  {
    id: 'minimal-dark',
    name: 'Minimal',
    style: 'digital',
    colors: { bg: '#0a0a0a', primary: '#ffffff', accent: '#ef4444', gradient: null },
    showSeconds: false,
    complications: ['date'],
    preview: 'https://customer-assets.emergentagent.com/job_60e9fd7e-902d-4a49-88d7-565643d05f9c/artifacts/jc9qyrjl_image.png'
  },
  {
    id: 'gradient-pink',
    name: 'Gradient',
    style: 'digital',
    colors: { bg: '#ec4899', primary: '#ffffff', accent: '#fbbf24', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
    showSeconds: true,
    complications: ['date', 'steps'],
    preview: 'https://customer-assets.emergentagent.com/job_60e9fd7e-902d-4a49-88d7-565643d05f9c/artifacts/mabreztt_image.png'
  },
  {
    id: 'classic-analog',
    name: 'Classic',
    style: 'analog',
    colors: { bg: '#fafafa', primary: '#0a0a0a', accent: '#ef4444', gradient: null },
    showSeconds: true,
    complications: ['date'],
    preview: null
  },
  {
    id: 'modular',
    name: 'Modular',
    style: 'digital',
    colors: { bg: '#0a0a0a', primary: '#22c55e', accent: '#3b82f6', gradient: null },
    showSeconds: false,
    complications: ['date', 'battery', 'steps', 'weather'],
    preview: null
  },
  {
    id: 'infograph',
    name: 'Infograph',
    style: 'analog',
    colors: { bg: '#0a0a0a', primary: '#ffffff', accent: '#f97316', gradient: null },
    showSeconds: true,
    complications: ['date', 'battery', 'steps', 'heart', 'weather', 'timer'],
    preview: null
  },
  {
    id: 'california',
    name: 'California',
    style: 'analog',
    colors: { bg: '#fef3c7', primary: '#78350f', accent: '#dc2626', gradient: null },
    showSeconds: false,
    complications: [],
    preview: null
  },
  {
    id: 'numerals',
    name: 'Numerals',
    style: 'digital',
    colors: { bg: '#0a0a0a', primary: '#3b82f6', accent: '#22d3ee', gradient: null },
    showSeconds: true,
    complications: ['date'],
    preview: null
  },
  {
    id: 'solar',
    name: 'Solar',
    style: 'analog',
    colors: { bg: '#1e3a5f', primary: '#fbbf24', accent: '#f97316', gradient: 'linear-gradient(180deg, #1e3a5f, #0f172a)' },
    showSeconds: false,
    complications: ['date'],
    preview: null
  },
  {
    id: 'pride',
    name: 'Pride',
    style: 'digital',
    colors: { bg: '#0a0a0a', primary: '#ffffff', accent: '#ec4899', gradient: 'linear-gradient(180deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)' },
    showSeconds: true,
    complications: [],
    preview: null
  },
  {
    id: 'contour',
    name: 'Contour',
    style: 'digital',
    colors: { bg: '#0a0a0a', primary: '#ef4444', accent: '#ffffff', gradient: null },
    showSeconds: false,
    complications: [],
    preview: null
  }
];

// Watch Face Preview Component (Live)
const LiveWatchFace = ({ face, size = 200, editable = false, onComplicationMove }) => {
  const [time, setTime] = useState(new Date());
  const [dragging, setDragging] = useState(null);
  const faceRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const handleDragStart = (compId, e) => {
    if (!editable) return;
    e.preventDefault();
    setDragging(compId);
  };

  const handleDrag = (e) => {
    if (!dragging || !faceRef.current) return;
    const rect = faceRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onComplicationMove?.(dragging, { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
  };

  const handleDragEnd = () => setDragging(null);

  const bgStyle = face.colors.gradient 
    ? { background: face.colors.gradient }
    : { backgroundColor: face.colors.bg };

  return (
    <div 
      ref={faceRef}
      className="relative rounded-[20%] overflow-hidden border-4 border-zinc-700"
      style={{ width: size, height: size * 1.22, ...bgStyle }}
      onMouseMove={editable ? handleDrag : undefined}
      onMouseUp={editable ? handleDragEnd : undefined}
      onMouseLeave={editable ? handleDragEnd : undefined}
    >
      {/* Analog or Digital */}
      {face.style === 'analog' ? (
        /* Analog Face */
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 rounded-full"
                style={{
                  backgroundColor: face.colors.primary,
                  left: '50%',
                  top: '8%',
                  transformOrigin: '50% 400%',
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  opacity: i % 3 === 0 ? 1 : 0.4
                }}
              />
            ))}
            {/* Hour hand */}
            <div
              className="absolute rounded-full"
              style={{
                backgroundColor: face.colors.primary,
                width: 6,
                height: '25%',
                left: '50%',
                top: '25%',
                transformOrigin: '50% 100%',
                transform: `translateX(-50%) rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`
              }}
            />
            {/* Minute hand */}
            <div
              className="absolute rounded-full"
              style={{
                backgroundColor: face.colors.primary,
                width: 4,
                height: '35%',
                left: '50%',
                top: '15%',
                transformOrigin: '50% 100%',
                transform: `translateX(-50%) rotate(${minutes * 6}deg)`
              }}
            />
            {/* Second hand */}
            {face.showSeconds && (
              <div
                className="absolute rounded-full"
                style={{
                  backgroundColor: face.colors.accent,
                  width: 2,
                  height: '40%',
                  left: '50%',
                  top: '10%',
                  transformOrigin: '50% 100%',
                  transform: `translateX(-50%) rotate(${seconds * 6}deg)`
                }}
              />
            )}
            {/* Center */}
            <div
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: face.colors.accent,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        </div>
      ) : (
        /* Digital Face */
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="font-mono font-bold"
            style={{ 
              color: face.colors.primary,
              fontSize: size * 0.25,
              textShadow: face.colors.gradient ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
            {face.showSeconds && (
              <span style={{ fontSize: size * 0.12, opacity: 0.7 }}>
                :{String(seconds).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Complications */}
      {face.complications?.map(compId => {
        const comp = COMPLICATIONS.find(c => c.id === compId);
        if (!comp) return null;
        const pos = face.complicationPositions?.[compId] || comp.defaultPos;
        const Icon = comp.icon;
        
        return (
          <div
            key={compId}
            className={`absolute flex items-center gap-1 ${editable ? 'cursor-move' : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              color: face.colors.primary,
              fontSize: size * 0.06,
              opacity: 0.8
            }}
            onMouseDown={(e) => handleDragStart(compId, e)}
          >
            <Icon style={{ width: size * 0.08, height: size * 0.08 }} />
            <span className="font-mono">
              {compId === 'date' && time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {compId === 'battery' && '85%'}
              {compId === 'steps' && '8,432'}
              {compId === 'weather' && '22°'}
              {compId === 'heart' && '72'}
              {compId === 'timer' && '0:00'}
            </span>
          </div>
        );
      })}

      {/* Edit indicator */}
      {editable && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

// Face Editor Panel
const FaceEditor = ({ face, onChange, onSave, onCancel }) => {
  const [localFace, setLocalFace] = useState({ ...face, complicationPositions: face.complicationPositions || {} });

  const updateFace = (updates) => {
    const newFace = { ...localFace, ...updates };
    setLocalFace(newFace);
    onChange?.(newFace);
  };

  const toggleComplication = (compId) => {
    const comps = localFace.complications || [];
    if (comps.includes(compId)) {
      updateFace({ complications: comps.filter(c => c !== compId) });
    } else {
      updateFace({ complications: [...comps, compId] });
    }
  };

  const handleComplicationMove = (compId, pos) => {
    updateFace({
      complicationPositions: {
        ...localFace.complicationPositions,
        [compId]: pos
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Live Preview */}
      <div className="flex flex-col items-center">
        <LiveWatchFace 
          face={localFace} 
          size={280}
          editable={true}
          onComplicationMove={handleComplicationMove}
        />
        <p className="text-zinc-500 text-sm mt-4">Drag complications to reposition</p>
      </div>

      {/* Editor Controls */}
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
        {/* Face Name */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">Face Name</label>
          <Input
            value={localFace.name}
            onChange={(e) => updateFace({ name: e.target.value })}
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        {/* Style Toggle */}
        <div>
          <label className="text-sm text-zinc-400 mb-3 block">Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateFace({ style: 'digital' })}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                localFace.style === 'digital' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Type className="w-5 h-5" /> Digital
            </button>
            <button
              onClick={() => updateFace({ style: 'analog' })}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                localFace.style === 'analog' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Clock className="w-5 h-5" /> Analog
            </button>
          </div>
        </div>

        {/* Show Seconds */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-zinc-400">Show Seconds</label>
          <Switch
            checked={localFace.showSeconds}
            onCheckedChange={(checked) => updateFace({ showSeconds: checked })}
          />
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <label className="text-sm text-zinc-400 block">Colors</label>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localFace.colors.bg}
                  onChange={(e) => updateFace({ colors: { ...localFace.colors, bg: e.target.value, gradient: null } })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Primary</label>
              <input
                type="color"
                value={localFace.colors.primary}
                onChange={(e) => updateFace({ colors: { ...localFace.colors, primary: e.target.value } })}
                className="w-10 h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Accent</label>
              <input
                type="color"
                value={localFace.colors.accent}
                onChange={(e) => updateFace({ colors: { ...localFace.colors, accent: e.target.value } })}
                className="w-10 h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Gradient Presets */}
          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Gradient Presets</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFace({ colors: { ...localFace.colors, gradient: null } })}
                className={`w-8 h-8 rounded-lg border-2 ${!localFace.colors.gradient ? 'border-blue-500' : 'border-transparent'}`}
                style={{ background: localFace.colors.bg }}
                title="Solid"
              />
              {[
                'linear-gradient(135deg, #ec4899, #8b5cf6)',
                'linear-gradient(135deg, #3b82f6, #22d3ee)',
                'linear-gradient(135deg, #22c55e, #eab308)',
                'linear-gradient(135deg, #f97316, #ef4444)',
                'linear-gradient(180deg, #1e3a5f, #0f172a)',
                'linear-gradient(180deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
              ].map((grad, i) => (
                <button
                  key={i}
                  onClick={() => updateFace({ colors: { ...localFace.colors, gradient: grad } })}
                  className={`w-8 h-8 rounded-lg border-2 ${localFace.colors.gradient === grad ? 'border-blue-500' : 'border-transparent'}`}
                  style={{ background: grad }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Complications */}
        <div>
          <label className="text-sm text-zinc-400 mb-3 block">Complications</label>
          <div className="grid grid-cols-2 gap-2">
            {COMPLICATIONS.map(comp => {
              const isActive = localFace.complications?.includes(comp.id);
              const Icon = comp.icon;
              return (
                <button
                  key={comp.id}
                  onClick={() => toggleComplication(comp.id)}
                  className={`py-2 px-3 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {comp.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-zinc-800">
          <Button
            onClick={() => onSave?.(localFace)}
            className="flex-1 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Save Face
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="h-12 px-6 rounded-full border-zinc-700"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Gallery View (Apple Watch style)
const GalleryView = ({ faces, selectedIndex, onSelect, onEdit, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % faces.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + faces.length) % faces.length);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-mono">{currentIndex + 1} / {faces.length}</span>
        <button 
          onClick={() => onEdit?.(faces[currentIndex])}
          className="text-blue-400 hover:text-blue-300"
        >
          <Edit className="w-6 h-6" />
        </button>
      </div>

      {/* Gallery */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Previous */}
        <button
          onClick={goPrev}
          className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Faces Carousel */}
        <div className="flex items-center gap-8">
          {/* Previous face (smaller) */}
          <div className="opacity-30 scale-75 hidden md:block">
            <LiveWatchFace 
              face={faces[(currentIndex - 1 + faces.length) % faces.length]} 
              size={180}
            />
          </div>

          {/* Current face */}
          <div className="transform transition-transform">
            <LiveWatchFace 
              face={faces[currentIndex]} 
              size={280}
            />
            <p className="text-center text-white font-semibold mt-4">{faces[currentIndex].name}</p>
          </div>

          {/* Next face (smaller) */}
          <div className="opacity-30 scale-75 hidden md:block">
            <LiveWatchFace 
              face={faces[(currentIndex + 1) % faces.length]} 
              size={180}
            />
          </div>
        </div>

        {/* Next */}
        <button
          onClick={goNext}
          className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => onSelect?.(faces[currentIndex])}
            className="h-14 px-12 rounded-full bg-blue-600 hover:bg-blue-500 text-lg"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            Set as Watch Face
          </Button>
        </div>
        <p className="text-center text-zinc-500 text-sm mt-4">
          Hold clock for 5 seconds on watch to open this gallery
        </p>
      </div>
    </div>
  );
};

export const WatchFaceLibraryPage = () => {
  const [faces, setFaces] = useState(FACE_TEMPLATES);
  const [selectedFace, setSelectedFace] = useState(null);
  const [editingFace, setEditingFace] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connected, setConnected] = useState(false);
  const [port, setPort] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const fileInputRef = useRef(null);

  const log = useCallback((msg, type = 'info') => {
    setLogs(prev => [...prev, { message: msg, type, timestamp: Date.now() }]);
  }, []);

  const filteredFaces = faces.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Connect watch
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

  // Flash face to watch
  const handleFlashFace = async (face) => {
    if (!connected || !port) {
      toast.error('Connect your watch first');
      return;
    }

    try {
      log(`Flashing "${face.name}" to watch...`);
      
      const faceData = {
        id: face.id,
        name: face.name,
        style: face.style,
        colors: face.colors,
        showSeconds: face.showSeconds,
        complications: face.complications,
        complicationPositions: face.complicationPositions || {}
      };

      const command = `WIDGET_WRITE_FACE\n${face.id}\n${JSON.stringify(faceData, null, 2)}\nEND_FACE_DATA\n`;
      
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode(command));
      writer.releaseLock();

      log(`"${face.name}" sent to watch gallery!`, 'success');
      toast.success(`"${face.name}" added to watch gallery!`);
    } catch (error) {
      log(`Flash failed: ${error.message}`, 'error');
      toast.error('Flash failed');
    }
  };

  // Set active face
  const handleSetActiveFace = async (face) => {
    if (connected && port) {
      try {
        const writer = port.writable.getWriter();
        await writer.write(new TextEncoder().encode(`WIDGET_SET_FACE\n${face.id}\n`));
        writer.releaseLock();
        log(`Set "${face.name}" as active face`, 'success');
        toast.success(`"${face.name}" is now your watch face!`);
      } catch (e) {
        log(`Failed to set face: ${e.message}`, 'error');
      }
    }
    setShowGallery(false);
    setSelectedFace(face);
  };

  // Save edited face
  const handleSaveFace = (face) => {
    const newId = face.id.startsWith('custom-') ? face.id : `custom-${Date.now()}`;
    const newFace = { ...face, id: newId };
    
    // Check if editing existing custom face
    const existingIndex = faces.findIndex(f => f.id === face.id);
    if (existingIndex >= 0 && face.id.startsWith('custom-')) {
      const updated = [...faces];
      updated[existingIndex] = newFace;
      setFaces(updated);
    } else {
      setFaces([newFace, ...faces]);
    }
    
    setEditingFace(null);
    toast.success(`"${newFace.name}" saved!`);

    // Auto-flash if connected
    if (connected) {
      handleFlashFace(newFace);
    }
  };

  // Download face
  const handleDownloadFace = (face) => {
    const faceData = {
      name: face.name,
      author: 'Fusion Labs',
      version: '1.0.0',
      supports: ['1.8', '2.06'],
      style: face.style,
      colors: face.colors,
      showSeconds: face.showSeconds,
      complications: face.complications,
      complicationPositions: face.complicationPositions
    };
    
    const blob = new Blob([JSON.stringify(faceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${face.id}_face.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded face.json - Copy to /WATCH/FACES/custom/${face.id}/`);
  };

  // Upload custom image
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFace = {
          id: `custom-img-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          style: 'custom-image',
          colors: { bg: '#0a0a0a', primary: '#ffffff', accent: '#3b82f6', gradient: null },
          showSeconds: false,
          complications: [],
          preview: event.target.result
        };
        setFaces([newFace, ...faces]);
        toast.success('Custom image face added!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/widget-os" className="flex items-center gap-2 text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Widget OS</span>
            </Link>
            <span className="font-mono text-sm text-blue-400">Watch Face Studio</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-mono mb-3">
            <Watch className="w-8 h-8 inline mr-3 text-blue-500" />
            Watch Face <span className="text-blue-500">Studio</span>
          </h1>
          <p className="text-zinc-400">
            Create, customize, and install watch faces. Like Apple Watch - hold for 5 seconds to change.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          {!connected ? (
            <Button onClick={handleConnect} className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-500">
              <Usb className="w-4 h-4 mr-2" /> Connect Watch
            </Button>
          ) : (
            <Button variant="outline" className="h-10 px-6 rounded-full border-emerald-500/50 text-emerald-400">
              <CheckCircle className="w-4 h-4 mr-2" /> Connected
            </Button>
          )}

          <Button
            onClick={() => setEditingFace({ 
              id: `new-${Date.now()}`, 
              name: 'My Face', 
              style: 'digital',
              colors: { bg: '#0a0a0a', primary: '#ffffff', accent: '#3b82f6', gradient: null },
              showSeconds: true,
              complications: ['date']
            })}
            variant="outline"
            className="h-10 px-6 rounded-full border-zinc-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Create New
          </Button>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="h-10 px-6 rounded-full border-zinc-700">
            <Upload className="w-4 h-4 mr-2" /> Upload Image
          </Button>

          <Button onClick={() => setShowGallery(true)} variant="outline" className="h-10 px-6 rounded-full border-purple-500/50 text-purple-400">
            <Grid className="w-4 h-4 mr-2" /> Gallery View
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faces..."
            className="pl-10 bg-zinc-900 border-zinc-700 rounded-full"
          />
        </div>

        {/* Editor Mode */}
        {editingFace && (
          <div className="mb-12 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-blue-500" />
              {editingFace.id.startsWith('new-') ? 'Create Watch Face' : 'Edit Watch Face'}
            </h2>
            <FaceEditor
              face={editingFace}
              onChange={setEditingFace}
              onSave={handleSaveFace}
              onCancel={() => setEditingFace(null)}
            />
          </div>
        )}

        {/* Face Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredFaces.map(face => (
            <div key={face.id} className="flex flex-col items-center group">
              <div 
                className={`relative cursor-pointer transition-transform hover:scale-105 ${selectedFace?.id === face.id ? 'ring-4 ring-blue-500 rounded-[20%]' : ''}`}
                onClick={() => setSelectedFace(face)}
              >
                {face.preview ? (
                  <div className="w-48 h-60 rounded-[20%] overflow-hidden border-4 border-zinc-700">
                    <img src={face.preview} alt={face.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <LiveWatchFace face={face} size={180} />
                )}
                
                {/* Hover Actions */}
                <div className="absolute inset-x-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingFace(face); }}
                    className="flex-1 py-1 rounded bg-black/80 text-white text-xs flex items-center justify-center"
                  >
                    <Paintbrush className="w-3 h-3 mr-1" /> Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFlashFace(face); }}
                    className="flex-1 py-1 rounded bg-blue-600/80 text-white text-xs flex items-center justify-center"
                  >
                    <Download className="w-3 h-3 mr-1" /> Flash
                  </button>
                </div>
              </div>
              <p className="text-center text-sm font-medium mt-3">{face.name}</p>
              {face.id.startsWith('custom-') && (
                <span className="text-xs text-blue-400">Custom</span>
              )}
            </div>
          ))}
        </div>

        {/* Selected Face Actions */}
        {selectedFace && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 p-4 z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <span className="text-zinc-400">Selected:</span>
                <span className="text-white font-semibold ml-2">{selectedFace.name}</span>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setEditingFace(selectedFace)} variant="outline" className="h-10 rounded-full border-zinc-700">
                  <Paintbrush className="w-4 h-4 mr-2" /> Customize
                </Button>
                <Button onClick={() => handleDownloadFace(selectedFace)} variant="outline" className="h-10 rounded-full border-zinc-700">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button onClick={() => handleFlashFace(selectedFace)} disabled={!connected} className="h-10 rounded-full bg-emerald-600 hover:bg-emerald-500">
                  <Usb className="w-4 h-4 mr-2" /> Flash to Watch
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-16 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <h3 className="font-semibold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
                Create or Customize
              </h4>
              <p>Choose a template, change colors, toggle digital/analog, add complications, adjust seconds display.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
                Flash to Watch
              </h4>
              <p>Connect via USB and click "Flash" to add face to your watch gallery. Or download face.json for manual install.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
                Change on Watch
              </h4>
              <p><strong>Hold clock face for 5 seconds</strong> → swipe through gallery → tap to select. Just like Apple Watch!</p>
            </div>
          </div>
        </div>

        {/* Console */}
        <div className="mt-8 rounded-2xl bg-black border border-white/10 overflow-hidden">
          <button onClick={() => setShowLogs(!showLogs)} className="w-full px-4 py-3 flex items-center justify-between text-zinc-400 hover:text-white">
            <span className="flex items-center gap-2 font-mono text-sm">
              <Terminal className="w-4 h-4" /> Console
            </span>
            {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showLogs && (
            <div className="border-t border-white/5 p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
              {logs.length === 0 ? <span className="text-zinc-600">No logs yet.</span> : logs.map((l, i) => (
                <div key={i} className={l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-zinc-400'}>
                  [{new Date(l.timestamp).toLocaleTimeString()}] {l.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Gallery Modal */}
      {showGallery && (
        <GalleryView
          faces={faces}
          selectedIndex={selectedFace ? faces.findIndex(f => f.id === selectedFace.id) : 0}
          onSelect={handleSetActiveFace}
          onEdit={(face) => { setShowGallery(false); setEditingFace(face); }}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/widget-os" className="text-zinc-500 hover:text-white font-mono text-sm">← Widget OS</Link>
          <span className="text-zinc-600 font-mono text-sm">Watch Face Studio</span>
        </div>
      </footer>
    </div>
  );
};

export default WatchFaceLibraryPage;
