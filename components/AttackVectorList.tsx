
import React from 'react';
import { AttackVector, Severity } from '../types';

interface AttackVectorListProps {
  isDarkMode: boolean;
  vectors: AttackVector[];
  isLoading: boolean;
}

const AttackVectorList: React.FC<AttackVectorListProps> = ({ isDarkMode, vectors, isLoading }) => {
  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL: return 'text-red-500';
      case Severity.HIGH: return 'text-orange-500';
      case Severity.MEDIUM: return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };

  const getIconForCategory = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('social') || cat.includes('phish')) {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
    if (cat.includes('malware') || cat.includes('ransom')) {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full mt-12 animate-pulse">
        <div className="h-4 w-48 bg-slate-800 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`h-32 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Live Threat Intelligence Feed
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] mono text-emerald-500 uppercase font-bold animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          Streaming Global Intel
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vectors.map((vector) => (
          <div
            key={vector.name}
            className={`p-5 rounded-2xl border transition-all hover:shadow-md relative overflow-hidden group ${
              isDarkMode 
                ? 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30' 
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  {getIconForCategory(vector.category)}
                </div>
                <h4 className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{vector.name}</h4>
              </div>
              <div className="flex gap-1">
                {vector.isTrending && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Trending
                  </span>
                )}
                {vector.isEmerging && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    Emerging
                  </span>
                )}
              </div>
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {vector.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${getSeverityColor(vector.severity)}`}>
                {vector.severity} Risk
              </span>
              <span className={`text-[9px] mono uppercase ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {vector.category}
              </span>
            </div>
            
            {/* Visual Flare for High Severity */}
            {(vector.severity === Severity.CRITICAL || vector.severity === Severity.HIGH) && (
              <div className="absolute top-0 right-0 w-12 h-12 -mr-6 -mt-6 bg-red-500/5 rotate-45 pointer-events-none group-hover:bg-red-500/10 transition-colors"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttackVectorList;
