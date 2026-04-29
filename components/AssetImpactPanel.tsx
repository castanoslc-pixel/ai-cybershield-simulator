
import React from 'react';
import { CompromisedAsset } from '../types';

interface AssetImpactPanelProps {
  assets: CompromisedAsset[];
  isDarkMode: boolean;
}

const AssetImpactPanel: React.FC<AssetImpactPanelProps> = ({ assets, isDarkMode }) => {
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Compromised': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Vulnerable': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Isolated': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Cleaned': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getIcon = (type: string) => {
    if (type === 'File') return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    );
    if (type === 'Network Node') return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    );
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    );
  };

  return (
    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-indigo-600 rounded">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Affected System Assets</h3>
      </div>
      
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
        {assets.length === 0 ? (
          <p className="text-[10px] text-slate-500 italic">No assets compromised yet.</p>
        ) : (
          assets.map((asset, i) => (
            <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${isDarkMode ? 'bg-black/20 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>{getIcon(asset.type)}</div>
                <div>
                  <div className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{asset.name}</div>
                  <div className="text-[8px] uppercase tracking-tighter opacity-50">{asset.type} • {asset.impact}</div>
                </div>
              </div>
              <div className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusStyle(asset.status)}`}>
                {asset.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssetImpactPanel;
