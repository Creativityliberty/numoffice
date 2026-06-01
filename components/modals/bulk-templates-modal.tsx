'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sliders, CheckSquare, Sparkles } from 'lucide-react';

interface BulkTemplatesModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  selectedClientIds: string[];
  handleBulkApplyTemplate: (type: 'starter' | 'pro' | 'enterprise') => void;
}

export default function BulkTemplatesModal({
  theme,
  isOpen,
  onClose,
  selectedClientIds,
  handleBulkApplyTemplate
}: BulkTemplatesModalProps) {
  const isDark = theme === 'dark';

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
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden relative transition-all duration-300 ${
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
                  <Sliders size={16} className="text-sky-400" />
                  <h3 className={`text-xs font-black uppercase font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Appliquer un Template de Tâches
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

              {/* Form Content */}
              <div className="p-4 space-y-4">
                <div className={`p-3 border rounded-xl select-none leading-relaxed text-[11px] font-semibold flex items-start gap-2.5 ${
                  isDark ? 'bg-blue-500/5 border-blue-500/10 text-zinc-400' : 'bg-blue-50 text-blue-900 border-blue-200 animate-fadeIn'
                }`}>
                  <CheckSquare size={16} className="text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    Vous vous apprêtez à remplacer la liste des tâches actuelles de <strong className="font-extrabold">{selectedClientIds.length} projet{selectedClientIds.length > 1 ? 's' : ''}</strong> par un schéma standardisé de livraison de production.
                  </span>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      handleBulkApplyTemplate('starter');
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex flex-col justify-center transition-all cursor-pointer ${
                      isDark 
                        ? 'border-white/[0.04] bg-white/[0.01] hover:bg-sky-500/5 hover:border-sky-450' 
                        : 'border-slate-150 bg-slate-50 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <span className={`text-[12px] font-black uppercase font-mono ${isDark ? 'text-sky-400' : 'text-blue-800'}`}>Formule Starter</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 font-medium">Idéal pour les petits projets (Cahier des charges, Maquettes, Recette standard)</span>
                  </button>

                  <button 
                    onClick={() => {
                      handleBulkApplyTemplate('pro');
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex flex-col justify-center transition-all cursor-pointer ${
                      isDark 
                        ? 'border-white/[0.04] bg-white/[0.01] hover:bg-sky-500/5 hover:border-sky-450' 
                        : 'border-slate-150 bg-slate-50 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <span className={`text-[12px] font-black uppercase font-mono ${isDark ? 'text-sky-400' : 'text-blue-800'}`}>Formule Pro</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 font-medium font-semibold">Idéal pour les performances web et vitrines avancées (SEO, Responsive audits, tests)</span>
                  </button>

                  <button 
                    onClick={() => {
                      handleBulkApplyTemplate('enterprise');
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex flex-col justify-center transition-all cursor-pointer ${
                      isDark 
                        ? 'border-white/[0.04] bg-white/[0.01] hover:bg-sky-500/5 hover:border-sky-450' 
                        : 'border-slate-150 bg-slate-50 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <span className={`text-[12px] font-black uppercase font-mono ${isDark ? 'text-sky-400' : 'text-blue-800'}`}>Formule Sur Mesure Custom</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 font-medium">Pour les développements sur-engagés (Sécurisation, Tests, Support continu)</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className={`p-4 border-t flex justify-end gap-2 ${
                isDark ? 'border-white/[0.04]' : 'border-slate-100'
              }`}>
                <button 
                  onClick={onClose}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    isDark ? 'hover:bg-white/[0.04] text-zinc-450 hover:text-white_soft' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Annuler
                </button>
              </div>

            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
