/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FullDemoModal } from './components/FullDemoModal';
import { AgentModal } from './components/AgentModal';
import { DataVaultDetailModal } from './components/DataVaultDetailModal';
import { ApprovalDetailModal } from './components/ApprovalDetailModal';
import { BenchmarkModal } from './components/BenchmarkModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { AgentsView } from './views/AgentsView';
import { DataVaultView } from './views/DataVaultView';
import { ToolFirewallView } from './views/ToolFirewallView';
import { ThreatMonitorView } from './views/ThreatMonitorView';
import { AttackSimulatorView } from './views/AttackSimulatorView';
import { ApprovalsView } from './views/ApprovalsView';
import { IncidentsView } from './views/IncidentsView';
import { CanaryView } from './views/CanaryView';
import { MultiAgentView } from './views/MultiAgentView';
import { AuditLogsView } from './views/AuditLogsView';
import { PrivacyView } from './views/PrivacyView';
import { ArchitectureView } from './views/ArchitectureView';

// Initial Mock Data
import {
  INITIAL_AGENTS,
  INITIAL_DATA_VAULT,
  INITIAL_TOOLS,
  INITIAL_AUDIT_LOGS,
  INITIAL_APPROVALS,
  INITIAL_INCIDENTS,
  INITIAL_DESTINATIONS,
  INITIAL_CANARIES
} from './lib/mockData';
import { AIAgent, DataVaultRecord, ApprovalRequest, SecurityIncident, AuditLog, ActionRequest } from './types';
import { executeSecurityGateway } from './lib/securityEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App-wide mutable states
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [vaultRecords, setVaultRecords] = useState<DataVaultRecord[]>(INITIAL_DATA_VAULT);
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [canaries, setCanaries] = useState(INITIAL_CANARIES);

  // Modals state
  const [isFullDemoOpen, setIsFullDemoOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [inspectedAgent, setInspectedAgent] = useState<AIAgent | null>(null);
  const [inspectedRecord, setInspectedRecord] = useState<DataVaultRecord | null>(null);
  const [inspectedApproval, setInspectedApproval] = useState<ApprovalRequest | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetDemoData = () => {
    setAgents(INITIAL_AGENTS);
    setVaultRecords(INITIAL_DATA_VAULT);
    setTools(INITIAL_TOOLS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setApprovals(INITIAL_APPROVALS);
    setIncidents(INITIAL_INCIDENTS);
    setDestinations(INITIAL_DESTINATIONS);
    setCanaries(INITIAL_CANARIES);
    showToast('Reset to default Zero-Trust demo dataset.');
  };

  const handleEmitLog = (newLog: AuditLog) => {
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Agent Passport Renewal
  const handleRenewPassport = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          passport: {
            ...a.passport,
            remainingMinutes: 30,
            status: 'valid' as const
          }
        };
      }
      return a;
    }));
    showToast(`Temporary permission passport for ${agentId} renewed for 30 minutes.`);
  };

  // Simulate Passport Expiration
  const handleExpirePassport = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          passport: {
            ...a.passport,
            remainingMinutes: 0,
            status: 'expired' as const
          }
        };
      }
      return a;
    }));
    const ag = agents.find(a => a.id === agentId);
    showToast(`Simulated: Passport for ${ag?.name || agentId} marked EXPIRED (0m left).`);
  };

  // Agent Quarantine Toggle
  const handleToggleQuarantine = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const nextStatus = a.status === 'quarantined' ? 'active' : 'quarantined';
        return {
          ...a,
          status: nextStatus as any,
          riskLevel: nextStatus === 'quarantined' ? 'critical' : 'low' as any,
          passport: {
            ...a.passport,
            status: nextStatus === 'quarantined' ? 'revoked' : 'valid' as any
          }
        };
      }
      return a;
    }));

    const agent = agents.find(a => a.id === agentId);
    showToast(
      agent?.status === 'quarantined' 
        ? `${agent?.name} quarantine lifted. Session re-verified.`
        : `🚨 ${agent?.name} quarantined immediately. Outbound connection severed.`
    );
  };

  // Human Approval Handlers with One-Time Execution Token
  const handleApprove = (id: string) => {
    const req = approvals.find(r => r.id === id);
    if (!req) return;

    const oneTimeToken = `CISO-GRANT-${Date.now().toString(16).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build real ActionRequest evaluated by Security Gateway with the one-time token
    const actionReq: ActionRequest = {
      requestId: `REQ-APP-${req.id}-${Date.now()}`,
      agentId: req.agentId,
      userId: 'ciso_operator',
      action: req.requestedAction,
      resource: req.dataInvolved,
      dataClassification: req.dataClassification,
      tool: 'data.export',
      destination: req.destination,
      authorization: true,
      oneTimeApprovalToken: oneTimeToken,
      instructionSource: 'user',
      provenance: 'trusted',
      requestedAt: new Date().toISOString()
    };

    const gatewayResult = executeSecurityGateway(actionReq, {
      agents,
      vaultRecords,
      knownDestinations: destinations
    });

    setApprovals(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', oneTimeToken } : r));

    handleEmitLog({
      id: gatewayResult.auditEvidenceId,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      user: 'ciso_operator',
      agent: req.agentName,
      action: `Human Authorized: ${req.requestedAction}`,
      data: req.dataInvolved,
      tool: 'Human Approval Grant (One-Time)',
      destination: req.destination,
      riskScore: gatewayResult.riskBreakdown.totalScore,
      riskLevel: 'medium',
      decision: 'ALLOW',
      reason: `Authorized by Human CISO under supervised compliance exception. Executed with one-time token ${oneTimeToken}.`,
      technicalDetails: {
        dataSensitivity: req.dataClassification,
        destinationTrust: 'VERIFIED_PARTNER',
        authorization: oneTimeToken,
        actionImpact: req.actionImpact,
        provenance: 'Approval Center',
        ruleId: 'RULE-ONE-TIME-CISO-OVERRIDE',
        evidenceId: gatewayResult.auditEvidenceId
      }
    });

    setInspectedApproval(null);
    showToast(`Action approved with one-time token ${oneTimeToken} and executed successfully.`);
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'REJECTED' };
      }
      return req;
    }));

    const req = approvals.find(r => r.id === id);
    if (req) {
      handleEmitLog({
        id: `APPROVAL-REJECT-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        user: 'ciso_operator',
        agent: req.agentName,
        action: `Human Denied: ${req.requestedAction}`,
        data: req.dataInvolved,
        tool: 'Human Approval Deny',
        destination: req.destination,
        riskScore: req.riskScore,
        riskLevel: 'high',
        decision: 'BLOCK',
        reason: 'Rejected by Human CISO. Action dropped and target record protected.',
        technicalDetails: {
          dataSensitivity: req.dataClassification,
          destinationTrust: 'UNTRUSTED',
          authorization: 'DENIED_BY_OPERATOR',
          actionImpact: req.actionImpact,
          provenance: 'Approval Center',
          ruleId: 'RULE-HUMAN-DENY-01'
        }
      });
    }

    setInspectedApproval(null);
    showToast('Action rejected. Zero data transferred.');
  };

  const handleBlockAgentFromApproval = (agentId: string) => {
    handleToggleQuarantine(agentId);
    setApprovals(prev => prev.map(req => {
      if (req.agentId === agentId && req.status === 'PENDING') {
        return { ...req, status: 'AGENT_BLOCKED' };
      }
      return req;
    }));
    setInspectedApproval(null);
  };

  // Canary Trigger simulation
  const handleTriggerCanary = (canaryId: string) => {
    const targetCanary = canaries.find(c => c.id === canaryId);
    if (!targetCanary) return;

    setCanaries(prev => prev.map(c => {
      if (c.id === canaryId) {
        return {
          ...c,
          status: 'TRIGGERED',
          triggeredCount: c.triggeredCount + 1,
          lastTriggered: 'Just now',
          triggeredByAgent: 'Finance Agent'
        };
      }
      return c;
    }));

    // Add incident
    const newIncident: SecurityIncident = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'critical',
      agentId: 'agent-finance',
      agentName: 'Finance Agent',
      title: `Canary Tripwire Triggered: ${targetCanary.tokenName}`,
      attackSource: 'Synthetic memory inspection query',
      category: 'Canary Trigger',
      dataInvolved: `Honeytoken (${targetCanary.tokenName})`,
      actionsTaken: 'Agent session quarantined immediately. Outbound connection severed at egress firewall.',
      status: 'OPEN',
      timestamp: 'Just now',
      technicalSummary: `Agent evaluated prompt requesting value for ${targetCanary.tokenName}. AI DataVault tripped tripwire before execution completed.`
    };

    setIncidents(prev => [newIncident, ...prev]);

    handleEmitLog({
      id: `CANARY-LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      user: 'canary_detector',
      agent: 'Finance Agent',
      action: `Referenced Honeytoken: ${targetCanary.tokenName}`,
      data: targetCanary.tokenName,
      tool: 'Database Query',
      destination: 'internal.corp',
      riskScore: 100,
      riskLevel: 'critical',
      decision: 'BLOCK',
      reason: `CANARY TRIGGERED: Synthetic honeytoken referenced. Security incident generated automatically.`,
      technicalDetails: {
        dataSensitivity: 'CRITICAL (HONEYPOT)',
        destinationTrust: 'UNTRUSTED',
        authorization: 'REVOKED',
        actionImpact: 'CRITICAL',
        provenance: 'Canary Tripwire Trap',
        ruleId: 'RULE-CANARY-TRIPWIRE-01'
      }
    });

    showToast(`🚨 CANARY TRIGGERED: ${targetCanary.tokenName} accessed. Incident logged.`);
  };

  const handleUpdateIncidentStatus = (id: string, status: any) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
    showToast(`Incident ${id} status updated to ${status}.`);
  };

  const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;
  const openIncidentsCount = incidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length;

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs font-mono text-cyan-200 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onLaunchFullDemo={() => setIsFullDemoOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        openIncidentsCount={openIncidentsCount}
        onResetDemoData={handleResetDemoData}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          pendingApprovalsCount={pendingApprovalsCount}
          openIncidentsCount={openIncidentsCount}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'landing' && (
            <LandingView
              onNavigate={setCurrentTab}
              onLaunchFullDemo={() => setIsFullDemoOpen(true)}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              agents={agents}
              vaultRecords={vaultRecords}
              auditLogs={auditLogs}
              approvals={approvals}
              incidents={incidents}
              destinations={destinations}
              onNavigate={setCurrentTab}
              onLaunchFullDemo={() => setIsFullDemoOpen(true)}
              onInspectAgent={(agent) => setInspectedAgent(agent)}
              onOpenBenchmark={() => setIsBenchmarkOpen(true)}
            />
          )}

          {currentTab === 'agents' && (
            <AgentsView
              agents={agents}
              onInspectAgent={(agent) => setInspectedAgent(agent)}
              onRenewPassport={handleRenewPassport}
              onToggleQuarantine={handleToggleQuarantine}
              onExpirePassport={handleExpirePassport}
              onEmitLog={handleEmitLog}
            />
          )}

          {currentTab === 'permissions' && (
            <AgentsView
              agents={agents}
              onInspectAgent={(agent) => setInspectedAgent(agent)}
              onRenewPassport={handleRenewPassport}
              onToggleQuarantine={handleToggleQuarantine}
              onExpirePassport={handleExpirePassport}
              onEmitLog={handleEmitLog}
            />
          )}

          {currentTab === 'data-vault' && (
            <DataVaultView
              records={vaultRecords}
              onInspectRecord={(record) => setInspectedRecord(record)}
            />
          )}

          {currentTab === 'tool-firewall' && (
            <ToolFirewallView
              tools={tools}
              agents={agents}
              records={vaultRecords}
              onEmitLog={handleEmitLog}
            />
          )}

          {currentTab === 'threat-monitor' && (
            <ThreatMonitorView
              destinations={destinations}
              auditLogs={auditLogs}
            />
          )}

          {currentTab === 'attack-simulator' && (
            <AttackSimulatorView
              agents={agents}
              onEmitLog={handleEmitLog}
            />
          )}

          {currentTab === 'approvals' && (
            <ApprovalsView
              approvals={approvals}
              onInspectApproval={(req) => setInspectedApproval(req)}
              onApprove={handleApprove}
              onReject={handleReject}
              onBlockAgent={handleBlockAgentFromApproval}
            />
          )}

          {currentTab === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
            />
          )}

          {currentTab === 'canary' && (
            <CanaryView
              canaries={canaries}
              onTriggerCanary={handleTriggerCanary}
            />
          )}

          {currentTab === 'multi-agent' && (
            <MultiAgentView />
          )}

          {currentTab === 'audit-logs' && (
            <AuditLogsView
              logs={auditLogs}
            />
          )}

          {currentTab === 'privacy' && (
            <PrivacyView />
          )}

          {currentTab === 'architecture' && (
            <ArchitectureView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <FullDemoModal
        isOpen={isFullDemoOpen}
        onClose={() => setIsFullDemoOpen(false)}
        onEmitEvent={handleEmitLog}
        onNavigateToView={(view) => {
          setCurrentTab(view);
          setIsFullDemoOpen(false);
        }}
        agents={agents}
        records={vaultRecords}
        tools={tools}
      />

      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        agents={agents}
        records={vaultRecords}
      />

      <AgentModal
        agent={inspectedAgent}
        isOpen={!!inspectedAgent}
        onClose={() => setInspectedAgent(null)}
        onRenewPassport={handleRenewPassport}
        onToggleQuarantine={handleToggleQuarantine}
      />

      <DataVaultDetailModal
        record={inspectedRecord}
        isOpen={!!inspectedRecord}
        onClose={() => setInspectedRecord(null)}
      />

      <ApprovalDetailModal
        request={inspectedApproval}
        isOpen={!!inspectedApproval}
        onClose={() => setInspectedApproval(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onBlockAgent={handleBlockAgentFromApproval}
      />
    </div>
  );
}
