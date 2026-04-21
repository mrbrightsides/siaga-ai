
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const data = [
  { time: '12:00', level: 10 },
  { time: '13:00', level: 15 },
  { time: '14:00', level: 35 },
  { time: '15:00', level: 55 },
  { time: '16:00', level: 45 },
  { time: '17:00', level: 80 },
  { time: '18:00', level: 110 },
];

export default function PredictionChart() {
  return (
    <div className="glass p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">AI Water Level Forecast</h3>
          <p className="text-2xl font-bold mt-1 tracking-tight">Kuningan District</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-red-500 px-2 py-1 rounded bg-red-500/10 text-[10px] font-bold uppercase mb-1">
            <AlertTriangle size={12} />
            Risk Spike
          </div>
          <div className="text-xs text-slate-500 font-mono">+45% next 2h</div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="levelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
              itemStyle={{ color: '#60a5fa', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#levelGradient)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Peak Prediction</p>
          <p className="text-xl font-bold flex items-baseline gap-1">
            125<span className="text-xs text-slate-500">cm</span>
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Confidence</p>
          <p className="text-xl font-bold flex items-baseline gap-1">
            94<span className="text-xs text-slate-500">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
