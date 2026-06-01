
import React, { useState } from 'react';
import { Simulation } from '../types';
import { generateCIRCIAReport } from '../services/geminiService';

interface CIRCIASectionProps {
  simulation: Simulation;
  isDarkMode: boolean;
}

const CIRCIASection: React.FC<CIRCIASectionProps> = ({ simulation, isDarkMode }) => {
  const [reportDraft, setReportDraft] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = await generateCIRCIAReport(simulation);
      setReportDraft(report);
    } catch (e) {
      console.error("Failed to generate CIRCIA report", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (reportDraft) {
      navigator.clipboard.writeText(reportDraft);
      alert("Report copied to clipboard.");
    }
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/60 border-indigo-500/20 shadow-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>CIRCIA Compliance Engine</h3>
            <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Regulatory reporting for Critical Infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-[9px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Report Deadline</div>
            <div className={`text-xs font-bold mono ${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`}>T-Minus 71:58:12</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold uppercase tracking-tight">Requirement 1: 72hr Window</span>
          </div>
          <p className="text-[10px] leading-tight text-slate-500">Must report significant cyber incidents to CISA within 72 hours of belief that an incident occurred.</p>
        </div>
        <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
            <span className="text-[10px] font-bold uppercase tracking-tight">Requirement 2: 24hr Window</span>
          </div>
          <p className="text-[10px] leading-tight text-slate-500">Ransomware payments must be reported within 24 hours. (Status: Not Applicable)</p>
        </div>
      </div>

      {reportDraft ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border max-h-96 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed font-serif ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            {reportDraft}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Copy Official Draft
            </button>
            <button 
              onClick={() => setReportDraft(null)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`w-full py-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all ${
            isDarkMode 
              ? 'border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/50 hover:bg-indigo-500/10' 
              : 'border-indigo-200 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100/50'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-bold text-indigo-500">Drafting Regulatory Disclosure...</span>
            </div>
          ) : (
            <>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Generate CIRCIA Disclosure Report</span>
              <span className="text-[10px] text-slate-500">Drafting includes incident timeline, vulnerability mapping, and impacts.</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CIRCIASection;
