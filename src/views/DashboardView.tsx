import React from 'react';
import { 
  Bot, 
  Database, 
  Activity, 
  ShieldAlert, 
  EyeOff, 
  Radio, 
  Ban, 
  CheckSquare, 
  TrendingUp, 
  AlertTriangle, 
  Play, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { 
  AIAgent, 
  DataVaultRecord, 
  AuditLog, 
  ApprovalRequest, 
  SecurityIncident, 
  ExternalDestination 
} from '../types';

interface DashboardViewProps {
  agents: AIAgent[];
  vaultRecords: DataVaultRecord[];
  auditLogs: AuditLog[];
  approvals: ApprovalRequest[];
  incidents: SecurityIncident[];
  destinations: ExternalDestination[];
  onNavigate: (tab: string) => void;
  onLaunchFullDemo: () => void;
  onInspectAgent: (agent: AIAgent) => void;
  onOpenBenchmark?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  agents,
  vaultRecords,
  auditLogs,
  approvals,
  incidents,
  destinations,
  onNavigate,
  onLaunchFullDemo,
  onInspectAgent,
  onOpenBenchmark
}) => {
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING').length;
  const blockedCount = auditLogs.filter(l => l.decision === 'BLOCK').length + 29; // aggregate
  const allowedCount = auditLogs.filter(l => l.decision === 'ALLOW').length + 1540;
  const reviewCount = auditLogs.filter(l => l.decision === 'HUMAN_APPROVAL').length + 42;

  // Hourly threat trend data (24h)
  const hourlyData = [
    { hour: '00:00', blocked: 2, allowed: 48 },
    { hour: '04:00', blocked: 1, allowed: 26 },
    { hour: '08:00', blocked: 6, allowed: 120 },
    { hour: '12:00', blocked: 14, allowed: 280 },
    { hour: '16:00', blocked: 18, allowed: 310 },
    { hour: '20:00', blocked: 9, allowed: 160 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-[#0B111E] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              Security Operations Center (SOC)
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ARMED & ENFORCING
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time Zero-Trust inspection of autonomous agent tool calls, network traffic, and memory access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenBenchmark && (
            <button
              onClick={onOpenBenchmark}
              className="px-3 py-2 text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Run automated 6-case Zero-Trust compliance suite"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero-Trust Benchmark</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('attack-simulator')}
            className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Threat</span>
          </button>

          <button
            onClick={onLaunchFullDemo}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-950"
          >
            <Play className="w-3 h-3 fill-slate-900" />
            <span>Run Full Demo</span>
          </button>
        </div>
      </div>

      {/* 8 Primary Security Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Card 1 */}
        <div 
          onClick={() => onNavigate('agents')}
          className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium truncate">Active Agents</span>
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {activeAgents} / {agents.length}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">100% scoped</span>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onNavigate('data-vault')}
          className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium truncate">Protected Data</span>
            <Database className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {vaultRecords.length} items
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Encrypted</span>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onNavigate('audit-logs')}
          className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium truncate">Actions Today</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {(allowedCount + blockedCount).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Live</span>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onNavigate('attack-simulator')}
          className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium truncate">Prompt Injections</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
              18
            </span>
            <span className="text-[10px] text-rose-400 font-mono">Defended</span>
          </div>
        </div>

        {/* Card 5 */}
        <div 
          onClick={() => onNavigate('data-vault')}
          className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium truncate">Sensitive Requests</span>
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
              142
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Minimized</span>
          </div>
        </div>

        {/* Card 6 */}
        <div 
          onClick={() => onNavigate('threat-monitor')}
          className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium truncate">Exfiltration Drops</span>
            <Radio className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
              43
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Zero Leaks</span>
          </div>
        </div>

        {/* Card 7 */}
        <div 
          onClick={() => onNavigate('audit-logs')}
          className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium truncate">Blocked Actions</span>
            <Ban className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
              {blockedCount}
            </span>
            <span className="text-[10px] text-rose-400 font-mono">Fail-Closed</span>
          </div>
        </div>

        {/* Card 8 */}
        <div 
          onClick={() => onNavigate('approvals')}
          className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-medium truncate">Pending Approvals</span>
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
              {pendingApprovals}
            </span>
            <span className="text-[10px] text-amber-400 font-mono">CISO Review</span>
          </div>
        </div>
      </div>

      {/* Main Visuals & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Threats Over Time & Actions Breakdown (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Threats Over Time (24h) */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Threats Intercepted Over Time (24h)</h3>
                <p className="text-[11px] text-slate-400">Blocked malicious actions vs authorized minimized traffic</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Allowed
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Blocked
                </span>
              </div>
            </div>

            {/* Custom SVG Data Visualization for 24h Telemetry */}
            <div className="h-44 w-full flex items-end gap-3 pt-4 px-2 border-b border-slate-800 pb-2">
              {hourlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full max-w-[36px] flex flex-col gap-0.5 items-center justify-end h-full">
                    {/* Blocked portion */}
                    <div 
                      style={{ height: `${Math.min(100, d.blocked * 4)}%` }}
                      className="w-full bg-rose-500/80 rounded-t group-hover:bg-rose-400 transition-all relative"
                      title={`${d.blocked} threats blocked at ${d.hour}`}
                    />
                    {/* Allowed portion */}
                    <div 
                      style={{ height: `${Math.min(100, (d.allowed / 350) * 100)}%` }}
                      className="w-full bg-emerald-500/30 border-t border-emerald-400/50 group-hover:bg-emerald-500/50 transition-all rounded-b"
                      title={`${d.allowed} operations allowed at ${d.hour}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors">
                    {d.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2 & 3: Verdict Breakdown & Risk Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Decision Breakdown */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Firewall Decision Distribution
              </h4>
              <div className="space-y-2.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-emerald-400">ALLOW (Safe / Minimized)</span>
                    <span className="text-white tabular-nums">96.8%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '96.8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-400">HUMAN APPROVAL (Suspended)</span>
                    <span className="text-white tabular-nums">1.4%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '1.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-rose-400">BLOCK (Zero-Trust Cut)</span>
                    <span className="text-white tabular-nums">1.8%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: '1.8%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Target Data by Classification */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Data Classification Activity
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'CRITICAL (Root Keys / PII)', count: '14 blocked', color: 'text-rose-400 bg-rose-950/40 border-rose-800/40' },
                  { label: 'HIGHLY CONFIDENTIAL (M&A / Health)', count: '28 intercepted', color: 'text-amber-300 bg-amber-950/40 border-amber-800/40' },
                  { label: 'CONFIDENTIAL (Customer DB)', count: '180 minimized', color: 'text-cyan-300 bg-cyan-950/40 border-cyan-800/40' },
                  { label: 'INTERNAL & PUBLIC', count: '1,420 authorized', color: 'text-slate-300 bg-slate-800/40 border-slate-700/40' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded border text-[11px] font-mono">
                    <span className="text-slate-300 truncate">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] ${item.color}`}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Agent Security Profiles & Pending Approvals */}
        <div className="space-y-6">
          {/* Active AI Agents List */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Monitored AI Agents</h3>
              <button
                onClick={() => onNavigate('agents')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>View all ({agents.length})</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {agents.slice(0, 5).map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => onInspectAgent(agent)}
                  className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${agent.avatarBg}`}>
                      {agent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors block truncate">
                        {agent.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Passport: {agent.passport.remainingMinutes}m remaining
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
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
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approval Highlight */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> High-Impact Action Awaiting CISO
              </span>
              <span className="text-[10px] font-mono text-amber-400">
                {pendingApprovals} Pending
              </span>
            </div>
            {approvals.length > 0 && (
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white">{approvals[0].agentName}</span>
                  <span className="text-amber-400 font-mono font-bold">Risk {approvals[0].riskScore}/100</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {approvals[0].requestedAction}
                </p>
                <button
                  onClick={() => onNavigate('approvals')}
                  className="w-full mt-1 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors text-center block cursor-pointer"
                >
                  Review in Approval Center
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Recent Security Events Feed */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Live Zero-Trust Interception Stream</h3>
            <p className="text-[11px] text-slate-400">Real-time decisions across all registered autonomous agents</p>
          </div>
          <button
            onClick={() => onNavigate('audit-logs')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Full Audit Trail</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 overflow-hidden bg-[#0A0F1D]">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/30 transition-colors text-xs">
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
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300">{log.action}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block sm:inline mt-0.5">
                    Target: {log.data} (via {log.tool})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="font-mono text-[11px] text-slate-400">
                  Risk: {log.riskScore}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
