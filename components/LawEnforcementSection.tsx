
import React, { useState, useMemo } from 'react';
import { Simulation } from '../types';
import { generateLawEnforcementDraft } from '../services/geminiService';

interface LawEnforcementSectionProps {
  simulation: Simulation;
  isDarkMode: boolean;
  jurisdiction: string;
}

const LawEnforcementSection: React.FC<LawEnforcementSectionProps> = ({ simulation, isDarkMode, jurisdiction }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestedAgencies = useMemo(() => {
    switch (jurisdiction) {
      case 'United States': return ['FBI Cyber Division', 'CISA', 'IC3'];
      case 'United Kingdom': return ['Action Fraud', 'National Cyber Security Centre (NCSC)'];
      case 'European Union': return ['Europol EC3', 'Local Cyber Command'];
      case 'Canada': return ['RCMP Cybercrime', 'Canadian Centre for Cyber Security'];
      case 'Australia': return ['Australian Cyber Security Centre (ACSC)', 'AFP'];
      case 'Singapore': return ['Singapore Police Force (Cybercrime Command)', 'CSA'];
      default: return ['Local Cybercrime Authority'];
    }
  }, [jurisdiction]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await generateLawEnforcementDraft(simulation, jurisdiction);
      setDraft(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const metadataRows = [
    { label: 'Incident ID', value: `#${simulation.id}` },
    { label: 'Primary Agency', value: suggestedAgencies[0] },
    { label: 'Date/Time', value: simulation.startTime.toLocaleString() },
    { label: 'Threat Type', value: simulation.attackName },
  ];

  return (
    <div className={`p-6 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/60 border-red-500/20 shadow-xl shadow-red-500/5' : 'bg-red-50/30 border-red-200'}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-600/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-7h1m-1 4h1m4-4h1m-1 4h1" />
          </svg>
        </div>
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>Law Enforcement Liaison</h3>
          <p className="text-[10px] opacity-60">Citizen Protection & Criminal Investigation</p>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl border ${isDarkMode ? 'bg-black/20 border-slate-800' : 'bg-white border-red-100'}`}>
        {metadataRows.map(row => (
          <div key={row.label}>
            <div className={`text-[9px] font-bold uppercase tracking-tighter ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{row.label}</div>
            <div className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{row.value}</div>
          </div>
        ))}
      </div>

      {!draft ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Target Agencies:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedAgencies.map(agency => (
                <span key={agency} className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${isDarkMode ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {agency}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl border-2 border-dashed border-red-500/30 flex flex-col items-center justify-center gap-1 hover:bg-red-500/10 transition-all group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-bold text-red-500 uppercase">Drafting Criminal Referral...</span>
              </div>
            ) : (
              <>
                <span className="text-xs font-bold uppercase tracking-widest text-red-500">Draft Law Enforcement Notification</span>
                <span className="text-[9px] text-slate-500">Pre-populating evidence for criminal prosecution.</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className={`p-4 rounded-xl font-mono text-[11px] h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed border ${isDarkMode ? 'bg-black/40 text-red-200 border-red-500/20' : 'bg-white text-red-900 border-red-100 shadow-inner'}`}>
            {draft}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(draft);
                alert("Notification draft copied.");
              }}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Copy Official Draft
            </button>
            <button 
              onClick={() => setDraft(null)}
              className={`px-4 py-2.5 rounded-lg border text-xs font-bold transition-all ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawEnforcementSection;
