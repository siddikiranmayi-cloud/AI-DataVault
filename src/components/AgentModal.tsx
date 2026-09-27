import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  Clock, 
  Check, 
  Ban, 
  Layers, 
  Terminal, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { AIAgent } from '../types';

interface AgentModalProps {
  agent: AIAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onRenewPassport: (agentId: string) => void;
  onToggleQuarantine: (agentId: string) => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({
  agent,
  isOpen,
  onClose,
  onRenewPassport,
  onToggleQuarantine
}) => {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#090E18] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1220]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${agent.avatarBg}`}>
              {agent.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">{agent.name}</h2>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  agent.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : agent.status === 'quarantined'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {agent.role} · Owner: {agent.owner}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-[11px] text-slate-400 block">Risk Rating</span>
              <span className={`text-sm font-bold font-mono uppercase ${
                agent.riskLevel === 'critical' ? 'text-rose-400' : agent.riskLevel === 'high' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {agent.riskLevel}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-[11px] text-slate-400 block">Passport Expiry</span>
              <span className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {agent.passport.remainingMinutes}m left
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-[11px] text-slate-400 block">Blocked Actions</span>
              <span className="text-sm font-bold font-mono text-rose-400">
                {agent.blockedActionsCount}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-[11px] text-slate-400 block">Total Actions</span>
              <span className="text-sm font-bold font-mono text-slate-200">
                {agent.totalActionsCount}
              </span>
            </div>
          </div>

          {/* Permission Passport Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Temporary Permission Passport #{agent.passport.passportId}
                </h3>
              </div>
              <button
                onClick={() => onRenewPassport(agent.id)}
                className="px-2.5 py-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 rounded flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Renew 30m</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* READ Permissions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Granted READ Scopes
                </span>
                <div className="space-y-1">
                  {agent.passport.readPermissions.map((perm, idx) => (
                    <div key={idx} className="p-2 rounded bg-black/30 border border-slate-800/80 text-slate-300">
                      {perm}
                    </div>
                  ))}
                </div>
              </div>

              {/* WRITE Permissions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-blue-400 uppercase font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Granted WRITE Scopes
                </span>
                <div className="space-y-1">
                  {agent.passport.writePermissions.map((perm, idx) => (
                    <div key={idx} className="p-2 rounded bg-black/30 border border-slate-800/80 text-slate-300">
                      {perm}
                    </div>
                  ))}
                </div>
              </div>

              {/* Denied Sensitive Scopes */}
              <div className="space-y-1.5 md:col-span-2">
                <span className="text-[11px] font-mono text-rose-400 uppercase font-semibold flex items-center gap-1">
                  <Ban className="w-3.5 h-3.5" /> Denied Sensitive Scopes (Hard Policy)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.passport.deniedSensitiveScopes.map((scope, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[11px]">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Isolated Sandbox Security Boundary */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Isolated Execution Sandbox Boundary
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-slate-800">
                <span className="text-slate-400">Filesystem Sandbox</span>
                <span className="font-mono text-emerald-400 font-semibold">RESTRICTED CHROOT</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-slate-800">
                <span className="text-slate-400">Unrestricted Shell Access</span>
                <span className="font-mono text-rose-400 font-semibold">STRICTLY BLOCKED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-slate-800">
                <span className="text-slate-400">Ephemeral Token Lifecycle</span>
                <span className="font-mono text-emerald-400 font-semibold">ENFORCED (15m ROTATION)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-slate-800">
                <span className="text-slate-400">External Network Egress</span>
                <span className={`font-mono font-semibold ${agent.passport.externalNetworkAllowed ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {agent.passport.externalNetworkAllowed ? 'PROXY ONLY' : 'AIR-GAPPED'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0B1220]">
          <button
            onClick={() => onToggleQuarantine(agent.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              agent.status === 'quarantined'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{agent.status === 'quarantined' ? 'Lift Quarantine & Re-verify' : 'Immediate Agent Quarantine'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
