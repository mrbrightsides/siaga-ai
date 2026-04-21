
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Map as MapIcon, ShieldAlert, Navigation, History, CloudRain, Info, Settings, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ViewTab } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems: { icon: any; label: ViewTab }[] = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: MapIcon, label: 'Live Map' },
  { icon: ShieldAlert, label: 'High Risk Zones' },
  { icon: Navigation, label: 'Safe Routes' },
  { icon: History, label: 'History Analytics' },
  { icon: Globe, label: 'Spatial Insights' },
];

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onGoBack?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose, onGoBack }: SidebarProps) {
  const handleNavClick = (tab: ViewTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <React.Fragment>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-screen z-[101] transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => handleNavClick('Dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <CloudRain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter leading-none">SIAGA Jalan</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-mono">Flood Intelligence</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left",
                activeTab === item.label 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
              )}
            >
              <item.icon size={20} className={cn(activeTab === item.label ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 group hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Agentic AI Live</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">Autonomous engine is analyzing 24 sensors and citizen feeds.</p>
          </div>
          
          <button 
            onClick={onGoBack}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 transition-all duration-200 group text-left rounded-xl text-slate-500 hover:text-slate-100"
          >
            <Info size={20} className="group-hover:text-blue-400 transition-colors" />
            <span className="font-medium text-sm">What is SIAGA?</span>
          </button>
          
          <button 
            onClick={() => handleNavClick('Settings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 mt-4 transition-all duration-200 group text-left rounded-xl",
              activeTab === 'Settings' 
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                : "text-slate-500 hover:text-slate-100"
            )}
          >
            <Settings size={20} className={cn(activeTab === 'Settings' ? "text-blue-400" : "group-hover:text-slate-300")} />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
}
