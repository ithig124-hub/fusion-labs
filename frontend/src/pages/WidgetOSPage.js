import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Cpu, Wifi, Battery, HardDrive, Monitor, Thermometer, Download, BookOpen, FolderTree, CloudSun, TrendingUp, DollarSign, Clock, Compass, Flashlight, Gamepad2, Music, Image, Gauge, Shield, Heart, Star, Rocket, Users, Code, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WidgetOSPage = () => {
  const specs180 = {
    display: '1.8" AMOLED (SH8601)',
    resolution: '368 × 448',
    boardId: 'WOS-180A',
    processor: 'ESP32-S3 Dual-core 240MHz',
    touch: 'FT3168 Capacitive',
    imu: 'QMI8658 (Accel + Gyro)',
    rtc: 'PCF85063',
    pmu: 'AXP2101',
    storage: 'SD Card (1-bit MMC)'
  };

  const specs206 = {
    display: '2.06" AMOLED (CO5300)',
    resolution: '410 × 502',
    boardId: 'WOS-206A',
    processor: 'ESP32-S3 Dual-core 240MHz',
    touch: 'FT3168 Capacitive',
    imu: 'QMI8658 (Accel + Gyro)',
    rtc: 'PCF85063',
    pmu: 'AXP2101',
    storage: 'SD Card (1-bit MMC)'
  };

  const features = [
    { icon: Monitor, title: 'Custom Watch Faces', desc: 'Built-in faces + custom via SD card. Auto-detects screen size for compatible faces.' },
    { icon: Wifi, title: 'WiFi Connected', desc: 'Configure up to 5 networks. Auto-connect on boot with NTP time sync.' },
    { icon: Battery, title: 'Smart Power', desc: 'Auto battery saver, adjustable brightness, usage stats & life estimates.' },
    { icon: HardDrive, title: 'SD Storage', desc: 'Auto-creates folder structure. Manual + automatic backups every 24h.' },
    { icon: Thermometer, title: 'Activity Tracking', desc: 'Step counter via IMU, daily goals, consecutive day streaks.' },
    { icon: Cpu, title: 'LVGL Graphics', desc: 'Smooth animations powered by Light and Versatile Graphics Library.' },
  ];

  const internetFeatures = [
    { icon: CloudSun, title: 'Weather', desc: 'Real-time weather with forecasts via OpenWeatherMap', api: 'OpenWeatherMap' },
    { icon: TrendingUp, title: 'Stocks', desc: 'Live stock prices and market data', api: 'Alpha Vantage' },
    { icon: DollarSign, title: 'Currency', desc: 'Exchange rates for crypto and fiat', api: 'CoinAPI' },
  ];

  const apps = [
    { icon: Clock, name: 'Clock', desc: 'Multiple styles' },
    { icon: Compass, name: 'Compass', desc: 'Digital compass' },
    { icon: Gauge, name: 'Timer', desc: 'Stopwatch & timer' },
    { icon: Flashlight, name: 'Torch', desc: 'Flashlight' },
    { icon: Gamepad2, name: 'Games', desc: 'Blackjack, Clicker' },
    { icon: Music, name: 'Media', desc: 'Audio player' },
    { icon: Image, name: 'Gallery', desc: 'Image viewer' },
    { icon: Shield, name: 'System', desc: 'Device info' },
  ];

  const acknowledgments = [
    { name: 'LVGL Team', desc: 'For their incredible graphics engine' },
    { name: 'Espressif', desc: 'For the versatile ESP32-S3 chip' },
    { name: 'Waveshare', desc: 'For beautiful AMOLED hardware' },
    { name: 'Emergent', desc: 'For the endless code debugging' },
    { name: 'My Little Sister', desc: 'For inspiring Widget OS' },
    { name: 'Open Source Communities', desc: 'For ongoing inspiration and support' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Back to Home</span>
            </Link>
            <span className="font-mono text-sm text-blue-400">Widget OS v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 text-xs font-mono bg-blue-500/20 text-blue-400 rounded-full mb-6">STABLE RELEASE</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-mono mb-4">
              Widget <span className="text-blue-500">OS</span>
            </h1>
            <p className="text-2xl text-zinc-300 font-medium mb-4">
              Your Favourite Widgets, Now On Your Wrists
            </p>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8">
              A productivity-focused smartwatch operating system. Clean interface, essential features, 
              reliable performance. Built for daily use. ESP32-S3 powered • AMOLED display • WiFi connected
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#update" className="inline-block">
                <Button 
                  data-testid="update-firmware-btn"
                  className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Update Firmware
                </Button>
              </a>
              <a href="/fusion-labs/docs/WIDGET_OS_README.md" target="_blank" className="inline-block">
                <Button 
                  data-testid="full-docs-btn"
                  variant="outline"
                  className="h-12 px-8 rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Full Documentation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Kickstarter Support */}
      <section className="py-16 border-b border-white/5 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-emerald-500" />
                <h2 className="text-2xl font-bold font-mono">Support Widget OS on Kickstarter</h2>
                <Rocket className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Help bring Widget OS to wider audiences and add exciting new features! Early backers receive 
                exclusive rewards like early access, dev kits, limited edition watches, and feature voting power.
              </p>
              <p className="text-zinc-500 text-sm">
                <strong className="text-zinc-300">End Goal:</strong> Setup an online store and sell technology starting with Widget and Fusion OS
              </p>
            </div>
            <div>
              <Button 
                data-testid="kickstarter-btn"
                className="h-14 px-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-lg transition-all hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]"
              >
                <Heart className="w-5 h-5 mr-2" />
                Coming Soon
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Comparison */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12">
            Hardware <span className="text-blue-500">Specifications</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 1.8" Specs */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
              <h3 className="text-xl font-bold font-mono mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-blue-500 rounded-full" />
                1.8" AMOLED
              </h3>
              <div className="space-y-3 font-mono text-sm">
                {Object.entries(specs180).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-zinc-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2.06" Specs */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
              <h3 className="text-xl font-bold font-mono mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-purple-500 rounded-full" />
                2.06" AMOLED
              </h3>
              <div className="space-y-3 font-mono text-sm">
                {Object.entries(specs206).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-zinc-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12">
            Core <span className="text-blue-500">Features</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors">
                <feature.icon className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internet Features */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12">
            Internet <span className="text-blue-500">Features</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {internetFeatures.map((feature, i) => (
              <div key={i} className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20">
                <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">{feature.desc}</p>
                <span className="text-xs font-mono text-zinc-600">API: {feature.api}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apps */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12">
            Built-in <span className="text-blue-500">Apps</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {apps.map((app, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <app.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-medium text-sm mb-1">{app.name}</h4>
                <p className="text-xs text-zinc-600">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SD Card Structure */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-4">
            <FolderTree className="w-8 h-8 inline mr-3 text-blue-500" />
            SD Card <span className="text-blue-500">Structure</span>
          </h2>
          <p className="text-zinc-400 mb-8">Auto-created on first boot. Same layout works on both board sizes.</p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <pre className="p-6 bg-zinc-900 rounded-xl text-sm font-mono overflow-x-auto text-zinc-300">
{`/WATCH/
├── SYSTEM/
│   ├── device.json    # Device ID, screen, hw rev
│   ├── os.json        # OS version, build type
│   └── logs/boot.log  # Boot logs
├── CONFIG/
│   ├── user.json      # Brightness, watch face
│   ├── display.json   # Timeout, theme
│   └── power.json     # Battery saver settings
├── FACES/
│   ├── custom/        # Your watch faces
│   └── imported/      # Downloaded faces
├── IMAGES/            # Your photos
├── MUSIC/             # Audio files
└── wifi/
    └── config.txt     # WiFi credentials`}
            </pre>

            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <h4 className="font-semibold text-emerald-400 mb-2">Safe Updates</h4>
                <p className="text-sm text-zinc-400">Firmware updates never erase user data. Your faces, settings, and files are preserved.</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-semibold text-blue-400 mb-2">Optional Storage</h4>
                <p className="text-sm text-zinc-400">OS boots without SD card using defaults. SD is only needed for custom media and faces.</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <h4 className="font-semibold text-purple-400 mb-2">Auto Backup</h4>
                <p className="text-sm text-zinc-400">Settings automatically backed up every 24 hours. Manual backup also available.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Update Section */}
      <section id="update" className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-4">
            Firmware <span className="text-blue-500">Update</span>
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl">
            Select your board size to access the web-based firmware updater. 
            Connect via USB and update directly in Chrome or Edge browser.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="/fusion-labs/docs/FIRMWARE_UPDATE_PROTOCOL.md" target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
              <Code className="w-4 h-4" />
              Firmware Update Protocol
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link to="/widget-os/wifi-config" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm" data-testid="wifi-config-link">
              <Settings className="w-4 h-4" />
              WiFi Configuration Tool
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 1.8" Updater Link */}
            <Link to="/widget-os/1.8" className="group" data-testid="updater-18-link">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold font-mono">1.8"</span>
                  <span className="px-3 py-1 text-xs font-mono bg-blue-500/20 text-blue-400 rounded-full">WOS-180A</span>
                </div>
                <p className="text-zinc-400 mb-2">368 × 448 • SH8601 AMOLED</p>
                <p className="text-zinc-600 text-sm mb-4">Firmware: S3_MiniOS.bin</p>
                <div className="flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                  Open Updater <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>

            {/* 2.06" Updater Link */}
            <Link to="/widget-os/2.06" className="group" data-testid="updater-206-link">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold font-mono">2.06"</span>
                  <span className="px-3 py-1 text-xs font-mono bg-purple-500/20 text-purple-400 rounded-full">WOS-206A</span>
                </div>
                <p className="text-zinc-400 mb-2">410 × 502 • CO5300 AMOLED</p>
                <p className="text-zinc-600 text-sm mb-4">Firmware: S3_MiniOS_206.bin</p>
                <div className="flex items-center text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
                  Open Updater <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Future Implementation */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-4">
            <Star className="w-8 h-8 inline mr-3 text-blue-500" />
            Future <span className="text-blue-500">Implementation</span>
          </h2>
          <p className="text-zinc-500 text-sm mb-8">(In Development)</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-400 leading-relaxed mb-6">
              This watch platform is designed to grow. Future updates will introduce additional watch faces, 
              deeper customization options, and expanded system features without requiring new hardware.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Screen protectors and case accessories are planned to improve durability and personalization. 
              USB-based firmware updates ensure long-term support, performance improvements, and new features over time.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              As the platform matures, additional tools, utilities, and optional software enhancements 
              may be released based on community feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section id="manual" className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12">
            Quick Start <span className="text-blue-500">Guide</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Getting Started */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-mono">1</span>
                Getting Started
              </h3>
              <div className="space-y-4 text-zinc-400">
                <p><strong className="text-white">Charging:</strong> Connect via USB-C. Full charge takes ~2 hours.</p>
                <p><strong className="text-white">Power On:</strong> Long press the side button for 3 seconds.</p>
                <p><strong className="text-white">Touch Navigation:</strong> Swipe to change screens, tap to select.</p>
                <p><strong className="text-white">SD Card:</strong> Optional but recommended for custom watch faces and media.</p>
              </div>
            </div>

            {/* WiFi Setup */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-mono">2</span>
                WiFi Configuration
              </h3>
              <div className="space-y-4 text-zinc-400">
                <p>Create <code className="px-2 py-1 bg-zinc-800 rounded text-sm font-mono">/WATCH/wifi/config.txt</code> on SD card:</p>
                <pre className="p-4 bg-zinc-900 rounded-lg text-sm font-mono overflow-x-auto">
{`WIFI1_SSID=YourNetwork
WIFI1_PASS=YourPassword
CITY=Perth
COUNTRY=AU
GMT_OFFSET=8`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgments */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-4 flex items-center gap-3">
            <span className="text-2xl">🙏</span>
            Acknowledgments & <span className="text-red-500">Thanks</span>
            <span className="text-2xl">❤️</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {acknowledgments.map((ack, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h4 className="font-semibold text-white mb-1">{ack.name}</h4>
                <p className="text-sm text-zinc-500">{ack.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Made With Love */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold font-mono mb-6 flex items-center justify-center gap-2">
            <span>🎉</span> Made with <span className="text-red-500">❤️</span> by makers, for makers
          </h2>
          <p className="text-zinc-400 leading-relaxed max-w-3xl mx-auto mb-6">
            Widget/Fusion OS isn't just software — it's a community-driven project turning your wrist 
            into a smart, beautiful hub that fits your lifestyle and creativity. <strong className="text-white">Your wrist, your rules.</strong>
          </p>
          <p className="text-zinc-500 leading-relaxed max-w-3xl mx-auto mb-6">
            Building this project alone has been a rewarding journey full of coding challenges, 
            sensor calibrations, and endless tweaks, but the joy of seeing it all come together 
            has been worth every late night.
          </p>
          <p className="text-zinc-400 leading-relaxed max-w-3xl mx-auto mb-8">
            This smartwatch project is my way of showing that with dedication and creativity, 
            even a <strong className="text-blue-400">single high school student</strong> can build something impactful and inspiring.
          </p>
          <p className="text-zinc-300 font-medium">
            Join me in this adventure—where your watch is not just a gadget, but a world waiting to be explored.
          </p>
          <p className="text-zinc-500 mt-4 text-sm">
            Any feedback and suggestions are highly welcome. :)
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-zinc-500 hover:text-white transition-colors font-mono text-sm">
              ← Fusion Labs
            </Link>
            <span className="text-zinc-600 font-mono text-sm">Widget OS v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WidgetOSPage;
