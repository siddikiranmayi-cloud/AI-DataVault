import React, { useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Ban, 
  Layers, 
  Terminal, 
  KeyRound, 
  Lock, 
  Bot, 
  User, 
  Database,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Fingerprint
} from 'lucide-react';
import { ActionRequest, GatewayExecutionResult } from '../types';
import { executeSecurityGateway } from '../lib/securityEngine';

export const MultiAgentView: React.FC = () => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [delegationResult, setDelegationResult] = useState<GatewayExecutionResult | null>(null);

  const handleSimulateDelegationEscalation = () => {
    setSimulationRunning(true);
    setDelegationResult(null);

    const delegationReq: ActionRequest = {
      requestId: `REQ-MULTI-${Date.now()}`,
      agentId: 'agent-dev',
      userId: 'user-cynthia-hr',
      action: 'ALTER_PRODUCTION_SCHEMA_AND_DUMP',
      resource: 'Production PostgreSQL Relational Schema',
      dataClassification: 'CRITICAL',
      tool: 'system.shell',
      destination: 'internal.db-cluster',
      authorization: false,
      instructionSource: 'delegated',
      provenance: 'untrusted',
      requestedAt: new Date().toISOString(),
      delegationChain: {
        originUserId: 'user-cynthia-hr',
        parentAgentId: 'agent-hr',
        childAgentId: 'agent-dev',
        parentAllowedScopes: ['Employee Directory', 'Leave Calendar'],
        requestedScope: 'Production Relational Schema'
      }
    };

    setTimeout(() => {
      const result = executeSecurityGateway(delegationReq);
      setDelegationResult(result);
      setSimulationRunning(false);
    }, 450);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Multi-Agent Authority Chains & Sandbox Isolation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Zero-Trust prevents privilege escalation across chained agents. Permissions are non-inheritable and fail-closed.
        </p>
      </div>

      {/* Authority Chain Escalation Visualizer (Prompt Requirement #20) */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 md:p-6 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Non-Inheritable Delegation Chain Analyzer
              </h2>
              <p className="text-[11px] text-slate-400">
                Detects multi-agent authority abuse when Agent A asks Agent B to perform out-of-scope actions.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSimulateDelegationEscalation}
            disabled={simulationRunning}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all flex items-center gap-1.5 shadow-sm shadow-amber-950 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{simulationRunning ? 'Evaluating Chain...' : 'Simulate Chained Escalation'}</span>
          </button>
        </div>

        {/* Chain Diagram */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
            {/* Node 1: User */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <User className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold">1. Origin User</span>
              </div>
              <span className="font-semibold text-white block">Cynthia (People Ops)</span>
              <span className="text-[10px] text-emerald-400 block">Grants: READ Directory</span>
            </div>

            {/* Node 2: Agent A */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Bot className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold">2. Agent A (Primary)</span>
              </div>
              <span className="font-semibold text-white block">HR Assistant</span>
              <span className="text-[10px] text-slate-300 block">Scope: Scoped directory only</span>
            </div>

            {/* Node 3: Delegation Request */}
            <div className="p-3.5 rounded-xl border border-amber-800/40 bg-amber-950/20 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400">
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold">3. Sub-Task Delegated</span>
              </div>
              <span className="font-semibold text-amber-300 block">Asks Developer Agent</span>
              <span className="text-[10px] text-amber-400 block">Request: Dump Prod Schema</span>
            </div>

            {/* Node 4: Policy Interceptor */}
            <div className={`p-3.5 rounded-xl border space-y-1 ${
              delegationResult ? 'border-rose-500/80 bg-rose-950/40 animate-pulse' : 'border-rose-500/40 bg-rose-950/20'
            }`}>
              <div className="flex items-center gap-1.5 text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold">4. Authority Check</span>
              </div>
              <span className="font-semibold text-rose-300 block">NON-INHERITABLE FIREWALL</span>
              <span className="text-[10px] text-rose-400 block font-bold">
                {delegationResult ? '🚨 BLOCKED BY GATEWAY' : '🚨 AUTHORITY ESCALATION'}
              </span>
            </div>

            {/* Node 5: Database */}
            <div className="p-3.5 rounded-xl border border-emerald-800/40 bg-emerald-950/20 space-y-1 flex flex-col justify-center text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                <Database className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold">5. Target Store</span>
              </div>
              <span className="font-semibold text-white block">Production Schema</span>
              <span className="text-[10px] text-emerald-300 block font-bold">PROTECTED (0 Access)</span>
            </div>
          </div>

          {/* Interactive Simulation Evidence Box */}
          {delegationResult && (
            <div className="p-4 rounded-xl border border-rose-500/40 bg-black/50 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-rose-400 font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Verdict: {delegationResult.decision}
                </span>
                <span className="text-slate-400">Rule: {delegationResult.matchedRules.join(', ')}</span>
              </div>

              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                {delegationResult.simpleExplanation}
              </p>

              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div><strong className="text-slate-200">Originating Scopes:</strong> ['Employee Directory', 'Leave Calendar']</div>
                <div><strong className="text-slate-200">Attempted Transitive Scope:</strong> 'Production Relational Schema' (Lacks parent grant)</div>
                <div className="text-cyan-400"><strong className="text-slate-200">Receipt ID:</strong> {delegationResult.cryptographicReceipt}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Pillars of Multi-Agent Containment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Cryptographic Delegation Signatures</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every delegation from Agent A to Agent B requires an explicit user authorization token with reduced permissions. Sub-agents can never possess more rights than their callers.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Fail-Closed Sub-Process Isolation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sub-agent sandboxes cannot share network sockets, environmental secrets, or filesystem handles with their parents. Cross-process IPC is mediated strictly by the AI DataVault gateway.
          </p>
        </div>
      </div>
    </div>
  );
};
