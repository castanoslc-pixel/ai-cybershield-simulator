
import React from 'react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  const bg = isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200';
  const text = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const title = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl ${bg} p-8`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${title}`}>CyberShield User Manual</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`space-y-6 ${text}`}>
          <section>
            <h3 className="font-bold text-indigo-400 uppercase text-xs tracking-widest mb-2">1. Getting Started</h3>
            <p className="text-sm">Select an asset from the left sidebar to launch a simulation. Use the "Campaign Mode" for advanced, nation-state level threats.</p>
          </section>

          <section>
            <h3 className="font-bold text-indigo-400 uppercase text-xs tracking-widest mb-2">2. Choosing Your Persona</h3>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li><strong>Student:</strong> Focuses on learning terminology and attack progression flows.</li>
              <li><strong>SecOps:</strong> Provides deep technical forensics and administrative control views.</li>
              <li><strong>Supervisor:</strong> High-level executive summaries and operational metrics.</li>
              <li><strong>Legal/Compliance:</strong> Regulatory reporting (CIRCIA) and Law Enforcement liaison.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-indigo-400 uppercase text-xs tracking-widest mb-2">3. Analyzing the Attack</h3>
            <p className="text-sm">Watch the <strong>Progression Map</strong> to visualize lateral movement. Review the <strong>Event Forensics</strong> timeline for step-by-step indicators of compromise (IoCs).</p>
          </section>

          <section>
            <h3 className="font-bold text-indigo-400 uppercase text-xs tracking-widest mb-2">4. Reporting & Response</h3>
            <p className="text-sm">Use the <strong>CIRCIA Engine</strong> to draft regulatory reports. For international incidents, use the <strong>Law Enforcement Liaison</strong> to generate jurisdiction-specific reports (FBI, Europol, etc.).</p>
          </section>

          <section>
            <h3 className="font-bold text-indigo-400 uppercase text-xs tracking-widest mb-2">5. Jurisdictions</h3>
            <p className="text-sm">Adjust your jurisdiction in the main dashboard to tailor legal and law enforcement reports to your specific country's requirements.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
          >
            Got it, Let's Defend
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualModal;
