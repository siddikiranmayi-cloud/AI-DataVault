import { DataClassification, DataVaultRecord, AIAgent } from '../types';

export interface DLPClassificationResult {
  classification: DataClassification;
  detectedEntities: {
    type: string;
    sampleRedactedValue: string;
    severity: DataClassification;
  }[];
  explanation: string;
}

/**
 * Deterministic synthetic data classifier for enterprise assets.
 * Inspects content, field names, and resource identifiers against DLP patterns.
 */
export function classifySyntheticData(text: string, resourceName?: string): DLPClassificationResult {
  const detectedEntities: DLPClassificationResult['detectedEntities'] = [];
  const lower = (text + ' ' + (resourceName || '')).toLowerCase();

  // 1. Critical Credentials & Root Keys (Zero Autonomous AI Access)
  const apiKeyRegex = /API_KEY_[A-Z0-9_-]+|AKIA[0-9A-Z]{16}|wJalrXUtnFEMI\/[A-Za-z0-9_+\/]{30,}/i;
  const tokenRegex = /TOKEN_TEST_[A-Z0-9]+|eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/i;
  const secretKeyRegex = /secret_key|root_key|master_password|kms_key|private_key/i;
  const canaryRegex = /CANARY_SECRET_[A-Z0-9_]+|CANARY_AWS_[A-Z0-9_]+|HONEY_USER_[A-Z0-9_]+/i;

  if (canaryRegex.test(text) || canaryRegex.test(resourceName || '')) {
    detectedEntities.push({
      type: 'Synthetic Canary Honeytoken',
      sampleRedactedValue: 'CANARY_TRIPWIRE_TRIGGERED',
      severity: 'CRITICAL'
    });
  }

  if (apiKeyRegex.test(text) || apiKeyRegex.test(resourceName || '')) {
    detectedEntities.push({
      type: 'API Credential / Cloud Access Key',
      sampleRedactedValue: 'AKIA****************',
      severity: 'CRITICAL'
    });
  }

  if (tokenRegex.test(text) || lower.includes('mfa recovery token') || lower.includes('bearer token')) {
    detectedEntities.push({
      type: 'Authentication Token / Secret Bearer',
      sampleRedactedValue: 'RECOVERY-TOKEN-****',
      severity: 'CRITICAL'
    });
  }

  if (secretKeyRegex.test(lower)) {
    detectedEntities.push({
      type: 'Cryptographic Root Key / Master Password',
      sampleRedactedValue: 's3cur3_pr0d_db_****',
      severity: 'CRITICAL'
    });
  }

  // 2. Highly Confidential Financial & Medical
  const bankWireRegex = /021000021-[0-9]{8,12}|routing\s*number|wire\s*instruction|iban/i;
  const medicalRegex = /lumbar spine|medical accommodation|physician signature|chronic|diagnosis/i;
  const maDealRegex = /m&a deal room|escrow allocation|pre-release earnings|unreleased q3/i;

  if (bankWireRegex.test(lower) || lower.includes('banking routing')) {
    detectedEntities.push({
      type: 'Banking Routing / Account Number',
      sampleRedactedValue: '999-000-WIRE-****',
      severity: 'CRITICAL'
    });
  }

  if (medicalRegex.test(lower)) {
    detectedEntities.push({
      type: 'HIPAA Medical Record / Occupational Health',
      sampleRedactedValue: '[REDACTED_MEDICAL_DIAGNOSIS]',
      severity: 'HIGHLY_CONFIDENTIAL'
    });
  }

  if (maDealRegex.test(lower) || lower.includes('confidential m&a')) {
    detectedEntities.push({
      type: 'Material Non-Public Information (MNPI)',
      sampleRedactedValue: '$35,000,000 [RESTRICTED_ESCROW]',
      severity: 'HIGHLY_CONFIDENTIAL'
    });
  }

  // 3. Confidential PII (PAN, Aadhaar, Salary, Phone)
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  const aadhaarRegex = /\b[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}\b/;
  const phoneRegex = /\+?[0-9]{1,3}[-.\s]?[0-9]{5}[-.\s]?[0-9]{5}/;
  const salaryRegex = /salary|annual spend|\$[0-9]{2,3},[0-9]{3}/i;

  if (panRegex.test(text)) {
    detectedEntities.push({
      type: 'Permanent Account Number (PAN)',
      sampleRedactedValue: 'ABCDE****F',
      severity: 'CONFIDENTIAL'
    });
  }

  if (aadhaarRegex.test(text)) {
    detectedEntities.push({
      type: 'Aadhaar-like National ID',
      sampleRedactedValue: '**** **** 9012',
      severity: 'CONFIDENTIAL'
    });
  }

  if (salaryRegex.test(lower)) {
    detectedEntities.push({
      type: 'Compensation / Executive Salary',
      sampleRedactedValue: '$***,***',
      severity: 'CONFIDENTIAL'
    });
  }

  if (phoneRegex.test(text) || lower.includes('phone: +')) {
    detectedEntities.push({
      type: 'Customer Personal Phone Number',
      sampleRedactedValue: '+91-*****-43210',
      severity: 'CONFIDENTIAL'
    });
  }

  // Determine overall classification level
  let classification: DataClassification = 'PUBLIC';

  if (detectedEntities.some(e => e.severity === 'CRITICAL')) {
    classification = 'CRITICAL';
  } else if (detectedEntities.some(e => e.severity === 'HIGHLY_CONFIDENTIAL')) {
    classification = 'HIGHLY_CONFIDENTIAL';
  } else if (detectedEntities.some(e => e.severity === 'CONFIDENTIAL')) {
    classification = 'CONFIDENTIAL';
  } else if (lower.includes('internal') || lower.includes('directory') || lower.includes('employee') || lower.includes('ticket')) {
    classification = 'INTERNAL';
  }

  const explanation = detectedEntities.length > 0
    ? `DLP classified as ${classification} due to detected entities: ${detectedEntities.map(e => e.type).join(', ')}.`
    : `DLP verified as ${classification} with no high-sensitivity identifiers detected.`;

  return {
    classification,
    detectedEntities,
    explanation
  };
}

