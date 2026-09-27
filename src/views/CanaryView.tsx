import React, { useState } from 'react';
import { 
  Bug, 
  ShieldAlert, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  Plus, 
  Terminal, 
  Database, 
  Zap 
} from 'lucide-react';
import { CanaryHoneyToken } from '../types';

interface CanaryViewProps {
  canaries: CanaryHoneyToken[];
  onTriggerCanary: (canaryId: string) => void;
}

export const CanaryView: React.FC<CanaryViewProps> = ({
  canaries,
  onTriggerCanary
}) => {
  const [lastTriggeredCanary, setLastTriggeredCanary] = useState<CanaryHoneyToken | null>(null);

  const handleSimulateTripwire = (canary: CanaryHoneyToken) => {
    onTriggerCanary(canary.id);
    setLastTriggeredCanary(canary);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Canary Honey Data & Tripwire Traps
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Synthetic decoy records and fake credentials seeded into databases to detect compromised agents and exfiltration attempts immediately.
        </p>
      </div>

      {/* Concept Notice */}
      <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10 text-xs text-cyan-200/90 leading-relaxed space-y-1">
        <span className="font-semibold text-cyan-300 block">
          Notice: Synthetic Security Tripwires Only
        </span>
        <p>
          These honeytokens are synthetic decoy strings (e.g. <code className="text-cyan-300 font-mono">CANARY_SECRET_84721</code>). They contain no real credentials or production keys. If any AI agent reads or broadcasts a canary token, the firewall instantly flags an uncontained compromise, quarantines the agent, and raises a critical SIEM incident.
        </p>
      </div>

      {/* Active Trigger Alert Banner (Prompt Requirement #18) */}
      {lastTriggeredCanary && (
        <div className="p-5 rounded-2xl border border-rose-500/50 bg-rose-950/20 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-300 font-mono tracking-wider">
                🚨 CANARY TRIPWIRE TRIGGERED
              </h2>
              <p className="text-[11px] text-slate-300">
                A synthetic honeytoken was referenced during an autonomous agent instruction cycle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Canary Token</span>
              <span className="font-bold text-white block mt-0.5">{lastTriggeredCanary.tokenName}</span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Compromised Agent</span>
              <span className="font-bold text-amber-300 block mt-0.5">Finance Agent</span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Attack Source</span>
              <span className="font-bold text-rose-300 block mt-0.5">External Instruction</span>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Firewall Action</span>
              <span className="font-bold text-rose-400 block mt-0.5">BLOCKED & QUARANTINED</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/30 border border-rose-900/40 text-xs text-rose-300/90 leading-relaxed font-mono">
            Incident INC-2026-080 generated automatically. Agent session terminated at firewall boundary.
          </div>
        </div>
      )}

      {/* Honeytokens List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Active Deployed Honeytokens ({canaries.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {canaries.map((canary) => (
            <div
              key={canary.id}
              className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      {canary.id} · {canary.category}
                    </span>
                    <h3 className="text-sm font-bold text-white font-mono mt-0.5">
                      {canary.tokenName}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    canary.status === 'TRIGGERED'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {canary.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                  Value: {canary.canaryValue}
                </div>

                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Deployment Location: </span>
                  {canary.placement}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Tripped: <span className="text-white font-bold">{canary.triggeredCount} times</span>
                </span>

                <button
                  onClick={() => handleSimulateTripwire(canary)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-950 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Simulate Agent Tripwire</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
