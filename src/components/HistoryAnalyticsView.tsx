
import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

const mockDailyData = [
  { day: 'Mon', incidents: 12, severity: 45 },
  { day: 'Tue', incidents: 19, severity: 60 },
  { day: 'Wed', incidents: 8, severity: 30 },
  { day: 'Thu', incidents: 25, severity: 85 },
  { day: 'Fri', incidents: 14, severity: 50 },
  { day: 'Sat', incidents: 10, severity: 40 },
  { day: 'Sun', incidents: 5, severity: 20 },
];

export default function HistoryAnalyticsView() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">History <span className="text-blue-500">Analytics</span></h2>
          <p className="text-slate-400">Long-term flood trends and incident distribution across the metropolitan area.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="glass px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
                <Calendar size={14} /> Last 7 Days
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                Export PDF Report
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Incidents', value: '93', trend: '+12%', icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Avg Severity', value: '47%', trend: '-5%', icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Avg Response Time', value: '14m', trend: '-2m', icon: Clock, color: 'text-green-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-slate-950 ${stat.color}`}>
                    <stat.icon size={20} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {stat.trend}
                </span>
            </div>
            <p className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />
            Weekly Incident Frequency
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="incidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            Severity Index Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDailyData}>
                <defs>
                  <linearGradient id="colorSeverity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="severity" stroke="#ef4444" fillOpacity={1} fill="url(#colorSeverity)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
