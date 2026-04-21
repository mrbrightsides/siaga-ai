
import React from 'react';
import { motion } from 'motion/react';
import { Search, Bell, User, Clock, Menu, CloudRain } from 'lucide-react';
import { ViewTab } from '../types';

interface HeaderProps {
  setActiveTab: (tab: ViewTab) => void;
  onMenuClick?: () => void;
}

export default function Header({ setActiveTab, onMenuClick }: HeaderProps) {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 lg:h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <CloudRain size={20} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-white">SIAGA</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search zones, routes, or streets..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-sans"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-8 ml-auto">
        <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-[10px] lg:text-xs">
          <Clock size={14} className="text-blue-400" />
          {now.toLocaleTimeString('id-ID', { hour12: false })} WIB
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full items-center justify-center flex hover:bg-slate-900 text-slate-400 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-slate-950 rounded-full" />
          </button>
          
          <div className="h-6 w-px bg-slate-800 mx-1" />

          <button 
            onClick={() => setActiveTab('Profile')}
            className="flex items-center gap-3 hover:bg-slate-900 p-1 lg:p-1.5 pr-2 lg:pr-4 rounded-full transition-colors group"
          >
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400">
              <User size={16} />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-200">Admin Control</p>
              <p className="text-[10px] text-slate-500 font-mono">Banjir Ops Team</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
