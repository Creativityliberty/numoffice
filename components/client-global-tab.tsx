'use client';

import React, { useState } from 'react';
import { Check, Edit2, ShieldAlert } from 'lucide-react';
import { Client, Project } from '../lib/types';

interface ClientGlobalTabProps {
  theme: 'dark' | 'light';
  filteredClients: Client[];
  projects: Record<string, Project>;
  overviewCols: number;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setSelectedClientId: (id: string | null) => void;
  setViewMode: (mode: 'detail' | 'overview' | 'clients') => void;
}

export default function ClientGlobalTab({
  theme,
  filteredClients,
  projects,
  overviewCols,
  updateProject,
  setSelectedClientId,
  setViewMode
}: ClientGlobalTabProps) {
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6 select-none" id="global-tab-wrapper">
      <div className={`border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-white/[0.01] border-white/[0.05]' 
          : 'bg-white border-slate-205 shadow-md'
      }`}>
        
        {/* Responsive Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-wider font-mono ${
                isDark ? 'border-white/[0.04] bg-black/15 text-zinc-500' : 'border-slate-100 bg-slate-50/50 text-slate-500'
              }`}>
                <th className="p-4 pl-6">Client</th>
                <th className="p-4">Avancement</th>
                
                {/* Dynamically render step columns according to overviewCols count slider parameter */}
                {Array.from({ length: overviewCols }).map((_, idx) => (
                  <th key={idx} className="p-4 text-center">Étape {idx + 1}</th>
                ))}
                
                <th className="p-4 pr-6 text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className={`divide-y text-xs font-semibold ${
              isDark ? 'divide-white/[0.03] text-zinc-300' : 'divide-slate-100 text-slate-700'
            }`}>
              {filteredClients.map(client => {
                const project = projects[client.id];
                if (!project) return null;

                const totalSteps = project.steps.length;
                const doneSteps = project.steps.filter(s => s.isCompleted).length;
                const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
                const isBlocked = project.currentBlocker !== 'none';

                return (
                  <tr 
                    key={client.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-white/[0.01]' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Header company client */}
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className={`font-extrabold text-[12.5px] leading-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>{client.company || client.name}</span>
                        <span className={`text-[10px] truncate mt-0.5 max-w-[150px] font-mono leading-none ${
                          isBlocked 
                            ? 'text-blue-500 font-extrabold animate-pulse' 
                            : isDark ? 'text-zinc-505' : 'text-slate-450'
                        }`}>
                          {isBlocked ? '⚠️ PROJET BLOQUÉ' : client.name}
                        </span>
                      </div>
                    </td>

                    {/* Progression bar column */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 rounded-full w-20 overflow-hidden ${isDark ? 'bg-white/[0.05]' : 'bg-slate-150'}`}>
                          <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className={`text-[10px] font-black font-mono leading-none ${
                          isDark ? 'text-zinc-400' : 'text-slate-600'
                        }`}>{pct}%</span>
                      </div>
                    </td>

                    {/* Step boxes checkboxes columns inside row */}
                    {Array.from({ length: overviewCols }).map((_, stepIdx) => {
                      const step = project.steps[stepIdx];
                      
                      if (!step) {
                        return (
                          <td key={stepIdx} className="p-4 text-center select-none text-zinc-650 dark:text-zinc-800 text-[10px] font-bold">—</td>
                        );
                      }

                      return (
                        <td key={stepIdx} className="p-4 text-center" title={`${step.label} (${step.isCompleted ? 'Fait' : 'À faire'})`}>
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                const nextSteps = project.steps.map(s => {
                                  if (s.id === step.id) {
                                    const nextComplete = !s.isCompleted;
                                    return {
                                      ...s,
                                      isCompleted: nextComplete,
                                      completedAt: nextComplete ? Date.now() : undefined
                                    };
                                  }
                                  return s;
                                });
                                updateProject(client.id, { steps: nextSteps });
                              }}
                              className={`w-5.5 h-5.5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                step.isCompleted 
                                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-transparent text-neutral-950 font-black' 
                                  : isDark 
                                    ? 'border-white/[0.08] hover:border-sky-450 bg-black/30' 
                                    : 'border-slate-300 hover:border-blue-500 bg-slate-50'
                              }`}
                            >
                              {step.isCompleted && <Check size={11} strokeWidth={4} />}
                            </button>
                          </div>
                        </td>
                      );
                    })}

                    {/* Action edit buttons redirecting to detailed panel */}
                    <td className="p-4 pr-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setViewMode('detail');
                        }}
                        className={`text-[10.5px] font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1 mx-auto transition-all cursor-pointer ${
                          isDark 
                            ? 'bg-white/[0.02] border-white/[0.05] text-sky-400 hover:bg-white/[0.05]' 
                            : 'bg-blue-50/50 border-blue-200 text-blue-800 hover:bg-blue-100 shadow-nano'
                        }`}
                      >
                        <Edit2 size={11} />
                        <span>Consulter</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={overviewCols + 3} className={`p-8 text-center italic ${
                    isDark ? 'text-zinc-600' : 'text-slate-400'
                  }`}>
                    Aucun projet correspondant à vos filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
