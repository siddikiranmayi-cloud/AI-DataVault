import React from 'react';
import { 
  ShieldCheck, 
  Play, 
  ArrowRight, 
  Terminal, 
  Lock, 
  Cpu, 
  EyeOff, 
  Network, 
  FileCheck, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Bot,
  Zap,
  Globe
} from 'lucide-react';
import { SideBySideComparison } from '../components/SideBySideComparison';

interface LandingViewProps {
  onNavigate: (tab: string) => void;
  onLaunchFullDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onLaunchFullDemo
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 pb-10 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Zero-Trust Security for Autonomous AI Agents</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight">
            Control what AI can access, understand, and do.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            "AI should be able to work with your data without owning your data." AI DataVault intercepts prompt injections, enforces temporary permission passports, and prevents data exfiltration before any sensitive byte escapes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLaunchFullDemo}
              className="px-6 py-3 text-sm font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl transition-all shadow-lg shadow-cyan-950/60 flex items-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-900 group-hover:scale-110 transition-transform" />
              <span>Run Full Security Demo</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Open Security Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('architecture')}
              className="px-5 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              View Architecture
            </button>
          </div>

          {/* Defense-in-depth visual preview */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#0A101D] shadow-2xl shadow-cyan-950/40">
              <img
                src="/src/assets/images/cyber_shield_core_1790442651942.jpg"
                alt="AI DataVault Zero-Trust Security Prism Core"
                referrerPolicy="no-referrer"
                className="w-full h-48 sm:h-64 object-cover opacity-85 hover:opacity-95 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-cyan-300/90">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Zero-Trust Interceptor Core Active</span>
                </span>
                <span className="text-slate-400 hidden sm:inline">Cryptographic Boundary v2.4</span>
              </div>
            </div>
          </div>

          {/* Defense-in-depth disclaimer */}
          <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
            *AI DataVault uses defense-in-depth controls to reduce unauthorized AI access, data leakage, and unsafe autonomous actions. We assume the agent can fail and contain the failure.
          </p>
        </div>
      </section>

      {/* Centerpiece: Side-by-Side Comparison */}
      <section className="max-w-5xl mx-auto px-2">
        <SideBySideComparison />
      </section>

      {/* Core Architecture Pipeline Flow */}
      <section className="max-w-5xl mx-auto p-6 md:p-8 rounded-2xl border border-slate-800 bg-[#0A0F1C] space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            Execution Interceptor
          </span>
          <h3 className="text-xl font-bold text-white">
            Deterministic Zero-Trust Evaluation Pipeline
          </h3>
          <p className="text-xs text-slate-400">
            Every AI agent action passes through 8 deterministic security checkpoints before any execution occurs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {[
            { step: '01', title: 'Intent Check', desc: 'Validates origin prompt' },
            { step: '02', title: 'Injection Scan', desc: 'Direct & indirect AST' },
            { step: '03', title: 'Data Scopes', desc: 'Classifies target files' },
            { step: '04', title: 'Passport Auth', desc: 'Temporary least-privilege' },
            { step: '05', title: 'Data DNA', desc: 'Cryptographic provenance' },
            { step: '06', title: 'Tool Firewall', desc: 'Blocks high-impact APIs' },
            { step: '07', title: 'Destination', desc: 'Inspects outbound hosts' },
            { step: '08', title: 'Risk Engine', desc: 'ALLOW / APPROVAL / BLOCK' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/40 text-center space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold block">{item.step}</span>
              <span className="text-xs font-semibold text-white block truncate">{item.title}</span>
              <span className="text-[10px] text-slate-400 block leading-tight">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Key Feature Pillars */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            Defense Capabilities
          </span>
          <h3 className="text-xl font-bold text-white">
            Enterprise Guardrails for Autonomous Systems
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Prompt Injection Defense</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects instruction overrides and hidden CSS/HTML injection in scraped external documents before execution.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <EyeOff className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Data Minimization</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Redacts sensitive fields (PAN, SSN, salary) dynamically so AI only receives the minimum attributes necessary.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Terminal className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Tool-Call Firewall</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restricts tool invocations like Delete File, Send Email, or Raw HTTP based on temporary passport scopes.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-[#0C1322] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Network className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Multi-Agent Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enforces non-inheritable authority chains to prevent chained agents from escalating system privileges.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0C1528] to-[#0A0F1D] text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-bold text-white">
          Experience Autonomous AI Security in Action
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Test prompt injections, review real-time tool blocks, inspect Data DNA, and simulate canary honeytokens.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onLaunchFullDemo}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Security Demo</span>
          </button>
          <button
            onClick={() => onNavigate('attack-simulator')}
            className="px-5 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            Open Attack Simulator
          </button>
        </div>
      </section>
    </div>
  );
};
