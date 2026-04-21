
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Clock, ShieldCheck, ChevronRight, Map as MapIcon, Car, Bike, Train, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { getPredictiveAlert } from '../services/aiAgentService';

const mockRoutes = [
  { 
    id: 1, 
    name: 'South-East Gateway (Jl. Antasari)', 
    risk: 'Safe', 
    duration: '22m', 
    probability: 5, 
    tags: ['Elevated Road', 'No Puddles'],
    type: 'car'
  },
  { 
    id: 2, 
    name: 'Central Arterial Bypass (Jl. Rasuna Said)', 
    risk: 'Moderate', 
    duration: '35m', 
    probability: 25, 
    tags: ['Congested', 'Minor Puddles'],
    type: 'car'
  },
  { 
    id: 3, 
    name: 'Coastal Logistics Route (Jl. Martadinata)', 
    risk: 'Danger', 
    duration: '50m', 
    probability: 85, 
    tags: ['Tidal Influence', 'Flooded'],
    type: 'train'
  },
];

export default function SafeRoutesView() {
  const prediction = getPredictiveAlert();
  const [activeType, setActiveType] = React.useState<'car' | 'bike' | 'train'>('car');
  const [selectedRoute, setSelectedRoute] = React.useState<number | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showEvacModal, setShowEvacModal] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);

  const filteredRoutes = mockRoutes.filter(r => r.type === activeType);

  const handleRouteClick = (id: number) => {
    setIsSyncing(true);
    setSelectedRoute(id);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const handleSectorScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Evacuation Protocol Modal */}
      <AnimatePresence>
        {showEvacModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEvacModal(false)}
              className="absolute inset-0 bg-red-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl glass p-8 rounded-[3rem] border-red-500/50 bg-slate-950 overflow-hidden shadow-2xl shadow-red-500/20"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-1/3 h-full bg-white blur-sm"
                  />
               </div>
               
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/30">
                      <AlertTriangle size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Evacuation Tactical Sync</h3>
                      <p className="text-red-400 font-mono text-xs uppercase tracking-widest">Autonomous Shelter Routing Initialized</p>
                    </div>
                  </div>
                  <button onClick={() => setShowEvacModal(false)} className="p-3 hover:bg-slate-900 rounded-2xl text-slate-500 transition-colors">
                    <AlertTriangle className="rotate-180" size={24} />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20">
                        <h4 className="text-sm font-bold text-red-500 uppercase mb-4 flex items-center gap-2">
                           <Sparkles size={14} /> AI Deployment Strategy
                        </h4>
                        <div className="space-y-3">
                           {[
                             "Identifying non-inundated corridors in Sector 4 (South)",
                             "Alerting local evacuation shelters to prepare capacity",
                             "Redirecting public security drones to monitoring zones",
                             "Broadcasting VMS alerts within 2km radius"
                           ].map((item, i) => (
                             <div key={i} className="flex gap-3 text-xs text-slate-300">
                                <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <p>{item}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                     <button className="w-full py-5 rounded-[2rem] bg-white text-slate-950 font-black uppercase tracking-tighter hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95">
                        Broadcast to Resident App
                     </button>
                  </div>
                  <div className="glass rounded-[2rem] bg-slate-900/50 border border-slate-800 overflow-hidden relative min-h-[300px]">
                     <img 
                        src="https://picsum.photos/seed/evac-map/800/600" 
                        alt="Evacuation Map" 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 invert"
                        referrerPolicy="no-referrer"
                     />
                     <div className="absolute inset-0 bg-red-950/20" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                           <div className="w-20 h-20 rounded-full border-4 border-red-500 border-t-white animate-spin mx-auto mb-4" />
                           <p className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">Recalculating Live Nodes...</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Predictive Agency Alert */}
      {prediction && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass p-6 rounded-[2.5rem] border-red-500/30 bg-red-500/5 overflow-hidden group"
        >
          <div className="absolute top-0 right-10 bottom-0 flex items-center opacity-10 blur-sm pointer-events-none">
            <AlertTriangle size={150} />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 animate-pulse">
              <AlertTriangle size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h3 className="text-xl font-black text-red-500 tracking-tight uppercase italic">Predictive Agency Alert</h3>
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold">CRITICAL ETA: {prediction.eta}</span>
              </div>
              <p className="text-sm font-bold text-slate-100 mb-1">{prediction.source}: {prediction.location}</p>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                <Sparkles size={12} className="inline mr-1 text-amber-400" />
                <span className="text-amber-400 font-bold italic">AI Directive: </span> 
                "{prediction.recommendation}"
              </p>
            </div>
            <button 
              onClick={() => setShowEvacModal(true)}
              className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              Buka Peta Evakuasi <ExternalLink size={14} />
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Safe <span className="text-green-500">Routes</span></h2>
          <p className="text-slate-400">AI-optimized navigation recommendations to avoid flood-prone corridors.</p>
        </div>
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            {[
              { id: 'car', icon: Car },
              { id: 'bike', icon: Bike },
              { id: 'train', icon: Train }
            ].map((type) => (
                <button 
                  key={type.id}
                  onClick={() => setActiveType(type.id as any)}
                  className={`p-2.5 rounded-xl transition-all ${activeType === type.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <type.icon size={18} />
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
            {filteredRoutes.length > 0 ? filteredRoutes.map((route, i) => (
                <motion.div 
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleRouteClick(route.id)}
                    className={`glass p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 group transition-all cursor-pointer ${
                      selectedRoute === route.id ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 hover:border-blue-500/50'
                    }`}
                >
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${
                        route.risk === 'Safe' ? 'bg-green-500/10 text-green-500' :
                        route.risk === 'Moderate' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                        {route.risk === 'Safe' ? <ShieldCheck size={32} /> : <Navigation size={32} />}
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          <h4 className="text-lg font-bold text-white">{route.name}</h4>
                          {selectedRoute === route.id && !isSyncing && (
                            <span className="px-2 py-0.5 rounded-md bg-green-500 text-white text-[8px] font-bold uppercase animate-pulse">Selected</span>
                          )}
                          {selectedRoute === route.id && isSyncing && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[8px] font-bold uppercase">
                              <Sparkles size={8} className="animate-spin" /> Syncing...
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {route.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-500 border border-slate-900">{tag}</span>
                            ))}
                        </div>
                        <p className="text-[10px] text-blue-400 italic font-medium mt-2">
                           <Sparkles size={10} className="inline mr-1" />
                           AI Advisory: {route.risk === 'Safe' ? 'High tactical viability. Recommendation: Primary Corridor.' : 'Elevated risk of hydroplaning. Consider alternative node.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-8 px-6 border-l border-slate-800 shrink-0">
                        <div className="text-center">
                            <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Duration</p>
                            <div className="flex items-center gap-1.5 text-slate-200">
                                <Clock size={14} className="text-blue-400" />
                                <span className="font-bold">{route.duration}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Flood Prob.</p>
                            <span className={`font-bold ${route.probability > 50 ? 'text-red-500' : 'text-green-500'}`}>{route.probability}%</span>
                        </div>
                        <ChevronRight className={`transition-colors ${selectedRoute === route.id ? 'text-blue-400' : 'text-slate-700 group-hover:text-blue-500'}`} />
                    </div>
                </motion.div>
            )) : (
              <div className="py-20 text-center glass rounded-[2.5rem] border-dashed border-slate-800">
                <Navigation size={40} className="text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-mono">No recommended routes found for this transport mode.</p>
              </div>
            )}
        </div>

        <div className="xl:col-span-4 space-y-6">
            <div className="glass p-6 rounded-[2rem] bg-blue-600/5 border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-blue-400">
                      <MapIcon size={20} />
                      <h3 className="font-bold">Dynamic Advisory</h3>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  "AI suggests avoiding low-lying areas in North Jakarta between 14:00 - 17:00 due to combined peak rainfall and high tide reports."
                </p>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Route Reliability</span>
                        <span className="text-xs font-bold text-blue-400">94.2%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '94.2%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-blue-600" 
                        />
                    </div>
                </div>
            </div>

            <div 
              onClick={handleSectorScan}
              className="glass p-6 rounded-[2rem] relative overflow-hidden h-64 group cursor-pointer border-slate-800 hover:border-blue-500/30 transition-all"
            >
                <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img 
                      src="https://picsum.photos/seed/jakarta-grid/600/600" 
                      alt="Mini Route Map" 
                      className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {isScanning && (
                   <motion.div 
                     initial={{ top: '-100%' }}
                     animate={{ top: '100%' }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 right-0 h-0.5 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
                   />
                )}

                <div className="relative h-full flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-white uppercase tracking-tighter">Sector Visualization</p>
                      {isScanning && <span className="text-[8px] px-1 rounded bg-blue-600 text-white font-bold animate-pulse">SCANNING</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {isScanning ? 'Synchronizing node telemetry...' : 'Previewing corridor status in South Jakarta node.'}
                    </p>
                    <div className="mt-4 flex gap-1">
                       {[...Array(4)].map((_, i) => (
                         <div key={i} className={`h-1 flex-1 rounded-full ${isScanning ? 'bg-blue-600 animate-pulse' : 'bg-slate-800'}`} style={{ animationDelay: `${i * 0.2}s` }} />
                       ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
