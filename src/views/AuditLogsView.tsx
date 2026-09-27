import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Ban, 
  Clock, 
  Database,
  Radio,
  Check
} from 'lucide-react';
import { AuditLog, SecurityDecision } from '../types';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDecision = decisionFilter === 'all' || log.decision === decisionFilter;
    return matchesSearch && matchesDecision;
  });

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aidatavault_audit_logs_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Real-Time Security Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all autonomous agent operations, policy decisions, and DLP inspection forensics.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs, agents, tools..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {['all', 'ALLOW', 'HUMAN_APPROVAL', 'BLOCK'].map((d) => (
              <button
                key={d}
                onClick={() => setDecisionFilter(d)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  decisionFilter === d
                    ? 'bg-slate-800 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d === 'all' ? 'ALL' : d}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0C1322] overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-800/80">
          {filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div key={log.id} className="transition-colors hover:bg-slate-800/20">
                <div 
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="font-mono text-slate-400 text-[11px] shrink-0 pt-0.5 sm:pt-0">
                      {log.timestamp}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 border ${
                      log.decision === 'BLOCK'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : log.decision === 'HUMAN_APPROVAL'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {log.decision}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{log.agent}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-300 font-medium">{log.action}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                        <span>Target: <span className="text-slate-300">{log.data}</span></span>
                        <span>·</span>
                        <span>Tool: <span className="text-cyan-400 font-mono">{log.tool}</span></span>
                        <span>·</span>
                        <span>Dest: <span className="text-amber-400 font-mono">{log.destination}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="font-mono text-xs text-slate-300">
                      Risk: <span className={log.riskScore > 75 ? 'text-rose-400 font-bold' : log.riskScore > 40 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{log.riskScore}/100</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Forensics View */}
                {isExpanded && (
                  <div className="p-4 bg-[#090F1C] border-t border-slate-800 text-xs font-mono space-y-3">
                    <div className="space-y-1">
                      <span className="text-slate-400 uppercase text-[10px] block font-semibold">Firewall Explanation:</span>
                      <p className="text-slate-200 font-sans text-xs leading-relaxed">{log.reason}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                      <div className="p-2 rounded bg-black/30 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Data Sensitivity</span>
                        <span className="text-white font-semibold">{log.technicalDetails.dataSensitivity}</span>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Destination Trust</span>
                        <span className="text-white font-semibold">{log.technicalDetails.destinationTrust}</span>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Authorization</span>
                        <span className="text-white font-semibold">{log.technicalDetails.authorization}</span>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Rule ID</span>
                        <span className="text-cyan-400 font-semibold">{log.technicalDetails.ruleId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
