
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, Activity, ShieldCheck, Zap, ChevronRight, Loader2, History } from 'lucide-react';
import { AgentAction } from '../services/aiAgentService';

interface AIAgentPanelProps {
  briefing: string;
  actions: { action: string; reasoning: string }[];
  riskLevel: string;
  loading: boolean;
  liveLogs?: AgentAction[];
}

export default function AIAgentPanel({ briefing, actions, riskLevel, loading, liveLogs = [] }: AIAgentPanelProps) {
  return (
    <div className="glass p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border-blue-500/20 relative group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Brain size={120} className="text-blue-500" />
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/20">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-tight uppercase text-xs font-mono">Agentic Command Core</h3>
              <p className="text-[10px] text-slate-500 font-mono">Autonomous Decision Engine Active</p>
            </div>
          </div>
          {loading && <Loader2 className="animate-spin text-blue-500" size={16} />}
        </div>

        <div className="space-y-6">
          {/* Briefing Card */}
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-blue-500/10">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Sparkles size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Intelligence Briefing</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{briefing}"
            </p>
          </div>

          {/* Autonomous Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Directives</h4>
               <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                 riskLevel === 'Extreme' ? 'bg-red-500/20 text-red-500' : 
                 riskLevel === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'
               }`}>
                 {riskLevel} Risk System-wide
               </div>
            </div>
            
            <div className="space-y-2">
              {actions.map((act, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">{act.action}</p>
                      <p className="text-[9px] text-slate-500">{act.reasoning}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover/item:text-blue-500 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live Agent Logs from User Reports */}
          {liveLogs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
               <div className="flex items-center gap-2 text-indigo-400">
                  <Activity size={14} />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Live Mission Execution</h4>
               </div>
               <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {liveLogs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[8px] font-mono text-indigo-500 uppercase font-bold">{log.incidentType}</span>
                           <span className="text-[8px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mb-2 leading-snug">{log.analysis}</p>
                        <div className="flex flex-wrap gap-1">
                           {log.dispatchedActions.map((action, idx) => (
                             <span key={idx} className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium">
                               {action}
                             </span>
                           ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
             <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                <Activity size={10} className="text-green-500" />
                Log Processing: 144ms
             </div>
             <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                <ShieldCheck size={10} className="text-blue-500" />
                Validation: Passed
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
