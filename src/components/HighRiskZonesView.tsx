
import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldAlert, Droplets, MapPin, Search, Filter, Sparkles } from 'lucide-react';

const mockRiskZones = [
  { id: 1, name: 'Kelapa Gading Barat', currentLevel: '45cm', risk: 'High', status: 'Rising', lastIncident: '2 hours ago' },
  { id: 2, name: 'Kemang Raya', currentLevel: '60cm', risk: 'Critical', status: 'Overflow', lastIncident: 'Active' },
  { id: 3, name: 'Jatiasih Sector 4', currentLevel: '30cm', risk: 'Medium', status: 'Stable', lastIncident: 'Yesterday' },
  { id: 4, name: 'Pluit Reservoir Area', currentLevel: '20cm', risk: 'High', status: 'Pumping', lastIncident: '5 hours ago' },
  { id: 5, name: 'Cawang Interchange', currentLevel: '15cm', risk: 'Medium', status: 'Stable', lastIncident: '3 days ago' },
];

export default function HighRiskZonesView() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">High Risk <span className="text-red-500">Zones</span></h2>
          <p className="text-slate-400">Identified critical areas based on topographic data and current rainfall intensity.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search sub-district..." 
                    className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-300 focus:border-blue-500 outline-none w-64"
                />
            </div>
            <button className="glass p-2.5 rounded-xl text-slate-400">
                <Filter size={18} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockRiskZones.map((zone, i) => (
          <motion.div 
            key={zone.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`glass p-6 rounded-[2rem] border-l-4 ${
                zone.risk === 'Critical' ? 'border-l-red-500' : 
                zone.risk === 'High' ? 'border-l-orange-500' : 'border-l-blue-500'
            } group hover:bg-slate-900/80 transition-all cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{zone.name}</h4>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <MapPin size={12} /> Jakarta Selatan
                    </div>
                </div>
                <div className={`p-2 rounded-xl ${
                    zone.risk === 'Critical' ? 'bg-red-500/10 text-red-500' : 
                    zone.risk === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                    {zone.risk === 'Critical' ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-900">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Depth Status</p>
                    <div className="flex items-center gap-2">
                        <Droplets size={14} className="text-blue-400" />
                        <span className="text-sm font-bold text-slate-200">{zone.currentLevel}</span>
                    </div>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-900">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Live Trend</p>
                    <span className={`text-sm font-bold ${zone.status === 'Rising' ? 'text-red-400' : 'text-green-400'}`}>{zone.status}</span>
                </div>
            </div>

            <div className="mb-6 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1.5 mb-1">
                    <Sparkles size={10} /> AI Tactical Response
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                    {zone.risk === 'Critical' ? 'Immediate deployment of drainage pumps recommended. Evacuation routes primed.' : 'Continuous monitoring of river gauges. Logistical standby initiated.'}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">LAST INCIDENT: {zone.lastIncident}</span>
                <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Alert Protocol</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
