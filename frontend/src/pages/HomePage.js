import { Link } from 'react-router-dom';
import { Github, Youtube, Cpu, Zap, ArrowRight, Watch, Layers, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-zinc-400 font-mono">Open Source Hardware</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-mono">
                <span className="text-white">FUSION</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">LABS</span>
              </h1>
              
              <p className="text-xl text-zinc-400 leading-relaxed max-w-lg">
                Building the future of wearable technology. ESP32-S3 powered smartwatches 
                with custom operating systems, open-source firmware, and a passionate community.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/widget-os">
                  <Button 
                    data-testid="widget-os-btn"
                    className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]"
                  >
                    <Watch className="w-5 h-5 mr-2" />
                    Widget OS
                  </Button>
                </Link>
                <Link to="/fusion-os">
                  <Button 
                    data-testid="fusion-os-btn"
                    variant="outline"
                    className="h-12 px-8 rounded-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-medium transition-all hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]"
                  >
                    <Layers className="w-5 h-5 mr-2" />
                    Fusion OS
                  </Button>
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6 pt-4">
                <a 
                  href="https://github.com/ithig124-hub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors"
                  data-testid="github-link"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.youtube.com/@IthiDezNuts" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-red-500 transition-colors"
                  data-testid="youtube-link"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <span className="text-zinc-600">|</span>
                <span className="text-sm text-zinc-500 font-mono">Coming Soon: Kickstarter & Store</span>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1673997303871-178507ca875a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwyfHxzbWFydHdhdGNoJTIwYW1vbGVkJTIwc2NyZWVuJTIwYmxhY2slMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc2OTc2MzM2NXww&ixlib=rb-4.1.0&q=85"
                  alt="Fusion Labs Smartwatch"
                  className="relative w-full h-full object-cover rounded-3xl border border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-mono mb-16 text-center">
            Why <span className="text-blue-500">Fusion Labs</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Cpu className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ESP32-S3 Powered</h3>
              <p className="text-zinc-400 leading-relaxed">
                Dual-core processor with WiFi & BLE. Enough power for smooth animations, 
                real-time data, and future features.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AMOLED Display</h3>
              <p className="text-zinc-400 leading-relaxed">
                Vibrant colors, true blacks, and crisp visuals. Available in 1.8" (368×448) 
                and 2.06" (410×502) variants.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Open Source</h3>
              <p className="text-zinc-400 leading-relaxed">
                Full firmware source available. Modify, learn, and contribute. 
                Your watch, your rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OS Selection Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-mono mb-16 text-center">
            Choose Your <span className="text-purple-500">Experience</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Widget OS Card */}
            <Link to="/widget-os" className="group">
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors" />
                <div className="relative">
                  <span className="inline-block px-3 py-1 text-xs font-mono bg-blue-500/20 text-blue-400 rounded-full mb-4">STABLE</span>
                  <h3 className="text-2xl font-bold mb-3 font-mono">Widget OS</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed">
                    Production-ready smartwatch OS focused on productivity, utility, and clarity. 
                    Weather, stocks, custom watch faces, and more.
                  </p>
                  <div className="flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                    Explore Widget OS <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Fusion OS Card */}
            <Link to="/fusion-os" className="group">
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors" />
                <div className="relative">
                  <span className="inline-block px-3 py-1 text-xs font-mono bg-purple-500/20 text-purple-400 rounded-full mb-4">COMING SOON</span>
                  <h3 className="text-2xl font-bold mb-3 font-mono">Fusion OS</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed">
                    Next-generation experience. Advanced features, deeper customization, 
                    and a completely reimagined interface. Stay tuned.
                  </p>
                  <div className="flex items-center text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Future Features Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-mono mb-4 text-center">
            Coming <span className="text-emerald-500">Soon</span>
          </h2>
          <p className="text-zinc-500 text-center mb-16 max-w-2xl mx-auto">
            We're constantly working on new features. Here's what's on the roadmap.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Watch Face Store', desc: 'Download and share custom watch faces from the community.' },
              { title: 'Screen Protectors', desc: 'Official tempered glass protectors for both screen sizes.' },
              { title: 'USB File Upload', desc: 'Drag-and-drop watch faces and images via USB mass storage.' },
              { title: 'Mobile Companion', desc: 'iOS & Android app for notifications and quick settings.' },
              { title: 'Developer SDK', desc: 'Build your own widgets and watch faces with our SDK.' },
              { title: 'More Hardware', desc: 'New board sizes and sensor configurations coming.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-zinc-500 text-sm font-mono">
              © 2025 Fusion Labs. Open Source Hardware.
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/ithig124-hub" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@IthiDezNuts" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
