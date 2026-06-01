
import React from 'react';
import { AttackLog } from '../types';

interface TimelineProps {
  logs: AttackLog[];
  isDarkMode: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ logs, isDarkMode }) => {
  const lineColor = isDarkMode ? 'via-slate-700' : 'via-slate-200';
  const circleBg = isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-500 shadow-sm';
  const cardBg = isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm';

  return (
    <div className={`space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent ${lineColor} before:to-transparent`}>
      {logs.map((log) => (
        <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors ${circleBg}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-colors ${cardBg}`}>
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{log.event}</div>
              <time className="mono text-[10px] text-indigo-400">{log.timestamp}</time>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{log.details}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
