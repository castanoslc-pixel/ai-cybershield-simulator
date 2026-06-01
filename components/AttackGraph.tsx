
import React from 'react';
import { AttackLog, AttackStatus } from '../types';

interface AttackGraphProps {
  logs: AttackLog[];
  status: AttackStatus;
  vulnerability: string;
  isDarkMode: boolean;
}

const AttackGraph: React.FC<AttackGraphProps> = ({ logs, status, vulnerability, isDarkMode }) => {
  // We want to show the logs in chronological order (oldest first for the flow)
  const orderedLogs = [...logs].reverse();
  
  const nodeSpacing = 100;
  const graphWidth = 400;
  const graphHeight = Math.max(400, (orderedLogs.length + 1) * nodeSpacing);
  
  const accentColor = isDarkMode ? '#818cf8' : '#4f46e5';
  const glowColor = isDarkMode ? 'rgba(129, 140, 248, 0.3)' : 'rgba(79, 70, 229, 0.1)';

  return (
    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Attack Progression Map
        </h3>
        <div className="flex gap-4 text-[10px] mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span>Node Discovery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-indigo-500"></div>
            <span>Vector Path</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto overflow-y-hidden">
        <svg 
          width="100%" 
          height={graphHeight} 
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="mx-auto"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={accentColor} />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Draw initial Vulnerability node */}
          <g transform={`translate(${graphWidth / 2}, 40)`}>
            <rect
              x="-80"
              y="-20"
              width="160"
              height="40"
              rx="8"
              fill={isDarkMode ? '#1e1b4b' : '#eef2ff'}
              stroke={accentColor}
              strokeWidth="2"
              className="animate-pulse"
              style={{ filter: 'url(#glow)' }}
            />
            <text
              textAnchor="middle"
              dy=".3em"
              fill={isDarkMode ? '#c7d2fe' : '#312e81'}
              fontSize="10"
              fontWeight="bold"
              className="mono uppercase"
            >
              VECTOR: {vulnerability.length > 20 ? vulnerability.substring(0, 18) + '...' : vulnerability}
            </text>
          </g>

          {/* Initial Path */}
          {orderedLogs.length > 0 && (
            <line
              x1={graphWidth / 2}
              y1={60}
              x2={graphWidth / 2}
              y2={nodeSpacing - 30}
              stroke={accentColor}
              strokeWidth="2"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
            />
          )}

          {/* Draw Event Nodes */}
          {orderedLogs.map((log, index) => {
            const y = (index + 1) * nodeSpacing;
            const isLast = index === orderedLogs.length - 1;
            
            return (
              <g key={log.id}>
                {/* Connection Line to next node */}
                {!isLast && (
                  <line
                    x1={graphWidth / 2}
                    y1={y + 20}
                    x2={graphWidth / 2}
                    y2={y + nodeSpacing - 20}
                    stroke={accentColor}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                )}

                {/* Node Box */}
                <g transform={`translate(${graphWidth / 2}, ${y})`}>
                  <rect
                    x="-100"
                    y="-25"
                    width="200"
                    height="50"
                    rx="12"
                    fill={isDarkMode ? '#0f172a' : '#ffffff'}
                    stroke={isLast && status !== AttackStatus.RESOLVED ? accentColor : (isDarkMode ? '#334155' : '#e2e8f0')}
                    strokeWidth={isLast ? '2' : '1'}
                    style={isLast ? { filter: 'url(#glow)' } : {}}
                  />
                  <text
                    textAnchor="middle"
                    dy="-4"
                    fill={isDarkMode ? '#f1f5f9' : '#1e293b'}
                    fontSize="11"
                    fontWeight="700"
                  >
                    {log.event.length > 25 ? log.event.substring(0, 22) + '...' : log.event}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="14"
                    fill={isDarkMode ? '#64748b' : '#94a3b8'}
                    fontSize="9"
                    className="mono"
                  >
                    {log.timestamp}
                  </text>

                  {/* Activity Indicator for last node */}
                  {isLast && status !== AttackStatus.RESOLVED && (
                    <circle
                      cx="100"
                      cy="-25"
                      r="4"
                      fill="#ef4444"
                      className="animate-ping"
                    />
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} text-center`}>
        <p className={`text-[10px] italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Visualizing live lateral movement and payload deployment sequences.
        </p>
      </div>
    </div>
  );
};

export default AttackGraph;
