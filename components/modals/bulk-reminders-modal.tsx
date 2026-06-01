'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, FileText, Check, AlertCircle } from 'lucide-react';
import { Client, Project } from '../../lib/types';

interface BulkRemindersModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  selectedClientIds: string[];
  clients: Client[];
  projects: Record<string, Project>;
  getPaymentReminderInfo: (p: Project) => any;
  getReminderTemplate1: (cName: string, comp: string, amount: number) => string;
  getReminderTemplate2: (cName: string, comp: string, amount: number) => string;
}

export default function BulkRemindersModal({
  theme,
  isOpen,
  onClose,
  selectedClientIds,
  clients,
  projects,
  getPaymentReminderInfo,
  getReminderTemplate1,
  getReminderTemplate2
}: BulkRemindersModalProps) {
  const isDark = theme === 'dark';
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const selectedProjects = clients.filter(c => selectedClientIds.includes(c.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop screen grey overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950 z-40"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4 z-50 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300 ${
                isDark 
                  ? 'bg-[#040815]/95 border-white/[0.08] text-zinc-100 backdrop-blur-3xl' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-white/[0.04]' : 'border-slate-100 bg-slate-50/50'
              }`}>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-sky-400" />
                  <h3 className={`text-xs font-black uppercase font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Relances de Paiement en Lot
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-1 rounded-lg cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-white/[0.05] text-zinc-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body elements */}
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
                <span className={`text-[9.5px] font-black uppercase tracking-wider block font-mono ${
                  isDark ? 'text-zinc-550' : 'text-slate-450'
                }`}>Génération des relances d{"'"}acompte</span>
                
                <div className="space-y-3">
                  {selectedProjects.map(client => {
                    const project = projects[client.id];
                    if (!project) return null;
                    const unpaid = project.financials.quoteAmount - project.financials.amountPaid;
                    const reminder = getPaymentReminderInfo(project);

                    if (unpaid <= 0) {
                      return (
                        <div 
                          key={client.id}
                          className={`border p-3.5 rounded-xl flex items-center gap-2 text-xs font-semibold select-none leading-none ${
                            isDark ? 'border-white/[0.02] bg-zinc-950/20 text-zinc-500' : 'border-slate-100 bg-slate-50/70 text-slate-400'
                          }`}
                        >
                          <Check size={14} className="text-emerald-500 shrink-0" />
                          <span>{client.company || client.name} est entièrement payé (Solde : 0 €)</span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={client.id}
                        className={`border p-3 rounded-xl space-y-3 relative transition-all ${
                          isDark 
                            ? 'border-white/[0.04] bg-zinc-950/20 text-zinc-300' 
                            : 'border-slate-150 bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[12px] font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {client.company || client.name} — <span className="font-extrabold text-red-500">{unpaid} € solde</span>
                          </span>
                          <span className={`px-1.5 py-0.5 text-[8px] font-black rounded border uppercase font-mono ${
                            reminder.alertLevel === 3 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/25'
                          }`}>
                            {reminder.label}
                          </span>
                        </div>

                        <div className="flex gap-2 select-none">
                          <button
                            onClick={() => {
                              const text = getReminderTemplate1(client.name, client.company, unpaid);
                              navigator.clipboard.writeText(text);
                              setCopiedIndex(client.id + '_rem1');
                              setTimeout(() => setCopiedIndex(null), 2500);
                            }}
                            className={`text-[9.5px] font-black border px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-mono ${
                              isDark 
                                ? 'border-white/[0.05] hover:border-sky-450 bg-white/[0.02] text-zinc-300 hover:text-sky-400 hover:bg-sky-500/10' 
                                : 'border-slate-200 bg-white hover:bg-blue-100/20 text-slate-600 hover:text-blue-800'
                            }`}
                          >
                            <FileText size={11} className="shrink-0" />
                            <span>{copiedIndex === client.id + '_rem1' ? 'Copié !' : 'Relance 1 sem'}</span>
                          </button>

                          <button
                            onClick={() => {
                              const text = getReminderTemplate2(client.name, client.company, unpaid);
                              navigator.clipboard.writeText(text);
                              setCopiedIndex(client.id + '_rem2');
                              setTimeout(() => setCopiedIndex(null), 2500);
                            }}
                            className={`text-[9.5px] font-black border px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-mono ${
                              isDark 
                                ? 'border-white/[0.05] hover:border-red-505 bg-white/[0.02] text-zinc-300 hover:text-red-400 hover:bg-red-500/10' 
                                : 'border-slate-200 bg-white hover:bg-red-100/20 text-slate-650 hover:text-red-700'
                            }`}
                          >
                            <FileText size={11} className="shrink-0" />
                            <span>{copiedIndex === client.id + '_rem2' ? 'Copié !' : 'Relance 2 sem'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {selectedProjects.length === 0 && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 py-3 italic">
                      <AlertCircle size={14} />
                      <span>Aucun client sélectionné pour la génération d{"'"}emails.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Close footer button */}
              <div className={`p-4 border-t flex justify-end ${
                isDark ? 'border-white/[0.04]' : 'border-slate-100'
              }`}>
                <button 
                  onClick={onClose}
                  className="bg-zinc-900 border border-zinc-805 hover:bg-zinc-800 text-white text-[10.5px] font-black font-mono tracking-wider px-4 py-1.5 rounded-xl uppercase hover:scale-[1.02] cursor-pointer shadow-md"
                >
                  Fermer
                </button>
              </div>

            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
