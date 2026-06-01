
import React, { useState } from 'react';
import { ArchivedSimulation, UserPersona } from '../types';

interface ArchiveVaultProps {
  archives: ArchivedSimulation[];
  isDarkMode: boolean;
  onRestore: (sim: ArchivedSimulation) => void;
  onClear: () => void;
  persona: UserPersona;
}

const ArchiveVault: React.FC<ArchiveVaultProps> = ({ archives, isDarkMode, onRestore, onClear, persona }) => {
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  const handleAccess = (sim: ArchivedSimulation) => {
    setIsVerifying(sim.id);
    // Simulate Zero-Trust MFA/Verification
    setTimeout(() => {
      setIsVerifying(null);
      onRestore(sim);
    }, 1200);
  };

  const bg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className={`mt-8 p-6 rounded-3xl border ${bg}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-600/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Secure Forensic Vault</h3>
            <p className="text-[10px] opacity-60">Zero-Trust Encrypted Archive Storage</p>
          </div>
        </div>
        {archives.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[10px] font-bold text-red-500 uppercase hover:underline"
          >
            Purge All Records
          </button>
        )}
      </div>

      {archives.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Vault Empty. Complete a simulation to archive data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archives.map((sim) => (
            <div 
              key={sim.id}
              className={`p-4 rounded-xl border group transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-200 hover:border-emerald-400'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Encrypted Archive</span>
                  <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{sim.attackName}</span>
                </div>
                <div className="p-1 bg-emerald-500/10 rounded">
                  <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest opacity-50">
                  <span>Target:</span>
                  <span>{sim.deviceType}</span>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest opacity-50">
                  <span>Archived:</span>
                  <span>{sim.archivedAt.toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleAccess(sim)}
                disabled={isVerifying === sim.id}
                className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isVerifying === sim.id 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isVerifying === sim.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Verifying Identity...
                  </span>
                ) : 'Verify & Decrypt'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveVault;
