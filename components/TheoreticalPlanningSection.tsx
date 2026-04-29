
import React from 'react';
import { TheoreticalDoctrine } from '../types';

interface TheoreticalPlanningSectionProps {
  doctrine: TheoreticalDoctrine;
  isDarkMode: boolean;
}

const TheoreticalPlanningSection: React.FC<TheoreticalPlanningSectionProps> = ({ doctrine, isDarkMode }) => {
  const bg = isDarkMode ? 'bg-violet-950/40 border-violet-500/20' : 'bg-violet-50 border-violet-200';
  const textTitle = isDarkMode ? 'text-violet-400' : 'text-violet-700';
  
  return (
    <div className={`p-8 rounded-[2rem] border-2 shadow-2xl ${bg} animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-600/30">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.346a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.547 1.022l-.477 2.388a2 2 0 00.547 1.022l1.168 1.168a2 2 0 001.022-.547l2.388-.477a6 6 0 003.86-.517l.691-.346a6 6 0 013.86-.517l2.387.477a2 2 0 001.022-.547l1.168-1.168a2 2 0 00.547-1.022l.477-2.388a2 2 0 00-.547-1.022l-1.168-1.168z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2v4M2 12h4m14 0h4M12 18v4" />
          </svg>
        </div>
        <div>
          <h2 className={`text-xl font-black uppercase tracking-widest ${textTitle}`}>Strategic Theoretical Doctrine</h2>
          <p className="text-xs font-bold opacity-60 uppercase tracking-tighter">Advanced Defense Planning for Future Threats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className={`text-sm font-black uppercase tracking-widest ${textTitle} opacity-80`}>Core Planning Principle</h3>
            <div className={`p-5 rounded-2xl border-l-4 border-violet-500 font-medium leading-relaxed italic ${isDarkMode ? 'bg-black/20 text-slate-200' : 'bg-white text-slate-700 shadow-sm'}`}>
              "{doctrine.corePrinciple}"
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={`text-sm font-black uppercase tracking-widest ${textTitle} opacity-80`}>Strategic Roadmap</h3>
            <div className="space-y-3">
              {doctrine.strategicRoadmap.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-xs transition-all ${isDarkMode ? 'border-violet-500/30 text-violet-400 group-hover:bg-violet-500/20' : 'border-violet-200 text-violet-600 group-hover:bg-violet-50 shadow-sm'}`}>
                    {i + 1}
                  </div>
                  <div className={`flex-1 p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-black/10 border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className={`text-sm font-black uppercase tracking-widest ${textTitle} opacity-80`}>Future Countermeasures</h3>
          <div className={`grid grid-cols-1 gap-3 p-6 rounded-3xl border ${isDarkMode ? 'bg-black/30 border-violet-500/10' : 'bg-white/50 border-violet-100 shadow-inner'}`}>
            {doctrine.countermeasures.map((cm, i) => (
              <div key={i} className={`p-4 rounded-2xl border flex items-start gap-4 transition-all hover:translate-x-1 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-violet-500/40' : 'bg-white border-slate-200 shadow-sm hover:border-violet-400'}`}>
                <div className="mt-1">
                  <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-xs font-bold leading-relaxed">{cm}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoreticalPlanningSection;
