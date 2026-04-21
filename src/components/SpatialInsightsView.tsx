
import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Layers, Map, Share2, Download, Info, Zap, AlertTriangle, Globe } from 'lucide-react';

const landUseData = [
  { name: 'Pemukiman Padat', value: 45, color: '#ef4444' },
  { name: 'Kawasan Industri', value: 20, color: '#f97316' },
  { name: 'Ruang Terbuka Hijau', value: 15, color: '#22c55e' },
  { name: 'Fasilitas Umum', value: 12, color: '#3b82f6' },
  { name: 'Lainnya', value: 8, color: '#64748b' },
];

const yearlyTrend = [
  { year: '2020', area: 5400, severity: 75 },
  { year: '2021', area: 4200, severity: 60 },
  { year: '2022', area: 6100, severity: 85 },
  { year: '2023', area: 4800, severity: 65 },
  { year: '2024', area: 5900, severity: 80 },
];

export default function SpatialInsightsView() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Spatial <span className="text-indigo-500">Insights</span></h2>
          <p className="text-slate-400">Macro-level flood analysis and land-use impact across the Metropolitan area.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="glass px-4 py-2 rounded-xl text-xs font-mono text-indigo-400 border-indigo-500/20 flex items-center gap-2">
                <Share2 size={14} /> Dataset API
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                <Download size={14} /> Download Map (SHP)
            </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Affected Area', value: '5,920 Ha', sub: '+12% from 2023', icon: Map },
           { label: 'Economic Risk Est.', value: 'Rp 4.2T', sub: 'Projected Annual', icon: Zap },
           { label: 'Critical Infrastucture', value: '142 Units', sub: 'High Risk Zones', icon: AlertTriangle },
           { label: 'Cloud Coverage', value: '22%', sub: 'Latest Satellite', icon: Globe },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="glass p-5 rounded-3xl border-slate-800/50"
           >
             <div className="p-2 w-10 h-10 rounded-xl bg-slate-950 text-indigo-400 mb-4 flex items-center justify-center">
               <stat.icon size={20} />
             </div>
             <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
             <p className="text-xl font-bold text-white">{stat.value}</p>
             <p className="text-[10px] text-slate-400 mt-1">{stat.sub}</p>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Land Use Impact (MapBiomas Style) */}
        <div className="lg:col-span-12 xl:col-span-5 glass p-8 rounded-[2.5rem] border-slate-800/50 flex flex-col h-full">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Layers size={16} className="text-indigo-500" />
                Land Use Impact Analysis
              </h3>
              <Info size={14} className="text-slate-600" />
           </div>

           <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 aspect-square relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={landUseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {landUseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-2xl font-bold text-white">45%</p>
                   <p className="text-[10px] text-slate-500 uppercase font-mono">Settlement</p>
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                 {landUseData.map((item, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-xs text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{item.value}%</span>
                   </div>
                 ))}
                 <div className="pt-4 mt-4 border-t border-slate-800">
                    <p className="text-[10px] text-slate-500 italic">Data processed using MapBiomas ID LULC classification standards.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Temporal Expansion Bar Chart */}
        <div className="lg:col-span-12 xl:col-span-7 glass p-8 rounded-[2.5rem] border-slate-800/50">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Globe size={16} className="text-blue-500" />
                Annual Inundation Timeline
              </h3>
              <div className="flex gap-2">
                 <div className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold">AREA (Ha)</div>
                 <div className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[9px] font-bold">SEVERITY</div>
              </div>
           </div>

           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="year" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                  <Bar dataKey="area" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                  <Bar dataKey="severity" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Persistence', val: '72%', color: 'text-indigo-400' },
                { label: 'Transition Rate', val: '5.2%', color: 'text-blue-400' },
                { label: 'Recovery Speed', val: '4.2d', color: 'text-green-400' },
                { label: 'Confidence Score', val: '98.2%', color: 'text-slate-400' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                  <p className="text-[9px] text-slate-500 uppercase font-mono mb-1">{item.label}</p>
                  <p className={`text-sm font-bold ${item.color}`}>{item.val}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
