'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Client, Project } from '../lib/types';

interface AdvancementWidgetProps {
  theme: 'dark' | 'light';
  clients: Client[];
  projects: Record<string, Project>;
  stats: {
    globalProgress: number;
  };
  setSelectedClientId: (id: string | null) => void;
  setViewMode: (mode: 'detail' | 'overview' | 'clients') => void;
}

export default function AdvancementWidget({
  theme,
  clients,
  projects,
  stats,
  setSelectedClientId,
  setViewMode
}: AdvancementWidgetProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`lg:col-span-2 border rounded-2xl p-4 flex flex-col h-[230px] shadow-2xl overflow-hidden transition-all duration-300 ${
      isDark 
        ? 'bg-white/[0.02] backdrop-blur-xl border-white/[0.05]' 
        : 'bg-white border-slate-200/80 shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className={`p-1.5 rounded-lg shrink-0 border ${
            isDark 
              ? 'bg-sky-500/10 text-sky-450 border-sky-400/20' 
              : 'bg-blue-50 text-blue-600 border-blue-200/40'
          }`}>
            <TrendingUp size={15} />
          </div>
          <div>
            <span className={`text-xs font-black uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>{"Tableau d'Avancement"}</span>
            <span className={`text-[9px] font-black block leading-none mt-0.5 font-mono tracking-widest ${
              isDark ? 'text-sky-400' : 'text-blue-600'
            }`}>{"PRIORITÉS D'EXÉCUTION"}</span>
          </div>
        </div>
        <span className={`text-xs font-black px-2.5 py-1 rounded-lg border leading-none shadow-sm ${
          isDark 
            ? 'text-sky-400 bg-sky-500/10 border-sky-400/20' 
            : 'text-blue-800 bg-blue-50 border-blue-200/60'
        }`}>{stats.globalProgress}% Global</span>
      </div>

      {/* Progress tracking dense rows */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 hide-scrollbar">
        {clients.filter(c => !c.isArchived).slice(0, 4).map(client => {
          const proj = projects[client.id];
          if (!proj) return null;
          const total = proj.steps.length;
          const done = proj.steps.filter(s => s.isCompleted).length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;
          const isBlocked = proj.currentBlocker !== 'none';

          return (
            <div 
              key={client.id}
              onClick={() => {
                setSelectedClientId(client.id);
                setViewMode('detail');
              }}
              className={`border p-2.5 flex items-center justify-between gap-3 transition-all rounded-xl cursor-pointer text-left select-none ${
                isDark 
                  ? 'bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.03] hover:border-white/[0.06]' 
                  : 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-150 hover:border-slate-300'
              }`}
            >
              <div className="min-w-0 flex-1">
                <h4 className={`text-[11px] font-extrabold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {client.company || client.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className={`h-1 rounded-full w-20 overflow-hidden ${isDark ? 'bg-white/[0.05]' : 'bg-slate-200'}`}>
                    <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className={`text-[9.5px] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{progress}%</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1">
                {isBlocked ? (
                  <span className="text-[9px] font-black text-blue-600 dark:text-sky-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider scale-[0.9]">Bloqué</span>
                ) : progress === 100 ? (
                  <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider scale-[0.9]">Livré</span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                    isDark ? 'text-zinc-400 bg-white/[0.03] border-white/[0.04]' : 'text-slate-500 bg-white border-slate-200'
                  }`}>{done}/{total} éts</span>
                )}
              </div>
            </div>
          );
        })}
        {clients.filter(c => !c.isArchived).length === 0 && (
          <div className={`flex-grow flex items-center justify-center italic text-[11px] h-full text-center py-8 select-none ${
            isDark ? 'text-zinc-500' : 'text-slate-400'
          }`}>
            Aucun projet actif en cours de livraison.
          </div>
        )}
      </div>
    </div>
  );
}
