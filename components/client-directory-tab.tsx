'use client';

import React from 'react';
import { Mail, Phone, Calendar, Trash2, Edit2, CheckSquare, Square, FolderMinus, Sparkles } from 'lucide-react';
import { Client, Project, OFFER_LABELS, PROJECT_TYPE_LABELS } from '../lib/types';

interface ClientDirectoryTabProps {
  theme: 'dark' | 'light';
  filteredClients: Client[];
  projects: Record<string, Project>;
  selectedClientIds: string[];
  setSelectedClientIds: React.Dispatch<React.SetStateAction<string[]>>;
  setIsBulkTemplatesOpen: (open: boolean) => void;
  setIsBulkRemindersOpen: (open: boolean) => void;
  setSelectedClientId: (id: string | null) => void;
  setViewMode: (mode: 'detail' | 'overview' | 'clients') => void;
  deleteClient: (id: string) => void;
}

export default function ClientDirectoryTab({
  theme,
  filteredClients,
  projects,
  selectedClientIds,
  setSelectedClientIds,
  setIsBulkTemplatesOpen,
  setIsBulkRemindersOpen,
  setSelectedClientId,
  setViewMode,
  deleteClient
}: ClientDirectoryTabProps) {
  const isDark = theme === 'dark';

  const toggleSelectClient = (id: string) => {
    setSelectedClientIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedClientIds.length === filteredClients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(filteredClients.map(c => c.id));
    }
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden w-full p-4 md:p-6" id="client-directory-wrapper">
      
      {/* BULK ACTIONS BANNER */}
      {selectedClientIds.length > 0 && (
        <div className={`mb-4 px-4 py-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl select-none animate-fade-in ${
          isDark 
            ? 'bg-blue-500/10 border-blue-500/20 text-sky-400' 
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 animate-ping" />
            <span className="text-xs font-black tracking-wide font-mono uppercase">
              {selectedClientIds.length} client{selectedClientIds.length > 1 ? 's' : ''} sélectionné{selectedClientIds.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex p-0.5 items-center gap-2 flex-wrap sm:flex-nowrap">
            <button 
              onClick={() => setIsBulkTemplatesOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-[10.5px] font-black uppercase font-mono bg-gradient-to-r from-blue-600 via-sky-455 to-cyan-400 text-neutral-950 hover:scale-[1.02] shadow-sm transition-all cursor-pointer"
            >
              Appliquer un Template en lot
            </button>
            <button 
              onClick={() => setIsBulkRemindersOpen(true)}
              className={`px-3.5 py-1.5 rounded-xl text-[10.5px] font-black uppercase font-mono border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-zinc-950/40 hover:bg-zinc-900/60 border-blue-500/20 hover:border-blue-400/40 text-sky-450' 
                  : 'bg-white hover:bg-slate-100 border-blue-300 text-blue-800'
              }`}
            >
              Rédiger les Relances en lot
            </button>
            <button 
              onClick={() => setSelectedClientIds([])}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-white/[0.03]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* DIRECTORY DISPLAY TABLE */}
      <div className={`flex-1 border rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
        isDark 
          ? 'bg-white/[0.01] border-white/[0.04]' 
          : 'bg-white border-slate-200/90 shadow-md'
      }`}>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-wider font-mono ${
                isDark ? 'border-white/[0.04] bg-black/15 text-zinc-500' : 'border-slate-100 bg-slate-50/50 text-slate-500'
              }`}>
                <th className="p-4 pl-6 text-center select-none w-10">
                  <button 
                    onClick={toggleSelectAll}
                    className={`p-1 hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer ${
                      isDark ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {selectedClientIds.length === filteredClients.length && filteredClients.length > 0 ? (
                      <CheckSquare size={16} className="text-sky-400" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="p-4">Contact & Structure</th>
                <th className="p-4">Offre achetée</th>
                <th className="p-4">Type de Projet</th>
                <th className="p-4">Coordonnées de communication</th>
                <th className="p-5 pr-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y text-xs font-semibold ${
              isDark ? 'divide-white/[0.03] text-zinc-350' : 'divide-slate-100 text-slate-650'
            }`}>
              {filteredClients.map(client => {
                const project = projects[client.id];
                const isSelected = selectedClientIds.includes(client.id);

                return (
                  <tr 
                    key={client.id}
                    className={`transition-all ${
                      isSelected 
                        ? isDark 
                          ? 'bg-blue-500/[0.02] hover:bg-blue-500/[0.03]' 
                          : 'bg-blue-50/30 hover:bg-blue-50/50'
                        : isDark ? 'hover:bg-white/[0.01]' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Checkbox selector column */}
                    <td className="p-4 pl-6 text-center">
                      <button 
                        onClick={() => toggleSelectClient(client.id)}
                        className={`p-1 hover:bg-white/[0.04] rounded-md transition-all cursor-pointer ${
                          isDark ? 'text-zinc-650 hover:text-sky-400' : 'text-slate-450 hover:text-blue-500'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare size={16} className="text-sky-400" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>

                    {/* Description coordinates */}
                    <td className="p-4 select-none">
                      <div className="flex flex-col">
                        <span className={`font-extrabold text-[12.5px] leading-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>{client.company || 'Sans Entreprise'}</span>
                        <span className={`text-[10px] truncate font-semibold leading-none mt-1 ${
                          isDark ? 'text-zinc-500' : 'text-slate-450'
                        }`}>{client.name}</span>
                      </div>
                    </td>

                    {/* Contract type offer label */}
                    <td className="p-4 whitespace-nowrap select-none">
                      <span className={`px-2 py-0.5 text-[8.5px] font-black rounded border tracking-wide uppercase ${
                        isDark 
                          ? 'text-sky-455 bg-blue-500/[0.03] border-blue-500/10' 
                          : 'text-blue-800 bg-blue-50 border-blue-200/50'
                      }`}>
                        {OFFER_LABELS[client.offerName as any] || client.offerName}
                      </span>
                    </td>

                    {/* Project type label */}
                    <td className="p-4 whitespace-nowrap select-none">
                      <span className={`px-2 py-0.5 text-[8.5px] font-black rounded border tracking-wide uppercase ${
                        (client.projectType as string) === 'saas' 
                          ? 'text-sky-455 bg-blue-500/[0.03] border-blue-500/10' 
                          : client.projectType === 'e_commerce' 
                            ? 'text-indigo-400 bg-indigo-500/[0.03] border-indigo-500/10' 
                            : 'text-emerald-400 bg-emerald-500/[0.03] border-emerald-500/10'
                      }`}>
                        {PROJECT_TYPE_LABELS[client.projectType] || client.projectType}
                      </span>
                    </td>

                    {/* Contact communication card indices */}
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className={isDark ? 'text-zinc-600' : 'text-slate-400'} />
                          <span className={`text-[11px] truncate max-w-[200px] font-semibold leading-none ${
                            isDark ? 'text-zinc-350' : 'text-slate-705'
                          }`} title={client.email}>{client.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className={isDark ? 'text-zinc-600' : 'text-slate-400'} />
                          <span className="text-[11px] truncate font-medium leading-none text-zinc-500">{client.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Single action elements */}
                    <td className="p-5 pr-6 text-center whitespace-nowrap select-none">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setViewMode('detail');
                          }}
                          className={`p-1.5 border rounded-lg cursor-pointer transition-all ${
                            isDark 
                              ? 'bg-white/[0.01] hover:bg-white/[0.04] border-white/[0.05] text-sky-400' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-blue-800 shadow-nano'
                          }`}
                          title="Ouvrir le projet"
                        >
                          <Edit2 size={12} />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
                              deleteClient(client.id);
                            }
                          }}
                          className={`p-1.5 border rounded-lg cursor-pointer transition-colors ${
                            isDark 
                              ? 'hover:bg-red-950/40 border-white/[0.04] text-zinc-500 hover:text-red-500' 
                              : 'hover:bg-red-50 border-slate-200 text-slate-400 hover:text-red-650'
                          }`}
                          title="Supprimer le client"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className={`p-8 text-center italic ${isDark ? 'text-zinc-605' : 'text-slate-450'}`}>
                    Aucun client répertorié.
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
