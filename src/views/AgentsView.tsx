import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  KeyRound, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Check, 
  Ban, 
  RotateCw, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  Lock,
  Play
} from 'lucide-react';
import { AIAgent, ActionRequest } from '../types';
import { executeSecurityGateway } from '../lib/securityEngine';

interface AgentsViewProps {
  agents: AIAgent[];
  onInspectAgent: (agent: AIAgent) => void;
  onRenewPassport: (agentId: string) => void;
  onToggleQuarantine: (agentId: string) => void;
  onExpirePassport?: (agentId: string) => void;
  onEmitLog?: (log: any) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  onInspectAgent,
  onRenewPassport,
  onToggleQuarantine,
  onExpirePassport,
  onEmitLog
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [testedAgentId, setTestedAgentId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTestExpiredEnforcement = (agent: AIAgent) => {
    setTestedAgentId(agent.id);
    const testReq: ActionRequest = {
      requestId: `REQ-EXP-TEST-${Date.now()}`,
      agentId: agent.id,
      userId: 'security_auditor',
      action: 'READ_EMPLOYEE_DIRECTORY',
      resource: 'Employee Directory',
      dataClassification: 'INTERNAL',
      tool: 'file.read',
      destination: 'internal',
      authorization: true,
      instructionSource: 'user',
      provenance: 'trusted',
      requestedAt: new Date().toISOString()
    };

    const res = executeSecurityGateway(testReq, { agents });
    setTestResult(`Enforcement Verified: [${res.decision}] ${res.simpleExplanation}`);

    if (onEmitLog) {
      onEmitLog({
        id: res.auditEvidenceId,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        user: 'passport_auditor',
        agent: agent.name,
        action: 'Test Read On Passport Status',
        data: 'Employee Directory',
        tool: 'file.read',
        destination: 'internal',
        riskScore: res.riskBreakdown.totalScore,
        riskLevel: res.riskBreakdown.riskLevel,
        decision: res.decision,
        reason: res.simpleExplanation,
        technicalDetails: {
          dataSensitivity: 'INTERNAL',
          destinationTrust: 'INTERNAL',
          authorization: 'PASSPORT_AUDIT',
          actionImpact: 'LOW',
          provenance: 'Auditor Enclave',
          ruleId: res.matchedRules[0] || 'RULE-PASSPORT-AUDIT'
        }
      });
    }

    setTimeout(() => {
      setTestResult(null);
      setTestedAgentId(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            AI Agent Monitor & Temporary Passports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Short-lived permission passports, countdown expiration, and fail-closed isolation containers.
          </p>
        </div>

        {/* Quick Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agent, owner, role..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {['all', 'active', 'review', 'quarantined'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-slate-800 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Global Enforcement Alert Banner if test result is present */}
      {testResult && (
        <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-xs font-mono text-cyan-200 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{testResult}</span>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-slate-400 hover:text-white text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAgents.map((agent) => {
          const isExpired = agent.passport.status === 'expired' || agent.passport.remainingMinutes <= 0;

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group shadow-sm ${
                agent.status === 'quarantined'
                  ? 'border-rose-900/60 bg-[#140B10]'
                  : isExpired
                  ? 'border-amber-900/60 bg-[#14100B]'
                  : 'border-slate-800 bg-[#0C1322] hover:border-slate-700/80'
              }`}
            >
              {/* Top Card Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${agent.avatarBg}`}>
                      {agent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {agent.department} · {agent.owner}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border shrink-0 ${
                    agent.status === 'active' && !isExpired
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : agent.status === 'quarantined'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {agent.status === 'quarantined' ? 'QUARANTINED' : isExpired ? 'PASSPORT EXPIRED' : agent.status}
                  </span>
                </div>

                {/* Passport Timer & Risk Rating */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded-lg border ${
                    isExpired ? 'bg-amber-950/30 border-amber-800/40 text-amber-300' : 'bg-black/30 border-slate-800'
                  }`}>
                    <span className="text-[10px] text-slate-400 block">Passport Expiry</span>
                    <span className="font-mono font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {isExpired ? 'EXPIRED (0m)' : `${agent.passport.remainingMinutes}m left`}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-black/30 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Threat Rating</span>
                    <span className={`font-mono uppercase font-bold mt-0.5 block ${
                      agent.riskLevel === 'critical' ? 'text-rose-400' : agent.riskLevel === 'high' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {agent.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Granted Scopes Pill List */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Active Permissions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {agent.passport.readPermissions.slice(0, 2).map((perm, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-[10px] font-mono">
                        READ: {perm}
                      </span>
                    ))}
                    {agent.passport.writePermissions.slice(0, 1).map((perm, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-800/40 text-[10px] font-mono">
                        WRITE: {perm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prohibited Scopes */}
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-mono text-rose-400/80 uppercase">
                    Explicitly Denied:
                  </span>
                  <p className="text-[11px] text-slate-400 truncate">
                    {agent.passport.deniedSensitiveScopes.slice(0, 2).join(', ')}...
                  </p>
                </div>

                {/* Quick Simulation Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 text-[11px] font-mono">
                  {onExpirePassport && !isExpired && (
                    <button
                      onClick={() => onExpirePassport(agent.id)}
                      className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Force passport countdown to zero to test fail-closed gateway rejection"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Simulate Expiry</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleTestExpiredEnforcement(agent)}
                    disabled={testedAgentId === agent.id}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer ml-auto"
                    title="Send a sample ActionRequest through the Gateway to verify passport enforcement"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test Gateway Action</span>
                  </button>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-[#0B111D] border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] font-mono text-slate-400">
                  Blocked: <span className="text-rose-400 font-bold">{agent.blockedActionsCount}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRenewPassport(agent.id)}
                    title="Renew Temporary Passport (30 mins)"
                    className="px-2.5 py-1 text-xs font-mono text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Renew</span>
                  </button>

                  <button
                    onClick={() => onInspectAgent(agent)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
