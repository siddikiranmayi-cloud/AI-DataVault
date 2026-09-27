import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  KeyRound, 
  Database, 
  ShieldAlert, 
  Wrench, 
  Radio, 
  CheckSquare, 
  AlertTriangle, 
  Bug, 
  Network, 
  FileText, 
  Lock, 
  Layers, 
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  pendingApprovalsCount: number;
  openIncidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  pendingApprovalsCount,
  openIncidentsCount
}) => {
  const navSections = [
    {
      title: 'Command',
      items: [
        { id: 'dashboard', label: 'Security Dashboard', icon: LayoutDashboard },
        { id: 'landing', label: 'Product Vision & Demo', icon: Sparkles }
      ]
    },
    {
      title: 'Agent Controls',
      items: [
        { id: 'agents', label: 'AI Agent Monitor', icon: Bot },
        { id: 'permissions', label: 'Permission Passports', icon: KeyRound },
        { id: 'multi-agent', label: 'Multi-Agent & Sandbox', icon: Network }
      ]
    },
    {
      title: 'Protected Vault',
      items: [
        { id: 'data-vault', label: 'Data Vault & DNA', icon: Database },
        { id: 'canary', label: 'Canary Honey Data', icon: Bug }
      ]
    },
    {
      title: 'Firewall & Attacks',
      items: [
        { id: 'attack-simulator', label: 'Attack Simulator', icon: ShieldAlert },
        { id: 'tool-firewall', label: 'Tool-Call Firewall', icon: Wrench },
        { id: 'threat-monitor', label: 'Exfiltration & Dest.', icon: Radio }
      ]
    },
    {
      title: 'Operations',
      items: [
        { 
          id: 'approvals', 
          label: 'Approval Center', 
          icon: CheckSquare,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        },
        { 
          id: 'incidents', 
          label: 'Incident Center', 
          icon: AlertTriangle,
          badge: openIncidentsCount > 0 ? openIncidentsCount : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        },
        { id: 'audit-logs', label: 'Audit Trail', icon: FileText }
      ]
    },
    {
      title: 'Governance',
      items: [
        { id: 'architecture', label: 'Zero-Trust Principles', icon: Layers },
        { id: 'privacy', label: 'Privacy Center', icon: Lock }
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#080C14] border-r border-slate-800/80 w-64">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80 lg:hidden">
        <span className="text-sm font-bold text-white tracking-wide">Security Navigation</span>
        <button 
          onClick={onCloseMobile}
          className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              {section.title}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20 shadow-inner shadow-cyan-950/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Zero-Trust Baseline Footer Badge */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/30">
        <div className="p-2.5 rounded-lg border border-slate-800 bg-[#090E18]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-300">Policy Mode</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FAIL-CLOSED
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI can request data; AI never automatically owns it.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
