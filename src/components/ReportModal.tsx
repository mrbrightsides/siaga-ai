
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Send, MapPin, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { processCitizenReport, AgentAction } from '../services/aiAgentService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportProcessed: (action: AgentAction) => void;
}

export default function ReportModal({ isOpen, onClose, onReportProcessed }: ReportModalProps) {
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [verificationStep, setVerificationStep] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      setVerificationStep("Analyzing Visual Evidence...");
      await new Promise(r => setTimeout(r, 1200));
      
      setVerificationStep("Cross-checking with nearby Hydraulic Gauges...");
      await new Promise(r => setTimeout(r, 1200));

      setVerificationStep("Verifying Citizen Reputation Score...");
      await new Promise(r => setTimeout(r, 800));

      setVerificationStep("Finalizing Autonomous Dispatch...");

      // Send to AI for autonomous analysis
      const result = await processCitizenReport(
        description, 
        image ? image.split(',')[1] : undefined
      );
      
      onReportProcessed(result);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setDescription('');
        setImage(null);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500">
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Report Incident</h3>
                    <p className="text-xs text-slate-500 font-mono">Autonomous Verification Queue</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6 border border-green-500/30">
                    <CheckCircle2 size={40} className="animate-bounce" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Report Dispatched</h4>
                  <p className="text-slate-400 text-sm max-w-xs">
                    The SIAGA AI Agent has verified the incident and initiated autonomous response protocols.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Incident Description</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Flood water high near Kemang bridge, traffic blocked..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 min-h-[120px] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Visual Evidence</label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="h-32 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-950/50 cursor-pointer transition-colors relative overflow-hidden"
                       >
                         {image ? (
                           <img src={image} alt="Preview" className="w-full h-full object-cover" />
                         ) : (
                           <React.Fragment>
                             <Camera size={24} className="text-slate-600" />
                             <span className="text-[10px] text-slate-600 uppercase font-bold">Upload Photo</span>
                           </React.Fragment>
                         )}
                         <input 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           ref={fileInputRef} 
                           onChange={handleImageChange}
                         />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Assigned Location</label>
                       <div className="h-32 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 p-4 text-center">
                          <MapPin size={24} className="text-blue-500 shadow-lg shadow-blue-500/20" />
                          <span className="text-[10px] text-slate-300 font-mono">Current Location Detected</span>
                       </div>
                    </div>
                  </div>

                  <button
                    disabled={loading || !description.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <React.Fragment>
                        <Loader2 className="animate-spin" size={20} />
                        <span className="uppercase tracking-widest text-[10px]">{verificationStep || 'AI Processing Engine...'}</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Send size={20} />
                        <span className="uppercase tracking-widest text-xs">Dispatch Mission</span>
                      </React.Fragment>
                    )}
                  </button>
                  <p className="text-[9px] text-center text-slate-500 italic mt-4 font-mono">
                    *Our Agentic AI will autonomously verify and dispatch authorities.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
