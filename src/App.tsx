import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SensorGrid from './components/SensorGrid';
import PredictionChart from './components/PredictionChart';
import VisualAnalysis from './components/VisualAnalysis';
import RouteOptimizer from './components/RouteOptimizer';
import LiveMapView from './components/LiveMapView';
import SensorDetailsModal from './components/SensorDetailsModal';
import HistoryAnalyticsView from './components/HistoryAnalyticsView';
import HighRiskZonesView from './components/HighRiskZonesView';
import SafeRoutesView from './components/SafeRoutesView';
import AIAgentPanel from './components/AIAgentPanel';
import SatelliteIntel from './components/SatelliteIntel';
import LandingPage from './components/LandingPage';
import ReportModal from './components/ReportModal';
import SpatialInsightsView from './components/SpatialInsightsView';
import { AgentAction } from './services/aiAgentService';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Layers, Info, Construction, Loader2, CloudRain, Save, Edit2, Shield, Clock as ClockIcon, Menu, X, Plus } from 'lucide-react';
import { ViewTab, SensorData } from './types';
import { fetchLiveReports, PetaBencanaReport, fetchFloodGauges } from './services/petaBencanaService';
import { analyzeFloodSituation } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<ViewTab>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showLanding, setShowLanding] = React.useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
  const [agentLogs, setAgentLogs] = React.useState<AgentAction[]>([]);
  const [reports, setReports] = React.useState<PetaBencanaReport[]>([]);
  const [loadingReports, setLoadingReports] = React.useState(true);
  const [sensors, setSensors] = React.useState<SensorData[]>([]);
  
  // AI Agent States
  const [aiAnalysis, setAiAnalysis] = React.useState({
    briefing: "Initializing neural network for geospatial analysis...",
    actions: [] as { action: string; reasoning: string }[],
    riskLevel: "Monitoring",
    loading: true
  });
  
  // Admin Profile State
  const [adminProfile, setAdminProfile] = React.useState({
    name: 'Admin Control',
    accessLevel: 'System Architect',
    lastLogin: 'Today, 08:45 WIB',
    isEditing: false
  });

  // Sensor Detail state
  const [selectedSensor, setSelectedSensor] = React.useState<SensorData | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSensorClick = (sensor: SensorData) => {
    setSelectedSensor(sensor);
    setIsModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminProfile(prev => ({ ...prev, isEditing: false }));
  };

  React.useEffect(() => {
    async function loadData() {
      setLoadingReports(true);
      setAiAnalysis(prev => ({ ...prev, loading: true }));
      
      const [reportData, gaugeData] = await Promise.all([
        fetchLiveReports('jkt'),
        fetchFloodGauges()
      ]);
      
      setReports(reportData.slice(0, 10));
      setSensors(gaugeData);
      setLoadingReports(false);

      // Perform AI Agent Analysis
      const analysis = await analyzeFloodSituation(reportData, gaugeData);
      setAiAnalysis({
        briefing: analysis.briefing,
        actions: analysis.actions,
        riskLevel: analysis.riskLevel,
        loading: false
      });
    }
    
    loadData();
    const interval = setInterval(loadData, 180000); // 3 minutes cycle
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onEnter={() => setShowLanding(false)} />
        </motion.div>
      ) : (
        <motion.div 
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex bg-slate-950 h-screen text-slate-200 overflow-hidden"
        >
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onGoBack={() => setShowLanding(true)}
          />
          
          <main className="flex-1 flex flex-col min-w-0 h-full relative">
            <Header 
              setActiveTab={setActiveTab} 
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Hero Section / Quick Summary */}
                <section className="mb-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                        City Monitoring <span className="text-blue-500">Overview</span>
                      </h2>
                      <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
                        SIAGA Jalan AI is currently processing data from global APIs and 24 active sensor nodes. 
                        Live synchronization with PetaBencana platform active.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-3 rounded-2xl text-slate-400 transition-colors">
                        <Layers size={20} />
                      </button>
                      <button 
                        onClick={() => setActiveTab('Live Map')}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                      >
                        <MapIcon size={18} />
                        Operational Map
                      </button>
                    </div>
                  </div>

                  <SensorGrid onSensorClick={handleSensorClick} />
                </section>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                  <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="h-[350px] md:h-[500px]">
                      <PredictionChart />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <VisualAnalysis />
                      <RouteOptimizer />
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-8">
                    <AIAgentPanel 
                      briefing={aiAnalysis.briefing}
                      actions={aiAnalysis.actions}
                      riskLevel={aiAnalysis.riskLevel}
                      loading={aiAnalysis.loading}
                      liveLogs={agentLogs}
                    />

                    <SatelliteIntel />

                    <div className="glass p-5 md:p-8 rounded-3xl flex flex-col md:max-h-[300px]">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Info size={18} />
                          <h3 className="font-bold tracking-tight uppercase text-xs font-mono">Raw Incident Logs</h3>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {reports.length > 0 ? reports.map((report, i) => (
                          <div key={i} className="flex gap-4 p-3 rounded-2xl bg-slate-950/30 border border-slate-900 group hover:border-slate-800 transition-colors">
                            <span className="text-[10px] font-mono text-slate-600 mt-0.5 shrink-0">
                              {new Date(report.properties.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <p className="text-xs text-slate-400 leading-snug">{report.properties.text}</p>
                          </div>
                        )) : (
                          <p className="text-[10px] font-mono text-slate-600 italic text-center py-8">No raw logs available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'Live Map' ? (
              <motion.div
                key="live-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[calc(100vh-14rem)] md:h-[calc(100vh-10rem)] w-full"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Geospatial Intelligence <span className="text-blue-500">Network</span></h2>
                    <p className="text-xs text-slate-500 mt-1">Overlaying real-time flood depth and citizen reports across Jakarta.</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live API Active
                  </div>
                </div>
                <LiveMapView agentActions={agentLogs} />
              </motion.div>
            ) : activeTab === 'High Risk Zones' ? (
              <motion.div
                key="high-risk"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <HighRiskZonesView />
              </motion.div>
            ) : activeTab === 'Safe Routes' ? (
              <motion.div
                key="safe-routes"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <SafeRoutesView />
              </motion.div>
            ) : activeTab === 'History Analytics' ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <HistoryAnalyticsView />
              </motion.div>
            ) : activeTab === 'Spatial Insights' ? (
              <motion.div
                key="spatial"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <SpatialInsightsView />
              </motion.div>
            ) : activeTab === 'Settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white mb-2">System <span className="text-blue-500">Settings</span></h2>
                  <p className="text-slate-400">Configure AI model parameters and data synchronization frequency.</p>
                </div>
                
                <div className="grid gap-6">
                  <div className="glass p-8 rounded-3xl">
                    <h3 className="text-lg font-bold text-slate-200 mb-6">AI Configuration</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-300">Model Temperature</p>
                          <p className="text-xs text-slate-500">Controls randomness in flood predictions.</p>
                        </div>
                        <input type="range" className="w-48 accent-blue-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-300">PetaBencana Sync Rate</p>
                          <p className="text-xs text-slate-500">Frequency of API requests (current: 2 min).</p>
                        </div>
                        <select defaultValue="2 Minutes" className="bg-slate-900 border border-slate-800 rounded-lg text-sm p-2 text-slate-300">
                          <option>1 Minute</option>
                          <option>2 Minutes</option>
                          <option>5 Minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-3xl border-red-500/20">
                    <h3 className="text-lg font-bold text-red-400 mb-6">Critical Actions</h3>
                    <button className="px-6 py-3 bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 text-red-500 rounded-2xl text-sm font-bold transition-all">
                      Reset Geospatial Cache
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'Profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-10">
                  <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 mx-auto mb-6 flex items-center justify-center text-4xl font-bold shadow-2xl shadow-blue-500/30 text-white transform rotate-3 hover:rotate-0 transition-transform">
                    {adminProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{adminProfile.name}</h2>
                  <p className="text-blue-400 font-mono text-sm mb-8 tracking-widest uppercase">Operational Command</p>
                </div>
                 
                <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                       <Shield size={20} className="text-blue-400" />
                       Credentials & Access
                    </h3>
                    {!adminProfile.isEditing ? (
                      <button 
                        onClick={() => setAdminProfile(p => ({ ...p, isEditing: true }))}
                        className="p-2 rounded-full bg-slate-950 text-slate-500 hover:text-blue-400 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all"
                      >
                        <Save size={14} /> Save Profile
                      </button>
                    )}
                  </div>

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSaveProfile}>
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                           <Edit2 size={10} /> Access Level
                        </label>
                        {adminProfile.isEditing ? (
                          <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                            value={adminProfile.accessLevel}
                            onChange={(e) => setAdminProfile(p => ({ ...p, accessLevel: e.target.value }))}
                          />
                        ) : (
                          <p className="text-sm font-bold text-slate-200 bg-slate-950/50 px-4 py-2 rounded-xl border border-transparent">{adminProfile.accessLevel}</p>
                        )}
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                           <ClockIcon size={10} /> Last Terminal Activity
                        </label>
                        {adminProfile.isEditing ? (
                          <input 
                            type="text" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:border-blue-500 outline-none"
                            value={adminProfile.lastLogin}
                            onChange={(e) => setAdminProfile(p => ({ ...p, lastLogin: e.target.value }))}
                          />
                        ) : (
                          <p className="text-sm font-bold text-slate-200 bg-slate-950/50 px-4 py-2 rounded-xl border border-transparent">{adminProfile.lastLogin}</p>
                        )}
                     </div>
                  </form>
                </div>
                 
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="mt-12 w-full px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl text-sm font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest hover:border-slate-700"
                >
                   Secure Logout
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 mb-8 shadow-2xl shadow-blue-500/10">
                  <Construction size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 italic serif">{activeTab} View</h2>
                <p className="text-slate-400 max-w-md leading-relaxed">
                  The AI Agent is currently synthesizing live PetaBencana feeds and sensor history for {activeTab.toLowerCase()}. 
                  This module will be online shortly.
                </p>
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="mt-8 px-6 py-2 border border-blue-500/30 hover:border-blue-500 text-blue-400 rounded-full text-sm font-medium transition-all"
                >
                  Return to Control Center
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SensorDetailsModal 
        sensor={selectedSensor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportProcessed={(newLog) => setAgentLogs(prev => [newLog, ...prev])}
      />

      {/* Floating Report Button */}
      {!showLanding && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsReportModalOpen(true)}
          className="fixed bottom-8 right-8 z-[999] w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center group border-4 border-slate-950"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          <div className="absolute right-full mr-4 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
             <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Report Incident</span>
          </div>
        </motion.button>
      )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
