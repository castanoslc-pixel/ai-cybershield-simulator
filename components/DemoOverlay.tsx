
import React from 'react';

interface DemoStep {
  title: string;
  content: string;
  targetId?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    title: "1. Phase: Infiltration",
    content: "A zero-day exploit is executed against the Strategic Facility. Watch the 'Attack Progression Map' node discovery. Status: INFILTRATING.",
  },
  {
    title: "2. Asset Impact Identification",
    content: "The system dynamically identifies affected network nodes and file systems. You can see specific IPs and binary paths appearing in the 'Affected Assets' panel with a 'Compromised' state.",
  },
  {
    title: "3. Automated Mitigation Logic",
    content: "AI-Orchestrated agents deploy virtual air-gaps. Malicious processes are suspended and suspicious nodes are isolated from the main data plane. Status: MITIGATING.",
  },
  {
    title: "4. Threat Removal & Clean-up",
    content: "Infected code segments are purged from memory. Forensic tracers verify that all compromised assets have been restored to a 'Cleaned' state, ensuring the threat is non-functioning.",
  },
  {
    title: "5. Documentation & Archival",
    content: "The workflow concludes with a comprehensive forensic report. The simulation is archived securely in our Zero-Trust vault for future legal compliance and analysis.",
  }
];

interface DemoOverlayProps {
  currentStep: number;
  onNext: () => void;
  onClose: () => void;
  isDarkMode: boolean;
}

const DemoOverlay: React.FC<DemoOverlayProps> = ({ currentStep, onNext, onClose, isDarkMode }) => {
  const step = DEMO_STEPS[currentStep];
  if (!step) return null;

  return (
    <div className="fixed bottom-12 right-12 z-[150] w-[420px] animate-in slide-in-from-right-12 duration-700 ease-out">
      <div className={`p-8 rounded-[32px] border-4 shadow-3xl ${isDarkMode ? 'bg-indigo-950/95 border-indigo-500/30 backdrop-blur-xl' : 'bg-white border-indigo-200'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Workflow Phase</span>
            <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-slate-100 text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p className={`text-base mb-8 leading-relaxed font-medium ${isDarkMode ? 'text-indigo-100/80' : 'text-slate-600'}`}>{step.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {DEMO_STEPS.map((_, i) => (
              <div key={i} className={`h-2 w-6 rounded-full transition-all duration-500 ${i === currentStep ? 'bg-indigo-400 w-10 shadow-lg shadow-indigo-400/50' : (isDarkMode ? 'bg-indigo-900/50' : 'bg-slate-200')}`} />
            ))}
          </div>
          <button 
            onClick={onNext}
            className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-500/30 transform hover:scale-105 active:scale-95"
          >
            {currentStep === DEMO_STEPS.length - 1 ? "Finish Demo" : "Next Phase"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoOverlay;
