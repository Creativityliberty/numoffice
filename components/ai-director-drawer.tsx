'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, User, Upload, FileText, Loader2, RefreshCw } from 'lucide-react';
import { Client, Project } from '../lib/types';

interface AiDirectorDrawerProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  projects: Record<string, Project>;
  assistantChat: Array<{ role: 'user' | 'assistant' | 'system'; text: string }>;
  assistantInput: string;
  setAssistantInput: (q: string) => void;
  handleAssistantSubmit: () => void;
  isAnalyzingHealth: boolean;
  handleBriefUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedBriefFile: File | null;
}

export default function AiDirectorDrawer({
  theme,
  isOpen,
  onClose,
  clients,
  projects,
  assistantChat,
  assistantInput,
  setAssistantInput,
  handleAssistantSubmit,
  isAnalyzingHealth,
  handleBriefUpload,
  selectedBriefFile
}: AiDirectorDrawerProps) {
  const isDark = theme === 'dark';
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest chat bubble on message append
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantChat]);

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

          {/* AI Drawer Slider */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] max-w-full shadow-2xl flex flex-col z-50 transition-colors duration-300 border-l ${
              isDark 
                ? 'bg-[#040815]/95 border-white/[0.04] text-zinc-150 backdrop-blur-3xl' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between shrink-0 select-none ${
              isDark ? 'border-white/[0.04] bg-black/10' : 'border-slate-100 bg-slate-50/50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-tr from-blue-600 via-sky-400 to-cyan-300 p-2 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                  <Sparkles size={16} className="text-black" />
                </div>
                <div>
                  <h2 className={`text-base font-black tracking-tight leading-tight flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <span>Directeur de Production</span>
                  </h2>
                  <span className={`text-[9px] font-black tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/15 font-mono mt-1 inline-block`}>
                    ● IA CO-PILOTE ACTIVE
                  </span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  isDark ? 'hover:bg-white/[0.05] text-zinc-500 hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-800'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat list context area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
              
              {/* Context brief informational panel */}
              <div className={`border p-4 rounded-2xl select-none leading-relaxed text-xs space-y-2.5 ${
                isDark ? 'border-white/[0.04] bg-white/[0.01] text-zinc-400' : 'border-slate-150 bg-slate-50/70 text-slate-600'
              }`}>
                <h4 className={`text-[10px] font-black uppercase tracking-wider font-mono ${
                  isDark ? 'text-sky-450' : 'text-blue-850'
                }`}>Mission Générale de l{"'"}IA</h4>
                <p>
                  Je parcours vos projets, identifie les goulots d’étranglement, analyse les devis et prépare les emails de relances contractuels.
                </p>
                <p className="font-mono text-[9px] font-bold">
                  Projets audités : {clients.length} | Tâches en cours : {clients.reduce((acc, c) => acc + (projects[c.id]?.steps?.filter(s => !s.isCompleted).length || 0), 0)}
                </p>
              </div>

              {/* Chat bubbles list */}
              <div className="space-y-4">
                {assistantChat.map((msg, index) => {
                  const isBot = msg.role === 'assistant' || msg.role === 'system';
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-start'}`}
                    >
                      {/* Avatar */}
                      <div className={`p-1.5 rounded-xl border shrink-0 ${
                        isBot 
                          ? isDark ? 'bg-sky-500/10 border-sky-400/20 text-sky-450' : 'bg-blue-50 border-blue-200 text-blue-600'
                          : isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-400' : 'bg-slate-100 border-slate-300 text-slate-600'
                      }`}>
                        {isBot ? <Bot size={14} /> : <User size={14} />}
                      </div>

                      {/* Msg bubble element */}
                      <div className={`p-3.5 rounded-2xl text-[12px] leading-relaxed font-semibold shadow-md whitespace-pre-wrap select-text border ${
                        isBot 
                          ? isDark 
                            ? 'bg-[#0e0f19] border-white/[0.04] text-zinc-200' 
                            : 'bg-[#fafafc] border-slate-150 text-slate-800'
                          : isDark 
                            ? 'bg-gradient-to-br from-sky-400/15 to-blue-500/5 border-sky-400/20 text-sky-400' 
                            : 'bg-gradient-to-br from-blue-50 to-sky-100/20 border-blue-200 text-blue-900'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}
                
                {isAnalyzingHealth && (
                  <div className="flex gap-3 items-center mr-auto max-w-[80%] pt-2 pl-1 select-none">
                    <Loader2 size={16} className="text-blue-500 animate-spinShrink animate-spin" />
                    <span className="text-xs font-black text-blue-600 dark:text-sky-450 font-mono tracking-widest uppercase">Analyse des contrats et relances en cours...</span>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>

            </div>

            {/* Bottom Actions Form */}
            <div className={`p-4 border-t space-y-3 shrink-0 select-none ${
              isDark ? 'border-white/[0.04] bg-black/10' : 'border-slate-100 bg-slate-50/50'
            }`}>
              {/* PDF Document upload handler trigger */}
              <div className="flex items-center justify-between gap-2.5">
                <label className={`flex-1 border-2 border-dashed rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 cursor-pointer text-[10.5px] font-bold transition-all ${
                  isDark 
                    ? 'border-white/[0.08] hover:border-sky-400 bg-white/[0.01] hover:bg-sky-500/5 text-zinc-400 hover:text-sky-400' 
                    : 'border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-slate-500 hover:text-blue-800'
                }`}>
                  <Upload size={13} className="shrink-0" />
                  <span className="truncate">{selectedBriefFile ? selectedBriefFile.name : 'Uploader le Brief PDF Client (IA)'}</span>
                  <input 
                    type="file" 
                    accept="application/pdf,text/plain" 
                    onChange={handleBriefUpload}
                    className="hidden" 
                  />
                </label>
                
                {selectedBriefFile && (
                  <div className={`flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-2.5 rounded-xl border shrink-0 ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' : 'bg-emerald-50 text-emerald-800 border-emerald-250'
                  }`}>
                    <FileText size={12} />
                    <span>Prêt</span>
                  </div>
                )}
              </div>

              {/* Chat Input Box */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAssistantSubmit();
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={assistantInput}
                  onChange={e => setAssistantInput(e.target.value)}
                  placeholder="Posez une question sur vos projets..."
                  className={`flex-1 px-4 py-2.5 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-450 transition-all ${
                    isDark 
                      ? 'bg-[#08080d] border-white/[0.06] text-slate-100 placeholder-zinc-650' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
                <button 
                  type="submit" 
                  disabled={!assistantInput.trim() || isAnalyzingHealth}
                  className="bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 text-neutral-950 px-4 rounded-xl flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all cursor-pointer border border-sky-400/10"
                >
                  <Send size={13} strokeWidth={2.5} />
                </button>
              </form>
            </div>

          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
