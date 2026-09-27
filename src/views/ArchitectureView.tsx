import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Lock, 
  EyeOff, 
  AlertOctagon, 
  Users, 
  Dna, 
  Wrench, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const principles = [
    {
      number: '01',
      title: 'Zero Trust Baseline',
      icon: ShieldCheck,
      principle: 'Never Trust, Always Verify',
      desc: 'AI agents operate with zero default trust. Every single request, tool invocation, and network egress packet is intercepted and evaluated against strict security policies.'
    },
    {
      number: '02',
      title: 'Least Privilege',
      icon: Lock,
      principle: 'Minimal Access by Default',
      desc: 'Agents receive only the exact permissions needed for their immediate task. Customer Support can read support tickets, but cannot touch salary, banking, or medical scopes.'
    },
    {
      number: '03',
      title: 'Data Minimization',
      icon: EyeOff,
      principle: 'Attribute-Level Redaction',
      desc: 'AI models never receive entire database rows. The firewall dynamically redacts PANs, SSNs, phone numbers, and credentials before handing payloads to the model.'
    },
    {
      number: '04',
      title: 'Defense in Depth',
      icon: Layers,
      principle: 'Multi-Layered Containment',
      desc: 'If prompt injection bypasses input filtering, data classification blocks the read; if data is read, egress firewall blocks the transmission; if transmission starts, honeytoken traps trigger quarantine.'
    },
    {
      number: '05',
      title: 'Fail Closed',
      icon: AlertOctagon,
      principle: 'Safety Over Execution',
      desc: 'When an evaluation fails, times out, or detects an anomalous token, the firewall fails closed: the transaction is dropped immediately and the agent session is quarantined.'
    },
    {
      number: '06',
      title: 'Human Oversight',
      icon: Users,
      principle: 'Human-in-the-Loop for Impact',
      desc: 'High-impact autonomous actions (bulk customer exports, wire drafts, schema changes) cannot be executed by AI alone; they require cryptographic sign-off from a human operator.'
    },
    {
      number: '07',
      title: 'Data Provenance (DNA)',
      icon: Dna,
      principle: 'Cryptographic Attribution',
      desc: 'Every sensitive object carries a watermark and origin metadata declaring allowed agents, allowed enclaves, and an irrevocable prohibition on AI training.'
    },
    {
      number: '08',
      title: 'Tool Authorization',
      icon: Wrench,
      principle: 'Execution Perimeter',
      desc: 'System calls, database write queries, and network sockets are governed by discrete tool firewalls. High-risk tools like Delete File are blocked by default.'
    },
    {
      number: '09',
      title: 'Continuous Monitoring',
      icon: Activity,
      principle: 'Real-Time Telemetry',
      desc: 'Dynamic risk scoring evaluates agent velocity, unusual memory queries, and destination reputation, feeding live events into the enterprise SIEM.'
    },
    {
      number: '10',
      title: 'Short-Lived Permissions',
      icon: Clock,
      principle: '30-Minute Ephemeral Passports',
      desc: 'No long-lived API keys. Agents receive temporary permission passports with strict expiration countdowns to eliminate persistent credential compromise.'
    }
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          The 10 Zero-Trust Principles for AI Agents
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          A defense-in-depth architectural standard designed to control what autonomous AI can access, understand, and do.
        </p>
      </div>

      {/* Philosophy Banner */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-[#0C1425] space-y-3 shadow-md">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
          Core Security Tenet
        </span>
        <h2 className="text-lg font-bold text-white">
          "Assume the agent can fail. Contain the failure."
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          We do not claim that software can make autonomous AI "100% safe" from adversarial manipulation. Instead, AI DataVault treats the AI agent as an untrusted client in a Zero-Trust architecture. Even if an agent is fully compromised by prompt injection, hard deterministic policy boundaries prevent it from leaking data, deleting files, or escalating privileges.
        </p>
      </div>

      {/* Critical Deterministic Policy Requirement (Prompt #28) */}
      <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
            Mandatory Security Requirement: Deterministic Logic Over LLM Autonomy
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          The AI model must <span className="font-bold text-white">NEVER</span> directly control database permissions, security policies, administrator privileges, or final data-export authorization.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-emerald-300 space-y-1">
            <span className="font-bold block text-emerald-400">✓ AI DataVault Workflow:</span>
            <p className="text-[11px] text-slate-300 font-sans">
              AI proposes → Security engine evaluates → Deterministic policy decides → System executes.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-rose-900/40 text-rose-300 space-y-1">
            <span className="font-bold block text-rose-400">✗ Prohibited Pattern:</span>
            <p className="text-[11px] text-slate-300 font-sans">
              AI decides → System executes (Creates direct vulnerability to jailbreaks).
            </p>
          </div>
        </div>
      </div>

      {/* 10 Principles Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          The 10 Architectural Pillars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">{item.principle}</span>
                    </div>
                  </div>
                  <span className="text-lg font-mono font-bold text-slate-400">
                    {item.number}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
