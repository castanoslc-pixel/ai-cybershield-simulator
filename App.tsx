
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  DeviceType, 
  Simulation, 
  AttackStatus, 
  Severity, 
  AttackLog,
  AttackVector,
  MitigationStrategy,
  CampaignType,
  UserPersona,
  ArchivedSimulation,
  CompromisedAsset
} from './types';
import { 
  generateAttackScenario, 
  generateCampaignScenario, 
  fetchMitigationStrategies, 
  fetchThreatIntel,
  fetchDetailedForensics,
  generateExecutiveSummary,
  generateTheoreticalSimulation
} from './services/geminiService';
import SimulationCard from './components/SimulationCard';
import Timeline from './components/Timeline';
import AttackVectorList from './components/AttackVectorList';
import MitigationSection from './components/MitigationSection';
import CIRCIASection from './components/CIRCIASection';
import AttackGraph from './components/AttackGraph';
import ManualModal from './components/ManualModal';
import LawEnforcementSection from './components/LawEnforcementSection';
import ArchiveVault from './components/ArchiveVault';
import DemoOverlay from './components/DemoOverlay';
import AssetImpactPanel from './components/AssetImpactPanel';
import TheoreticalPlanningSection from './components/TheoreticalPlanningSection';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const App: React.FC = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [archives, setArchives] = useState<ArchivedSimulation[]>([]);
  const [activeSimId, setActiveSimId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mitigationStrategies, setMitigationStrategies] = useState<MitigationStrategy[]>([]);
  const [mitigationLoading, setMitigationLoading] = useState(false);
  const [statsData, setStatsData] = useState<{ time: string; intensity: number }[]>([]);
  const [threatIntel, setThreatIntel] = useState<AttackVector[]>([]);
  const [intelLoading, setIntelLoading] = useState(true);
  const [persona, setPersona] = useState<UserPersona>(UserPersona.SEC_OPS);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [jurisdiction, setJurisdiction] = useState('United States');
  const [zeroTrustCompliance, setZeroTrustCompliance] = useState(true);
  
  // Demo State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  
  const activeSim = simulations.find(s => s.id === activeSimId);
  const simulationIntervals = useRef<{ [key: string]: any }>({});

  const activeAlerts = useMemo(() => {
    return simulations.filter(s => 
      s.status === AttackStatus.INFILTRATING || 
      s.status === AttackStatus.DETECTED || 
      s.status === AttackStatus.MITIGATING
    );
  }, [simulations]);

  useEffect(() => {
    const data = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      intensity: Math.floor(Math.random() * 40) + 10
    }));
    setStatsData(data);

    const loadIntel = async () => {
      try {
        const intel = await fetchThreatIntel();
        setThreatIntel(intel);
      } catch (e) {
        console.error("Failed to load threat intel", e);
      } finally {
        setIntelLoading(false);
      }
    };
    loadIntel();

    const savedArchives = localStorage.getItem('cyber_shield_archives');
    if (savedArchives) {
      try {
        const parsed = JSON.parse(savedArchives);
        setArchives(parsed.map((a: any) => ({
          ...a,
          startTime: new Date(a.startTime),
          archivedAt: new Date(a.archivedAt),
          resolutionTime: a.resolutionTime ? new Date(a.resolutionTime) : undefined
        })));
      } catch (e) {
        console.error("Archive parse failed", e);
      }
    }

    const intelInterval = setInterval(loadIntel, 120000);
    return () => clearInterval(intelInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem('cyber_shield_archives', JSON.stringify(archives));
  }, [archives]);

  const archiveSimulation = useCallback((sim: Simulation) => {
    const archived: ArchivedSimulation = {
      ...sim,
      archivedAt: new Date(),
      encryptionStatus: zeroTrustCompliance ? 'AES-256-GCM' : 'Unencrypted',
      zeroTrustVerified: zeroTrustCompliance
    };
    setArchives(prev => [archived, ...prev]);
    setSimulations(prev => prev.filter(s => s.id !== sim.id));
    if (activeSimId === sim.id) setActiveSimId(null);
  }, [zeroTrustCompliance, activeSimId]);

  const restoreFromArchive = (archivedSim: ArchivedSimulation) => {
    setSimulations(prev => [archivedSim, ...prev]);
    setArchives(prev => prev.filter(a => a.id !== archivedSim.id));
    setActiveSimId(archivedSim.id);
  };

  const startSim = async (scenario: any, target: string, isCampaign: boolean = false) => {
    const newId = Math.random().toString(36).substr(2, 9);
    
    // Domain-specific assets
    let initialAssets: CompromisedAsset[] = [];
    if (scenario.theoreticalDoctrine) {
        initialAssets = [
          { name: 'Quantum Key Distribution Node', type: 'Theoretical Vector', impact: 'Speculative', status: 'Vulnerable' },
          { name: 'Neural-Sync Buffer', type: 'Theoretical Vector', impact: 'Speculative', status: 'Compromised' }
        ];
    } else if (target === DeviceType.AI_LLM_SERVICE) {
      initialAssets = [
        { name: 'Model Transformer Weights', type: 'Model Weight', impact: 'Infiltrated', status: 'Vulnerable' },
        { name: 'Inference Prompt Buffer', type: 'Prompt Buffer', impact: 'Infiltrated', status: 'Compromised' }
      ];
    } else if (target === DeviceType.ROBOTIC_SYSTEM || target === DeviceType.SMART_FACTORY) {
      initialAssets = [
        { name: 'Robotic Arm PLC Controller', type: 'Process', impact: 'Infiltrated', status: 'Vulnerable' },
        { name: 'Axis 1 Servo Actuator', type: 'Actuator', impact: 'Infiltrated', status: 'Compromised' }
      ];
    } else {
      initialAssets = [
        { name: 'Core Auth Service', type: 'Process', impact: 'Infiltrated', status: 'Vulnerable' },
        { name: 'Gateway Node 10.0.1.5', type: 'Network Node', impact: 'Infiltrated', status: 'Compromised' }
      ];
    }

    const newSim: Simulation = {
      id: newId,
      deviceType: target,
      attackName: scenario.attackName,
      startTime: new Date(),
      status: AttackStatus.INFILTRATING,
      severity: scenario.severity as Severity,
      reactionTaken: scenario.reactionTaken || 'Strategic doctrine deployment initiated.',
      description: scenario.description,
      vulnerability: scenario.vulnerability,
      isCampaign,
      compromisedAssets: initialAssets,
      theoreticalDoctrine: scenario.theoreticalDoctrine,
      logs: [{
        id: 'init',
        timestamp: new Date().toLocaleTimeString(),
        event: 'Advanced Modeling Started',
        details: scenario.theoreticalDoctrine 
          ? `Theoretical threat '${scenario.attackName}' simulation active. Projecting doctrinal responses.`
          : 'Initial payload execution detected on perimeter node.'
      }]
    };

    setSimulations(prev => [newSim, ...prev]);
    setActiveSimId(newId);
    
    let currentStep = 0;
    const timelineSteps = scenario.timelineSteps;
    const interval = setInterval(() => {
      setSimulations(prev => {
        const simIndex = prev.findIndex(s => s.id === newId);
        if (simIndex === -1) return prev;
        const updatedSim = { ...prev[simIndex] };
        const step = timelineSteps[currentStep];

        if (step) {
          const newLog: AttackLog = {
            id: Math.random().toString(),
            timestamp: new Date().toLocaleTimeString(),
            event: step.event || 'System Progression',
            details: step.details
          };
          updatedSim.logs = [newLog, ...updatedSim.logs];
          
          if (currentStep === Math.floor(timelineSteps.length / 3)) {
            updatedSim.status = AttackStatus.DETECTED;
          }
          if (currentStep === Math.floor(timelineSteps.length * 2 / 3)) {
            updatedSim.status = AttackStatus.MITIGATING;
            updatedSim.compromisedAssets = updatedSim.compromisedAssets?.map(a => ({ ...a, status: 'Isolated' }));
          }
          if (currentStep === timelineSteps.length - 1) {
             updatedSim.status = AttackStatus.RESOLVED;
             updatedSim.resolutionTime = new Date();
             updatedSim.compromisedAssets = updatedSim.compromisedAssets?.map(a => ({ ...a, status: 'Cleaned' }));
             clearInterval(simulationIntervals.current[newId]);
             enrichSimulation(updatedSim.id);
          }
        }
        const newArr = [...prev];
        newArr[simIndex] = updatedSim;
        return newArr;
      });
      currentStep++;
      if (currentStep >= timelineSteps.length) {
        clearInterval(simulationIntervals.current[newId]);
      }
    }, 4500);

    simulationIntervals.current[newId] = interval;
    if (!scenario.theoreticalDoctrine) {
        const strategies = await fetchMitigationStrategies(target, scenario.attackName);
        setMitigationStrategies(strategies);
    }
  };

  const enrichSimulation = async (id: string) => {
    const sim = simulations.find(s => s.id === id);
    if (!sim) return;
    const [forensics, summary] = await Promise.all([
      fetchDetailedForensics(sim),
      generateExecutiveSummary(sim)
    ]);
    setSimulations(prev => prev.map(s => s.id === id ? {
      ...s,
      forensicData: forensics,
      executiveSummary: summary
    } : s));
  };

  const runSimulation = useCallback(async (deviceType: DeviceType) => {
    setLoading(true);
    setMitigationLoading(true);
    try {
      const scenario = await generateAttackScenario(deviceType);
      await startSim(scenario, deviceType);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
      setMitigationLoading(false);
    }
  }, []);

  const runTheoreticalSim = useCallback(async (deviceType: DeviceType) => {
    setLoading(true);
    try {
      const scenario = await generateTheoreticalSimulation(deviceType);
      await startSim(scenario, `Theoretical Target (${deviceType})`);
    } catch (error) {
      console.error("Theoretical simulation failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const runDemo = useCallback(async () => {
    setIsDemoMode(true);
    setDemoStep(0);
    setPersona(UserPersona.SEC_OPS); 
    await runSimulation(DeviceType.SMART_FACTORY);
  }, [runSimulation]);

  const runCampaign = useCallback(async (campaign: CampaignType) => {
    setLoading(true);
    setMitigationLoading(true);
    try {
      const scenario = await generateCampaignScenario(campaign);
      await startSim(scenario, "Corporate Infrastructure", true);
    } catch (error) {
      console.error("Campaign Simulation failed:", error);
    } finally {
      setLoading(false);
      setMitigationLoading(false);
    }
  }, []);

  const stopSimulation = (id: string) => {
    if (simulationIntervals.current[id]) {
      clearInterval(simulationIntervals.current[id]);
      delete simulationIntervals.current[id];
    }
    setSimulations(prev => prev.map(s => s.id === id ? { ...s, status: AttackStatus.FAILED } : s));
  };

  const exportSimulationReport = (sim: Simulation) => {
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <title>Forensic Incident Report: ${sim.attackName}</title>
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 40px auto; padding: 40px; background: #f8fafc; }
    .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
    .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 11px; text-transform: uppercase; background: #dcfce7; color: #166534; }
    .critical-summary { border: 1px solid #fee2e2; background: #fef2f2; padding: 20px; border-radius: 12px; margin: 20px 0; }
    .asset-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
    .asset-item { padding: 10px; background: #f1f5f9; border-radius: 8px; font-size: 13px; display: flex; justify-content: space-between; }
    .neutralized { color: #10b981; font-weight: bold; }
    h2 { color: #0f172a; border-left: 5px solid #6366f1; padding-left: 15px; margin-top: 40px; }
    pre { background: #0f172a; color: #818cf8; padding: 20px; border-radius: 12px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0;">Post-Incident Forensic Analysis</h1>
        <span class="status-badge">Threat Neutralized</span>
      </div>
      <p style="color: #64748b; margin-top: 10px;">Incident Ref: #${sim.id} | Generated: ${new Date().toLocaleString()}</p>
    </div>

    <div class="critical-summary">
      <h3 style="margin-top: 0; color: #991b1b;">Threat Resolution Statement</h3>
      <p>The malicious code associated with <strong>${sim.attackName}</strong> on <strong>${sim.deviceType}</strong> has been successfully <strong>removed, neutralized, and contained</strong>. Automated mitigation agents have purged infected memory segments and restored file integrity for all functional paths. For AI assets, weights have been re-validated. For Robotics, actuator limits have been restored to safety specifications.</p>
    </div>

    <div class="section">
      <h2>Executive Summary</h2>
      <p>${sim.executiveSummary || 'A sophisticated breach was intercepted and resolved via AI-orchestrated defense.'}</p>
    </div>

    <div class="section">
      <h2>Restored Asset Inventory</h2>
      <div class="asset-grid">
        ${sim.compromisedAssets?.map(a => `
          <div class="asset-item">
            <span>${a.name} (${a.type})</span>
            <span class="neutralized">${a.status === 'Cleaned' ? 'FULLY RESTORED' : 'CONTAINED'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([htmlReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Shield_Forensic_Report_${sim.id}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const themeClass = isDarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900";
  const sidebarClass = isDarkMode ? "bg-slate-900/20 border-slate-800" : "bg-slate-100/50 border-slate-200";

  return (
    <div className={`min-h-screen ${themeClass} flex flex-col transition-colors duration-300`}>
      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} isDarkMode={isDarkMode} />
      
      {isDemoMode && (
        <DemoOverlay 
          currentStep={demoStep} 
          onNext={() => demoStep < 4 ? setDemoStep(demoStep + 1) : setIsDemoMode(false)} 
          onClose={() => setIsDemoMode(false)} 
          isDarkMode={isDarkMode} 
        />
      )}

      <header className={`h-16 border-b flex items-center px-6 sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${!isDarkMode ? 'text-slate-900' : 'text-white'}`}>CyberShield <span className="text-indigo-500">Simulator</span></h1>
            <p className={`text-[10px] mono uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Visual Forensic OS</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button 
            onClick={runDemo}
            className={`px-4 py-1.5 rounded-full border-2 border-indigo-500 text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${isDarkMode ? 'text-indigo-400 hover:bg-indigo-500 hover:text-white' : 'text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
          >
            Visual Demo
          </button>
          
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          
          <button onClick={() => setIsManualOpen(true)} className={`p-2 rounded-full border transition-colors ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>

          <div className={`flex items-center gap-1 p-1 rounded-full border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            {Object.values(UserPersona).map((p) => (
              <button key={p} onClick={() => setPersona(p)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap ${persona === p ? (isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm') : 'text-slate-500'}`}>
                {p.split(' ')[0]}
              </button>
            ))}
          </div>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full border transition-colors ${isDarkMode ? 'border-slate-700 text-amber-400' : 'border-slate-300 text-indigo-600'}`}>
            {isDarkMode ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className={`w-80 border-r flex flex-col ${sidebarClass}`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Industrial & AI Defense</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(DeviceType).map((type) => (
                <button key={type} onClick={() => runSimulation(type)} disabled={loading} className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all disabled:opacity-50 ${isDarkMode ? 'border-slate-800 bg-slate-900 hover:border-indigo-500' : 'border-slate-200 bg-white hover:border-indigo-400'}`}>
                  <span className="text-[10px] text-center font-bold tracking-tight leading-tight">{type}</span>
                </button>
              ))}
            </div>
            
            {/* Fix: removed reference to non-existent UserPersona.STRATEGIC_STRATEGIST */}
            {persona === UserPersona.STRATEGIST && (
              <div className="mt-6 p-4 rounded-2xl border-2 border-violet-500/20 bg-violet-500/5">
                <h3 className="text-[10px] font-black uppercase text-violet-400 mb-3 tracking-widest">Theoretical Modeling</h3>
                <button 
                  onClick={() => runTheoreticalSim(DeviceType.STRATEGIC_FACILITY)}
                  disabled={loading}
                  className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg shadow-violet-600/20"
                >
                  Model Future Threat
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Incident History</h2>
            <div className="space-y-3">
              {simulations.map(sim => <SimulationCard key={sim.id} simulation={sim} isDarkMode={isDarkMode} isActive={activeSimId === sim.id} onClick={(s) => setActiveSimId(s.id)} />)}
            </div>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeSim ? (
            <div className="p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-700">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-indigo-400 mono text-xs">REF_ID: {activeSim.id}</span>
                    <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border ${activeSim.status === AttackStatus.RESOLVED ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {activeSim.status.toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight">
                    {activeSim.attackName}
                    {activeSim.theoreticalDoctrine && <span className="ml-4 text-xs font-black bg-violet-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Theoretical Modeling</span>}
                  </h1>
                  <p className="text-sm opacity-60 max-w-3xl leading-relaxed">{activeSim.description}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => archiveSimulation(activeSim)} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2">
                    Archive
                  </button>
                  <button onClick={() => exportSimulationReport(activeSim)} className={`px-6 py-2.5 rounded-xl border-2 font-bold text-xs transition-all ${isDarkMode ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    Export Analysis
                  </button>
                </div>
              </div>

              {activeSim.theoreticalDoctrine && (
                <TheoreticalPlanningSection doctrine={activeSim.theoreticalDoctrine} isDarkMode={isDarkMode} />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <AttackGraph logs={activeSim.logs} status={activeSim.status} vulnerability={activeSim.vulnerability} isDarkMode={isDarkMode} />
                  <AssetImpactPanel assets={activeSim.compromisedAssets || []} isDarkMode={isDarkMode} />
                </div>
                <div className="space-y-8">
                  {activeSim.theoreticalDoctrine ? (
                    <div className={`p-6 rounded-3xl border-2 border-violet-500/10 bg-violet-500/5 ${isDarkMode ? 'text-violet-200' : 'text-violet-800'}`}>
                       <h3 className="text-xs font-black uppercase tracking-widest mb-4">Strategic Intelligence Memo</h3>
                       <p className="text-sm leading-relaxed mb-4">{activeSim.executiveSummary}</p>
                       <p className="text-xs opacity-70 italic">Generated by Theoretical Doctrine Analysis Engine.</p>
                    </div>
                  ) : (
                    <MitigationSection strategies={mitigationStrategies} isDarkMode={isDarkMode} isLoading={mitigationLoading} />
                  )}
                  <div className="grid grid-cols-1 gap-6">
                    <CIRCIASection simulation={activeSim} isDarkMode={isDarkMode} />
                    <LawEnforcementSection simulation={activeSim} isDarkMode={isDarkMode} jurisdiction={jurisdiction} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Log Transmission</h3>
                  <div className={`border-2 rounded-3xl p-8 min-h-[450px] ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-inner'}`}>
                    <Timeline logs={activeSim.logs} isDarkMode={isDarkMode} />
                  </div>
                </div>
                <div className={`p-8 rounded-3xl border-2 flex flex-col ${isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-200 shadow-sm'}`}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6">Threat Intensity Analysis</h3>
                  <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderRadius: '12px', border: 'none' }} />
                        <Line type="monotone" dataKey="intensity" stroke="#818cf8" strokeWidth={3} dot={false} animationDuration={1000} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 max-w-6xl mx-auto w-full space-y-12">
               <div className="flex flex-col items-center justify-center p-24 text-center border-b border-slate-800 pb-16">
                <div className={`w-32 h-32 border-4 border-indigo-600 rounded-[40px] flex items-center justify-center mb-8 shadow-3xl shadow-indigo-600/30 bg-indigo-600/10 animate-pulse`}>
                  <svg className="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h2 className="text-5xl font-black mb-6 tracking-tight">Advanced Defense Command</h2>
                <p className="max-w-xl text-xl opacity-60 mb-10 leading-relaxed font-medium">Model and neutralize cyber threats targeting LLMs, Autonomous Robotics, and Smart Manufacturing. Advanced strategists can utilize the Theoretical Doctrine engine to prepare for tomorrow's threats today.</p>
                <div className="flex gap-4">
                  <button onClick={runDemo} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all transform hover:scale-105 flex items-center gap-3">
                    Launch Standard Simulation
                  </button>
                  <button onClick={() => setPersona(UserPersona.STRATEGIST)} className={`px-8 py-4 rounded-2xl border-2 font-bold transition-all ${isDarkMode ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-200 hover:bg-slate-100'}`}>
                    Enter Strategic Mode
                  </button>
                </div>
              </div>
              <div className="pb-24">
                <ArchiveVault archives={archives} isDarkMode={isDarkMode} onRestore={restoreFromArchive} onClear={() => setArchives([])} persona={persona} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={`h-12 border-t flex items-center px-8 justify-between text-[10px] mono font-bold uppercase tracking-[0.2em] ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>
        <div className="flex gap-8">
           <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> OT/AI Sentinel: Operational</span>
           <span className="opacity-50">Encryption: AES-256-GCM</span>
        </div>
        <div className="text-indigo-400">{new Date().toISOString()}</div>
      </footer>
    </div>
  );
};

export default App;
