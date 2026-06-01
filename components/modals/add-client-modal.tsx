'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Client, Project, OFFER_LABELS, ProjectType, OfferType, PROJECT_TYPE_LABELS, DEFAULT_STEPS } from '../../lib/types';

interface AddClientModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  handleAddClient: (formData: {
    name: string;
    company: string;
    email: string;
    phone: string;
    projectType: ProjectType;
    offerName: OfferType;
    quoteAmount: number;
    amountPaid: number;
    startDate: string;
    endDate: string;
    steps?: string[];
  }) => void;
}

export default function AddClientModal({
  theme,
  isOpen,
  onClose,
  handleAddClient
}: AddClientModalProps) {
  const isDark = theme === 'dark';

  const [formData, setFormData] = React.useState(() => {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 30);
    return {
      name: '',
      company: '',
      email: '',
      phone: '',
      projectType: 'site_vitrine' as ProjectType,
      offerName: 'presence_pro' as OfferType,
      quoteAmount: 2500,
      amountPaid: 1000,
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  });

  const [tempSteps, setTempSteps] = React.useState<string[]>(() => [...DEFAULT_STEPS.site_vitrine]);
  const [newStepText, setNewStepText] = React.useState('');

  const [error, setError] = React.useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Le nom du contact est obligatoire.");
      return;
    }
    if (!formData.company.trim()) {
      setError("Le nom de l'entreprise est obligatoire.");
      return;
    }
    setError('');
    handleAddClient({
      ...formData,
      steps: tempSteps
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Grey backdrop overlay */}
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
              <div className={`p-5 border-b flex items-center justify-between ${
                isDark ? 'border-white/[0.04]' : 'border-slate-100 bg-slate-50/50'
              }`}>
                <div>
                  <h3 className={`text-base font-black tracking-tight leading-tight uppercase font-mono ${
                    isDark ? 'text-sky-400' : 'text-blue-800'
                  }`}>Nouveau Projet de Production</h3>
                  <span className={`text-[9.5px] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Paramétrez le calendrier et la grille tarifaire</span>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-white/[0.05] text-zinc-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-850'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={onSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto hide-scrollbar">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/15 p-2.5 rounded-xl flex items-center gap-2 text-red-500 text-[11px] font-semibold leading-none">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Nom de l{"'"}Entreprise *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}                      placeholder="Nümtema Corp."
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-450 ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white placeholder-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Nom du Contact *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-450 ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white placeholder-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Adresse Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean@numtema.fr"
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-450 ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white placeholder-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Téléphone</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-450 ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white placeholder-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Type de Livrable</label>
                    <select 
                      value={formData.projectType}
                      onChange={e => {
                        const val = e.target.value as ProjectType;
                        setFormData({ ...formData, projectType: val });
                        if (DEFAULT_STEPS[val]) {
                          setTempSteps([...DEFAULT_STEPS[val]]);
                        } else {
                          setTempSteps([]);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none focus:border-blue-450 cursor-pointer ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white' : 'bg-slate-50 border-slate-205 text-slate-800'
                      }`}
                    >
                      {Object.entries(PROJECT_TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key} className={isDark ? "bg-zinc-950 font-bold" : "bg-white font-bold"}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Formule achetée</label>
                    <select 
                      value={formData.offerName}
                      onChange={e => setFormData({ ...formData, offerName: e.target.value as any })}
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none focus:border-blue-450 cursor-pointer ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white' : 'bg-slate-50 border-slate-205 text-slate-800'
                      }`}
                    >
                      {Object.entries(OFFER_LABELS).map(([key, label]) => (
                        <option key={key} value={key} className={isDark ? "bg-zinc-950 font-bold" : "bg-white font-bold"}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Quota Devis (€)</label>
                    <input 
                      type="number" 
                      value={formData.quoteAmount}
                      onChange={e => setFormData({ ...formData, quoteAmount: Number(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-sky-400' : 'bg-slate-50 border-slate-200 text-blue-800'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Acompte payé (€)</label>
                    <input 
                      type="number" 
                      value={formData.amountPaid}
                      onChange={e => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-700'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Date de Lancement</label>
                    <input 
                      type="date" 
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>Date d{"'"}échéance</label>
                    <input 
                      type="date" 
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                {/* Custom Checklist Steps Panel */}
                <div className="space-y-2 border-t pt-4 dark:border-white/[0.04] border-slate-100">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-widest block font-mono pl-1 ${
                      isDark ? 'text-sky-400' : 'text-blue-800'
                    }`}>Processus de Production : Étapes contractuelles</span>
                    <span className={`text-[9.4px] ${isDark ? 'text-zinc-500' : 'text-slate-450'}`}>Personnalisez les étapes et changez le processus selon votre contrat</span>
                  </div>

                  {/* Add direct inline step input */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newStepText}
                      onChange={e => setNewStepText(e.target.value)}
                      placeholder="Ajouter une étape personnalisée..."
                      className={`flex-1 px-3 py-1.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-450 ${
                        isDark ? 'bg-[#0a0b12] border-white/[0.06] text-white placeholder-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                      }`}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newStepText.trim()) {
                            setTempSteps([...tempSteps, newStepText.trim()]);
                            setNewStepText('');
                          }
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newStepText.trim()) {
                           setTempSteps([...tempSteps, newStepText.trim()]);
                           setNewStepText('');
                        }
                      }}
                      className={`text-[10px] font-black tracking-widest uppercase flex items-center justify-center h-8 px-3 rounded-xl border cursor-pointer transition-colors ${
                        isDark 
                          ? 'text-sky-400 bg-sky-500/10 hover:bg-sky-500/15 border-sky-400/20' 
                          : 'text-blue-800 bg-blue-50 hover:bg-blue-100 border-blue-200'
                      }`}
                    >
                      <Plus size={11} strokeWidth={2.5} />
                      <span className="ml-1">Ajouter</span>
                    </button>
                  </div>

                  <div className={`border rounded-xl max-h-[140px] overflow-y-auto p-2 space-y-1.5 hide-scrollbar ${
                    isDark ? 'bg-black/20 border-white/[0.04]' : 'bg-slate-50/50 border-slate-150'
                  }`}>
                    {tempSteps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
                          isDark 
                            ? 'bg-zinc-950/40 border-white/[0.03] text-zinc-350' 
                            : 'bg-white border-slate-200/60 text-slate-700 shadow-sm'
                        }`}
                      >
                        <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-black shrink-0 font-mono">
                          {idx + 1}
                        </div>
                        <input 
                          type="text" 
                          value={step}
                          onChange={e => {
                            const updated = [...tempSteps];
                            updated[idx] = e.target.value;
                            setTempSteps(updated);
                          }}
                          className={`flex-1 bg-transparent focus:outline-none focus:underline border-none p-0 leading-tight ${
                            isDark ? 'text-zinc-200 focus:text-white' : 'text-slate-700 focus:text-slate-900'
                          }`}
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            setTempSteps(tempSteps.filter((_, i) => i !== idx));
                          }}
                          className={`p-1 rounded-md transition-colors shrink-0 text-zinc-500 ${
                            isDark ? 'hover:bg-white/[0.04] hover:text-red-400' : 'hover:bg-slate-100 hover:text-red-500'
                          }`}
                          title="Supprimer l'étape"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {tempSteps.length === 0 && (
                      <div className="text-center py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Aucune étape de livraison définie
                      </div>
                    )}
                  </div>
                </div>



                {/* Footer Trigger action submit */}
                <div className={`pt-4 border-t flex justify-end gap-2.5 ${
                  isDark ? 'border-white/[0.04]' : 'border-slate-100'
                }`}>
                  <button 
                    type="button" 
                    onClick={onClose}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      isDark ? 'hover:bg-white/[0.04] text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 text-neutral-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-mono shadow-md hover:brightness-110 active:scale-95 flex items-center gap-1 cursor-pointer border border-sky-400/10"
                  >
                    <Plus size={13} strokeWidth={3} />
                    <span>Créer le contrat</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
