import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  ArrowDown, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Bot, 
  Globe, 
  Database,
  Lock
} from 'lucide-react';

export const SideBySideComparison: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
          Architectural Defense Comparison
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          How AI DataVault Defends Against Compromised Agents
        </h2>
        <p className="text-xs md:text-sm text-slate-400">
          "Assume the agent can fail. Contain the failure." See the direct flow difference when an autonomous agent encounters indirect prompt injection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WITHOUT AI DataVault */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5 md:p-6 space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-rose-900/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <XCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300">
                WITHOUT AI DataVault
              </h3>
            </div>
            <span className="text-[11px] font-mono text-rose-400/80 bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-800/40">
              Direct AI Access
            </span>
          </div>

          {/* Flow Steps */}
          <div className="space-y-3 text-xs font-mono">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Globe className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase">1. Trigger</span>
                <span className="text-slate-200">Malicious Webpage / Document</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-rose-400/70" />
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Bot className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase">2. Execution</span>
                <span className="text-slate-200">AI Agent executes hidden override command</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-rose-400/70" />
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Database className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase">3. Target</span>
                <span className="text-slate-200">Full Unredacted Confidential Company Files</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-rose-400/70" />
            </div>

            {/* Step 4 */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Globe className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase">4. Egress</span>
                <span className="text-slate-200">Outbound HTTP POST to Unknown Server</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-rose-400/70" />
            </div>

            {/* Result */}
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-center space-y-1">
              <div className="text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>UNCONTAINED DATA BREACH & EXFILTRATION</span>
              </div>
              <p className="text-[11px] text-rose-300/80 font-sans">
                Sensitive records, customer PII, and financial reports leaked with zero audit trail.
              </p>
            </div>
          </div>
        </div>

        {/* WITH AI DataVault */}
        <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/10 p-5 md:p-6 space-y-5 relative overflow-hidden shadow-lg shadow-cyan-950/20">
          <div className="flex items-center justify-between border-b border-cyan-900/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
                WITH AI DataVault
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/40">
              Zero-Trust Interceptor
            </span>
          </div>

          {/* Flow Steps */}
          <div className="space-y-3 text-xs font-mono">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase">1. Trigger</span>
                <span className="text-slate-200">Malicious Webpage / Document Ingested</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-cyan-400/70" />
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Bot className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase">2. Proposal</span>
                <span className="text-slate-200">Compromised AI Agent proposes action</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-cyan-400/70" />
            </div>

            {/* Step 3: THE FIREWALL */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 3. AI DataVault Security Firewall
                </span>
                <span className="text-[10px] text-cyan-300 font-bold">ARMED</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-cyan-200/90 pt-1">
                <span>✓ Instruction Override Detected</span>
                <span>✓ Data Classification: CRITICAL</span>
                <span>✓ Destination: UNTRUSTED</span>
                <span>✓ Passport Scope: DENIED</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-cyan-400/70" />
            </div>

            {/* Result */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-center space-y-1">
              <div className="text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>🚨 ACTION TERMINATED · ZERO DATA ESCAPES</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 font-sans">
                Connection severed at egress, incident dispatched to SIEM, and agent quarantined.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
