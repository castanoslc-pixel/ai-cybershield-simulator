
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceType, Severity, AttackStatus, CampaignType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAttackScenario = async (deviceType: DeviceType) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a realistic cyberattack scenario for a ${deviceType}. 
    - If it's an AI/LLM Deployment, focus on adversarial attacks, prompt injection, model theft, or training data poisoning.
    - If it's Autonomous Robotics or Automated Manufacturing, focus on PLC logic sabotage, sensor spoofing, actuator override, or safety limit bypass that could cause physical damage or production downtime.
    - If it's a Data Center or Strategic Facility, focus on high-impact infrastructure threats like hypervisor escapes or cooling system sabotage.
    Provide the attack name, a brief description, the primary vulnerability exploited, a severity level, and the standard automated reaction/mitigation steps taken by a security system.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          attackName: { type: Type.STRING },
          description: { type: Type.STRING },
          vulnerability: { type: Type.STRING },
          severity: { 
            type: Type.STRING, 
            enum: ['Low', 'Medium', 'High', 'Critical'] 
          },
          reactionTaken: { type: Type.STRING },
          timelineSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                offsetSeconds: { type: Type.NUMBER },
                event: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ['offsetSeconds', 'event', 'details']
            }
          }
        },
        required: ['attackName', 'description', 'vulnerability', 'severity', 'reactionTaken', 'timelineSteps']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateTheoreticalSimulation = async (deviceType: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `As a Lead Cyber Strategist, model a THEORETICAL FUTURE THREAT (5-10 years out) targeting ${deviceType}. 
    Focus on speculative technologies such as:
    - Post-quantum cryptographic failure.
    - Biometric-neural bypass.
    - AGI-led automated social engineering.
    - Nanobot/IoT swarm manipulation.
    
    Provide:
    1. Attack Name and a visionary description.
    2. Core theoretical vulnerability.
    3. A multi-step timeline of the speculative attack.
    4. A "Strategic Planning Doctrine" which includes:
       - A Core Principle for defense.
       - A Strategic Roadmap (3 steps).
       - Future Countermeasures that don't exist yet but are theorized.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          attackName: { type: Type.STRING },
          description: { type: Type.STRING },
          vulnerability: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Critical'] },
          timelineSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                event: { type: Type.STRING },
                details: { type: Type.STRING }
              }
            }
          },
          theoreticalDoctrine: {
            type: Type.OBJECT,
            properties: {
              corePrinciple: { type: Type.STRING },
              strategicRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
              countermeasures: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['corePrinciple', 'strategicRoadmap', 'countermeasures']
          }
        },
        required: ['attackName', 'description', 'vulnerability', 'severity', 'timelineSteps', 'theoreticalDoctrine']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateLawEnforcementDraft = async (simulation: any, jurisdiction: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a Senior Cybercrime Investigator. Draft a formal, high-priority notification for the relevant law enforcement agency in ${jurisdiction} regarding an active/recent criminal cyber threat.
    
    Incident Context:
    - Attack Type: ${simulation.attackName}
    - Severity: ${simulation.severity}
    - Target Asset: ${simulation.deviceType}
    - Start Time: ${simulation.startTime.toLocaleString()}
    - Entry Vector: ${simulation.vulnerability}
    - Business/Citizen Impact: ${simulation.description}
    
    Requirements for the draft:
    1. Identify and suggest the most appropriate specific agency for this jurisdiction (e.g., FBI Cyber Division for US, Action Fraud for UK, Europol EC3 for EU).
    2. Use a tone of high urgency, emphasizing the need for immediate action to protect citizens or critical infrastructure.
    3. Include a "Digital Evidence Summary" section pre-populated with the attack name and timestamps.
    4. Explicitly request an immediate investigation or forensic coordination.
    5. Format the draft as a professional law enforcement referral document.`,
  });
  return response.text;
};

export const fetchDetailedForensics = async (simulation: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a deep forensic analyst, provide a technical breakdown of the following incident: ${simulation.attackName} on ${simulation.deviceType}. 
    - If the target is AI, include model layer anomaly logs or prompt buffer traces.
    - If the target is Robotics/Manufacturing, include PLC register state changes, motor frequency anomalies, or safety interlock bypass logs.
    Include hypothetical packet header snippets, process injection traces, and registry or file system changes. 
    Format this for an administrator view with code snippets.`,
  });
  return response.text;
};

export const generateExecutiveSummary = async (simulation: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a high-level executive summary of the following cyber incident for leadership: 
    Incident: ${simulation.attackName}
    Device: ${simulation.deviceType}
    Severity: ${simulation.severity}
    Description: ${simulation.description}
    Vulnerability: ${simulation.vulnerability}
    
    Focus on business impact, risk level, and final outcome. Keep it under 200 words.`,
  });
  return response.text;
};

