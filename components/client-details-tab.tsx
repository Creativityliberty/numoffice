'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, AlertCircle, Calendar, ArrowRight, X, Archive, Trash2, Clock, 
  FileText, ExternalLink, Plus, Check, CheckCircle2
} from 'lucide-react';
import { Client, Project, OFFER_LABELS, PROJECT_TYPE_LABELS, BLOCKER_LABELS, Step, Blocker } from '../lib/types';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientDetailsTabProps {
  theme: 'dark' | 'light';
  filteredClients: Client[];
  projects: Record<string, Project>;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  selectedClientIds: string[];
  setSelectedClientIds: React.Dispatch<React.SetStateAction<string[]>>;
  getPaymentReminderInfo: (p: Project) => any;
  getReminderTemplate1: (cName: string, comp: string, amount: number) => string;
  getReminderTemplate2: (cName: string, comp: string, amount: number) => string;
  getProjectTheme: (type: any) => any;
}

export default function ClientDetailsTab({
  theme,
  filteredClients,
  projects,
  selectedClientId,
  setSelectedClientId,
  updateClient,
  deleteClient,
  updateProject,
  selectedClientIds,
  setSelectedClientIds,
  getPaymentReminderInfo,
  getReminderTemplate1,
  getReminderTemplate2,
  getProjectTheme
}: ClientDetailsTabProps) {
  const isDark = theme === 'dark';
  const [copiedReminder, setCopiedReminder] = useState<'relance1' | 'relance2' | null>(null);

  return (
    <div className="flex-grow flex overflow-hidden w-full relative" id="details-tab-wrapper">
      
      {/* LEFT AREA: GRID OF CARDS */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 hide-scrollbar relative content-start">
        {filteredClients.map(client => {
          const project = projects[client.id];
          if (!project) return null;

          const totalTasks = project.steps.length;
          const completedTasksCount = project.steps.filter(s => s.isCompleted).length;
          const progress = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
          const budgetPaidPercentage = project.financials.quoteAmount > 0 
            ? Math.round((project.financials.amountPaid / project.financials.quoteAmount) * 100) 
            : 0;

          const isBlocked = project.currentBlocker !== 'none';
          const pTheme = getProjectTheme(client.projectType);

          return (
            <motion.div 
              key={client.id}
              onClick={() => {
                setSelectedClientId(client.id);
              }}
              className={`backdrop-blur-xl rounded-2xl border transition-all flex flex-col p-4 text-left select-none relative min-h-[350px] ${
                selectedClientId === client.id 
                  ? isDark 
                    ? 'border-sky-400 ring-4 ring-sky-500/10 bg-white/[0.03]' 
                    : 'border-blue-500 ring-4 ring-blue-550/10 bg-white'
                  : isDark 
                    ? 'border-white/[0.04] bg-white/[0.02] hover:border-sky-500/30 hover:bg-white/[0.03]' 
                    : 'border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md'
              }`}
            >
              {/* Badge and Blocker indicators */}
              <div className={`flex items-start justify-between gap-2 border-b pb-3 mb-3 ${
                isDark ? 'border-white/[0.04]' : 'border-slate-100'
              }`}>
                <div className="min-w-0 flex-1">
                  <span className={`px-2 py-0.5 text-[8.5px] font-black rounded border tracking-wide uppercase ${pTheme.bg}`}>
                    {PROJECT_TYPE_LABELS[client.projectType]}
                  </span>
                  <h3 className={`text-sm font-extrabold tracking-tight truncate max-w-[150px] mt-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`} title={client.company || client.name}>
                    {client.company || client.name}
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {isBlocked && (
                    <div className="bg-blue-500/10 text-blue-650 dark:text-sky-400 border border-blue-500/25 rounded-xl px-2 py-0.5 text-[9px] font-black flex items-center gap-1 tracking-wider uppercase">
                      <AlertTriangle size={11} />
                      <span>Bloqué</span>
                    </div>
                  )}

                  {(() => {
                    const unpaid = project.financials.quoteAmount - project.financials.amountPaid;
                    if (unpaid > 0) {
                      const ageInDays = differenceInDays(new Date(), project.startDate ? new Date(project.startDate) : new Date());
                      if (ageInDays >= 14) {
                        return (
                          <div className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25 rounded-xl px-2 py-0.5 text-[9px] font-black flex items-center gap-1 tracking-wider uppercase animate-pulse">
                            <AlertCircle size={11} />
                            <span>Relance 2</span>
                          </div>
                        );
                      } else if (ageInDays >= 7) {
                        return (
                          <div className="bg-blue-500/10 text-blue-650 dark:text-sky-400 border border-blue-500/25 rounded-xl px-2 py-0.5 text-[9px] font-black flex items-center gap-1 tracking-wider uppercase">
                            <AlertTriangle size={11} />
                            <span>Relance 1</span>
                          </div>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Display Blocker Detail */}
              {isBlocked && (
                <div className={`border rounded-xl p-2.5 mb-3 text-[10px] font-semibold leading-relaxed flex gap-1.5 items-start ${
                  isDark ? 'bg-blue-500/5 border-blue-500/20 text-sky-400' : 'bg-blue-50/50 border-blue-250/70 text-blue-800'
                }`}>
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>Bloquant: <strong className="font-extrabold">{BLOCKER_LABELS[project.currentBlocker]}</strong></span>
                </div>
              )}

              {/* Progress Gauges */}
              <div className="space-y-4 mb-4 select-none">
                <div>
                  <div className={`flex justify-between items-center text-[10px] font-bold mb-1 leading-none ${
                    isDark ? 'text-zinc-500' : 'text-slate-450'
                  }`}>
                    <span>Progression</span>
                    <span className="text-blue-600 dark:text-sky-400 font-black">{progress}% ({completedTasksCount}/{totalTasks})</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden border relative ${
                    isDark ? 'bg-white/[0.05] border-white/[0.01]' : 'bg-slate-100 border-transparent'
                  }`}>
                    <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className={`flex justify-between items-center text-[10px] font-bold mb-1 leading-none ${
                    isDark ? 'text-zinc-505' : 'text-slate-450'
                  }`}>
                    <span>Finances Payées</span>
                    <span className="text-emerald-600 dark:text-emerald-450 font-black">{project.financials.amountPaid}€ / {project.financials.quoteAmount}€ ({budgetPaidPercentage}%)</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden border ${
                    isDark ? 'bg-white/[0.05] border-white/[0.01]' : 'bg-slate-100 border-transparent'
                  }`}>
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all rounded-full" style={{ width: `${budgetPaidPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Next active tasks list */}
              <div className="flex-1 space-y-1.5 select-none">
                <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 font-mono ${
                  isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}>Prochaines étapes</span>
                {project.steps.filter(s => !s.isCompleted).slice(0, 3).map((step, idx) => (
                  <div 
                    key={step.id} 
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSteps = project.steps.map(s => s.id === step.id ? { ...s, isCompleted: true, completedAt: Date.now() } : s);
                      updateProject(client.id, { steps: newSteps });
                    }}
                    className={`border rounded-xl px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-2 group transition-all ${
                      isDark 
                        ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.03] hover:border-white/[0.08] text-zinc-300 hover:text-white' 
                        : 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-nano'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isDark ? 'border-zinc-700 group-hover:bg-sky-500/10 group-hover:border-sky-400' : 'border-slate-300 group-hover:bg-blue-50 group-hover:border-blue-500'
                    }`}>
                      <Check size={10} className="text-blue-600 dark:text-sky-400 hidden group-hover:block" />
                    </div>
                    <span className="truncate flex-1 font-sans">{step.label}</span>
                  </div>
                ))}
                {project.steps.filter(s => !s.isCompleted).length === 0 && (
                  <div className={`border text-[11.5px] font-black rounded-xl p-3 text-center flex items-center justify-center gap-2 ${
                    isDark ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    <CheckCircle2 size={16} className="text-emerald-500 animate-pulse" />
                    <span>Projet entièrement livré !</span>
                  </div>
                )}
              </div>

              {/* Card Footer info */}
              <div className={`pt-3 border-t mt-4 flex items-center justify-between text-[10px] font-bold shrink-0 font-sans ${
                isDark ? 'border-white/[0.04] text-zinc-500' : 'border-slate-100 text-slate-450'
              }`}>
                {project.endDate ? (
                  <div className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>Fin: {format(new Date(project.endDate), 'dd MMM yyyy', { locale: fr })}</span>
                  </div>
                ) : (
                  <span />
                )}

                <span className="text-blue-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                  <span>Détails</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* RIGHT DETAILED ACTIVE DRAWER */}
      <AnimatePresence>
        {selectedClientId && (
          <>
            {/* Clickable Backdrop for mobile/tablet to easily close the drawer */}
            <motion.div 
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClientId(null)}
              className="absolute inset-0 bg-neutral-900/60 z-20 lg:hidden cursor-pointer backdrop-blur-sm"
              id="drawer-backdrop"
            />

            <motion.div 
              key="drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-full md:max-w-md lg:max-w-lg shrink-0 h-full border-l shadow-2xl flex flex-col z-25 absolute lg:relative top-0 right-0 ${
                isDark 
                  ? 'border-white/[0.04] bg-[#040815]/95 backdrop-blur-3xl text-zinc-150' 
                  : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              {(() => {
                const client = filteredClients.find(c => c.id === selectedClientId);
                const project = projects[selectedClientId];
                if (!client || !project) return null;

                const unpaid = project.financials.quoteAmount - project.financials.amountPaid;

                return (
                  <div className="h-full flex flex-col overflow-hidden">
                    {/* Panel Header */}
                    <div className={`p-5 border-b flex items-center justify-between shrink-0 select-none ${
                      isDark ? 'border-white/[0.04] bg-black/10' : 'border-slate-100 bg-slate-50/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedClientId(null)}
                          id="close-drawer-button"
                          className={`w-11 h-11 rounded-xl shrink-0 cursor-pointer transition-all flex items-center justify-center border ${
                            isDark 
                              ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08] text-zinc-400 hover:text-white hover:border-white/[0.12]' 
                              : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-505 hover:text-slate-900 hover:border-slate-300'
                          }`}
                          title="Fermer les détails"
                        >
                          <X size={20} strokeWidth={2.5} />
                        </button>
                        <div>
                          <h2 className={`text-base font-extrabold tracking-tight leading-tight ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>{client.company || client.name}</h2>
                          <span className="text-[10px] text-blue-700 dark:text-sky-400 font-black tracking-wider uppercase bg-sky-500/10 px-2.5 py-0.5 rounded-md mt-1 inline-block border border-blue-500/20 dark:border-sky-400/15">
                            {OFFER_LABELS[client.offerName as any] || client.offerName}
                          </span>
                        </div>
                      </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          updateClient(client.id, { isArchived: !client.isArchived });
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-all flex items-center gap-1.5 text-[9px] tracking-wider font-mono ${
                          client.isArchived 
                            ? 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-sky-450 font-extrabold' 
                            : isDark ? 'bg-transparent border-white/[0.06] text-zinc-450 hover:bg-white/[0.04] hover:text-white' : 'bg-transparent border-slate-350 text-slate-500 hover:bg-slate-100/50 hover:text-slate-900'
                        }`}
                      >
                        <Archive size={13} />
                        <span>{client.isArchived ? 'ARCHIVÉ' : 'ARCHIVER'}</span>
                      </button>

                      <button 
                        onClick={() => {
                          if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
                            deleteClient(client.id);
                            setSelectedClientId(null);
                          }
                        }}
                        className={`p-1.5 border rounded-lg cursor-pointer transition-colors ${
                          isDark ? 'hover:bg-red-950/40 text-zinc-500 hover:text-red-500 border-white/[0.05]' : 'hover:bg-red-50 text-slate-400 hover:text-red-600 border-slate-200'
                        }`}
                        title="Supprimer le projet"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Panel Scroll Body */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar bg-transparent">
                    {/* Project calendar details */}
                    <div className={`border rounded-2xl p-4 space-y-3 font-semibold text-xs select-none ${
                      isDark ? 'bg-white/[0.01] border-white/[0.04] text-zinc-400' : 'bg-slate-50/50 border-slate-200 text-slate-600'
                    }`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest block border-b pb-1.5 font-mono ${
                        isDark ? 'text-zinc-500 border-white/[0.04]' : 'text-slate-400 border-slate-250/70'
                      }`}>Calendrier du Projet</span>
                      
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className={`space-y-1 p-2.5 rounded-xl border ${isDark ? 'bg-[#121422]/40 border-white/[0.03]' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <span className="text-[9px] text-blue-700 dark:text-sky-450 uppercase font-black font-mono">Date de début</span>
                          <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                            <Clock size={14} className="text-blue-500" />
                            <span>{project.startDate ? format(new Date(project.startDate), 'dd MMMM yyyy', { locale: fr }) : 'Non démarré'}</span>
                          </div>
                        </div>

                        <div className={`space-y-1 p-2.5 rounded-xl border ${isDark ? 'bg-[#121422]/40 border-white/[0.03]' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <span className="text-[9px] text-blue-700 dark:text-sky-450 uppercase font-black font-mono">Date de fin (contractuelle)</span>
                          <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                            <Calendar size={14} className="text-blue-500" />
                            <span>{project.endDate ? format(new Date(project.endDate), 'dd MMMM yyyy', { locale: fr }) : 'Non planifiée'}</span>
                          </div>
                        </div>

                        <div className={`space-y-1 p-2.5 rounded-xl border ${isDark ? 'bg-[#121422]/40 border-white/[0.03]' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-500 uppercase font-bold font-mono">Date de livraison payée</span>
                          <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>{project.completedAt ? format(new Date(project.completedAt), 'dd MMMM yyyy', { locale: fr }) : 'En cours'}</span>
                          </div>
                        </div>

                        <div className={`space-y-1 p-2.5 rounded-xl border ${isDark ? 'bg-[#121422]/40 border-white/[0.03]' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <span className="text-[9px] text-slate-500 uppercase font-black font-mono">Date Archivage</span>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Archive size={14} />
                            <span>{client.archivedAt ? format(new Date(client.archivedAt), 'dd MMMM yyyy', { locale: fr }) : 'En ligne'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact details & Devis */}
                    <div className={`space-y-2 border p-4 rounded-2xl text-[11px] font-semibold ${
                      isDark ? 'bg-white/[0.01] border-white/[0.04] text-zinc-400' : 'bg-slate-50/50 border-slate-200 text-slate-600'
                    }`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest block border-b pb-1.5 font-mono ${
                        isDark ? 'text-zinc-500 border-white/[0.04]' : 'text-slate-400 border-slate-250/70'
                      }`}>Fiche Client & Devis</span>
                      
                      <div className="grid grid-cols-2 gap-3 pt-1.5">
                        <div>
                          <strong className="text-zinc-500 text-[10px] font-mono">Email:</strong> 
                          <p className={`text-[11.5px] font-bold truncate mt-0.5 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                            {client.email || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <strong className="text-zinc-500 text-[10px] font-mono">Téléphone:</strong> 
                          <p className={`text-[11.5px] font-bold truncate mt-0.5 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                            {client.phone || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Financial details box updates */}
                      <div className="pt-3 border-t border-dashed border-zinc-200/5 dark:border-zinc-800 grid grid-cols-3 gap-2.5 select-none text-center">
                        <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#121422]/45 border-white/[0.03]' : 'bg-white border-slate-100 shadow-sm'}`}>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Quota Devis</span>
                          <div className="flex items-center justify-center gap-0.5 mt-0.5 text-zinc-400">
                            <input 
                              type="number" 
                              value={project.financials.quoteAmount}
                              onChange={e => updateProject(client.id, { financials: { ...project.financials, quoteAmount: Number(e.target.value) } })}
                              className={`w-16 text-center font-extrabold rounded p-0.5 focus:outline-none ${
                                isDark 
                                  ? 'bg-[#0c0d15]/80 border-white/[0.06] text-sky-400 focus:border-sky-400' 
                                  : 'bg-slate-50 border-slate-250 text-blue-700 focus:border-blue-500'
                              }`}
                            />
                            <span>€</span>
                          </div>
                        </div>

                        <div className={`p-2 rounded-xl border ${isDark ? 'bg-[#121422]/45 border-white/[0.03]' : 'bg-white border-slate-100 shadow-sm'}`}>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Montant Payé</span>
                          <div className="flex items-center justify-center gap-0.5 mt-0.5 text-zinc-400">
                            <input 
                              type="number" 
                              value={project.financials.amountPaid}
                              onChange={e => updateProject(client.id, { financials: { ...project.financials, amountPaid: Number(e.target.value) } })}
                              className={`w-16 text-center font-extrabold rounded p-0.5 focus:outline-none ${
                                isDark 
                                  ? 'bg-[#0c0d15]/80 border-white/[0.06] text-emerald-450 focus:border-emerald-500' 
                                  : 'bg-slate-50 border-slate-250 text-emerald-700 focus:border-emerald-500'
                              }`}
                            />
                            <span>€</span>
                          </div>
                        </div>

                        <div className={`p-2 rounded-xl border flex flex-col justify-center ${isDark ? 'bg-[#121422]/45 border-white/[0.03]' : 'bg-white border-slate-100 shadow-sm'}`}>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono">Solde Reste</span>
                          <div className={`font-black text-[12px] leading-tight mt-1 ${unpaid <= 0 ? 'text-emerald-500' : isDark ? 'text-sky-400' : 'text-blue-850'}`}>
                            {unpaid}€
                          </div>
                        </div>
                      </div>

                      {/* Relances Emailing Automatic Templates Drawer Panel */}
                      {(() => {
                        const reminder = getPaymentReminderInfo(project);
                        return (
                          <div className={`pt-3.5 border-t mt-3.5 space-y-2 select-none ${
                            isDark ? 'border-white/[0.04]' : 'border-slate-100'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1 font-mono">
                                <FileText size={11} />
                                <span>Suivi des Relances</span>
                              </span>
                              <span className={`px-2 py-0.5 text-[8.5px] font-extrabold rounded-md border tracking-wide uppercase font-mono ${
                                reminder.alertLevel === 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                reminder.alertLevel === 1 ? 'bg-zinc-800 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-400 border-zinc-700' :
                                reminder.alertLevel === 2 ? 'bg-sky-500/10 text-blue-700 dark:text-sky-400 border-blue-300 dark:border-sky-400/25' :
                                'bg-red-500/15 text-red-650 dark:text-red-400 border-red-500/20'
                              }`}>
                                {reminder.label}
                              </span>
                            </div>

                            <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed flex items-start gap-2.5 ${
                              isDark ? 'bg-[#0e101a]/40 border-white/[0.03]' : 'bg-white border-slate-150'
                            }`}>
                              {reminder.alertLevel === 0 ? (
                                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                              ) : reminder.alertLevel === 1 ? (
                                <Clock size={15} className="text-slate-400 shrink-0 mt-0.5" />
                              ) : reminder.alertLevel === 2 ? (
                                <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                              )}
                              
                              <div className="space-y-2 flex-1 select-text">
                                <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                  {reminder.description}
                                </p>
                                
                                {unpaid > 0 && (
                                  <div className="pt-2 flex flex-wrap gap-2 select-none border-t border-zinc-100/10 dark:border-white/[0.02] mt-1.5">
                                    <button
                                      onClick={() => {
                                        const text = getReminderTemplate1(client.name, client.company, unpaid);
                                        navigator.clipboard.writeText(text);
                                        setCopiedReminder('relance1');
                                        setTimeout(() => setCopiedReminder(null), 2500);
                                      }}
                                      className={`text-[9.5px] font-black border px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-mono ${
                                        isDark 
                                          ? 'border-white/[0.05] hover:border-sky-400 bg-white/[0.02] hover:bg-sky-500/10 text-zinc-300 hover:text-sky-400' 
                                          : 'border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-100/30 text-slate-600 hover:text-blue-800'
                                      }`}
                                    >
                                      <FileText size={11} className="shrink-0" />
                                      <span>{copiedReminder === 'relance1' ? 'Copié !' : 'Copier Relance 1 sem'}</span>
                                    </button>
                                    
                                    <button
                                      onClick={() => {
                                        const text = getReminderTemplate2(client.name, client.company, unpaid);
                                        navigator.clipboard.writeText(text);
                                        setCopiedReminder('relance2');
                                        setTimeout(() => setCopiedReminder(null), 2500);
                                      }}
                                      className={`text-[9.5px] font-black border px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-mono ${
                                        isDark 
                                          ? 'border-white/[0.05] hover:border-red-500/40 bg-white/[0.02] hover:bg-red-550/10 text-zinc-300 hover:text-red-400' 
                                          : 'border-slate-200 hover:border-red-500 bg-slate-50 hover:bg-red-100/30 text-slate-600 hover:text-red-650'
                                      }`}
                                    >
                                      <FileText size={11} className="shrink-0" />
                                      <span>{copiedReminder === 'relance2' ? 'Copié !' : 'Copier Relance 2 sem'}</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Blocker selection & Project links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                      {/* Blocker selector */}
                      <div className={`space-y-1.5 p-3.5 border rounded-2xl ${
                        isDark ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-slate-50/50 border-slate-200'
                      }`}>
                        <span className={`text-[9.5px] font-black uppercase tracking-wider block font-mono ${
                          isDark ? 'text-zinc-500' : 'text-slate-450'
                        }`}>Bloquant Actuel</span>
                        <select 
                          value={project.currentBlocker} 
                          onChange={e => updateProject(client.id, { currentBlocker: e.target.value as Blocker })}
                          className={`w-full text-xs font-black border rounded-xl p-2 focus:outline-none text-blue-600 dark:text-sky-400 cursor-pointer ${
                            isDark ? 'border-white/[0.05] bg-[#0c0d15]/90' : 'border-slate-250 bg-white'
                          }`}
                        >
                          {Object.entries(BLOCKER_LABELS).map(([key, label]) => (
                            <option key={key} value={key} className={isDark ? "bg-zinc-950 font-bold text-white" : "bg-white font-bold text-slate-800"}>{label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Custom input fields links */}
                      <div className={`space-y-2 p-3.5 border rounded-2xl flex flex-col justify-center ${
                        isDark ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-slate-50/50 border-slate-200'
                      }`}>
                        <div className={`flex items-center justify-between text-[9.5px] font-black uppercase tracking-wider font-mono ${
                          isDark ? 'text-zinc-500' : 'text-slate-450'
                        }`}>
                          <span>Lien Drive</span>
                          {project.driveLink && <a href={project.driveLink} target="_blank" rel="noreferrer" className="text-blue-605 dark:text-sky-400 hover:underline"><ExternalLink size={10} /></a>}
                        </div>
                        <input 
                          type="text" 
                          value={project.driveLink}
                          onChange={e => updateProject(client.id, { driveLink: e.target.value })}
                          placeholder="https://drive.google.com/..."
                          className={`w-full text-xs font-semibold border rounded-xl p-2 focus:outline-none ${
                            isDark ? 'border-white/[0.05] bg-[#0c0d15]/90 text-zinc-300 focus:border-sky-400/40' : 'border-slate-250 bg-white text-slate-850 focus:border-blue-500'
                          }`}
                        />
                        
                        <div className={`flex items-center justify-between text-[9.5px] font-black uppercase tracking-wider mt-1.5 font-mono ${
                          isDark ? 'text-zinc-500' : 'text-slate-450'
                        }`}>
                          <span>Site Web</span>
                          {project.siteLink && <a href={project.siteLink} target="_blank" rel="noreferrer" className="text-blue-605 dark:text-sky-400 hover:underline"><ExternalLink size={10} /></a>}
                        </div>
                        <input 
                          type="text" 
                          value={project.siteLink}
                          onChange={e => updateProject(client.id, { siteLink: e.target.value })}
                          placeholder="https://client-test.com"
                          className={`w-full text-xs font-semibold border rounded-xl p-2 focus:outline-none ${
                            isDark ? 'border-white/[0.05] bg-[#0c0d15]/90 text-zinc-300 focus:border-sky-400/45' : 'border-slate-250 bg-white text-slate-850 focus:border-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Checkbox steps list container */}
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between border-b pb-2 ${
                        isDark ? 'border-white/[0.04]' : 'border-slate-100'
                      }`}>
                        <span className={`text-xs font-black uppercase tracking-widest block font-mono ${
                          isDark ? 'text-zinc-500' : 'text-slate-400'
                        }`}>Étapes de livraison ({project.steps.filter(s => s.isCompleted).length}/{project.steps.length})</span>
                        
                        <button 
                          onClick={() => {
                            const stepLabel = prompt('Ajouter une étape personnalisée :');
                            if (stepLabel) {
                              const newStep: Step = { id: 'custom_' + Date.now(), label: stepLabel, isCompleted: false };
                              updateProject(client.id, { steps: [...project.steps, newStep] });
                            }
                          }}
                          className={`text-[10px] font-black tracking-widest uppercase flex items-center gap-1 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                            isDark 
                              ? 'text-sky-400 bg-sky-500/10 hover:bg-sky-500/15 border-sky-400/20' 
                              : 'text-blue-800 bg-blue-50 hover:bg-blue-105 border-blue-200'
                          }`}
                        >
                          <Plus size={11} />
                          <span>Ajouter</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {project.steps.map((step, index) => (
                          <div 
                            key={step.id} 
                            className={`flex items-center gap-3 border p-3 rounded-2xl group transition-all ${
                              step.isCompleted 
                                ? isDark 
                                  ? 'border-emerald-500/10 bg-emerald-500/5' 
                                  : 'border-emerald-200 bg-emerald-50/50' 
                                : isDark 
                                  ? 'border-white/[0.04] bg-white/[0.01]' 
                                  : 'border-slate-150 bg-white shadow-nano'
                            }`}
                          >
                            {/* Actions toggle checkbox */}
                            <button 
                              onClick={() => {
                                const newSteps = project.steps.map(s => {
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
                                updateProject(client.id, { steps: newSteps });
                              }}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                step.isCompleted 
                                  ? 'bg-emerald-500 border-emerald-500 text-neutral-950' 
                                  : isDark 
                                    ? 'border-white/[0.1] bg-white/[0.02] hover:border-sky-400 hover:bg-sky-500/10' 
                                    : 'border-slate-350 bg-slate-50 hover:border-blue-500 hover:bg-blue-50'
                              }`}
                            >
                              {step.isCompleted && <Check size={12} strokeWidth={3} />}
                            </button>

                            <div className="flex-1 min-w-0 pr-2 select-text">
                              <span className={`text-[12.5px] font-semibold leading-snug ${
                                step.isCompleted 
                                  ? 'line-through text-slate-400 dark:text-slate-500 font-medium' 
                                  : isDark ? 'text-zinc-200' : 'text-slate-800'
                              }`}>
                                {step.label}
                              </span>
                              {step.isCompleted && step.completedAt && (
                                <span className={`block text-[8.5px] tracking-wide mt-1 select-none ${
                                  isDark ? 'text-emerald-450' : 'text-emerald-700'
                                }`}>
                                  Accompli le {format(new Date(step.completedAt), 'dd MMM à HH:mm', { locale: fr })}
                                </span>
                              )}
                            </div>

                            <button 
                              onClick={() => {
                                if (confirm('Supprimer cette étape ?')) {
                                  const newSteps = project.steps.filter(s => s.id !== step.id);
                                  updateProject(client.id, { steps: newSteps });
                                }
                              }}
                              className={`p-1.5 opacity-0 group-hover:opacity-100 rounded-lg cursor-pointer transition-all shrink-0 ${
                                isDark ? 'hover:bg-white/[0.04] text-zinc-500 hover:text-red-500' : 'hover:bg-slate-100 text-slate-400 hover:text-red-650'
                              }`}
                              title="Supprimer l'étape"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes detail text editor */}
                    <div className={`space-y-2 border p-4.5 rounded-2xl ${
                      isDark ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-slate-50/50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest block font-mono ${
                        isDark ? 'text-zinc-500' : 'text-slate-450'
                      }`}>Notes de Production</span>
                      <textarea 
                        value={project.notes || ''}
                        onChange={e => updateProject(client.id, { notes: e.target.value })}
                        placeholder="Saisissez vos retours, détails ou remarques..."
                        className={`w-full h-24 text-xs font-semibold focus:outline-none resize-none leading-relaxed rounded-xl p-3 border ${
                          isDark 
                            ? 'bg-[#0a0b12]/90 border-white/[0.06] text-zinc-350 focus:border-sky-400/40' 
                            : 'bg-white border-slate-250 text-slate-800 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
