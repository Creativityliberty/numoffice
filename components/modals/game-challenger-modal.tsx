'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Calendar, Trophy, CheckCircle2, ChevronDown, ChevronRight, Target, Award, Brain } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface GameChallengerModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  taskCompletions7Days: Array<{ 
    dateStr: string; 
    count: number;
    tasks: Array<{ taskName: string; clientName: string }>;
  }>;
  completedToday: number;
  streakAndGoal: {
    streak: number;
    weeklyTotal: number;
    weeklyGoal: number;
  };
}

export default function GameChallengerModal({
  theme,
  isOpen,
  onClose,
  taskCompletions7Days,
  completedToday,
  streakAndGoal
}: GameChallengerModalProps) {
  const isDark = theme === 'dark';
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  const toggleDay = (idx: number) => {
    setExpandedDays(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

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

  // Determine Rank based on total tasks
  const determineRank = (total: number) => {
    if (total < 5) return 'Débutant';
    if (total < 15) return 'Challenger';
    if (total < 30) return 'Hustler';
    return 'Machine';
  };
  const rank = determineRank(streakAndGoal?.weeklyTotal || 0);

  // Generate Insight AI text
  const generateInsight = () => {
    if (!streakAndGoal) return "";
    if (completedToday === 0) return "C'est l'heure de s'y mettre ! Fais péter le compteur aujourd'hui.";
    if (completedToday > 3) return "Impressionnant ! Tu es sur un rythme de champion aujourd'hui.";
    if (streakAndGoal.streak >= 3) return `Wow, ${streakAndGoal.streak} jours d'affilée ! Ne brise pas la chaîne.`;
    return "Bon travail aujourd'hui. Continue sur cette lancée pour accumuler des badges Dopamine !";
  };
  const insightText = generateInsight();
  const goalPercentage = Math.min(100, Math.round(((streakAndGoal?.weeklyTotal || 0) / (streakAndGoal?.weeklyGoal || 20)) * 100));

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
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-40"
          />

          {/* Modal Container - Horizontal layout */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden relative flex flex-col transition-all duration-300 ${
                isDark 
                  ? 'bg-[#040815]/95 border-white/[0.08] text-zinc-100 backdrop-blur-3xl shadow-blue-500/10' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              {/* Header */}
              <div className={`p-5 border-b flex items-center justify-between ${
                isDark ? 'border-white/[0.04] bg-white/[0.01]' : 'border-slate-100 bg-slate-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-sky-500/10' : 'bg-blue-100'}`}>
                    <Flame size={20} className="text-sky-400 animate-bounce" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-black uppercase font-mono tracking-wider ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Détails du Challenge
                    </h3>
                    <p className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      Analyse de productivité et suivi des performances
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-xl cursor-pointer transition-colors ${
                    isDark ? 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body (KPIs + Split view) */}
              <div className="flex flex-col md:flex-row h-full max-h-[70vh]">
                
                {/* LEFT COLUMN: KPIs & Chart */}
                <div className={`flex-1 p-6 flex flex-col gap-6 border-b md:border-b-0 md:border-r ${
                  isDark ? 'border-white/[0.04]' : 'border-slate-100'
                }`}>
                  
                  {/* Top KPIs Row */}
                  {streakAndGoal && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${
                        isDark ? 'bg-zinc-900/50 border-white/[0.05]' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <Award size={18} className="text-purple-400 mb-1" />
                        <span className={`text-[9px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Niveau</span>
                        <span className="text-xs font-black text-purple-500">{rank}</span>
                      </div>

                      <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${
                        isDark ? 'bg-zinc-900/50 border-white/[0.05]' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <Flame size={18} className="text-orange-400 mb-1" />
                        <span className={`text-[9px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Streak</span>
                        <span className="text-xs font-black text-orange-500">{streakAndGoal.streak} Jours</span>
                      </div>

                      <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center ${
                        isDark ? 'bg-zinc-900/50 border-white/[0.05]' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <Target size={18} className="text-emerald-400 mb-1" />
                        <span className={`text-[9px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Objectif</span>
                        <div className="w-full flex items-center justify-center gap-1.5 mt-0.5">
                          <div className={`h-1.5 flex-1 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${goalPercentage}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-emerald-500">{streakAndGoal.weeklyTotal}/{streakAndGoal.weeklyGoal}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Graphic Chart */}
                  <div className="flex-1 min-h-[220px] flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-widest block font-mono mb-3 ${
                      isDark ? 'text-sky-450' : 'text-blue-800'
                    }`}>Courbes d{"'"}Évolution (7 jours)</span>
                    
                    <div className={`flex-1 w-full border rounded-2xl p-4 relative ${
                      isDark 
                        ? 'bg-black/40 border-white/[0.05]' 
                        : 'bg-slate-50 border-slate-200 shadow-inner'
                    }`}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={taskCompletionsWithCumulative} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="modalAreaDaily" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} />
                              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="modalAreaCumulative" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                          <XAxis dataKey="dateStr" fontSize={10} fontWeight="700" stroke={isDark ? "#52525b" : "#94a3b8"} tickLine={false} axisLine={false} />
                          <YAxis fontSize={10} fontWeight="700" stroke={isDark ? "#52525b" : "#94a3b8"} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={
                              isDark 
                                ? { borderRadius: '12px', background: 'rgba(9, 10, 16, 0.9)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', backdropFilter: 'blur(8px)' }
                                : { borderRadius: '12px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0', fontSize: '11px', backdropFilter: 'blur(8px)' }
                            }
                            labelStyle={{ color: isDark ? '#a1a1aa' : '#475569', fontWeight: 'bold', marginBottom: '4px' }}
                            formatter={(value: any, name: any) => {
                              if (name === "daily") return [`${value} tâche${value > 1 ? 's' : ''}`, "Quotidien"];
                              return [`${value} tâche${value > 1 ? 's' : ''}`, "Cumulé (Semaine)"];
                            }}
                          />
                          {/* Daily Curve */}
                          <Area 
                            name="daily"
                            type="monotone" 
                            dataKey="count" 
                            stroke="#38bdf8" 
                            strokeWidth={3} 
                            fill="url(#modalAreaDaily)" 
                            dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: isDark ? '#040815' : '#ffffff' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                          {/* Cumulative Curve */}
                          <Area 
                            name="cumulative"
                            type="monotone" 
                            dataKey="cumulative" 
                            stroke="#8b5cf6" 
                            strokeWidth={2} 
                            fill="url(#modalAreaCumulative)" 
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Insight AI Box */}
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  }`}>
                    <Brain size={18} className={`shrink-0 mt-0.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 block mb-0.5">Insight IA</span>
                      <p className="text-xs font-semibold leading-relaxed">{insightText}</p>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Detailed History Accordion */}
                <div className="w-full md:w-[350px] flex flex-col shrink-0">
                  <div className={`p-5 pb-3 border-b ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest block font-mono ${
                      isDark ? 'text-zinc-400' : 'text-slate-500'
                    }`}>Historique Détaillé</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 space-y-3">
                    {taskCompletions7Days.slice().reverse().map((day, idx) => {
                      const isExpanded = !!expandedDays[idx];
                      const hasTasks = day.count > 0;

                      return (
                        <div key={idx} className="flex flex-col gap-2">
                          {/* Day Row */}
                          <div 
                            onClick={() => hasTasks && toggleDay(idx)}
                            className={`border px-3 py-3 rounded-2xl flex items-center justify-between text-xs font-bold leading-none transition-colors ${hasTasks ? 'cursor-pointer hover:border-sky-500/30' : 'opacity-60 cursor-default'} ${
                              isDark 
                                ? 'border-white/[0.05] bg-white/[0.02] text-zinc-300' 
                                : 'border-slate-200 bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {hasTasks ? (
                                isExpanded ? <ChevronDown size={14} className="text-sky-400" /> : <ChevronRight size={14} className="text-sky-400" />
                              ) : (
                                <div className="w-[14px]" /> // spacer
                              )}
                              <Calendar size={14} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
                              <span>{day.dateStr}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {hasTasks ? (
                                <>
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                  <span className={isDark ? "text-white" : "text-slate-800"}>{day.count} tâche{day.count > 1 ? 's' : ''}</span>
                                </>
                              ) : (
                                <span className={isDark ? "text-zinc-500" : "text-slate-400"}>0 tâche</span>
                              )}
                            </div>
                          </div>

                          {/* Expanded Tasks List */}
                          <AnimatePresence>
                            {isExpanded && hasTasks && day.tasks && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className={`pl-4 py-1 space-y-2 border-l-2 ml-4 ${isDark ? 'border-sky-500/30' : 'border-blue-200'}`}>
                                  {day.tasks.map((task, tIdx) => (
                                    <div key={tIdx} className="flex flex-col gap-0.5">
                                      <span className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                                        • {task.taskName}
                                      </span>
                                      <span className={`text-[10px] font-semibold pl-2.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                                        Client: <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>{task.clientName}</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
