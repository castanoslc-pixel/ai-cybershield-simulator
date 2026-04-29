
import React from 'react';
import { MitigationStrategy } from '../types';

interface MitigationSectionProps {
  strategies: MitigationStrategy[];
  isDarkMode: boolean;
  isLoading: boolean;
}

const MitigationSection: React.FC<MitigationSectionProps> = ({ strategies, isDarkMode, isLoading }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-emerald-500';
      case 'Medium': return 'text-amber-500';
      case 'Low': return 'text-slate-500';
      default: return 'text-slate-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-40 bg-slate-800 rounded"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-24 rounded-2xl border ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className={`text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        AI-Orchestrated Mitigation Engine
      </h3>
      
      <div className="space-y-3">
        {strategies.map((strategy, idx) => (
          <div 
            key={idx} 
            className={`group p-4 rounded-2xl border transition-all hover:shadow-lg ${
              isDarkMode 
                ? 'bg-slate-900/40 border-slate-800/50 hover:border-indigo-500/30' 
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {strategy.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase ${getImpactColor(strategy.impact)}`}>
                  {strategy.impact} Impact
                </span>
                <span className={`text-[10px] mono font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                  {strategy.confidence}% Conf
                </span>
              </div>
            </div>
            
            {/* Non-technical Summary */}
            <div className={`mb-3 p-2.5 rounded-lg border ${isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'}`}>
              <span className={`text-[9px] font-bold uppercase block mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Executive Goal</span>
              <p className={`text-xs italic leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {strategy.summary}
              </p>
            </div>

            {/* Technical Description */}
            <div className="space-y-1">
              <span className={`text-[9px] font-bold uppercase block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Technical Implementation</span>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {strategy.description}
              </p>
            </div>
            
            <div className="mt-4 flex justify-end">
               <button className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                 isDarkMode 
                  ? 'bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400' 
                  : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
               }`}>
                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 Deploy Response
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MitigationSection;
