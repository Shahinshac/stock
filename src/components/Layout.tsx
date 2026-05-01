import React from 'react';
import { Activity, Globe, LayoutDashboard, Settings } from 'lucide-react';
import { Topbar } from './Topbar';

export const Layout = ({ children, activeView, onViewChange }: { children: React.ReactNode, activeView: string, onViewChange: (view: string) => void }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 bg-slate-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <Globe className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            OmniFi Hub
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => onViewChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => onViewChange('markets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'markets' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <Activity className="w-5 h-5" />
            <span className="font-medium">Markets</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={() => onViewChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'settings' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10" />
        <Topbar onViewChange={onViewChange} />
        {children}
      </main>
    </div>
  );
};
