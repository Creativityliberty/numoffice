'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, ChevronLeft, ChevronRight, Clock, Archive, Folder, 
  Sparkles, RefreshCw, Moon, Sun
} from 'lucide-react';
import { Client, Project, PROJECT_TYPE_LABELS } from '../lib/types';

interface SidebarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  filterType: 'active' | 'archived' | 'all';
  setFilterType: (type: 'active' | 'archived' | 'all') => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  setViewMode: (mode: 'detail' | 'overview' | 'clients' | 'architecture') => void;
  clients: Client[];
  projects: Record<string, Project>;
  stats: {
    totalProjects: number;
    completedProjects: number;
    totalTasksCompleted: number;
    totalTasks: number;
    activeProjects: number;
    archivedProjects: number;
    globalProgress: number;
  };
  handleAnalyzeHealth: () => void;
  resetToDemo: () => void;
}

export default function Sidebar({
  theme,
  toggleTheme,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  filterType,
  setFilterType,
  selectedClientId,
  setSelectedClientId,
  setViewMode,
  clients,
  projects,
  stats,
  handleAnalyzeHealth,
  resetToDemo
}: SidebarProps) {
  const isDark = theme === 'dark';

  return (
    <motion.div 
      animate={{ width: isSidebarCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-full flex flex-col shrink-0 relative border-r transition-colors duration-300 shadow-2xl z-20 ${
        isDark 
          ? 'bg-[#091122]/85 border-[#1e2a4a]/50 text-white backdrop-blur-2xl' 
          : 'bg-white border-slate-200/80 text-slate-800'
      }`}
    >
      {/* Toggle Collapse Button */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`absolute -right-3 top-6 border rounded-full p-1 shadow-lg hover:scale-110 transition-all z-50 cursor-pointer ${
          isDark 
            ? 'bg-[#091122] border-white/[0.08] text-zinc-400 hover:text-sky-450' 
            : 'bg-white border-slate-200 text-slate-500 hover:text-blue-500'
        }`}
      >
        {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Sidebar Header / Logo */}
      <div className={`p-5 flex items-center justify-between border-b overflow-hidden ${
        isDark ? 'border-white/[0.04] bg-black/10' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 via-sky-400 to-cyan-300 p-2 rounded-xl shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.15)] animate-pulse-slow">
            <Flame size={20} className="text-black" />
          </div>
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col select-none"
            >
              <span className={`font-extrabold text-sm tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Nümtema <span className="text-blue-600 dark:text-sky-400 font-black">Office</span>
              </span>
              <span className={`text-[9px] font-black tracking-widest uppercase leading-none mt-0.5 font-mono ${
                isDark ? 'text-sky-400/85' : 'text-blue-600'
              }`}>
                Suivi de Production
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* --- DOPAMINE PROGRESS BADGES PANEL --- */}
      <div className={`p-4 border-b text-slate-450 space-y-3 ${
        isDark ? 'border-white/[0.04] bg-black/5' : 'border-slate-100 bg-slate-50/20'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-black uppercase tracking-widest font-mono ${
            isDark ? 'text-zinc-500' : 'text-slate-400'
          }`}>
            {isSidebarCollapsed ? 'Suivi' : 'Indicateurs de Suivi'}
          </span>
          {!isSidebarCollapsed && (
            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border flex items-center gap-1 shadow-sm ${
              isDark 
                ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' 
                : 'text-blue-700 bg-blue-50 border-blue-200/50'
            }`}>
              <Flame size={11} className={isDark ? 'text-sky-400' : 'text-blue-600'} />
              <span>SCORE: {stats.totalTasksCompleted * 10} pts</span>
            </span>
          )}
        </div>

        <div className="space-y-2">
          {/* Indicator Badges */}
          <div 
            className={`p-2 rounded-xl border flex items-center gap-2.5 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            } ${
              isDark 
                ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.05]' 
                : 'bg-white hover:bg-slate-50 border-slate-200/60 shadow-sm'
            }`} 
            title="Tâches accomplies"
          >
            <div className={`p-1.5 rounded-lg shrink-0 border ${
              isDark 
                ? 'bg-sky-500/10 text-sky-450 border-sky-500/10' 
                : 'bg-blue-50 text-blue-600 border-blue-200/40'
            }`}>
              <Clock size={16} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className={`text-[11px] font-bold tracking-wide truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {stats.totalTasksCompleted} accomplies
                </span>
                <span className={`text-[9px] truncate ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                  {stats.totalTasks - stats.totalTasksCompleted} restantes
                </span>
              </div>
            )}
          </div>

          <div 
            className={`p-2 rounded-xl border flex items-center gap-2.5 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            } ${
              isDark 
                ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.05]' 
                : 'bg-white hover:bg-slate-50 border-slate-200/60 shadow-sm'
            }`} 
            title="Projets terminés / archivés"
          >
            <div className={`p-1.5 rounded-lg shrink-0 border ${
              isDark 
                ? 'bg-sky-500/10 text-sky-450 border-sky-500/10' 
                : 'bg-blue-50 text-blue-600 border-blue-200/40'
            }`}>
              <Archive size={16} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className={`text-[11px] font-bold tracking-wide truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {stats.completedProjects} complétés
                </span>
                <span className={`text-[9px] truncate ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                  {stats.archivedProjects} archivés
                </span>
              </div>
            )}
          </div>

          {/* Global progress tracker */}
          <div className="pt-1.5">
            <div className={`flex items-center justify-between text-[10px] font-bold mb-1 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}>
              {!isSidebarCollapsed && <span>Progression Globale</span>}
              <span className={isSidebarCollapsed ? 'w-full text-center text-blue-600 dark:text-sky-400' : 'text-blue-600 dark:text-sky-400'}>
                {stats.globalProgress}%
              </span>
            </div>
            <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.04]' : 'bg-slate-150'}`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.globalProgress}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-blue-600 to-sky-450"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Filters */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto hide-scrollbar bg-transparent">
        <span className={`block text-[9px] font-black uppercase tracking-widest mb-2 font-mono ${
          isDark ? 'text-zinc-650' : 'text-slate-450'
        }`}>
          {!isSidebarCollapsed ? 'Filtres de statut' : 'Statuts'}
        </span>

        <button 
          onClick={() => setFilterType('active')}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            filterType === 'active' 
              ? 'bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 text-neutral-950 font-black shadow-lg shadow-blue-500/10' 
              : isDark 
                ? 'text-zinc-400 hover:text-white hover:bg-white/[0.03]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock size={16} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Projets Actifs ({stats.activeProjects})</span>}
        </button>

        <button 
          onClick={() => setFilterType('archived')}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            filterType === 'archived' 
              ? isDark 
                ? 'bg-white/[0.05] text-zinc-100 border-l-4 border-sky-400 shadow-md' 
                : 'bg-slate-100 text-slate-900 border-l-4 border-blue-500 shadow-sm'
              : isDark 
                ? 'text-zinc-400 hover:text-white hover:bg-white/[0.03]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Archive size={16} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Archivés ({stats.archivedProjects})</span>}
        </button>

        <button 
          onClick={() => setFilterType('all')}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            filterType === 'all' 
              ? isDark 
                ? 'bg-white/[0.05] text-white border-l-4 border-zinc-500' 
                : 'bg-slate-100 text-slate-950 border-l-4 border-slate-400'
              : isDark 
                ? 'text-zinc-400 hover:text-white hover:bg-white/[0.03]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Folder size={16} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Tous ({stats.totalProjects})</span>}
        </button>

        {/* AI Production Director Theme Active Widget button */}
        <button 
          onClick={handleAnalyzeHealth}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-black cursor-pointer transition-all bg-gradient-to-r from-blue-600 via-sky-450 to-cyan-400 text-neutral-950 hover:brightness-110 active:scale-95 shadow-lg shadow-blue-500/15 border border-sky-405/20 mt-4"
        >
          <Sparkles size={16} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Directeur Virtuel IA</span>}
        </button>

        {/* Theme Switcher Toggle (Request fulfilled in very details!) */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all mt-3 border ${
            isDark 
              ? 'bg-white/[0.02] border-white/[0.04] text-sky-400 hover:bg-white/[0.05]' 
              : 'bg-blue-50 border-blue-200/50 text-blue-800 hover:bg-blue-100/50'
          }`}
        >
          {isDark ? <Sun size={15} className="shrink-0" /> : <Moon size={15} className="shrink-0" />}
          {!isSidebarCollapsed && (
            <span className="truncate font-bold">
              {isDark ? 'Basculer en Mode Clair' : 'Basculer en Mode Sombre'}
            </span>
          )}
        </button>

        {/* Recent clients list with customized theme colors */}
        {!isSidebarCollapsed && clients.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-200/10 dark:border-zinc-900 space-y-2 select-none">
            <span className={`block text-[10px] font-black uppercase tracking-widest mb-2 px-1 ${
              isDark ? 'text-sky-400' : 'text-blue-700'
            }`}>
              Clients Récents
            </span>
            <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1 hide-scrollbar">
              {clients.slice(0, 10).map(c => {
                const project = projects[c.id];
                const hasBlocker = project && project.currentBlocker && project.currentBlocker !== 'none';
                const isSelected = selectedClientId === c.id;
                
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedClientId(c.id);
                      setViewMode('detail');
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between text-[11px] font-semibold border ${
                      isSelected 
                        ? isDark 
                          ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 font-bold shadow-[0_0_15px_rgba(56,189,248,0.08)]' 
                          : 'bg-blue-50/70 border-blue-300/65 text-blue-900 font-bold shadow-sm'
                        : isDark
                          ? 'bg-[#050a14]/20 border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                          : 'bg-slate-50/50 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 hover:border-slate-200/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        hasBlocker 
                          ? 'bg-rose-500 animate-pulse' 
                          : project?.steps?.every(s => s.isCompleted) 
                            ? 'bg-emerald-500' 
                            : 'bg-blue-500'
                      }`} />
                      <div className="truncate flex-1">
                        <span className={`block truncate font-extrabold leading-tight-short ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}>{c.company || 'Sans Entreprise'}</span>
                        <span className={`block text-[9.5px] truncate leading-none mt-0.5 ${
                          isDark ? 'text-zinc-500' : 'text-slate-400'
                        }`}>{c.name}</span>
                      </div>
                    </div>
                    
                    {project?.financials?.quoteAmount && (
                      <span className={`text-[9.5px] font-bold font-mono px-1 rounded ml-1 shrink-0 ${
                        isDark ? 'text-sky-400 bg-sky-500/5' : 'text-blue-700 bg-blue-100/40'
                      }`}>
                        {project.financials.quoteAmount}€
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Re-sync restore demo button */}
        <button 
          onClick={() => {
            if (confirm('Voulez-vous restaurer les données de démonstration ? Vos modifications actuelles seront écrasées.')) {
              resetToDemo();
              window.location.reload();
            }
          }}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs hover:text-rose-500 hover:bg-rose-500/5 transition-all mt-4 border border-dashed cursor-pointer ${
            isDark 
              ? 'text-slate-500 border-zinc-900' 
              : 'text-slate-450 border-slate-200'
          }`}
        >
          <RefreshCw size={14} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Données de démo</span>}
        </button>
      </div>

      {/* Footer copyright */}
      <div className={`p-4 border-t overflow-hidden text-center text-[10px] font-medium leading-tight shrink-0 select-none ${
        isDark ? 'border-zinc-900 bg-[#050a14] text-slate-600' : 'border-slate-100 bg-slate-50/50 text-slate-400'
      }`}>
        {!isSidebarCollapsed ? (
          <span>Nümtema Desk © 2026</span>
        ) : (
          <span>N</span>
        )}
      </div>
    </motion.div>
  );
}
