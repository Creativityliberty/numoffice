'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../lib/store';
import { Client, Project, Step, Blocker, ProjectType, OfferType, DEFAULT_STEPS } from '../lib/types';
import { format, differenceInDays } from 'date-fns';

// Import newly isolated subcomponents
import Sidebar from './sidebar';
import Header from './header';
import GameChallengerChart from './game-challenger-chart';
import AdvancementWidget from './advancement-widget';
import ClientDetailsTab from './client-details-tab';
import ClientGlobalTab from './client-global-tab';
import ClientDirectoryTab from './client-directory-tab';
import AiDirectorDrawer from './ai-director-drawer';
import CommercialArchitectureTab from './commercial-architecture-tab';

// Import Modals
import AddClientModal from './modals/add-client-modal';
import GameChallengerModal from './modals/game-challenger-modal';
import BulkRemindersModal from './modals/bulk-reminders-modal';
import BulkTemplatesModal from './modals/bulk-templates-modal';

export default function AppContent() {
  const { 
    clients, 
    projects, 
    isLoaded, 
    isDbMode,
    addClient, 
    updateClient, 
    updateProject, 
    deleteClient, 
    resetToDemo,
    theme,
    toggleTheme 
  } = useStore();

  const isDark = theme === 'dark';

  // Layout retraction & Filters
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filterType, setFilterType] = useState<'active' | 'archived' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [hasInitiallySelected, setHasInitiallySelected] = useState(false);
  const [viewMode, setViewMode] = useState<'detail' | 'overview' | 'clients' | 'architecture'>('detail');
  const [showDashboardWidgets, setShowDashboardWidgets] = useState(true);
  const [overviewCols, setOverviewCols] = useState(4);

  // Modals/Drawers toggle flags
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isGameChallengerOpen, setIsGameChallengerOpen] = useState(false);
  const [isDirectorOpen, setIsDirectorOpen] = useState(false);
  const [isBulkRemindersOpen, setIsBulkRemindersOpen] = useState(false);
  const [isBulkTemplatesOpen, setIsBulkTemplatesOpen] = useState(false);

  // Selection for lot variables
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  // Interactive AI Assistant states
  const [assistantInput, setAssistantInput] = useState('');
  const [isAnalyzingHealth, setIsAnalyzingHealth] = useState(false);
  const [selectedBriefFile, setSelectedBriefFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Conversational AI Director history chat logs state
  const [assistantChat, setAssistantChat] = useState<Array<{ role: 'user' | 'assistant' | 'system'; text: string }>>([
    { 
      role: 'assistant', 
      text: "Bonjour Chef ! Je suis votre Directeur de Production Virtuel. Je peux auditer vos délais, formuler des relances intelligentes, ou planifier un projet en lot.\n\nPosez-moi vos questions ou écrivez un ordre (ex: 'Créer un contrat de 3200€ pour la société LVMH avec acompte de 1500€')." 
    }
  ]);

  // Handle custom notifications
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Safe checks for empty projects list - only run initially so user can close it
  useEffect(() => {
    if (isLoaded && clients.length > 0 && !selectedClientId && !hasInitiallySelected) {
      const firstActive = clients.find(c => !c.isArchived);
      if (firstActive) {
        setSelectedClientId(firstActive.id);
      }
      setHasInitiallySelected(true);
    }
  }, [isLoaded, clients, selectedClientId, hasInitiallySelected]);

  // Calculate task completions for Game Challenger tracking over past 7 days
  const taskCompletions7Days = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: format(d, 'dd/MM'),
        dateObj: d,
        count: 0
      };
    });

    Object.values(projects).forEach(proj => {
      proj.steps.forEach(step => {
        if (step.isCompleted && step.completedAt) {
          const stepDate = new Date(step.completedAt);
          days.forEach(day => {
            if (
              stepDate.getDate() === day.dateObj.getDate() &&
              stepDate.getMonth() === day.dateObj.getMonth() &&
              stepDate.getFullYear() === day.dateObj.getFullYear()
            ) {
              day.count += 1;
            }
          });
        }
      });
    });

    return days;
  }, [projects]);

  // Cumulative sum of completed tasks for double curves charts
  const taskCompletionsWithCumulative = useMemo(() => {
    let sum = 0;
    return taskCompletions7Days.map(d => {
      sum += d.count;
      return {
        ...d,
        cumulative: sum
      };
    });
  }, [taskCompletions7Days]);

  // Tasks finished today metric
  const completedToday = useMemo(() => {
    const today = taskCompletions7Days[taskCompletions7Days.length - 1];
    return today ? today.count : 0;
  }, [taskCompletions7Days]);

  // Calculate global summary metrics
  const stats = useMemo(() => {
    const totalProjects = clients.length;
    const completedProjects = clients.filter(c => {
      const p = projects[c.id];
      return p && p.steps.length > 0 && p.steps.every(s => s.isCompleted);
    }).length;
    const activeProjects = clients.filter(c => !c.isArchived).length;
    const archivedProjects = clients.filter(c => c.isArchived).length;

    let totalTasksCompleted = 0;
    let totalTasks = 0;
    clients.forEach(c => {
      const p = projects[c.id];
      if (p) {
        totalTasks += p.steps.length;
        totalTasksCompleted += p.steps.filter(s => s.isCompleted).length;
      }
    });

    const globalProgress = totalTasks > 0 ? Math.round((totalTasksCompleted / totalTasks) * 100) : 0;

    return {
      totalProjects,
      completedProjects,
      totalTasksCompleted,
      totalTasks,
      activeProjects,
      archivedProjects,
      globalProgress
    };
  }, [clients, projects]);

  // Filter clients dynamically depending on searches and view indicators
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      if (filterType === 'active' && client.isArchived) return false;
      if (filterType === 'archived' && !client.isArchived) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const nameMatch = client.name?.toLowerCase().includes(query);
        const compMatch = client.company?.toLowerCase().includes(query);
        const emailMatch = client.email?.toLowerCase().includes(query);
        if (!nameMatch && !compMatch && !emailMatch) return false;
      }
      return true;
    });
  }, [clients, filterType, searchQuery]);

  // Create Client Form submission handler
  const handleCreateClient = (formData: {
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
  }) => {
    const startTimestamp = Date.parse(formData.startDate) || Date.now();
    const endTimestamp = Date.parse(formData.endDate) || Date.now() + 30 * 24 * 60 * 60 * 1000;

    const clientId = addClient({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      projectType: formData.projectType,
      offerName: formData.offerName
    }, {
      quoteAmount: formData.quoteAmount,
      amountPaid: formData.amountPaid,
      startDate: startTimestamp,
      endDate: endTimestamp,
      steps: formData.steps
    });

    showToast(`Projet "${formData.company}" créé avec succès !`, 'success');
    if (clientId) {
      setSelectedClientId(clientId);
      setViewMode('detail');
    }
  };

  // Bulk apply workflows templates logic (Starter / Pro / Enterprise tracks)
  const handleBulkApplyTemplate = (type: 'starter' | 'pro' | 'enterprise') => {
    let tSteps: string[] = [];
    if (type === 'starter') {
      tSteps = ["Brief fonctionnel", "Design maquettes", "Développement V1", "Finalisation & Recette"];
    } else if (type === 'pro') {
      tSteps = ["Cadrage technique", "Architecture UX/UI", "Phase Dev Front/Back", "SEO & Analytics audits", "Recette globale & Livraison"];
    } else {
      tSteps = ["Audit initial", "Spécificités techniques", "Design sur-mesure", "Phase Dev 1", "Phase Dev 2", "Tests automatisés", "Recette & Formation", "Prise en main continue"];
    }

    selectedClientIds.forEach(cId => {
      const p = projects[cId];
      if (p) {
        const payloadSteps: Step[] = tSteps.map((label, index) => ({
          id: `s_bulk_${cId}_${index}_${Date.now()}`,
          label,
          isCompleted: false
        }));
        updateProject(cId, { steps: payloadSteps });
      }
    });

    showToast(`Template "${type.toUpperCase()}" appliqué à ${selectedClientIds.length} projets !`, 'success');
    setSelectedClientIds([]);
  };

  // AI Assistant trigger Health check report analysis
  const handleAnalyzeHealth = async () => {
    setIsAnalyzingHealth(true);
    setIsDirectorOpen(true);

    const userMsg = { role: 'user' as const, text: "Exécute l'analyse de santé de mes contrats et décèle les retards de paiement de devis." };
    setAssistantChat(prev => [...prev, userMsg]);

    try {
      const response = await fetch('/api/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'health-check',
          clients,
          projects
        })
      });

      if (!response.ok) {
        throw new Error("Erreur de communication avec le serveur IA.");
      }

      const raw = await response.json();
      const botMsg = { 
        role: 'assistant' as const, 
        text: raw.feedback || "Analyse terminée Chef ! Voici mon verdict :\n\n⚠️ Certains clients n'ont pas encore soldé leurs acomptes contractuels alors que leurs jalons ont été validés. Je vous préconise d'utiliser les Relances en Lot." 
      };
      setAssistantChat(prev => [...prev, botMsg]);
      showToast("Bilan de production IA émis !", "success");

    } catch (err: any) {
      setAssistantChat(prev => [...prev, { role: 'assistant', text: `Défaillance lors de l'audit : ${err.message}` }]);
    } finally {
      setIsAnalyzingHealth(false);
    }
  };

  // Conversational prompts sending
  const handleAssistantSubmit = async () => {
    if (!assistantInput.trim()) return;

    const userText = assistantInput;
    setAssistantInput('');
    setIsAnalyzingHealth(true);

    setAssistantChat(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const response = await fetch('/api/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'command',
          userPrompt: userText,
          clients,
          projects
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'application de l'ordre.");
      }

      const result = await response.json();
      setAssistantChat(prev => [...prev, { role: 'assistant', text: result.feedback || "Compris Chef !" }]);

      if (result.understood && result.commandAction === 'create_client' && result.clientData) {
        const startRaw = Date.now();
        const endRaw = Date.now() + 30 * 24 * 60 * 60 * 1000;

        const insertedId = addClient({
          name: result.clientData.name || "Interlocuteur",
          company: result.clientData.company || "Nouveau Projet Spécial",
          email: result.clientData.email || "contact@numtema.fr",
          phone: result.clientData.phone || "N/A",
          projectType: (result.clientData.projectType || 'site_vitrine') as ProjectType,
          offerName: (result.clientData.offerName || 'presence_pro') as OfferType
        }, {
          quoteAmount: result.projectData?.quoteAmount ?? 1500,
          amountPaid: result.projectData?.amountPaid ?? 0,
          startDate: startRaw,
          endDate: endRaw
        });

        showToast(`✨ Projet "${result.clientData.company}" planifié suite à votre ordre !`, 'success');
        if (insertedId) {
          setSelectedClientId(insertedId);
          setViewMode('detail');
          setIsDirectorOpen(false);
        }
      } else {
        showToast("Demande traitée avec succès !", "info");
      }

    } catch (err: any) {
      setAssistantChat(prev => [...prev, { role: 'assistant', text: `Erreur d'ordre : ${err.message}` }]);
    } finally {
      setIsAnalyzingHealth(false);
    }
  };

  // AI brief pdf analytics reader
  const handleBriefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedBriefFile(file);
    setIsAnalyzingHealth(true);

    try {
      showToast("Lecture et téléversement du brief PDF en cours...", "info");

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const rawResult = reader.result as string;
          resolve(rawResult.split(',')[1]);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-brief',
          fileBase64: base64,
          fileType: file.type || 'application/pdf',
          fileName: file.name
        })
      });

      if (!response.ok) {
        throw new Error("L'analyse du document par l'IA a échoué.");
      }

      const result = await response.json();
      
      const promptReply = { 
        role: 'assistant' as const, 
        text: `Brief "${file.name}" analysé à 100% ! J'ai extrait les livrables techniques :\n\n- Entreprise : ${result.clientData?.company || 'Non spécifié'}\n- Budget estimé : ${result.projectData?.quoteAmount || 0}€\n\nJ'ai pré-configuré ses jalons de production.` 
      };
      setAssistantChat(prev => [...prev, promptReply]);

      if (result.understood && result.clientData && result.projectData) {
        const createdId = addClient({
          name: result.clientData.name || "Client de l'IA",
          company: result.clientData.company || "Maquette Brief PDF",
          email: result.clientData.email || "support@numtema.fr",
          phone: "N/A",
          projectType: (result.clientData.projectType || 'site_vitrine') as ProjectType,
          offerName: (result.clientData.offerName || 'presence_pro') as OfferType
        }, {
          quoteAmount: result.projectData.quoteAmount || 1500,
          amountPaid: result.projectData.amountPaid || 0,
          notes: result.projectData.notes || "Généré par brief PDF",
          steps: result.projectData.steps || [],
          startDate: Date.now(),
          endDate: Date.now() + 30 * 24 * 60 * 60 * 1000
        });

        showToast("Projet extrait et initialisé !", "success");
        if (createdId) {
          setSelectedClientId(createdId);
          setViewMode('detail');
          setIsDirectorOpen(false);
        }
      }

    } catch (err: any) {
      showToast(err.message || "Impossible d'extraire le brief.", "error");
    } finally {
      setIsAnalyzingHealth(false);
      setSelectedBriefFile(null);
    }
  };

  // Helper variables for invoices
  const getPaymentReminderInfo = (project: Project) => {
    const qAmount = project.financials?.quoteAmount ?? 0;
    const pAmount = project.financials?.amountPaid ?? 0;
    const unpaid = qAmount - pAmount;

    if (unpaid <= 0) {
      return { status: 'paid', label: 'Payé total', description: 'Toutes les factures ont été payées.', alertLevel: 0 };
    }

    const start = project.startDate ? new Date(project.startDate) : new Date();
    const days = differenceInDays(new Date(), start);

    if (days < 7) {
      return { status: 'waiting', label: 'En attente', description: `Créé il y a ${days}j. Prochaine relance de conformité automatique dans ${7 - days}j.`, alertLevel: 1 };
    } else if (days >= 7 && days < 14) {
      return { status: 'reminder_1', label: 'Relance 1 nécessaire', description: `Acompte impayé depuis ${days}j. Veuillez expédier la première relance douce d'acompte.`, alertLevel: 2 };
    } else {
      return { status: 'reminder_2', label: 'Relance 2 urgente', description: `Retard flagrant de paiement de ${days}j (plus de 2 semaines). Deuxième relance juridique à envoyer d'urgence.`, alertLevel: 3 };
    }
  };

  const getReminderTemplate1 = (clientName: string, company: string, amount: number) => {
    return `Bonjour ${clientName},

J'espère que vous vous portez bien.

Je me permets de vous contacter pour le suivi de notre accompagnement concernant la production de ${company || 'votre projet'}.

Sauf erreur de notre part, le règlement d'acompte de ${amount} € reste à régulariser afin de valider officiellement le lancement de votre phase de production.

Pour rappel, conformément à nos engagements Nümtema Agency :
- La production s'organise autour de 2 cycles de retouche inclus maximum pour garantir le respect rigoureux de vos délais.
- Les frais de nom de domaine, hébergement et licences logicielles tiers restent à votre charge exclusive.
- Les mentions légales et textes de conformité (RGPD/CGV) sont à valider par vos soins à la mise en ligne.

Vous trouverez notre RIB ci-joint pour effectuer le virement bancaire et libérer nos équipes créatives.

Chaleureusement,
La direction de production Nümtema`;
  };

  const getReminderTemplate2 = (clientName: string, company: string, amount: number) => {
    return `Bonjour ${clientName},

Je reviens vers vous suite à mon précédent courriel pour solliciter la régularisation de la facture de production en attente d'un montant de ${amount} € pour le projet ${company || 'votre entreprise'}.

Afin de ne pas retarder votre calendrier de livraison, merci d'émettre le virement bancaire sous 48h. Tout décalage de paiement suspend temporairement la planification de votre prochain cycle de retouche ou d'intégration.

Pour rappel de nos dispositions CGV :
- La cession définitive des droits ou du code source n'est pas comprise, sauf stipulation contractuelle écrite expresse.
- La mise en ligne finale interviendra dès réception et validation définitive du solde complet.

Nous vous remercions pour votre réactivité et restons mobilisés pour finaliser cette magnifique vitrine.

Bien cordialement,
Le Directeur de Production Nümtema`;
  };

  const getProjectTheme = (type: any) => {
    switch (type) {
      case 'site_vitrine': return { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', rawBg: 'from-emerald-400 to-teal-500' };
      case 'e_commerce': return { bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', rawBg: 'from-indigo-400 to-purple-500' };
      case 'saas': return { bg: 'bg-blue-500/10 text-blue-600 dark:text-sky-400 border-sky-500/20', rawBg: 'from-blue-600 to-sky-400' };
      default: return { bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20', rawBg: 'from-violet-400 to-fuchsia-500' };
    }
  };

  // Loading state overlay
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#040815] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500/10 border-t-sky-400 rounded-full animate-spin"></div>
          <span className="text-xs font-black font-mono tracking-widest uppercase text-zinc-550">Chargement de votre Bureau...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 antialiased relative ${
      isDark 
        ? 'bg-[#040815] text-[#f1f5f9] bg-gradient-to-br from-[#040815] via-[#091122] to-[#02050b]' 
        : 'bg-[#f8fafc] text-slate-800'
    }`}>
      {/* Decorative Light-emitting Orbs */}
      {isDark ? (
        <React.Fragment>
          <div className="absolute top-[5%] left-[25%] w-[450px] h-[450px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-sky-500/5 blur-[140px] pointer-events-none z-0" />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="absolute top-[2%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-600/[0.04] blur-[110px] pointer-events-none z-0" />
          <div className="absolute bottom-[5%] right-[20%] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.04] blur-[130px] pointer-events-none z-0" />
        </React.Fragment>
      )}

      {/* 1. LEFT SIDEBAR */}
      <Sidebar 
        theme={theme}
        toggleTheme={toggleTheme}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        filterType={filterType}
        setFilterType={setFilterType}
        selectedClientId={selectedClientId}
        setSelectedClientId={setSelectedClientId}
        setViewMode={setViewMode}
        clients={clients}
        projects={projects}
        stats={stats}
        handleAnalyzeHealth={handleAnalyzeHealth}
        resetToDemo={resetToDemo}
      />

      {/* 2. MAIN HUB CANVAS */}
      <div className="flex-grow flex flex-col overflow-hidden relative z-10 w-full" id="hub-wrapper">
        <Header 
          theme={theme}
          toggleTheme={toggleTheme}
          filterType={filterType}
          filteredClients={filteredClients}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showDashboardWidgets={showDashboardWidgets}
          setShowDashboardWidgets={setShowDashboardWidgets}
          overviewCols={overviewCols}
          setOverviewCols={setOverviewCols}
          completedToday={completedToday}
          setIsGameChallengerOpen={setIsGameChallengerOpen}
          taskCompletions7Days={taskCompletions7Days}
          setIsAddClientOpen={setIsAddClientOpen}
          stats={stats}
          isDbMode={isDbMode}
        />

        {/* 3. DUAL GRAPHICAL WIDGETS SECTION */}
        {showDashboardWidgets && viewMode !== 'clients' && viewMode !== 'architecture' && (
          <div className={`px-6 pt-5 grid grid-cols-1 lg:grid-cols-5 gap-5 shrink-0 ${
            selectedClientId ? 'hidden lg:grid' : ''
          }`} id="widgets-container">
            <GameChallengerChart 
              theme={theme}
              taskCompletionsWithCumulative={taskCompletionsWithCumulative}
              completedToday={completedToday}
            />
            <AdvancementWidget 
              theme={theme}
              clients={clients}
              projects={projects}
              stats={stats}
              setSelectedClientId={setSelectedClientId}
              setViewMode={setViewMode}
            />
          </div>
        )}

        {/* 4. ACTIVE SUB-VIEWPORT */}
        {viewMode === 'detail' && (
          <ClientDetailsTab 
            theme={theme}
            filteredClients={filteredClients}
            projects={projects}
            selectedClientId={selectedClientId}
            setSelectedClientId={setSelectedClientId}
            updateClient={updateClient}
            deleteClient={deleteClient}
            updateProject={updateProject}
            selectedClientIds={selectedClientIds}
            setSelectedClientIds={setSelectedClientIds}
            getPaymentReminderInfo={getPaymentReminderInfo}
            getReminderTemplate1={getReminderTemplate1}
            getReminderTemplate2={getReminderTemplate2}
            getProjectTheme={getProjectTheme}
          />
        )}

        {viewMode === 'overview' && (
          <ClientGlobalTab 
            theme={theme}
            filteredClients={filteredClients}
            projects={projects}
            overviewCols={overviewCols}
            updateProject={updateProject}
            setSelectedClientId={setSelectedClientId}
            setViewMode={setViewMode}
          />
        )}

        {viewMode === 'clients' && (
          <ClientDirectoryTab 
            theme={theme}
            filteredClients={filteredClients}
            projects={projects}
            selectedClientIds={selectedClientIds}
            setSelectedClientIds={setSelectedClientIds}
            setIsBulkTemplatesOpen={setIsBulkTemplatesOpen}
            setIsBulkRemindersOpen={setIsBulkRemindersOpen}
            setSelectedClientId={setSelectedClientId}
            setViewMode={setViewMode}
            deleteClient={deleteClient}
          />
        )}

        {viewMode === 'architecture' && (
          <CommercialArchitectureTab theme={theme} />
        )}
      </div>

      {/* 5. FLOATING VIRTUAL AI DRAWERS */}
      <AiDirectorDrawer 
        theme={theme}
        isOpen={isDirectorOpen}
        onClose={() => setIsDirectorOpen(false)}
        clients={clients}
        projects={projects}
        assistantChat={assistantChat}
        assistantInput={assistantInput}
        setAssistantInput={setAssistantInput}
        handleAssistantSubmit={handleAssistantSubmit}
        isAnalyzingHealth={isAnalyzingHealth}
        handleBriefUpload={handleBriefUpload}
        selectedBriefFile={selectedBriefFile}
      />

      {/* 6. MODALS POPUPS CONTROL ELEMENTS */}
      <AddClientModal 
        theme={theme}
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        handleAddClient={handleCreateClient}
      />

      <GameChallengerModal 
        theme={theme}
        isOpen={isGameChallengerOpen}
        onClose={() => setIsGameChallengerOpen(false)}
        taskCompletions7Days={taskCompletions7Days}
        completedToday={completedToday}
      />

      <BulkRemindersModal 
        theme={theme}
        isOpen={isBulkRemindersOpen}
        onClose={() => setIsBulkRemindersOpen(false)}
        selectedClientIds={selectedClientIds}
        clients={clients}
        projects={projects}
        getPaymentReminderInfo={getPaymentReminderInfo}
        getReminderTemplate1={getReminderTemplate1}
        getReminderTemplate2={getReminderTemplate2}
      />

      <BulkTemplatesModal 
        theme={theme}
        isOpen={isBulkTemplatesOpen}
        onClose={() => setIsBulkTemplatesOpen(false)}
        selectedClientIds={selectedClientIds}
        handleBulkApplyTemplate={handleBulkApplyTemplate}
      />

      {/* 7. NOTIFICATION BAR CO-PILOTE TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-100 flex items-center shadow-2xl"
          >
            <div className={`px-4 py-3 rounded-xl border text-xs font-black tracking-wide flex items-center gap-2 select-none ${
              toast.type === 'error' 
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                : toast.type === 'info'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/15'
                  : 'bg-emerald-500/11 text-emerald-600 dark:text-emerald-400 border-emerald-500/15'
            }`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                toast.type === 'error' ? 'bg-rose-500' : toast.type === 'info' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`} />
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