/**
 * Data Minimization Engine (Requirement #7)
 * Ensures AI agent receives only the minimal attributes required for the stated task.
 * Dynamically redacts PAN, Aadhaar, salary, phone numbers, recovery tokens, etc.
 */
export function applyDataMinimization(
  record: DataVaultRecord,
  agent: AIAgent,
  action: string
): {
  requestedAttributes: string[];
  requiredAttributes: string[];
  allowedAttributes: string[];
  redactedAttributes: string[];
  sampleCleanOutput: Record<string, string>;
} {
  const requestedAttributes = record.sampleFields.map(f => f.field);
  
  // Specific task-based necessity rules
  const isCustomerSupportVerification = agent.id === 'agent-support' || action.toLowerCase().includes('ticket');
  const isHRLeaveValidation = agent.id === 'agent-hr' || action.toLowerCase().includes('leave');

  let requiredAttributes: string[] = [];
  let allowedAttributes: string[] = [];
  let redactedAttributes: string[] = [];
  const cleanOutput: Record<string, string> = {};

  record.sampleFields.forEach(field => {
    const isSensitive = field.redactedByDefault || 
      field.sensitivity === 'CRITICAL' || 
      field.sensitivity === 'HIGHLY_CONFIDENTIAL' ||
      field.field.toLowerCase().includes('pan') ||
      field.field.toLowerCase().includes('phone') ||
      field.field.toLowerCase().includes('salary') ||
      field.field.toLowerCase().includes('medical') ||
      field.field.toLowerCase().includes('token') ||
      field.field.toLowerCase().includes('key') ||
      field.field.toLowerCase().includes('routing');

    if (isSensitive) {
      redactedAttributes.push(field.field);
    } else {
      // Allowed baseline attribute
      if (isCustomerSupportVerification) {
        if (field.field.toLowerCase().includes('name') || field.field.toLowerCase().includes('status') || field.field.toLowerCase().includes('account')) {
          requiredAttributes.push(field.field);
          allowedAttributes.push(field.field);
          cleanOutput[field.field] = field.value;
        } else {
          redactedAttributes.push(field.field);
        }
      } else if (isHRLeaveValidation) {
        if (field.field.toLowerCase().includes('name') || field.field.toLowerCase().includes('title') || field.field.toLowerCase().includes('department')) {
          requiredAttributes.push(field.field);
          allowedAttributes.push(field.field);
          cleanOutput[field.field] = field.value;
        } else {
          redactedAttributes.push(field.field);
        }
      } else {
        allowedAttributes.push(field.field);
        requiredAttributes.push(field.field);
        cleanOutput[field.field] = field.value;
      }
    }
  });

  // Guarantee at least minimal public identifier if all were sensitive
  if (allowedAttributes.length === 0 && record.sampleFields.length > 0) {
    allowedAttributes.push(record.sampleFields[0].field);
    requiredAttributes.push(record.sampleFields[0].field);
    cleanOutput[record.sampleFields[0].field] = record.sampleFields[0].value;
  }

  return {
    requestedAttributes,
    requiredAttributes,
    allowedAttributes,
    redactedAttributes,
    sampleCleanOutput: cleanOutput
  };
}
