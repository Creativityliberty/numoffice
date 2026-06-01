'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface GameChallengerChartProps {
  theme: 'dark' | 'light';
  taskCompletionsWithCumulative: Array<{
    dateStr: string;
    count: number;
    cumulative: number;
  }>;
  completedToday: number;
}

export default function GameChallengerChart({
  theme,
  taskCompletionsWithCumulative,
  completedToday
}: GameChallengerChartProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`lg:col-span-3 border rounded-2xl p-4 flex flex-col h-[230px] shadow-2xl relative transition-all duration-300 ${
      isDark 
        ? 'bg-white/[0.02] backdrop-blur-xl border-white/[0.05]' 
        : 'bg-white border-slate-200/80 shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-2 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg shrink-0 border ${
            isDark 
              ? 'bg-sky-500/10 text-sky-450 border-sky-400/20' 
              : 'bg-blue-50 text-blue-600 border-blue-200/40'
          }`}>
            <Flame size={15} className="animate-pulse" />
          </div>
          <div>
            <span className={`text-xs font-black uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>Game Challenger</span>
            <span className={`text-[9px] font-black block leading-none mt-0.5 font-mono tracking-widest ${
              isDark ? 'text-sky-400' : 'text-blue-600'
            }`}>{"COURBES D'ÉVOLUTION (7 JOURS)"}</span>
          </div>
        </div>
        <span className={`text-[10px] font-semibold italic ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          {completedToday} tâche{completedToday !== 1 ? 's' : ''} complétée{completedToday !== 1 ? 's' : ''} {"aujourd'hui"}
        </span>
      </div>

      {/* Chart Container displaying double curves and X/Y axes */}
      <div className="flex-1 w-full min-h-0 relative select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={taskCompletionsWithCumulative} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="dashboardAreaDaily" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dashboardAreaCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="dateStr" fontSize={9} fontWeight="700" stroke={isDark ? "#52525b" : "#94a3b8"} tickLine={false} />
            <YAxis fontSize={9} fontWeight="700" stroke={isDark ? "#52525b" : "#94a3b8"} tickLine={false} />
            <Tooltip 
              contentStyle={
                isDark 
                  ? { borderRadius: '12px', background: '#090a10', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }
                  : { borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
              }
              labelStyle={{ color: isDark ? '#a1a1aa' : '#475569', fontWeight: 'bold', fontSize: '10px', marginBottom: '3px' }}
              itemStyle={{ color: isDark ? '#38bdf8' : '#1d4ed8' }}
              formatter={(value: any, name: any) => {
                if (name === "daily") return [`${value} tâche${value > 1 ? 's' : ''}`, "Quotidien"];
                return [`${value} tâche${value > 1 ? 's' : ''}`, "Cumulé"];
              }}
            />
            {/* Curve 1: Daily completed tasks (Cyber Sky Blue Area) */}
            <Area 
              name="daily"
              type="monotone" 
              dataKey="count" 
              stroke="#38bdf8" 
              strokeWidth={2} 
              fill="url(#dashboardAreaDaily)" 
              dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }} 
            />
            {/* Curve 2: Progressive Cumulative curve showing achievements growth */}
            <Area 
              name="cumulative"
              type="monotone" 
              dataKey="cumulative" 
              stroke="#3b82f6" 
              strokeWidth={2.5} 
              fill="url(#dashboardAreaCumulative)" 
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 1, stroke: isDark ? '#07080d' : '#ffffff' }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
