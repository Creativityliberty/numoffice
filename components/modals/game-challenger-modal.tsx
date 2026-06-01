'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Calendar, Trophy, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface GameChallengerModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  taskCompletions7Days: Array<{ dateStr: string; count: number }>;
  completedToday: number;
}

export default function GameChallengerModal({
  theme,
  isOpen,
  onClose,
  taskCompletions7Days,
  completedToday
}: GameChallengerModalProps) {
  const isDark = theme === 'dark';

  // Calculate cumulative completions for the double curve chart inside the modal
  const taskCompletionsWithCumulative = React.useMemo(() => {
    const list: Array<{ dateStr: string; count: number; cumulative: number }> = [];
    let currentSum = 0;
    for (const d of taskCompletions7Days) {
      currentSum += d.count;
      list.push({
        ...d,
        cumulative: currentSum
      });
    }
    return list;
  }, [taskCompletions7Days]);

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
                  <Flame size={16} className="text-sky-400 animate-bounce" />
                  <h3 className={`text-xs font-black uppercase font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Détails du Challenge
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-1 rounded-lg cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-white/[0.05] text-zinc-500 hover:text-white' : 'hover:bg-slate-205 text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body Logs */}
              <div className="p-4 space-y-4">
                <div className={`p-3.5 border rounded-xl flex items-center gap-3 select-none text-xs font-semibold ${
                  isDark ? 'bg-sky-500/5 border-sky-400/10 text-zinc-300' : 'bg-blue-50/60 border-blue-200 text-blue-800'
                }`}>
                  <Trophy size={18} className="text-blue-500 dark:text-sky-450 shrink-0" />
                  <div>
                    <span className="font-extrabold block">Aujourd{"'"}hui : {completedToday} réalisée{completedToday > 1 ? 's' : ''}</span>
                    <span className={`text-[10px] leading-tight-short block h-auto mt-0.5 ${
                      isDark ? 'text-zinc-500' : 'text-slate-500'
                    }`}>Continuez ainsi pour accumuler des badges Dopamine !</span>
                  </div>
                </div>

                {/* GRAPHIC CHART (DOUBLES COURBES D'ÉVOLUTION) */}
                <div className="space-y-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest block font-mono pl-1 ${
                    isDark ? 'text-sky-450' : 'text-blue-800'
                  }`}>Courbes d{"'"}Évolution (7 jours)</span>
                  
                  <div className={`h-[150px] w-full border rounded-xl p-3 relative select-none ${
                    isDark 
                      ? 'bg-black/35 border-white/[0.05]' 
                      : 'bg-slate-50 border-slate-200/75 shadow-inner shadow-slate-100'
                  }`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={taskCompletionsWithCumulative} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                        <defs>
                          <linearGradient id="modalAreaDaily" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="modalAreaCumulative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="dateStr" fontSize={8} fontWeight="700" stroke={isDark ? "#52525b" : "#94a3b8"} tickLine={false} />
                        <YAxis fontSize={8} fontWeight="700" stroke={isDark ? "#52525b" : "#94a3b8"} tickLine={false} />
                        <Tooltip 
                          contentStyle={
                            isDark 
                              ? { borderRadius: '10px', background: '#090a10', border: '1px solid rgba(255,255,255,0.08)', fontSize: '10px' }
                              : { borderRadius: '10px', background: '#ffffff', border: '1px solid #e2e8f0', fontSize: '10px' }
                          }
                          labelStyle={{ color: isDark ? '#a1a1aa' : '#475569', fontWeight: 'bold' }}
                          itemStyle={{ color: isDark ? '#38bdf8' : '#1d4ed8' }}
                          formatter={(value: any, name: any) => {
                            if (name === "daily") return [`${value} tâche${value > 1 ? 's' : ''}`, "Quotidien"];
                            return [`${value} tâche${value > 1 ? 's' : ''}`, "Cumulé"];
                          }}
                        />
                        {/* Daily Curve */}
                        <Area 
                          name="daily"
                          type="monotone" 
                          dataKey="count" 
                          stroke="#38bdf8" 
                          strokeWidth={2} 
                          fill="url(#modalAreaDaily)" 
                          dot={{ r: 2, fill: '#38bdf8', strokeWidth: 0 }} 
                        />
                        {/* Cumulative Curve */}
                        <Area 
                          name="cumulative"
                          type="monotone" 
                          dataKey="cumulative" 
                          stroke="#3b82f6" 
                          strokeWidth={2.5} 
                          fill="url(#modalAreaCumulative)" 
                          dot={{ r: 3, fill: '#3b82f6', strokeWidth: 1, stroke: isDark ? '#07080d' : '#ffffff' }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* History checklist logs */}
                <div className="space-y-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest block font-mono pl-1 ${
                    isDark ? 'text-zinc-550' : 'text-slate-450'
                  }`}>Historique du Score (7 jours)</span>
                  
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 hide-scrollbar">
                    {taskCompletions7Days.slice().reverse().map((day, idx) => (
                      <div 
                        key={idx}
                        className={`border p-2.5 rounded-xl flex items-center justify-between text-xs font-bold leading-none ${
                          isDark 
                            ? 'border-white/[0.03] bg-zinc-950/25 text-zinc-300' 
                            : 'border-slate-150 bg-slate-50/50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className={isDark ? 'text-zinc-550' : 'text-slate-400'} />
                          <span>{day.dateStr}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          <span className={isDark ? "text-white" : "text-slate-800"}>{day.count} tâche{day.count > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className={`p-4 border-t flex justify-end ${
                isDark ? 'border-white/[0.04]' : 'border-slate-100'
              }`}>
                <button 
                  onClick={onClose}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-[10.5px] font-black font-mono tracking-wider px-3.5 py-1.5 rounded-xl uppercase hover:scale-[1.02] cursor-pointer"
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
