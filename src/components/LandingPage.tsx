
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CloudRain, ShieldCheck, Zap, Brain, Navigation, ChevronRight, Activity, ArrowRight, Play } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const missionRef = useRef<HTMLElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  const scrollToMission = () => {
    missionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <nav className="relative z-50 h-20 flex items-center justify-between px-8 md:px-16 container mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <CloudRain size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">SIAGA <span className="text-blue-500">Jalan</span></span>
        </div>
        <button 
          onClick={onEnter}
          className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
        >
          Login Control
          <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
        </button>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-8 md:px-16 container mx-auto">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Agentic Intelligence System v2.4
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[0.9]">
                Jakarta Under <br />
                <span className="text-blue-500">Autonomous</span> Watch.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
                Floods cost Jakarta billions and lives every year. SIAGA Jalan transforms chaotic citizen reports and sensor data into 
                <span className="text-white font-medium"> actionable intelligence</span> using proprietary agentic AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onEnter}
                  className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Enter Command Center
                  <ArrowRight size={20} />
                </button>
                <button 
                  onClick={scrollToMission}
                  className="px-10 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  Watch Ops Brief
                  <Play size={18} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Why Section */}
        <section ref={missionRef} className="py-32 px-8 md:px-16 bg-slate-900/30 border-y border-slate-900 overflow-hidden relative">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.3em] font-bold mb-4">The Mission</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tighter">Why SIAGA Jalan <br className="hidden md:block" /> exists today?</h3>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-red-500 border border-slate-800">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-200 mb-2">Data Overload</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">During floods, thousands of citizen reports flood social media. Humans can't process them fast enough. We can.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-blue-500 border border-slate-800">
                    <Navigation size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-200 mb-2">Static Navigation</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Standard GPS doesn't know which streets are 30cm deep. Our dynamic routing adapts every 180 seconds based on live sensor feed.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/20 blur-3xl opacity-30 rounded-full" />
              <div className="relative glass p-2 rounded-[2.5rem] border-slate-800 rotate-2 overflow-hidden">
                <div className="rounded-[2rem] bg-slate-950 aspect-video flex items-center justify-center group relative overflow-hidden">
                  {showVideo ? (
                    <iframe 
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" /* Placeholder - user can replace */
                      title="Operational Footage"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10" />
                      <img 
                        src="https://picsum.photos/seed/jakarta/1200/800" 
                        alt="Jakarta Floods" 
                        className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute z-20 flex flex-col items-center gap-4">
                        <button 
                          onClick={() => setShowVideo(true)}
                          className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
                        >
                          <Play size={24} fill="currentColor" className="ml-1" />
                        </button>
                        <span className="text-xs font-mono text-white/50 uppercase tracking-[0.2em]">Operational Footage</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-32 px-8 md:px-16 container mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-[10px] font-mono text-blue-500 uppercase tracking-[0.3em] font-bold mb-4">Core Technology</h2>
             <h3 className="text-4xl font-bold text-white tracking-tighter">Beyond Simple Monitoring</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Brain, 
                title: 'Agentic Intelligence', 
                desc: 'Autonomous reasoning engine that classifies risks and suggests deployment protocols without human interference.' 
              },
              { 
                icon: ShieldCheck, 
                title: 'Citizen Verification', 
                desc: 'Cross-references PetaBencana reports with official hydraulic gauges to filter false reports instantly.' 
              },
              { 
                icon: Zap, 
                title: '180s Refresh Cycle', 
                desc: 'High-frequency synchronization with the metropolitan flood network for sub-minute decision making.' 
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-[2.5rem] border-slate-800 hover:border-blue-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-blue-500 mb-8 border border-slate-800">
                  <f.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-8 md:px-16 border-t border-slate-900">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-500">
                <CloudRain size={18} />
              </div>
              <span className="text-sm font-bold tracking-tighter text-white">SIAGA <span className="text-blue-500">Jalan</span></span>
            </div>
            
            <p className="text-xs text-slate-600 font-mono uppercase tracking-widest">
              Built for resilient cities. © 2026 Jakarta Ops.
            </p>

            <div className="flex gap-6">
              <a href="https://pantaubanjir.jakarta.go.id/" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors">Project Doc</a>
              <a href="https://github.com/mrbrightsides/siaga-ai" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors">Source Code</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
