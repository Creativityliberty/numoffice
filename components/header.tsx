'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, LayoutGrid, Sliders, FileText, Eye, Flame, Plus, TrendingUp, Sun, Moon, BookOpen
} from 'lucide-react';
import { Client } from '../lib/types';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  filterType: 'active' | 'archived' | 'all';
  filteredClients: Client[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'detail' | 'overview' | 'clients' | 'architecture';
  setViewMode: (mode: 'detail' | 'overview' | 'clients' | 'architecture') => void;
  showDashboardWidgets: boolean;
  setShowDashboardWidgets: (show: boolean) => void;
  overviewCols: number;
  setOverviewCols: (cols: number) => void;
  completedToday: number;
  setIsGameChallengerOpen: (open: boolean) => void;
  taskCompletions7Days: Array<{ dateStr: string; count: number }>;
  setIsAddClientOpen: (open: boolean) => void;
  stats: {
    globalProgress: number;
  };
  isDbMode: boolean;
}

export default function Header({
  theme,
  toggleTheme,
  filterType,
  filteredClients,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  showDashboardWidgets,
  setShowDashboardWidgets,
  overviewCols,
  setOverviewCols,
  completedToday,
  setIsGameChallengerOpen,
  taskCompletions7Days,
  setIsAddClientOpen,
  stats,
  isDbMode,
}: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className={`border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 transition-all duration-300 z-20 shadow-md ${
      isDark 
        ? 'bg-[#040815]/55 border-white/[0.04] text-white backdrop-blur-xl' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center justify-between md:justify-start gap-4 flex-wrap">
        <div>
          <h1 className={`text-xl font-black tracking-tight flex items-center gap-2 flex-wrap ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span>Tableau de Bord</span>
            {isDbMode ? (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-mono font-bold tracking-tight inline-flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                PostgreSQL Live
              </span>
            ) : (
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/20 font-mono font-bold tracking-tight inline-flex items-center gap-1 shrink-0 bg-opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Local Mode
              </span>
            )}
            {filterType === 'archived' ? (
              <span className="text-[10px] bg-blue-500/10 text-blue-650 dark:text-sky-400 px-2.5 py-0.5 rounded-lg border border-blue-500/20 uppercase font-black tracking-wider">Archivés</span>
            ) : filterType === 'all' ? (
              <span className={`text-[10px] px-2.5 py-0.5 rounded-lg border uppercase font-black tracking-wider ${
                isDark ? 'bg-white/10 text-zinc-350 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>Bureau Global</span>
            ) : null}
          </h1>
          <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
            {filteredClients.length} projet{filteredClients.length > 1 ? 's' : ''} correspondant{filteredClients.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Dynamic global progress meter */}
        <div className={`hidden lg:flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs font-semibold ${
          isDark ? 'bg-white/[0.02] border-white/[0.05] text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <TrendingUp size={14} className="text-blue-550 dark:text-sky-400" />
          <span>Avancement:</span>
          <span className="font-extrabold text-blue-600 dark:text-sky-400">{stats.globalProgress}%</span>
          <div className={`w-16 h-1.5 rounded-full overflow-hidden ml-1 ${isDark ? 'bg-white/[0.05]' : 'bg-slate-200'}`}>
            <div className="h-full bg-gradient-to-r from-blue-600 to-sky-450" style={{ width: `${stats.globalProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3.5 select-none">
        {/* Quick Search */}
        <div className="relative">
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className={`pl-9 pr-4 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-450 w-40 lg:w-48 transition-all ${
              isDark 
                ? 'bg-[#0a0b12]/60 text-slate-100 placeholder-zinc-650 border-white/[0.06] backdrop-blur-sm' 
                : 'bg-slate-50 text-slate-800 placeholder-slate-450 border-slate-200'
            }`}
          />
        </div>

        {/* View Switcher Segment */}
        <div className={`flex p-1 rounded-xl shrink-0 border ${
          isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-slate-100 border-slate-200/60'
        }`}>
          <button 
            onClick={() => setViewMode('detail')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              viewMode === 'detail' 
                ? 'bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 text-neutral-950 shadow-md font-black' 
                : isDark ? 'text-zinc-450 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={13} />
            <span className="hidden sm:inline">Détaillée</span>
          </button>
          <button 
            onClick={() => setViewMode('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              viewMode === 'overview' 
                ? 'bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 text-neutral-950 shadow-md font-black' 
                : isDark ? 'text-zinc-450 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders size={13} />
            <span className="hidden sm:inline">Globale</span>
          </button>
          <button 
            onClick={() => setViewMode('clients')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              viewMode === 'clients' 
                ? 'bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 text-neutral-950 shadow-md font-black' 
                : isDark ? 'text-zinc-450 hover:text-white' : 'text-slate-505 hover:text-slate-900'
            }`}
          >
            <FileText size={13} />
            <span className="hidden sm:inline">Clients</span>
          </button>
          <button 
            onClick={() => setViewMode('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              viewMode === 'architecture' 
                ? 'bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 text-neutral-950 shadow-md font-black' 
                : isDark ? 'text-zinc-450 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen size={13} />
            <span className="hidden sm:inline">Architecture</span>
          </button>
        </div>

        {/* Graphs toggle */}
        {viewMode !== 'clients' && viewMode !== 'architecture' && (
          <button 
            onClick={() => setShowDashboardWidgets(!showDashboardWidgets)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl cursor-pointer transition-all border ${
              showDashboardWidgets 
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-sky-400 hover:bg-blue-100/15' 
                : isDark 
                  ? 'bg-white/[0.02] border-white/[0.05] text-zinc-400 hover:bg-white/[0.04] hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-505 hover:bg-slate-50 hover:text-slate-800 shadow-sm'
            }`}
          >
            <Eye size={13} className={showDashboardWidgets ? "text-blue-500 dark:text-sky-400 animate-pulse" : ""} />
            <span className="hidden lg:inline">{showDashboardWidgets ? 'Masquer Widgets' : 'Afficher Widgets'}</span>
          </button>
        )}

        {/* Columns count slider */}
        {viewMode === 'overview' && (
          <div className={`flex items-center gap-3 border px-3 py-1.5 rounded-xl shrink-0 ${
            isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Colonnes: {overviewCols}</span>
            <input 
              type="range" 
              min="4" 
              max="10" 
              value={overviewCols} 
              onChange={(e) => setOverviewCols(Number(e.target.value))}
              className="w-16 sm:w-20 lg:w-24 accent-sky-400 h-1 rounded-lg bg-zinc-300 dark:bg-[#27272a] cursor-pointer"
            />
          </div>
        )}

        {/* Game Challenger tracker widget preview */}
        <div 
          onClick={() => setIsGameChallengerOpen(true)}
          className="flex bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 rounded-xl p-[1px] hover:scale-105 transition-all duration-300 shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <div className={`rounded-[11px] p-1.5 pl-2.5 flex items-center gap-2.5 text-white ${
            isDark ? 'bg-[#040815]/95 hover:bg-zinc-900/40' : 'bg-slate-900 hover:bg-slate-950 shadow-inner'
          }`}>
            <div className="relative">
              <Flame size={15} className="text-sky-400 drop-shadow-sm animate-bounce" />
              {completedToday > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[8px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full border border-sky-400"
                >
                  {completedToday}
                </motion.div>
              )}
            </div>

            <div className="flex flex-col text-left mr-1 select-none">
              <span className="text-[8px] font-black uppercase text-sky-400 tracking-widest font-mono">CHALLENGER</span>
              <span className="text-[10px] font-extrabold leading-none mt-0.5">{completedToday} fait</span>
            </div>

            {/* Sparkline curve */}
            <div className={`w-12 sm:w-16 h-7 border rounded-lg p-1 flex items-center justify-center relative shadow-inner overflow-hidden select-none ${
              isDark ? 'bg-[#08080c] border-white/[0.05]' : 'bg-black/20 border-white/5'
            }`}>
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0,100 ${taskCompletions7Days.map((d, idx) => `L ${idx * 16.6}, ${100 - Math.min(90, d.count * 15)}`).join(' ')} L 100,100 Z`} 
                  fill="url(#curveGradient)"
                />
                <path 
                  d={taskCompletions7Days.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${idx * 16.6}, ${100 - Math.min(90, d.count * 15)}`).join(' ')} 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Global create client CTA */}
        <button 
          onClick={() => setIsAddClientOpen(true)}
          className="bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 text-neutral-950 hover:brightness-110 active:scale-95 transition-all px-4 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer border border-sky-400/10"
        >
          <Plus size={14} className="stroke-[3px]" />
          <span className="uppercase tracking-widest font-mono">Créer</span>
        </button>

        {/* Accessible simple mode theme switcher header shortcut */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl cursor-pointer hover:scale-105 transition-all border ${
            isDark 
              ? 'bg-white/[0.02] border-white/[0.05] text-sky-400 hover:bg-white/[0.04]' 
              : 'bg-slate-50 border-slate-200 text-blue-650 hover:bg-slate-100 shadow-sm'
          }`}
          title={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
