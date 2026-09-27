import React, { useState } from 'react';
import { 
  Radio, 
  Globe, 
  ShieldAlert, 
  ShieldCheck, 
  Ban, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  Search, 
  Database,
  Lock,
  Bot
} from 'lucide-react';
import { ExternalDestination, AuditLog } from '../types';

interface ThreatMonitorViewProps {
  destinations: ExternalDestination[];
  auditLogs: AuditLog[];
}

export const ThreatMonitorView: React.FC<ThreatMonitorViewProps> = ({
  destinations,
  auditLogs
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const exfiltrationEvents = auditLogs.filter(
    log => log.technicalDetails.destinationTrust === 'UNTRUSTED' ||
           log.technicalDetails.destinationTrust === 'MALICIOUS' ||
           log.decision === 'BLOCK' && log.tool.includes('HTTP')
  );

  const filteredDestinations = destinations.filter(d => 
    d.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Data Exfiltration & Destination Security
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time packet inspection of AI agent outbound traffic, domain reputation auditing, and leak containment.
        </p>
      </div>

      {/* Exfiltration Scenario Visual Showcase (Prompt Requirement #13) */}
      <div className="rounded-2xl border border-rose-500/40 bg-rose-950/10 p-5 md:p-6 space-y-5 shadow-lg shadow-rose-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-900/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-300 tracking-wide uppercase">
                🚨 Data Exfiltration Containment Architecture
              </h2>
              <p className="text-[11px] text-slate-400">
                Zero-Trust intercepts outbound transfers before network sockets are established.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-800/40 self-start sm:self-auto">
            Zero-Trust Rule: Egress Inspection
          </span>
        </div>

        {/* Chain Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">1. Origin Data</span>
            <span className="font-semibold text-white block truncate">Q3 Financial Earnings</span>
            <span className="text-[10px] text-amber-400 block">HIGHLY CONFIDENTIAL</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">2. Compromised Agent</span>
            <span className="font-semibold text-white block truncate">Research Agent</span>
            <span className="text-[10px] text-rose-400 block">Prompt Injected</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1322] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">3. Tool Invocation</span>
            <span className="font-semibold text-cyan-300 block truncate">HTTP POST Request</span>
            <span className="text-[10px] text-cyan-400 block">REST Client Tool</span>
          </div>

          <div className="p-3 rounded-xl border border-rose-800/40 bg-rose-950/30 space-y-1">
            <span className="text-[10px] text-rose-400 uppercase block">4. Target Host</span>
            <span className="font-mono text-rose-300 font-bold block truncate">pastebin-drop.site</span>
            <span className="text-[10px] text-rose-400 block">MALICIOUS ENDPOINT</span>
          </div>

          <div className="p-3 rounded-xl border border-rose-500/60 bg-rose-950/40 space-y-1 text-center flex flex-col justify-center">
            <span className="text-[10px] text-rose-400 uppercase block font-bold">5. Zero-Trust Decision</span>
            <span className="text-sm font-bold text-rose-400 font-mono tracking-wider block">BLOCK</span>
            <span className="text-[10px] text-slate-300 block">Risk: 99/100 · Disconnected</span>
          </div>
        </div>
      </div>

      {/* Destination Security Reputation Registry (Prompt Requirement #14) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              External Destination Security Registry ({destinations.length} Monitored Hosts)
            </h2>
            <p className="text-[11px] text-slate-400">
              Domains evaluated by internal trust scores, VPC enclave status, and historical exfiltration attempts.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domains..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-48 sm:w-56"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0C1322] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0A0F1D] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Domain Endpoint</th>
                  <th className="py-3 px-4">Trust Level</th>
                  <th className="py-3 px-4">Network Scope</th>
                  <th className="py-3 px-4">Reputation</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4 text-right">Blocked Traffic</th>
                  <th className="py-3 px-4 text-right">Allowed Traffic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredDestinations.map((dest, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {dest.domain}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${
                        dest.trustLevel === 'TRUSTED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : dest.trustLevel === 'CONDITIONAL'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : dest.trustLevel === 'UNTRUSTED'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {dest.trustLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {dest.type}
                    </td>
                    <td className="py-3 px-4">
                      {dest.reputation}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={dest.riskScore > 70 ? 'text-rose-400' : dest.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                        {dest.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400 tabular-nums">
                      {dest.requestsBlocked}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 tabular-nums">
                      {dest.requestsAllowed.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Exfiltration Interceptions Log */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Recent Exfiltration Interceptions ({exfiltrationEvents.length})
        </h2>

        <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 bg-[#0C1322] overflow-hidden">
          {exfiltrationEvents.map((event) => (
            <div key={event.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-800/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">{event.timestamp}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                    BLOCKED
                  </span>
                  <span className="font-semibold text-white">{event.agent}</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px]">
                  Target: {event.data} → {event.destination} ({event.tool})
                </p>
                <p className="text-slate-400 text-[11px]">
                  {event.reason}
                </p>
              </div>

              <div className="self-end sm:self-center font-mono text-xs text-rose-400 font-bold shrink-0">
                Risk Score: {event.riskScore}/100
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
