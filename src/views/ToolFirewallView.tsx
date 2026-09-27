import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Terminal, 
  Mail, 
  Globe, 
  Database, 
  FileCode, 
  Trash2, 
  HardDrive, 
  Play, 
  CheckCircle2, 
  Ban, 
  Layers 
} from 'lucide-react';
import { 
  ToolSecurityDefinition, 
  AIAgent, 
  DataVaultRecord, 
  GatewayExecutionResult, 
  ActionRequest,
  CustomActionExecutionState,
  ToolExecutionStatus,
  NetworkTransmissionStatus,
  ApprovalRequest,
  SecurityIncident
} from '../types';
import { executeSecurityGateway, executeSimulatedTool, generateActionId } from '../lib/securityEngine';
import { ProofOfEnforcementCard } from '../components/ProofOfEnforcementCard';

interface ToolFirewallViewProps {
  tools: ToolSecurityDefinition[];
  agents: AIAgent[];
  records: DataVaultRecord[];
  onEmitLog: (log: any) => void;
  onAddApproval?: (approval: ApprovalRequest) => void;
  onAddIncident?: (incident: SecurityIncident) => void;
}

export const ToolFirewallView: React.FC<ToolFirewallViewProps> = ({
  tools,
  agents,
  records,
  onEmitLog,
  onAddApproval,
  onAddIncident
}) => {
  const [selectedToolId, setSelectedToolId] = useState(tools[3].id); // Send Email
  const [selectedAgentId, setSelectedAgentId] = useState(agents[1].id); // Finance Agent
  const [targetDestination, setTargetDestination] = useState('unknown@competitor-corp.com');
  const [selectedRecordId, setSelectedRecordId] = useState(records[1].id); // Q3 Earnings
  const [executionState, setExecutionState] = useState<CustomActionExecutionState | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const selectedTool = tools.find(t => t.id === selectedToolId) || tools[0];
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];
  const selectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  const handleTestToolExecution = () => {
    setIsEvaluating(true);

    setTimeout(() => {
      // 1. CREATE ACTION REQUEST with Unique Action ID
      const actionId = generateActionId();
      const toolCode = selectedTool.toolCode || selectedTool.name.toLowerCase().replace(/\s+/g, '.');

      const actionReq: ActionRequest = {
        requestId: actionId,
        agentId: selectedAgent.id,
        userId: 'security_operator',
        action: `EXECUTE_TOOL_${selectedTool.name.toUpperCase().replace(/\s+/g, '_')}`,
        resource: selectedRecord.title,
        dataClassification: selectedRecord.classification,
        tool: toolCode,
        destination: targetDestination,
        authorization: false,
        instructionSource: 'user',
        provenance: 'trusted',
        requestedAt: new Date().toISOString(),
        rawPrompt: `Invoke tool ${selectedTool.name} targeting ${targetDestination} with payload from ${selectedRecord.title}`
      };

      // 2. RUN DETERMINISTIC POLICY ENGINE
      const result = executeSecurityGateway(actionReq, {
        agents,
        vaultRecords: records,
        tools
      });

      // 3. RECEIVE ALLOW / REVIEW / BLOCK
      const decision = result.decision;

      // 4, 5, 6. TOOL EXECUTION AND ENFORCEMENT
      const simTool = executeSimulatedTool(toolCode, actionReq, decision);
      const isInternal = targetDestination.toLowerCase().includes('internal') || targetDestination === 'internal';

      let toolExecutionStatus: ToolExecutionStatus = simTool.status;
      let networkTransmissionStatus: NetworkTransmissionStatus = 
        decision === 'ALLOW' && !isInternal ? 'TRANSMITTED' : 'NOT_EXECUTED';
      let incidentCreated = false;
      let incidentId: string | null = null;
      let approvalCreated = false;
      let approvalId: string | null = null;

      if (decision === 'BLOCK') {
        incidentCreated = true;
        incidentId = `INC-2026-${actionId.replace('ACT-2026-', '')}`;
        if (onAddIncident) {
          onAddIncident({
            id: incidentId,
            severity: result.riskBreakdown.riskLevel,
            agentId: selectedAgent.id,
            agentName: selectedAgent.name,
            title: `Tool Blocked by Firewall: ${selectedTool.name}`,
            attackSource: 'Tool Authorization Inspector',
            category: 'Unauthorized Tool Call',
            dataInvolved: selectedRecord.title,
            actionsTaken: 'Tool execution blocked before dispatch. Process terminated.',
            status: 'OPEN',
            timestamp: 'Just now',
            technicalSummary: result.simpleExplanation,
            evidenceReceipt: result.cryptographicReceipt,
            riskScore: result.riskBreakdown.totalScore
          });
        }
      } else if (decision === 'REVIEW') {
        approvalCreated = true;
        approvalId = `APPR-2026-${actionId.replace('ACT-2026-', '')}`;
        if (onAddApproval) {
          onAddApproval({
            id: approvalId,
            agentId: selectedAgent.id,
            agentName: selectedAgent.name,
            requestedAction: `Invoke ${selectedTool.name}`,
            dataInvolved: selectedRecord.title,
            dataClassification: selectedRecord.classification,
            destination: targetDestination,
            reason: result.simpleExplanation,
            riskScore: result.riskBreakdown.totalScore,
            status: 'PENDING',
            requestedAt: 'Just now',
            actionImpact: selectedTool.riskRating.toUpperCase() as any,
            actionRequest: actionReq
          });
        }
      }

      // 7. CREATE AN AUDIT EVENT FOR EVERY DECISION
      onEmitLog({
        id: result.auditEvidenceId,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        user: 'security_operator',
        agent: selectedAgent.name,
        action: `Invoked ${selectedTool.name} on ${selectedRecord.title}`,
        data: selectedRecord.title,
        tool: selectedTool.name,
        destination: targetDestination,
        riskScore: result.riskBreakdown.totalScore,
        riskLevel: result.riskBreakdown.riskLevel,
        decision: decision === 'REVIEW' ? 'HUMAN_APPROVAL' : decision,
        reason: result.simpleExplanation,
        technicalDetails: {
          dataSensitivity: selectedRecord.classification,
          destinationTrust: targetDestination,
          authorization: decision === 'ALLOW' ? 'SCOPED' : 'FAIL_CLOSED',
          actionImpact: selectedTool.riskRating.toUpperCase(),
          provenance: 'Tool Firewall Playground',
          ruleId: result.matchedRules[0] || 'RULE-TOOL-FW-01',
          evidenceId: result.auditEvidenceId
        }
      });

      setExecutionState({
        actionId,
        requestId: actionId,
        timestamp: new Date().toISOString(),
        actionRequest: actionReq,
        gatewayResult: result,
        policyDecision: decision,
        toolRequested: selectedTool.name,
        toolExecutionStatus,
        networkTransmissionStatus,
        sensitiveDataReleased: false,
        incidentCreated,
        incidentId,
        approvalCreated,
        approvalId,
        auditLogCreated: true,
        auditEventId: result.auditEvidenceId,
        simulatedToolResult: simTool
      });

      setIsEvaluating(false);
    }, 400);
  };

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'Send Email': return <Mail className="w-4 h-4 text-amber-400" />;
      case 'HTTP Request': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'Database Query': return <Database className="w-4 h-4 text-blue-400" />;
      case 'Execute Code': return <Terminal className="w-4 h-4 text-purple-400" />;
      case 'Delete File': return <Trash2 className="w-4 h-4 text-rose-400" />;
      default: return <Wrench className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Tool-Call Execution Firewall
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Autonomous agents cannot directly invoke host tools or network sockets without deterministic policy evaluation.
        </p>
      </div>

      {/* Interactive Tool-Call Evaluation Sandbox */}
      <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 md:p-6 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Live Tool Authorization Inspector
              </h2>
              <p className="text-[11px] text-slate-400">
                Simulate an agent tool invocation against the Zero-Trust policy rules
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/40 self-start sm:self-auto">
            Zero-Trust Rule: Tool Scoping
          </span>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Tool Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block text-[11px] uppercase">
              1. Requested Tool
            </label>
            <select
              value={selectedToolId}
              onChange={(e) => setSelectedToolId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {tools.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.riskRating.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Agent Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block text-[11px] uppercase">
              2. Initiating Agent
            </label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.status})
                </option>
              ))}
            </select>
          </div>

          {/* Record Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block text-[11px] uppercase">
              3. Data Payload Attached
            </label>
            <select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 truncate"
            >
              {records.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.classification})
                </option>
              ))}
            </select>
          </div>

          {/* Target Destination Input */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold block text-[11px] uppercase">
              4. Target Recipient / Domain
            </label>
            <input
              type="text"
              value={targetDestination}
              onChange={(e) => setTargetDestination(e.target.value)}
              placeholder="e.g. unknown@example.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>
        </div>

        {/* Evaluate Button */}
        <div className="flex justify-end">
          <button
            onClick={handleTestToolExecution}
            disabled={isEvaluating}
            className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-cyan-950 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isEvaluating ? 'Evaluating Through Policy Engine...' : 'Evaluate Tool Call Through Firewall'}</span>
          </button>
        </div>

        {/* Live Verdict Banner & Proof of Enforcement */}
        {executionState && (
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-xl border transition-all ${
              executionState.policyDecision === 'BLOCK'
                ? 'border-rose-500/40 bg-rose-950/20'
                : executionState.policyDecision === 'REVIEW'
                ? 'border-amber-500/40 bg-amber-950/20'
                : 'border-emerald-500/40 bg-emerald-950/20'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  {executionState.policyDecision === 'BLOCK' ? (
                    <Ban className="w-5 h-5 text-rose-400" />
                  ) : executionState.policyDecision === 'REVIEW' ? (
                    <Clock className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  )}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Firewall Verdict</span>
                    <span className={`text-base font-bold font-mono tracking-wider ${
                      executionState.policyDecision === 'BLOCK' ? 'text-rose-400' : executionState.policyDecision === 'REVIEW' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {executionState.policyDecision === 'REVIEW' ? 'HUMAN APPROVAL REQUIRED' : executionState.policyDecision}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono">
                  <span className="text-slate-400">Action ID: </span>
                  <span className="font-bold text-cyan-300 mr-3">{executionState.actionId}</span>
                  <span className="text-slate-400">Risk Score: </span>
                  <span className={`font-bold ${
                    executionState.gatewayResult.riskBreakdown.totalScore > 75 ? 'text-rose-400' : executionState.gatewayResult.riskBreakdown.totalScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {executionState.gatewayResult.riskBreakdown.totalScore}/100
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                <span className="font-semibold text-white">Policy Rationale: </span>
                {executionState.gatewayResult.simpleExplanation}
              </p>
            </div>

            {/* TOOL DISPATCH Block */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#070D18] space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    TOOL DISPATCH
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Tool: <strong className="text-slate-200">{executionState.toolRequested}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                {/* Status */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Status</span>
                  <span className={`text-xs font-bold mt-1 block ${
                    executionState.toolExecutionStatus === 'NOT_EXECUTED' ? 'text-rose-400' :
                    executionState.toolExecutionStatus === 'SUSPENDED' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {executionState.toolExecutionStatus === 'NOT_EXECUTED' ? 'NOT EXECUTED' :
                     executionState.toolExecutionStatus === 'SUSPENDED' ? 'SUSPENDED' : 'EXECUTED'}
                  </span>
                </div>

                {/* Network transmission */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Network transmission</span>
                  <span className={`text-xs font-bold mt-1 block ${
                    executionState.networkTransmissionStatus === 'NOT_EXECUTED' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {executionState.networkTransmissionStatus === 'NOT_EXECUTED' ? 'NOT EXECUTED' : 'TRANSMITTED'}
                  </span>
                </div>

                {/* Sensitive data release */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Sensitive data release</span>
                  <span className="text-xs font-bold mt-1 block text-emerald-400">
                    NONE
                  </span>
                </div>

                {/* Protected resource modification */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Protected resource</span>
                  <span className="text-xs font-bold mt-1 block text-emerald-400">
                    NONE
                  </span>
                </div>

                {/* Incident */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Incident</span>
                  <span className={`text-xs font-bold mt-1 block ${
                    executionState.incidentCreated ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {executionState.incidentCreated ? 'CREATED' : 'NONE'}
                  </span>
                </div>

                {/* Audit */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Audit</span>
                  <span className="text-xs font-bold mt-1 block text-cyan-400">
                    {executionState.auditLogCreated ? 'LOGGED' : 'NONE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Proof of Enforcement Panel */}
            <ProofOfEnforcementCard
              actionId={executionState.actionId}
              policyVerdict={executionState.policyDecision}
              toolName={executionState.toolRequested}
              toolExecutionState={executionState.toolExecutionStatus}
              dataReleaseState="NONE"
              networkState={executionState.networkTransmissionStatus === 'NOT_EXECUTED' ? 'NONE' : 'TRANSMITTED'}
              incidentState={executionState.incidentCreated ? 'CREATED' : 'NONE'}
              auditState={executionState.auditLogCreated ? 'LOGGED' : 'NONE'}
              protectedResourceModification="NONE"
              title="Proof of Enforcement (Tool-Call Firewall)"
            />
          </div>
        )}
      </div>

      {/* Tools Catalog Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Enforced Tool Directory ({tools.length} Managed Tools)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    {getToolIcon(tool.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{tool.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Category: {tool.category}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  tool.riskRating === 'critical'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : tool.riskRating === 'high'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {tool.riskRating} Risk
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {tool.description}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Used today: <span className="text-white">{tool.usageToday}</span></span>
                  <span className="text-slate-400">Blocked: <span className="text-rose-400 font-bold">{tool.blockedToday}</span></span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  tool.blockedByDefault 
                    ? 'text-rose-400 bg-rose-950/40 border border-rose-800/40' 
                    : tool.requiresHumanApproval 
                    ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40' 
                    : 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                }`}>
                  {tool.blockedByDefault ? 'BLOCKED BY DEFAULT' : tool.requiresHumanApproval ? 'APPROVAL REQUIRED' : 'PASSPORT CONTROLLED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
