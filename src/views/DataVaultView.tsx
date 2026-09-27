import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Dna, 
  EyeOff, 
  Eye, 
  Check, 
  Ban, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  Filter,
  Sparkles
} from 'lucide-react';
import { DataVaultRecord, DataClassification } from '../types';

interface DataVaultViewProps {
  records: DataVaultRecord[];
  onInspectRecord: (record: DataVaultRecord) => void;
}

export const DataVaultView: React.FC<DataVaultViewProps> = ({
  records,
  onInspectRecord
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [activeMinimizationDemo, setActiveMinimizationDemo] = useState(true);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          record.ownerDepartment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassification === 'all' || record.classification === selectedClassification;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Enterprise Protected Data Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data classification, cryptographic provenance (Data DNA), and real-time field-level data minimization.
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
              placeholder="Search data records..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto">
            {['all', 'PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'HIGHLY CONFIDENTIAL', 'CRITICAL'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClassification(c)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-colors whitespace-nowrap ${
                  selectedClassification === c
                    ? 'bg-slate-800 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Interactive Data Minimization Showcase (Prompt Requirement #9) */}
      <div className="rounded-2xl border border-cyan-500/40 bg-[#0B1220] p-5 md:p-6 space-y-5 shadow-lg shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Live Data Minimization Engine
              </h2>
              <p className="text-[11px] text-slate-400">
                AI agents should never receive an entire sensitive record. Only minimal required fields are released.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/40 self-start sm:self-auto">
            Zero-Trust Rule: Least Disclosure
          </span>
        </div>

        {/* Live Transformation Workflow */}
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400 uppercase text-[10px]">Sample Agent Request:</span>
              <span className="text-slate-200 font-semibold italic">"Give me Rahul's customer information."</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">AUTOMATICALLY SCOPED</span>
          </div>

          {/* 4-Step Minimization Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1525] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">1. Requested Data</span>
              <p className="text-[11px] text-slate-300">Entire Customer Master Record (8 Attributes)</p>
              <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                <div>· Full Name</div>
                <div>· Status & Account</div>
                <div>· PAN & Personal Phone</div>
                <div>· Salary & Medical & Token</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0C1525] space-y-2">
              <span className="text-[10px] text-cyan-400 uppercase block font-semibold">2. Required by Task</span>
              <p className="text-[11px] text-slate-300">Context: Frontline Support Verification</p>
              <div className="text-[10px] text-cyan-300/80 space-y-0.5 pt-1">
                <div>✓ Verified identity</div>
                <div>✓ Account standing</div>
                <div className="text-slate-500">✗ Financial history not needed</div>
                <div className="text-slate-500">✗ Identifiers not needed</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase block font-semibold">3. Allowed Data (Safe)</span>
              <div className="space-y-1 pt-1 text-[11px] text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Rahul Verma</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Tier 1 Enterprise</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>ACC-88319-IND</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
              <span className="text-[10px] text-rose-400 uppercase block font-semibold">4. Redacted Data (Blocked)</span>
              <div className="space-y-1 pt-1 text-[11px] text-rose-300">
                <div className="flex items-center gap-1.5">
                  <Ban className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>PAN: ABCDE1234F</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ban className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>Phone: +91-98765</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ban className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>Salary & Medical Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ban className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>MFA Token: RECOVERY-***</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Records Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Protected Records Catalog ({filteredRecords.length})
          </h2>
          <span className="text-xs text-slate-400">
            Click any record to inspect Data DNA & DLP travel policies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => onInspectRecord(record)}
              className="p-5 rounded-2xl border border-slate-800 bg-[#0C1322] hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {record.id} · {record.category}
                  </span>
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

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {record.title}
                </h3>

                <p className="text-xs text-slate-400">
                  Custodian: {record.ownerDepartment}
                </p>

                {/* Data DNA Snippet */}
                <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Provenance:</span>
                    <span className="text-slate-200 truncate max-w-[140px]">{record.dataDNA.originSystem}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AI Training Policy:</span>
                    <span className="text-rose-400 font-bold">{record.aiTrainingPolicy}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>External Egress:</span>
                    <span className="text-rose-400 font-bold">{record.externalTransmissionPolicy}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  {record.sampleFields.length} attributes
                </span>
                <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                  <span>Inspect Data DNA</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
