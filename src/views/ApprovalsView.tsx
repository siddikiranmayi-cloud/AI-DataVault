import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Check, 
  Ban, 
  X, 
  AlertTriangle, 
  Database, 
  Radio, 
  ShieldCheck, 
  Filter 
} from 'lucide-react';
import { ApprovalRequest } from '../types';

interface ApprovalsViewProps {
  approvals: ApprovalRequest[];
  onInspectApproval: (request: ApprovalRequest) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBlockAgent: (agentId: string) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  onInspectApproval,
  onApprove,
  onReject,
  onBlockAgent
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');

  const filteredApprovals = approvals.filter(req => {
    if (filter === 'PENDING') return req.status === 'PENDING';
    if (filter === 'RESOLVED') return req.status !== 'PENDING';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Human Approval Center (CISO Oversight)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero-Trust fail-closed queue. High-impact operations remain suspended until verified by a human operator.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {(['ALL', 'PENDING', 'RESOLVED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-[11px] font-mono transition-colors ${
                filter === s
                  ? 'bg-slate-800 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#0C1322] space-y-3">
            <CheckSquare className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Queue Clear</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no pending human authorizations currently waiting in the Zero-Trust queue.
            </p>
          </div>
        ) : (
          filteredApprovals.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-cyan-400 text-xs font-bold">{req.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs font-semibold text-white">{req.agentName}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-[11px] text-slate-400">{req.requestedAt}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ml-auto md:ml-0 ${
                    req.status === 'PENDING'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : req.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <p className="text-sm font-bold text-white">
                  {req.requestedAction}
                </p>

                <p className="text-xs text-slate-300 italic">
                  "{req.reason}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target: {req.dataInvolved}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>Destination: {req.destination}</span>
                  </span>
                  <span className="font-bold text-amber-400">
                    Risk Score: {req.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0">
                {req.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => onInspectApproval(req)}
                      className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Examine Details
                    </button>
                    <button
                      onClick={() => onReject(req.id)}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onApprove(req.id)}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-950"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onInspectApproval(req)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60"
                  >
                    View Audit Record
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
