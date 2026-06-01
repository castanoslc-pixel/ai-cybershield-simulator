
import React from 'react';
import { Simulation, AttackStatus, Severity } from '../types';

interface SimulationCardProps {
  simulation: Simulation;
  onClick: (sim: Simulation) => void;
  isActive: boolean;
  isDarkMode: boolean;
}

const SimulationCard: React.FC<SimulationCardProps> = ({ simulation, onClick, isActive, isDarkMode }) => {
  const getStatusColor = (status: AttackStatus) => {
    switch (status) {
      case AttackStatus.INFILTRATING: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case AttackStatus.DETECTED: return 'text-red-400 bg-red-400/10 border-red-400/20';
      case AttackStatus.MITIGATING: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case AttackStatus.RESOLVED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL: return 'bg-red-600';
      case Severity.HIGH: return 'bg-orange-500';
      case Severity.MEDIUM: return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const activeClasses = isDarkMode 
    ? 'border-indigo-500 bg-slate-900 shadow-lg shadow-indigo-500/10' 
    : 'border-indigo-400 bg-indigo-50 shadow-sm';
  
  const inactiveClasses = isDarkMode
    ? 'border-slate-800 bg-slate-900/50 hover:bg-slate-900'
    : 'border-slate-200 bg-white hover:bg-slate-50';

  return (
    <div 
      onClick={() => onClick(simulation)}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityColor(simulation.severity)} text-white`}>
          {simulation.severity}
        </span>
        <span className={`text-[11px] mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {simulation.startTime.toLocaleTimeString()}
        </span>
      </div>
      <h3 className={`font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{simulation.attackName}</h3>
      <p className={`text-xs mb-3 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{simulation.deviceType}</p>
      
      <div className={`text-[10px] inline-flex items-center gap-1.5 font-semibold px-2 py-1 rounded-full border ${getStatusColor(simulation.status)}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {simulation.status}
      </div>
    </div>
  );
};

export default SimulationCard;
