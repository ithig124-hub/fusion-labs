import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Bell, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export const FusionOSPage = () => {
  const [email, setEmail] = useState('');

  const handleNotify = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('You\'ll be notified when Fusion OS launches!');
      setEmail('');
    }
  };

  const plannedFeatures = [
    'Completely reimagined UI with advanced animations',
    'App ecosystem with third-party widget support',
    'Deep customization — themes, layouts, behaviors',
    'Health tracking with step & heart rate monitoring',
    'Notifications sync with your phone',
    'Voice assistant integration'
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
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
            <span className="font-mono text-sm text-purple-400">Coming Soon</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-mono">In Development</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter font-mono mb-8">
            <span className="text-white">FUSION</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">OS</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The next evolution of smartwatch experience. 
            More powerful. More personal. More you.
          </p>

          {/* Notify Form */}
          <form onSubmit={handleNotify} className="max-w-md mx-auto flex gap-3" data-testid="notify-form">
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
      </section>

      {/* What to Expect */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight font-mono mb-12 text-center">
            What to <span className="text-purple-500">Expect</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plannedFeatures.map((feature, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-zinc-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Layers className="w-12 h-12 text-purple-500 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-mono mb-6">
              Built Different
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Fusion OS isn't just Widget OS with more features. It's a complete rethinking 
              of what a smartwatch can be. We're taking our time to get it right — 
              because you deserve more than incremental updates.
            </p>
          </div>
        </div>
      </section>

      {/* CTA to Widget OS */}
      <section className="relative py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-400 mb-6">Can't wait? Widget OS is ready now.</p>
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
            <span className="text-zinc-600 font-mono text-sm">Fusion OS • Coming Soon</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FusionOSPage;
