
import React from 'react';
import { CloudRain, Wind, Droplets, Thermometer, MapPin, TrendingUp, RefreshCcw, Loader2 } from 'lucide-react';
import { fetchFloodGauges } from '../services/petaBencanaService';
import { SensorData } from '../types';

interface SensorGridProps {
  onSensorClick?: (sensor: SensorData) => void;
}

export default function SensorGrid({ onSensorClick }: SensorGridProps) {
  const [sensors, setSensors] = React.useState<SensorData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchFloodGauges();
    // Take top 3 for the dashboard summary
    setSensors(data.slice(0, 3));
    setLoading(false);
  };

  React.useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Sync every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Live PetaBencana Sync</span>
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 text-[10px] font-mono text-blue-400 hover:text-blue-300 transition-colors uppercase font-bold"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />}
          Refresh Node Data
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: CloudRain, label: 'Current Rainfall', value: '42.5', unit: 'mm/h', color: 'text-blue-400' },
          { icon: Thermometer, label: 'Temperature', value: '26.4', unit: '°C', color: 'text-orange-400' },
          { icon: Wind, label: 'Wind Speed', value: '18', unit: 'km/h', color: 'text-teal-400' },
          { icon: Droplets, label: 'Humidity', value: '92', unit: '%', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-4 rounded-3xl flex flex-col gap-3">
            <div className={`w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold mt-1 tracking-tight">
                {stat.value}
                <span className="text-[10px] font-normal text-slate-500 ml-1">{stat.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && sensors.length === 0 ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass p-5 rounded-3xl h-40 animate-pulse bg-slate-900/50" />
          ))
        ) : (
          sensors.map((sensor) => (
            <button 
              key={sensor.id} 
              onClick={() => onSensorClick?.(sensor)}
              className="glass p-5 rounded-3xl relative overflow-hidden group text-left transition-all hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-900/80 active:scale-95"
            >
              {sensor.waterLevel >= sensor.threshold && (
                <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-950 text-slate-400 group-hover:text-blue-400 transition-colors">
                    <MapPin size={14} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{sensor.location}</h4>
                </div>
                <div className={`p-1 rounded bg-slate-950 ${sensor.risk === 'Extreme' || sensor.risk === 'High' ? 'text-red-400' : 'text-green-400'}`}>
                  <TrendingUp size={12} className={sensor.risk === 'Extreme' || sensor.risk === 'High' ? '' : 'rotate-180'} />
                </div>
              </div>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Water Depth</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${sensor.waterLevel >= sensor.threshold ? 'text-red-500' : 'text-slate-100'}`}>
                      {sensor.waterLevel}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">cm</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Status</p>
                  <div className={`text-xs font-bold uppercase tracking-wider ${
                    sensor.risk === 'Extreme' ? 'text-red-500' : 
                    sensor.risk === 'High' ? 'text-orange-500' :
                    sensor.risk === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {sensor.risk}
                  </div>
                </div>
              </div>

              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    sensor.risk === 'Extreme' ? 'bg-red-500' : 
                    sensor.risk === 'High' ? 'bg-orange-500' :
                    sensor.risk === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (sensor.waterLevel / sensor.threshold) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-mono text-slate-600">Threshold: {sensor.threshold}cm</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold truncate ml-2">Real-time Station</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
