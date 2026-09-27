import React from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  Layers, 
  CheckCircle2, 
  Ban,
  Database
} from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Privacy Center & Governance Invariants
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Privacy-by-design standards governing autonomous agent training, model inference, and data residency.
        </p>
      </div>

      {/* Core Privacy Oath */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0C1528] to-[#0A0F1D] space-y-3 shadow-md">
        <div className="flex items-center gap-2.5 text-cyan-400">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Zero Customer Data for AI Model Training
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Under no circumstances is enterprise customer data, employee records, intellectual property, or financial logs shared with foundational model providers or used to train, fine-tune, or calibrate public or third-party AI models.
        </p>
      </div>

      {/* What AI Can Access vs Cannot Access (Prompt Requirement #25) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What AI Can Access */}
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-900/30 pb-3">
            <Eye className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              What AI Agents Can Access (Scoped)
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 font-sans">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Public documentation, FAQs, and product knowledge bases.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Minimized task fields explicitly authorized by the active temporary passport.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Ephemeral work buffers inside isolated chroot containers that wipe upon completion.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Sanitized staging test datasets with all PII and financial records masked.</span>
            </div>
          </div>
        </div>

        {/* What AI Cannot Access */}
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 border-b border-rose-900/30 pb-3">
            <EyeOff className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              What AI Agents Cannot Access (Hard Block)
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 font-sans">
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>Root AWS/Cloud KMS cryptographic keys and production master passwords.</span>
            </div>
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>Unmasked Personal Identifiable Information (PAN, SSN, phone numbers, recovery tokens).</span>
            </div>
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>Unrestricted shell execution (<code className="text-rose-300 font-mono">/bin/bash</code>, <code className="text-rose-300 font-mono">rm -rf</code>).</span>
            </div>
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>Unverified outbound internet destinations, webhooks, or pastebin services.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Governance & Retention Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-white uppercase text-[11px]">30-Minute Passports</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            All agent permissions expire automatically after 30 minutes, preventing lingering unauthorized access.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-2">
          <Database className="w-4 h-4 text-purple-400" />
          <h4 className="font-bold text-white uppercase text-[11px]">Data Retention Limits</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            Prompt memory buffers and intermediate AST states are scrubbed immediately after each transaction concludes.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0C1322] space-y-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="font-bold text-white uppercase text-[11px]">Cryptographic Provenance</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            Every sensitive payload carries an indelible watermark and SHA-256 signature to track leak vectors.
          </p>
        </div>
      </div>
    </div>
  );
};
