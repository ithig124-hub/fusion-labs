import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Bell, Zap, Layers, Github, Gamepad2, Sword, Compass, Users, Trophy, Heart, Star, ChevronRight, Flame, Shield, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Watch Simulator Component
const WatchSimulator = () => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({ level: 42, xp: 7500, health: 95, steps: 8432 });
  const [showMenu, setShowMenu] = useState(false);
  
  const themes = [
    { 
      name: 'Luffy Gear 5', 
      bg: 'from-orange-600 to-red-700', 
      accent: 'orange',
      title: 'Rubber Pirate',
      icon: '🏴‍☠️',
      colors: { primary: '#f97316', secondary: '#dc2626' }
    },
    { 
      name: 'Sung Jin-Woo', 
      bg: 'from-purple-700 to-black', 
      accent: 'purple',
      title: 'Shadow Monarch',
      icon: '⚔️',
      colors: { primary: '#9333ea', secondary: '#000' }
    },
    { 
      name: 'Yugo Wakfu', 
      bg: 'from-cyan-500 to-blue-700', 
      accent: 'cyan',
      title: 'Portal Master',
      icon: '🌀',
      colors: { primary: '#06b6d4', secondary: '#1d4ed8' }
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const theme = themes[currentTheme];

  return (
    <div className="relative">
      {/* Watch Frame */}
      <div className="relative w-64 h-80 mx-auto">
        {/* Watch Body */}
        <div className="absolute inset-0 bg-zinc-900 rounded-[3rem] border-4 border-zinc-700 shadow-2xl overflow-hidden">
          {/* Screen */}
          <div className={`absolute inset-2 rounded-[2.5rem] bg-gradient-to-br ${theme.bg} overflow-hidden`}>
            {/* Status Bar */}
            <div className="absolute top-3 left-0 right-0 px-4 flex justify-between items-center text-white/80 text-xs font-mono">
              <span>{stats.steps.toLocaleString()} steps</span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-2 bg-white/30 rounded-sm relative overflow-hidden">
                  <span className="absolute inset-0 bg-green-400" style={{ width: '75%' }} />
                </span>
                75%
              </span>
            </div>

            {!showMenu ? (
              /* Main Watch Face */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                {/* Time */}
                <div className="text-5xl font-bold font-mono tracking-tight mb-1">
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="text-sm opacity-70 mb-4">
                  {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                
                {/* Character Info */}
                <div className="text-center mb-4">
                  <div className="text-2xl mb-1">{theme.icon}</div>
                  <div className="text-sm font-semibold">{theme.title}</div>
                  <div className="text-xs opacity-70">Level {stats.level}</div>
                </div>

                {/* XP Bar */}
                <div className="w-32 h-2 bg-black/30 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-white/80 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.xp % 10000) / 100}%` }}
                  />
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {stats.health}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {stats.xp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            ) : (
              /* App Menu */
              <div className="absolute inset-0 pt-8 pb-4 px-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Gamepad2, label: 'Games' },
                    { icon: Sword, label: 'Quest' },
                    { icon: Trophy, label: 'Stats' },
                    { icon: Users, label: 'Shadow' },
                    { icon: Compass, label: 'Map' },
                    { icon: Heart, label: 'Health' },
                  ].map((app, i) => (
                    <button 
                      key={i}
                      className="aspect-square rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex flex-col items-center justify-center gap-1"
                    >
                      <app.icon className="w-5 h-5 text-white" />
                      <span className="text-[10px] text-white/70">{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Touch Hint */}
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-colors"
            />
          </div>
        </div>

        {/* Side Button */}
        <div className="absolute right-0 top-1/3 w-2 h-10 bg-zinc-600 rounded-r-lg" />
        <div className="absolute right-0 top-1/2 w-2 h-6 bg-zinc-600 rounded-r-lg" />
      </div>

      {/* Theme Selector */}
      <div className="flex justify-center gap-3 mt-8">
        {themes.map((t, i) => (
          <button
            key={i}
            onClick={() => setCurrentTheme(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i === currentTheme 
                ? `bg-gradient-to-r ${t.bg} text-white shadow-lg` 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            data-testid={`theme-btn-${i}`}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>
      <p className="text-center text-zinc-600 text-sm mt-3">Click themes to preview • Tap watch bar to toggle menu</p>
    </div>
  );
};

export const FusionOSPage = () => {
  const [email, setEmail] = useState('');

  const handleNotify = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('You\'ll be notified when Fusion OS launches!');
      setEmail('');
    }
  };

  const characterPaths = [
    {
      name: 'Luffy Gear 5',
      icon: '🏴‍☠️',
      path: 'Sun God Nika',
      color: 'orange',
      progression: ['Rubber', 'Gear 2', 'Gear 4', 'Gear 5', 'Joy Boy', 'Sun God'],
      desc: 'Freedom, adventure, reality manipulation'
    },
    {
      name: 'Sung Jin-Woo',
      icon: '⚔️',
      path: 'Shadow Monarch',
      color: 'purple',
      progression: ['E-Rank', 'C-Rank', 'S-Rank', 'National', 'Shadow Monarch'],
      desc: 'Power, growth, growing shadow army'
    },
    {
      name: 'Yugo Wakfu',
      icon: '🌀',
      path: 'Dragon King / Portal Master',
      color: 'cyan',
      progression: ['Eliatrope', 'Wakfu Master', 'Dragon/Portal King'],
      desc: 'Intelligence, magic, dimensional mastery'
    },
  ];

  const features = [
    { icon: Gamepad2, title: '6 Built-in Games', desc: 'Adventure Quest, Combat Arena, Puzzle Master, Speed Runner, Strategy Battles, Skill Challenges' },
    { icon: Trophy, title: 'Level 1-100 Progression', desc: 'Exponential XP curves, real-world activity integration, 22+ titles per character' },
    { icon: Users, title: 'Quest System', desc: 'Daily challenges, adaptive difficulty, streak bonuses, achievement unlocks' },
    { icon: Shield, title: '6-Stat System', desc: 'STR / SPD / INT / END / MAG / Special Power with meaningful advancement' },
    { icon: Flame, title: 'Theme Integration', desc: 'Every game adapts to your character with unique visuals and effects' },
    { icon: Brain, title: 'Persistent Progress', desc: 'Save system in flash memory, progress never lost' },
  ];

  const devStatus = [
    { name: 'Watch Functions', progress: 100 },
    { name: 'Gaming System', progress: 100 },
    { name: 'Media Apps', progress: 100 },
    { name: 'Internet Features', progress: 100 },
    { name: 'Power Management', progress: 100 },
    { name: 'RPG System', progress: 90 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      {/* Header */}
      <header className="relative sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Back to Home</span>
            </Link>
            <a 
              href="https://github.com/ithig124-hub/ESP32_Watch" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              data-testid="fusion-github-link"
            >
              <Github className="w-4 h-4" />
              <span className="font-mono text-sm">Source Code</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300 font-mono">In Development</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-mono mb-6">
                <span className="text-white">FUSION</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">OS</span>
              </h1>

              <p className="text-xl text-zinc-400 max-w-lg mb-8 leading-relaxed">
                The world's first <strong className="text-white">RPG-themed smartwatch OS</strong>. 
                Character progression, quests, mini-games, and anime-inspired themes. 
                Your fitness journey becomes an adventure.
              </p>

              {/* Notify Form */}
              <form onSubmit={handleNotify} className="flex gap-3 max-w-md" data-testid="notify-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50"
                  data-testid="notify-email-input"
                />
                <Button 
                  type="submit"
                  data-testid="notify-btn"
                  className="h-12 px-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </form>
            </div>

            {/* Right - Watch Simulator */}
            <div>
              <WatchSimulator />
            </div>
          </div>
        </div>
      </section>

      {/* Character Themes */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-4 text-center">
            Character <span className="text-purple-500">Themes</span>
          </h2>
          <p className="text-zinc-500 text-center mb-12 max-w-2xl mx-auto">
            Choose your path. Each character transforms the entire watch experience with unique visuals, progression, and abilities.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {characterPaths.map((char, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-${char.color}-500/30 transition-all`}
              >
                <div className="text-4xl mb-4">{char.icon}</div>
                <h3 className="text-xl font-bold mb-1">{char.name}</h3>
                <p className={`text-sm text-${char.color}-400 mb-3`}>{char.path}</p>
                <p className="text-sm text-zinc-500 mb-4">{char.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {char.progression.map((stage, j) => (
                    <span key={j} className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-400">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12 text-center">
            RPG <span className="text-purple-500">Features</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Status */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12 text-center">
            Development <span className="text-purple-500">Status</span>
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            {devStatus.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-40 text-sm text-zinc-400">{item.name}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-purple-500'}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className={`text-sm font-mono ${item.progress === 100 ? 'text-emerald-400' : 'text-purple-400'}`}>
                  {item.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source Code CTA */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Layers className="w-12 h-12 text-purple-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-mono mb-6">
            Open Source Development
          </h2>
          <p className="text-zinc-400 leading-relaxed text-lg max-w-2xl mx-auto mb-8">
            Fusion OS is being developed openly. Check out the source code, contribute, 
            or follow along with development on GitHub.
          </p>
          <a 
            href="https://github.com/ithig124-hub/ESP32_Watch" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              data-testid="view-source-btn"
              className="h-12 px-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]"
            >
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </section>

      {/* CTA to Widget OS */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-400 mb-6">Can't wait? Widget OS is ready now — stable and production-ready.</p>
          <Link to="/widget-os">
            <Button 
              data-testid="try-widget-os-btn"
              variant="outline"
              className="h-12 px-8 rounded-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-medium"
            >
              Try Widget OS →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-zinc-500 hover:text-white transition-colors font-mono text-sm">
              ← Fusion Labs
            </Link>
            <a 
              href="https://github.com/ithig124-hub/ESP32_Watch" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-purple-400 transition-colors font-mono text-sm"
            >
              github.com/ithig124-hub/ESP32_Watch
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FusionOSPage;
