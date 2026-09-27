import React from 'react';
import { 
  ShieldCheck, 
  Menu, 
  Play, 
  Bell, 
  ExternalLink,
  RotateCcw,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  onLaunchFullDemo: () => void;
  pendingApprovalsCount: number;
  openIncidentsCount: number;
  onResetDemoData: () => void;
  onOpenBenchmark?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onLaunchFullDemo,
  pendingApprovalsCount,
  openIncidentsCount,
  onResetDemoData,
  onOpenBenchmark
}) => {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-800/80 bg-[#090D16]/95 backdrop-blur-md px-4 lg:px-8">
      <div className="flex h-full items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 text-slate-400 hover:text-slate-200 lg:hidden rounded-md hover:bg-slate-800/60 cursor-pointer"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white font-sans">
                AI DataVault
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`transition-colors hover:text-cyan-300 py-1 cursor-pointer ${currentTab === 'dashboard' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('attack-simulator')}
            className={`transition-colors hover:text-cyan-300 py-1 cursor-pointer ${currentTab === 'attack-simulator' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
          >
            Attack Simulator
          </button>
          <button
            onClick={() => onSelectTab('data-vault')}
            className={`transition-colors hover:text-cyan-300 py-1 cursor-pointer ${currentTab === 'data-vault' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
          >
            Data Vault
          </button>
          <button
            onClick={() => onSelectTab('tool-firewall')}
            className={`transition-colors hover:text-cyan-300 py-1 cursor-pointer ${currentTab === 'tool-firewall' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
          >
            Tool Firewall
          </button>
          <button
            onClick={() => onSelectTab('approvals')}
            className={`transition-colors hover:text-cyan-300 py-1 flex items-center gap-1.5 cursor-pointer ${currentTab === 'approvals' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
          >
            <span>Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] flex items-center justify-center font-mono">
                {pendingApprovalsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('architecture')}
            className={`transition-colors hover:text-cyan-300 py-1 cursor-pointer ${currentTab === 'architecture' ? 'text-cyan-400 border-b border-cyan-400 font-semibold' : ''}`}
          >
            Zero-Trust Architecture
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2">
          {onOpenBenchmark && (
            <button
              onClick={onOpenBenchmark}
              className="px-2.5 py-1.5 text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer hidden sm:flex"
              title="Run automated 6-case Zero-Trust compliance suite"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Benchmark (6 Cases)</span>
            </button>
          )}

          <button
            onClick={onResetDemoData}
            title="Reset to default demo data"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors text-xs flex items-center gap-1 hidden md:flex cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reset Data</span>
          </button>

          <button
            onClick={() => onSelectTab('incidents')}
            className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            title="Security Incidents"
          >
            <Bell className="w-4 h-4" />
            {openIncidentsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={onLaunchFullDemo}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg hover:from-cyan-300 hover:to-teal-300 transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-900/40 whitespace-nowrap cursor-pointer"
          >
            <Play className="w-3 h-3 fill-slate-900" />
            <span>Run Security Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
