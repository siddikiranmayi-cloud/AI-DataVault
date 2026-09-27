import React from 'react';
import { 
  X, 
  CheckSquare, 
  AlertTriangle, 
  ShieldCheck, 
  Ban, 
  Check, 
  Clock, 
  Database, 
  Radio, 
  FileText 
} from 'lucide-react';
import { ApprovalRequest } from '../types';
import { ProofOfEnforcementCard } from './ProofOfEnforcementCard';

interface ApprovalDetailModalProps {
  request: ApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBlockAgent: (agentId: string) => void;
}

export const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onBlockAgent
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090E18] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1220]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Human CISO Approval Required</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-amber-500/20 text-amber-300 border-amber-500/40">
                  {request.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ticket: {request.id} · Requested {request.requestedAt}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main Action Banner */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Proposed Autonomous Action
            </span>
            <p className="text-sm font-semibold text-white leading-snug">
              {request.requestedAction}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="text-slate-400">Initiating Agent:</span>
              <span className="font-semibold text-cyan-300">{request.agentName}</span>
            </div>
          </div>

          {/* Forensic Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-cyan-400" /> Data Involved
              </span>
              <span className="font-semibold text-white mt-1 block truncate">
                {request.dataInvolved}
              </span>
              {request.recordCount && (
                <span className="text-[10px] font-mono text-cyan-400 mt-0.5 block">
                  Volume: {request.recordCount.toLocaleString()} records
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-slate-400 block text-[11px]">Classification Level</span>
              <span className={`font-mono font-bold mt-1 block ${
                request.dataClassification === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {request.dataClassification}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-amber-400" /> Target Destination
              </span>
              <span className="font-mono text-amber-300 mt-1 block truncate">
                {request.destination}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322]">
              <span className="text-slate-400 block text-[11px]">Dynamic Risk Score</span>
              <span className="font-mono text-base font-bold text-amber-400 mt-1 block">
                {request.riskScore} / 100
              </span>
            </div>
          </div>

          {/* Business Justification */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-black/40 text-xs space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Stated Agent Objective:
            </span>
            <p className="text-slate-400 leading-relaxed">
              "{request.reason}"
            </p>
          </div>

          {/* Security Safeguard Notice */}
          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-950/10 text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Fail-Closed Enforcement:</span>
              This action will remain suspended until a cryptographic operator authorization is signed. If no action is taken, the session passport will expire and drop the request.
            </div>
          </div>

          {/* Proof of Enforcement Panel */}
          <ProofOfEnforcementCard
            actionId={request.actionRequest?.requestId || `ACT-2026-${request.id.replace('APPR-', '').replace('appr-', '')}`}
            policyVerdict="REVIEW"
            toolName={request.actionRequest?.tool || 'data.export'}
            toolExecutionState="SUSPENDED"
            dataReleaseState="NONE"
            networkState="NONE"
            incidentState="NONE"
            auditState="LOGGED"
            protectedResourceModification="NONE"
            title="Proof of Enforcement (Suspended Action)"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-t border-slate-800 bg-[#0B1220]">
          <button
            onClick={() => onBlockAgent(request.agentId)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/40 transition-colors flex items-center gap-1.5"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Block Agent Immediately</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject(request.id)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Reject Action
            </button>
            <button
              onClick={() => onApprove(request.id)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-900 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-950"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve (Scoped)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
