import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ChevronRight, 
  FileText,
  ShieldX
} from 'lucide-react';
import { SecurityIncident } from '../types';

interface IncidentsViewProps {
  incidents: SecurityIncident[];
  onUpdateIncidentStatus: (id: string, status: 'OPEN' | 'INVESTIGATING' | 'BLOCKED' | 'RESOLVED') => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onUpdateIncidentStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Security Incident Center & Forensic Triage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated alerts triggered by prompt injections, canary traps, unauthorized tools, and exfiltration attempts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incidents, agents..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {['all', 'OPEN', 'INVESTIGATING', 'BLOCKED', 'RESOLVED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  statusFilter === s
                    ? 'bg-slate-800 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id}
            className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] hover:border-slate-700/80 transition-all space-y-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-cyan-400 text-xs font-bold">{inc.id}</span>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold ${
                  inc.severity === 'critical'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {inc.severity} Severity
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                  {inc.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">{inc.timestamp}</span>
                <select
                  value={inc.status}
                  onChange={(e) => onUpdateIncidentStatus(inc.id, e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-cyan-300 focus:outline-none"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white leading-snug">
                {inc.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {inc.technicalSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Agent Involved</span>
                <span className="font-semibold text-white mt-0.5 block truncate">{inc.agentName}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Attack Source</span>
                <span className="font-semibold text-amber-300 mt-0.5 block truncate">{inc.attackSource}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Actions Executed</span>
                <span className="font-semibold text-emerald-400 mt-0.5 block truncate">{inc.actionsTaken}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
