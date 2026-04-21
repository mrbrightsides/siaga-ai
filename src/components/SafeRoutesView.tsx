
import React from 'react';
import { motion } from 'motion/react';
import { Navigation, Clock, ShieldCheck, ChevronRight, Map as MapIcon, Car, Bike, Train, Sparkles } from 'lucide-react';

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
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Safe <span className="text-green-500">Routes</span></h2>
          <p className="text-slate-400">AI-optimized navigation recommendations to avoid flood-prone corridors.</p>
        </div>
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            {[Car, Bike, Train].map((Icon, idx) => (
                <button key={idx} className={`p-2.5 rounded-xl transition-all ${idx === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}>
                    <Icon size={18} />
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
            {mockRoutes.map((route, i) => (
                <motion.div 
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-center gap-6 group hover:border-blue-500/50 transition-all cursor-pointer"
                >
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${
                        route.risk === 'Safe' ? 'bg-green-500/10 text-green-500' :
                        route.risk === 'Moderate' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                        {route.risk === 'Safe' ? <ShieldCheck size={32} /> : <Navigation size={32} />}
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h4 className="text-lg font-bold text-white">{route.name}</h4>
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
                        <ChevronRight className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                    </div>
                </motion.div>
            ))}
        </div>

        <div className="xl:col-span-4 space-y-6">
            <div className="glass p-6 rounded-[2rem] bg-blue-600/5 border-blue-500/20">
                <div className="flex items-center gap-3 mb-4 text-blue-400">
                    <MapIcon size={20} />
                    <h3 className="font-bold">Dynamic Advisory</h3>
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
                        <div className="h-full bg-blue-600 w-[94.2%]" />
                    </div>
                </div>
            </div>

            <div className="glass p-6 rounded-[2rem] relative overflow-hidden h-64 grayscale group cursor-crosshair">
                <img 
                    src="https://picsum.photos/seed/route-map/400/400" 
                    alt="Mini Route Map" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <div className="relative h-full flex flex-col justify-end">
                    <p className="text-xs font-bold text-white mb-1">Sector Visualization</p>
                    <p className="text-[10px] text-slate-500">Previewing corridor status in South Jakarta node.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