export const generateCampaignScenario = async (campaign: CampaignType) => {
  let context = "";
  if (campaign === CampaignType.VOLT_TYPHOON) {
    context = "Focus on Living-off-the-Land (LotL) techniques, targeting critical infrastructure like power or water grids, using stolen legitimate credentials, and maintaining stealthy persistence without traditional malware.";
  } else if (campaign === CampaignType.SOLAR_WIND) {
    context = "Focus on a sophisticated supply chain compromise where a trusted software update mechanism is subverted. Mention trojanized DLLs, signed binary manipulation, and high-value target selection through backdoors.";
  } else if (campaign === CampaignType.APT_GENERAL) {
    context = "Focus on a multi-stage Advanced Persistent Threat (APT) involving initial spearphishing, lateral movement across a network using Kerberoasting or pass-the-hash, and long-term data exfiltration of intellectual property.";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a specialized cybersecurity campaign simulation inspired by the ${campaign} threat profile. ${context} 
    Provide the attack name, a high-level description, the core vulnerability or entry point, CRITICAL severity, and the forensic reaction steps.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          attackName: { type: Type.STRING },
          description: { type: Type.STRING },
          vulnerability: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Critical'] },
          reactionTaken: { type: Type.STRING },
          timelineSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                offsetSeconds: { type: Type.NUMBER },
                event: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ['offsetSeconds', 'event', 'details']
            }
          }
        },
        required: ['attackName', 'description', 'vulnerability', 'severity', 'reactionTaken', 'timelineSteps']
      }
    }
  });

  return JSON.parse(response.text);
};

export const fetchMitigationStrategies = async (deviceType: string, attackName: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a senior AI security orchestrator, generate 3-4 specific technical mitigation strategies to neutralize a '${attackName}' attack affecting ${deviceType}. 
    - If the target is AI, suggest techniques like robust training, prompt filtering, or model versioning/canary deployments.
    - If the target is Robotics, suggest physical safety overrides, network micro-segmentation, or encrypted PLC updates.
    For each strategy, provide:
    1. A concise title.
    2. A non-technical summary that briefly explains its purpose and expected outcome for a general audience.
    3. A technical description of the implementation for security engineers.
    4. The expected security impact (High/Medium/Low).
    5. A confidence score (0-100%).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            description: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            confidence: { type: Type.NUMBER }
          },
          required: ['title', 'summary', 'description', 'impact', 'confidence']
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateCIRCIAReport = async (simulation: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Act as a Regulatory Compliance Officer. Draft a formal report for CISA following CIRCIA (Cyber Incident Reporting for Critical Infrastructure Act) guidelines based on this incident:
    - Attack: ${simulation.attackName}
    - Target: ${simulation.deviceType}
    - Severity: ${simulation.severity}
    - Logs: ${JSON.stringify(simulation.logs)}
    
    The report should include:
    1. Incident Description and timeline.
    2. Vulnerability exploited.
    3. Technical description of the exploit.
    4. Impact on functional systems.
    5. Information on the suspected actor (if applicable).
    
    Format the output as a professional document.`,
    config: {
      temperature: 0.1, // Keep it professional and factual
    }
  });
  return response.text;
};

export const fetchThreatIntel = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Act as a global threat intelligence feed. Provide 6 current or emerging cyberattack vectors seen globally this week. Include their name, a brief description, category, if they are 'trending' or 'emerging', and their associated severity. Ensure a mix of traditional (DDoS, Phishing) and modern (AI-driven social engineering, LLM jailbreaking, supply chain attacks) threats.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            isTrending: { type: Type.BOOLEAN },
            isEmerging: { type: Type.BOOLEAN },
            severity: { 
              type: Type.STRING, 
              enum: ['Low', 'Medium', 'High', 'Critical'] 
            }
          },
          required: ['name', 'description', 'category', 'isTrending', 'isEmerging', 'severity']
        }
      }
    }
  });

  return JSON.parse(response.text);
};
