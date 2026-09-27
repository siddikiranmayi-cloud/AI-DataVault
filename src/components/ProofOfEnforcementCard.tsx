import React from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Clock, 
  Terminal, 
  Share2, 
  Database, 
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ToolExecutionStatus, NetworkTransmissionStatus } from '../types';

export interface ProofOfEnforcementProps {
  actionId: string;
  policyVerdict: 'ALLOW' | 'REVIEW' | 'BLOCK';
  toolName: string;
  toolExecutionState: ToolExecutionStatus;
  dataReleaseState?: 'NONE' | 'RELEASED' | 'SANITIZED';
  networkState?: NetworkTransmissionStatus | 'NONE';
  incidentState?: 'CREATED' | 'NONE';
  auditState?: 'LOGGED' | 'NONE';
  protectedResourceModification?: 'NONE' | 'MODIFIED';
  title?: string;
  compact?: boolean;
}

export const ProofOfEnforcementCard: React.FC<ProofOfEnforcementProps> = ({
  actionId,
  policyVerdict,
  toolName,
  toolExecutionState,
  dataReleaseState = 'NONE',
  networkState = 'NONE',
  incidentState,
  auditState = 'LOGGED',
  protectedResourceModification = 'NONE',
  title = 'Proof of Enforcement',
  compact = false
}) => {
  // Infer defaults if not explicitly provided
  const resolvedIncidentState: 'CREATED' | 'NONE' = 
    incidentState !== undefined 
      ? incidentState 
      : policyVerdict === 'BLOCK' ? 'CREATED' : 'NONE';

  const resolvedNetworkState: 'NONE' | 'TRANSMITTED' = 
    networkState === 'NONE' || networkState === 'NOT_EXECUTED' || networkState === 'BLOCKED_AT_EGRESS' || policyVerdict !== 'ALLOW'
      ? 'NONE'
      : 'TRANSMITTED';

  // Tool status badge formatting
  const getToolBadge = () => {
    switch (toolExecutionState) {
      case 'NOT_EXECUTED':
        return {
          label: '❌ NOT EXECUTED',
          color: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
          dot: 'bg-rose-500'
        };
      case 'SUSPENDED':
        return {
          label: '⏸ SUSPENDED',
          color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
          dot: 'bg-amber-500'
        };
      case 'EXECUTED':
        return {
          label: '✓ EXECUTED',
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
          dot: 'bg-emerald-500'
        };
    }
  };

  const getVerdictBadge = () => {
    switch (policyVerdict) {
      case 'BLOCK':
        return {
          label: 'BLOCK',
          color: 'text-rose-400 bg-rose-950/40 border-rose-800/60'
        };
      case 'REVIEW':
        return {
          label: 'REVIEW',
          color: 'text-amber-400 bg-amber-950/40 border-amber-800/60'
        };
      case 'ALLOW':
        return {
          label: 'ALLOW',
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
        };
    }
  };

  const toolBadge = getToolBadge();
  const verdictBadge = getVerdictBadge();

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#070C16] p-4 sm:p-5 space-y-4 shadow-xl font-mono">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Cryptographically verifiable runtime tool dispatch & policy enforcement proof
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] text-slate-400">ACTION ID:</span>
          <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            {actionId}
          </span>
        </div>
      </div>

      {/* Required Proof Dimensions:
          ACTION ID
          POLICY VERDICT
          TOOL EXECUTION STATE
          DATA RELEASE STATE
          NETWORK STATE
          INCIDENT STATE
          AUDIT STATE
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-xs">
        {/* 1. POLICY */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            POLICY
          </span>
          <span className={`text-xs font-bold mt-1.5 block uppercase px-2 py-0.5 rounded border text-center ${verdictBadge.color}`}>
            {verdictBadge.label}
          </span>
        </div>

        {/* 2. TOOL */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            TOOL
          </span>
          <span className="text-xs font-bold text-slate-200 mt-1.5 block truncate text-center bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
            {toolName}
          </span>
        </div>

        {/* 3. TOOL EXECUTION */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            TOOL EXECUTION
          </span>
          <span className={`text-xs font-bold mt-1.5 block px-2 py-0.5 rounded border text-center ${toolBadge.color}`}>
            {toolBadge.label}
          </span>
        </div>

        {/* 4. DATA RELEASE */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            DATA RELEASE
          </span>
          <span className={`text-xs font-bold mt-1.5 block px-2 py-0.5 rounded border text-center ${
            dataReleaseState === 'NONE' 
              ? 'text-rose-400 bg-rose-950/30 border-rose-800/50' 
              : dataReleaseState === 'SANITIZED'
              ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50'
              : 'text-amber-400 bg-amber-950/30 border-amber-800/50'
          }`}>
            {dataReleaseState === 'NONE' ? '❌ NONE' : dataReleaseState === 'SANITIZED' ? '✓ SANITIZED' : '⚠ RELEASED'}
          </span>
        </div>

        {/* 5. NETWORK TRANSMISSION */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            NETWORK TRANSMISSION
          </span>
          <span className={`text-xs font-bold mt-1.5 block px-2 py-0.5 rounded border text-center ${
            resolvedNetworkState === 'NONE'
              ? 'text-rose-400 bg-rose-950/30 border-rose-800/50'
              : 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50'
          }`}>
            {resolvedNetworkState === 'NONE' ? '❌ NONE' : '✓ TRANSMITTED'}
          </span>
        </div>

        {/* 6. INCIDENT */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            INCIDENT
          </span>
          <span className={`text-xs font-bold mt-1.5 block px-2 py-0.5 rounded border text-center ${
            resolvedIncidentState === 'CREATED'
              ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50'
              : 'text-slate-400 bg-slate-900/40 border-slate-800'
          }`}>
            {resolvedIncidentState === 'CREATED' ? '✓ CREATED' : '— NONE'}
          </span>
        </div>

        {/* 7. AUDIT */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            AUDIT
          </span>
          <span className={`text-xs font-bold mt-1.5 block px-2 py-0.5 rounded border text-center ${
            auditState === 'LOGGED'
              ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/50'
              : 'text-slate-400 bg-slate-900/40 border-slate-800'
          }`}>
            {auditState === 'LOGGED' ? '✓ LOGGED' : '— NONE'}
          </span>
        </div>
      </div>

      {/* Secondary Execution Metadata (Protected Resource Modification & Dispatch Details) */}
      {!compact && (
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Protected Resource Modification:</span>
              <strong className={protectedResourceModification === 'NONE' ? 'text-emerald-400' : 'text-rose-400'}>
                {protectedResourceModification}
              </strong>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <span>Tool Dispatch Sandbox:</span>
              <strong className="text-slate-300">FAIL-CLOSED Isolated Runtime</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
            <span>External requests: </span>
            <span className="text-emerald-400 font-mono font-semibold">SIMULATED / LOCAL ONLY</span>
          </div>
        </div>
      )}
    </div>
  );
};
