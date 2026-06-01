
export enum DeviceType {
  PC = 'Personal Computer',
  NETWORK = 'Network Infrastructure',
  MOBILE = 'Mobile Phone',
  GLASSES = 'Smart Glasses',
  WATCH = 'Smartwatch',
  ICS = 'Industrial Control System',
  DATA_CENTER = 'Enterprise Data Center',
  STRATEGIC_FACILITY = 'Strategic Facility (Stargate-class)',
  AI_LLM_SERVICE = 'AI/LLM Deployment',
  ROBOTIC_SYSTEM = 'Autonomous Robotics',
  SMART_FACTORY = 'Automated Manufacturing'
}

export enum CampaignType {
  VOLT_TYPHOON = 'Volt Typhoon (Stealth)',
  SOLAR_WIND = 'Solar Supply Chain',
  APT_GENERAL = 'Advanced Persistent Threat',
  THEORETICAL_QUANTUM = 'Quantum Decryption (Future)',
  AGI_SWARM = 'AGI-Driven Swarm Attack',
  NEURAL_HIJACK = 'Neural-Interface Hijack'
}

export enum UserPersona {
  STUDENT = 'Academic / Student',
  SEC_OPS = 'Security Operations',
  SUPERVISOR = 'Executive Supervisor',
  LEGAL = 'Legal & Compliance',
  STRATEGIST = 'Advanced Strategist'
}

export enum AttackStatus {
  INFILTRATING = 'Infiltrating',
  DETECTED = 'Detected',
  MITIGATING = 'Mitigating',
  RESOLVED = 'Resolved',
  FAILED = 'Failed'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface AttackLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
}

export interface LawEnforcementContact {
  agency: string;
  jurisdiction: string;
  notificationDraft: string;
}

export interface CompromisedAsset {
  name: string;
  type: 'File' | 'Process' | 'Network Node' | 'Model Weight' | 'Actuator' | 'Prompt Buffer' | 'Theoretical Vector';
  impact: 'Read' | 'Modified' | 'Deleted' | 'Infiltrated' | 'Poisoned' | 'Override' | 'Speculative';
  status: 'Vulnerable' | 'Compromised' | 'Isolated' | 'Cleaned';
}

export interface TheoreticalDoctrine {
  corePrinciple: string;
  strategicRoadmap: string[];
  countermeasures: string[];
}

export interface Simulation {
  id: string;
  deviceType: DeviceType | string;
  attackName: string;
  startTime: Date;
  detectionTime?: Date;
  resolutionTime?: Date;
  status: AttackStatus;
  severity: Severity;
  reactionTaken: string;
  logs: AttackLog[];
  description: string;
  vulnerability: string;
  isCampaign?: boolean;
  forensicData?: string;
  executiveSummary?: string;
  leNotification?: LawEnforcementContact;
  compromisedAssets?: CompromisedAsset[];
  theoreticalDoctrine?: TheoreticalDoctrine;
}

export interface ArchivedSimulation extends Simulation {
  archivedAt: Date;
  encryptionStatus: 'AES-256-GCM' | 'Unencrypted';
  zeroTrustVerified: boolean;
}

export interface DeviceState {
  type: DeviceType;
  status: 'Healthy' | 'Under Attack' | 'Compromised';
  lastChecked: Date;
}

export interface AttackVector {
  name: string;
  description: string;
  category: string;
  isTrending: boolean;
  isEmerging: boolean;
  severity: Severity;
}

export interface MitigationStrategy {
  title: string;
  summary: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  confidence: number;
}
