import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Dna, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Eye, 
  Share2, 
  Check, 
  Ban, 
  ArrowRight 
} from 'lucide-react';
import { DataVaultRecord } from '../types';

interface DataVaultDetailModalProps {
  record: DataVaultRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DataVaultDetailModal: React.FC<DataVaultDetailModalProps> = ({
  record,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'minimization' | 'dna' | 'fields'>('minimization');
  const [selectedAgentRequest, setSelectedAgentRequest] = useState('Customer Support Agent');

  if (!isOpen || !record) return null;

  const allowedFields = record.sampleFields.filter(f => !f.redactedByDefault);
  const redactedFields = record.sampleFields.filter(f => f.redactedByDefault);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#090E18] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1220]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">{record.title}</h2>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  record.classification === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : record.classification === 'HIGHLY CONFIDENTIAL'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  {record.classification}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ID: {record.id} · Department: {record.ownerDepartment}
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

        {/* Tab Controls */}
        <div className="px-6 border-b border-slate-800/80 bg-[#0A0F1D] flex items-center gap-4">
          <button
            onClick={() => setActiveTab('minimization')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'minimization'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Minimization Filter</span>
          </button>
          <button
            onClick={() => setActiveTab('dna')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'dna'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Data DNA / Provenance</span>
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'fields'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Raw Schema & Redactions</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'minimization' && (
            <div className="space-y-6">
              {/* Concept Banner */}
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10 text-xs text-cyan-200/90 leading-relaxed">
                <span className="font-semibold text-cyan-300 block mb-1">Zero-Trust Data Minimization Principle:</span>
                Autonomous AI agents never receive full unredacted customer or financial database records. The firewall dynamically filters the record to supply only the minimum necessary fields required to answer the specific task.
              </div>

              {/* Minimization Flow Visualizer */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Minimization Pipeline Simulator
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Step 1: Requested */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">1. Agent Request</span>
                    <p className="text-xs text-slate-300 font-medium">"Retrieve customer record for ticket"</p>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Target: {record.sampleFields.length} attributes
                    </span>
                  </div>

                  {/* Step 2: Policy Scope */}
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase block">2. Policy Evaluation</span>
                    <p className="text-xs text-slate-300 font-medium">RBAC + DLP Filter</p>
                    <span className="text-[11px] text-cyan-300/80 block pt-1">
                      Passport Verified: Scoped
                    </span>
                  </div>

                  {/* Step 3: Allowed Fields */}
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block">3. Allowed ({allowedFields.length})</span>
                    <div className="space-y-1">
                      {allowedFields.map((f, i) => (
                        <div key={i} className="text-[11px] text-emerald-300 flex items-center gap-1 font-mono">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="truncate">{f.field}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Redacted Fields */}
                  <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
                    <span className="text-[10px] font-mono text-rose-400 uppercase block">4. Redacted ({redactedFields.length})</span>
                    <div className="space-y-1">
                      {redactedFields.map((f, i) => (
                        <div key={i} className="text-[11px] text-rose-300 flex items-center gap-1 font-mono">
                          <Ban className="w-3 h-3 text-rose-400" />
                          <span className="truncate">{f.field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Payload Result Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> What AI Agent Receives (Clean)
                  </span>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 font-mono text-xs text-slate-200 space-y-1.5">
                    {allowedFields.map((f, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-slate-400">{f.field}:</span>
                        <span className="text-emerald-300">{f.value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
                      [+ {redactedFields.length} sensitive fields omitted by Zero-Trust firewall]
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5" /> What AI Agent is Blocked from Seeing
                  </span>
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 font-mono text-xs text-rose-300 space-y-1.5">
                    {redactedFields.map((f, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-rose-400/70">{f.field}:</span>
                        <span className="text-rose-300 tracking-widest font-bold">████████</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dna' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Dna className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Data DNA & Cryptographic Provenance
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Origin System</span>
                    <span className="font-mono text-white font-semibold">{record.dataDNA.originSystem}</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Watermark Token</span>
                    <span className="font-mono text-cyan-400 font-semibold">{record.dataDNA.watermarkId}</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800 sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Cryptographic SHA-256 Signature</span>
                    <span className="font-mono text-slate-300 text-[11px] break-all">{record.dataDNA.cryptographicHash}</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Retention Lifecycle</span>
                    <span className="font-mono text-slate-300">{record.dataDNA.retentionDays} Days</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">External Transmission Policy</span>
                    <span className="font-mono text-rose-400 font-bold">{record.externalTransmissionPolicy}</span>
                  </div>
                </div>
              </div>

              {/* Travel Permissions */}
              <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Authorized Enclaves & AI Training Boundary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">AI Model Training Policy</span>
                    <span className="font-mono text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                      <Ban className="w-3.5 h-3.5" /> {record.aiTrainingPolicy}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/30 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Allowed Agent IDs</span>
                    <span className="font-mono text-cyan-300 text-[11px] mt-0.5 block truncate">
                      {record.allowedAgents.length > 0 ? record.allowedAgents.join(', ') : 'None (Air-Gapped)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Full Schema Attributes & Data Loss Prevention (DLP) Status
              </h4>
              <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden bg-[#0C1322]">
                {record.sampleFields.map((field, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-800/30 transition-colors">
                    <div>
                      <span className="font-semibold text-white block">{field.field}</span>
                      <span className="font-mono text-[11px] text-slate-400">{field.value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        field.sensitivity === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : field.sensitivity === 'HIGHLY CONFIDENTIAL'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {field.sensitivity}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        field.redactedByDefault
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                      }`}>
                        {field.redactedByDefault ? 'REDACTED' : 'AUTHORIZED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-[#0B1220]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
