
import React from 'react';
import { Navigation, ShieldCheck, MapIcon, ChevronRight } from 'lucide-react';

const routes = [
  { id: '1', name: 'Jl. Sudirman Transit', status: 'Safe', risk: 10, time: '12 min', dist: '4.2 km' },
  { id: '2', name: 'Gatot Subroto Bypass', status: 'Caution', risk: 45, time: '18 min', dist: '5.1 km' },
  { id: '3', name: 'Rasuna Said Main', status: 'Danger', risk: 85, time: '35 min', dist: '3.8 km' },
];

export default function RouteOptimizer() {
  return (
    <div className="glass p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">Agent Route Optimizer</h3>
          <p className="text-lg font-bold mt-1">Smart Traffic Rerouting</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
          <Navigation size={20} />
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {routes.map((route) => (
          <div 
            key={route.id}
            className="group relative p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer overflow-hidden"
          >
            {/* Intensity gradient for danger */}
            {route.status === 'Danger' && (
              <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
            )}
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  route.status === 'Safe' ? 'bg-green-500/10 text-green-400' :
                  route.status === 'Caution' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {route.status === 'Safe' ? <ShieldCheck size={18} /> : <MapIcon size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{route.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{route.dist}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{route.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-[10px] font-bold uppercase tracking-widest ${
                  route.status === 'Safe' ? 'text-green-500' :
                  route.status === 'Caution' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {route.status}
                </div>
                <div className="text-lg font-bold mt-0.5 text-slate-100">{route.risk}% <span className="text-[10px] font-mono font-normal text-slate-500 uppercase">Risk</span></div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/50 group-hover:border-slate-700 transition-colors">
              <span className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors font-medium">Click for alternate waypoints</span>
              <ChevronRight size={14} className="text-slate-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-slate-100 hover:bg-white text-slate-950 text-xs font-bold py-3 rounded-xl transition-all shadow-xl shadow-white/5 uppercase tracking-wider">
        Recalculate All Routes
      </button>
    </div>
  );
}
