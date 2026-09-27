export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL' | 'HIGHLY CONFIDENTIAL' | 'CRITICAL';

export type SecurityDecision = 'ALLOW' | 'REVIEW' | 'BLOCK' | 'HUMAN_APPROVAL';

export type ToolExecutionStatus = 'NOT_EXECUTED' | 'EXECUTED' | 'SUSPENDED';

export type NetworkTransmissionStatus = 'NOT_EXECUTED' | 'TRANSMITTED' | 'BLOCKED_AT_EGRESS';

export interface SimulatedToolExecutionResult {
  tool: string;
  status: ToolExecutionStatus;
  executionTimeMs: number;
  stdout: string;
  networkBytesTransferred: number;
  dataTransmitted: 'NOT_EXECUTED' | 'TRANSMITTED';
  sensitiveDataReleased: boolean;
  outputPayload?: any;
}

export interface CustomActionExecutionState {
  actionId: string;
  requestId: string;
  timestamp: string;
  actionRequest: ActionRequest;
  gatewayResult: GatewayExecutionResult;
  policyDecision: 'ALLOW' | 'REVIEW' | 'BLOCK';
  toolRequested: string;
  toolExecutionStatus: ToolExecutionStatus;
  networkTransmissionStatus: NetworkTransmissionStatus;
  sensitiveDataReleased: boolean;
  incidentCreated: boolean;
  incidentId: string | null;
  approvalCreated: boolean;
  approvalId: string | null;
  auditLogCreated: boolean;
  auditEventId: string;
  simulatedToolResult: SimulatedToolExecutionResult;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type AgentStatus = 'active' | 'quarantined' | 'review' | 'idle';

export type DestinationTrustLevel = 'TRUSTED_INTERNAL' | 'TRUSTED_PARTNER' | 'UNKNOWN_EXTERNAL' | 'BLOCKED_EXTERNAL';

export interface ActionRequest {
  requestId: string;
  agentId: string;
  userId: string;
  action: string;
  resource: string;
  dataClassification: DataClassification;
  tool: string;
  destination: string;
  destinationTrust?: DestinationTrustLevel;
  authorization: boolean;
  instructionSource: 'user' | 'external' | 'delegated' | 'system';
  provenance: 'trusted' | 'untrusted' | 'unknown' | 'canary';
  requestedAt: string;
  rawPrompt?: string;
  contextDocument?: string;
  oneTimeApprovalToken?: string;
  delegationChain?: {
    originUserId: string;
    parentAgentId: string;
    childAgentId: string;
    parentAllowedScopes: string[];
    requestedScope: string;
  };
}

export interface RiskScoreBreakdown {
  instructionTrustScore: number;    // 0 - 20
  dataSensitivityScore: number;      // 0 - 20
  permissionMismatchScore: number;   // 0 - 20
  destinationRiskScore: number;      // 0 - 15
  toolImpactScore: number;           // 0 - 15
  authorizationScore: number;        // 0 - 10
  totalScore: number;                // 0 - 100
  riskLevel: RiskLevel;
}

export interface GatewayExecutionResult {
  requestId: string;
  actionRequest: ActionRequest;
  decision: 'ALLOW' | 'REVIEW' | 'BLOCK';
  executionStatus: 'EXECUTED' | 'SUSPENDED_FOR_APPROVAL' | 'TERMINATED_BLOCKED';
  riskBreakdown: RiskScoreBreakdown;
  threatType: string | null;
  simpleExplanation: string;
  policyViolations: string[];
  matchedRules: string[];
  auditEvidenceId: string;
  cryptographicReceipt: string;
  timestamp: string;
  dataFlow: {
    source: string;
    agent: string;
    resource: string;
    tool: string;
    destination: string;
    status: 'PASSED' | 'INSPECTED' | 'BLOCKED';
  };
  dataMinimization?: {
    requestedAttributes: string[];
    requiredAttributes: string[];
    allowedAttributes: string[];
    redactedAttributes: string[];
    sampleCleanOutput: Record<string, string>;
  };
}

export interface PermissionPassport {
  passportId: string;
  agentId: string;
  issuedAt: string;
  expiresAt: string;
  durationMinutes: number;
  remainingMinutes: number;
  readPermissions: string[];
  writePermissions: string[];
  deniedSensitiveScopes: string[];
  allowedTools?: string[];
  allowedDestinations?: string[];
  maxDataClassification?: DataClassification;
  externalNetworkAllowed: boolean;
  maxToolImpactLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  escalationAttemptsCount: number;
  status: 'valid' | 'expired' | 'revoked';
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  owner: string;
  department: string;
  avatarBg: string;
  status: AgentStatus;
  riskLevel: RiskLevel;
  passport: PermissionPassport;
  allowedDataCategories: string[];
  allowedTools: string[];
  lastAction: string;
  lastActionTime: string;
  blockedActionsCount: number;
  suspiciousActionsCount: number;
  totalActionsCount: number;
  sandbox: {
    filesystemRestricted: boolean;
    networkRestricted: boolean;
    allowedApis: string[];
    blockedApis: string[];
    unrestrictedShell: boolean;
    temporaryTokensOnly: boolean;
  };
}

export interface DataVaultRecord {
  id: string;
  title: string;
  category: string;
  classification: DataClassification;
  ownerDepartment: string;
  allowedAgents: string[];
  allowedDestinations: string[];
  aiTrainingPolicy: 'BLOCKED' | 'ALLOWED_SYNTHETIC_ONLY';
  externalTransmissionPolicy: 'BLOCKED' | 'REQUIRES_CISO_APPROVAL' | 'RESTRICTED';
  createdAt: string;
  lastAccessed: string;
  sampleFields: {
    field: string;
    value: string;
    sensitivity: DataClassification;
    redactedByDefault: boolean;
  }[];
  dataDNA: {
    originSystem: string;
    cryptographicHash: string;
    watermarkId: string;
    retentionDays: number;
  };
}

export interface ToolSecurityDefinition {
  id: string;
  name: string;
  toolCode?: string; // e.g. "file.read", "database.delete"
  category: 'System' | 'Network' | 'Storage' | 'Communication' | 'Execution';
  description: string;
  riskRating: RiskLevel;
  requiresHumanApproval: boolean;
  blockedByDefault: boolean;
  usageToday: number;
  blockedToday: number;
}

export interface SecurityIncident {
  id: string;
  severity: RiskLevel;
  agentId: string;
  agentName: string;
  title: string;
  attackSource: string;
  category: 
    | 'Prompt Injection'
    | 'Indirect Prompt Injection'
    | 'Data Exfiltration'
    | 'Credential Exposure'
    | 'Unauthorized Tool Call'
    | 'Permission Escalation'
    | 'Malicious External Content'
    | 'Canary Trigger'
    | 'Multi-Agent Authority Violation';
  dataInvolved: string;
  actionsTaken: string;
  status: 'OPEN' | 'INVESTIGATING' | 'BLOCKED' | 'RESOLVED';
  timestamp: string;
  technicalSummary: string;
  evidenceReceipt?: string;
  riskScore?: number;
}

export interface ApprovalRequest {
  id: string;
  agentId: string;
  agentName: string;
  requestedAction: string;
  dataInvolved: string;
  dataClassification: DataClassification;
  destination: string;
  reason: string;
  riskScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AGENT_BLOCKED';
  requestedAt: string;
  actionImpact: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recordCount?: number;
  oneTimeToken?: string;
  actionRequest?: ActionRequest;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  agent: string;
  action: string;
  data: string;
  tool: string;
  destination: string;
  riskScore: number;
  riskLevel: RiskLevel;
  decision: SecurityDecision;
  reason: string;
  technicalDetails: {
    dataSensitivity: string;
    destinationTrust: string;
    authorization: string;
    actionImpact: string;
    provenance: string;
    ruleId: string;
    evidenceId?: string;
  };
}

export interface ExternalDestination {
  domain: string;
  trustLevel: 'TRUSTED' | 'CONDITIONAL' | 'UNTRUSTED' | 'MALICIOUS';
  canonicalTrust?: DestinationTrustLevel;
  type: 'Internal VPC' | 'Partner Cloud' | 'Public Web' | 'Unknown Server' | 'Data Exfiltration Endpoint';
  reputation: 'High' | 'Moderate' | 'Untrusted' | 'High Risk';
  riskScore: number;
  requestsBlocked: number;
  requestsAllowed: number;
  lastAttempt: string;
}

export interface CanaryHoneyToken {
  id: string;
  tokenName: string;
  canaryValue: string;
  category: 'API Credential' | 'Database String' | 'Customer PII' | 'Executive Memo';
  placement: string;
  deployedDate: string;
  status: 'ARMED' | 'TRIGGERED';
  triggeredCount: number;
  lastTriggered?: string;
  triggeredByAgent?: string;
}

export interface AttackScenario {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  agentId: string;
  simulatedInput: string;
  contextDocument?: string;
  destination?: string;
  toolRequested?: string;
  dataRequested?: string;
  expectedDecision: SecurityDecision;
  threatType: string;
  simpleExplanation: string;
  structuredRequest?: Partial<ActionRequest>;
  technicalChecks: {
    label: string;
    result: 'FAIL' | 'PASS' | 'WARN';
    detail: string;
  }[];
}

export interface SecurityEvaluationResult {
  decision: SecurityDecision;
  riskScore: number;
  riskLevel: RiskLevel;
  threatType: string | null;
  simpleExplanation: string;
  technicalExplanation: {
    dataSensitivity: string;
    destinationTrust: string;
    authorization: string;
    actionImpact: string;
    provenance: string;
    passportStatus: string;
  };
  matchedRules: string[];
  dataMinimization?: {
    requested: string[];
    required: string[];
    allowed: string[];
    redacted: string[];
  };
}

export interface SecurityTestCase {
  id: string;
  testNumber: number;
  name: string;
  category: string;
  description: string;
  actionRequest: ActionRequest;
  expectedDecision: 'ALLOW' | 'REVIEW' | 'BLOCK';
  expectedRiskRange: [number, number];
  keyPolicyRule: string;
  explanation: string;
}

export interface SecurityTestRunResult {
  testId: string;
  testName: string;
  expectedDecision: 'ALLOW' | 'REVIEW' | 'BLOCK';
  actualDecision: 'ALLOW' | 'REVIEW' | 'BLOCK';
  passed: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  matchedRules: string[];
  evidenceId: string;
  explanation: string;
  executionTimeMs: number;
}
