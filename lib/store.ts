/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Client, Project, Step, Blocker, ProjectType, OFFER_LABELS, DEFAULT_STEPS } from './types';

const INITIAL_CLIENTS: Client[] = [];
const INITIAL_PROJECTS: Record<string, Project> = {};

export function useStore() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDbMode, setIsDbMode] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('numtema_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('numtema_theme', nextTheme);
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch('/api/clients');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const parsedClients: Client[] = [];
            const parsedProjects: Record<string, Project> = {};
            
            data.forEach((c: any) => {
              const { project, ...clientOnly } = c;
              parsedClients.push(clientOnly);
              if (project) {
                parsedProjects[c.id] = project;
              }
            });

            setClients(parsedClients);
            setProjects(parsedProjects);
            setIsDbMode(true);
            setIsLoaded(true);
            return;
          }
        }
      } catch (err) {
        console.warn('Database fallback: PostgreSQL not reachable or not migrated yet. Using localStorage instead.', err);
      }

      // LocalStorage fallback
      const rawClients = localStorage.getItem('numtema_clients');
      const rawProjects = localStorage.getItem('numtema_projects');
      if (rawClients && rawProjects) {
        try {
          const parsedClients = JSON.parse(rawClients) as Client[];
          const parsedProjects = JSON.parse(rawProjects) as Record<string, Project>;
          
          let healed = false;
          parsedClients.forEach(c => {
            if (!parsedProjects[c.id]) {
              const initialSteps = DEFAULT_STEPS[c.projectType] || [];
              parsedProjects[c.id] = {
                id: c.id,
                financials: { quoteAmount: 1500, amountPaid: 0 },
                steps: initialSteps.map((label, idx) => ({
                  id: `s_${c.id}_${idx}`,
                  label,
                  isCompleted: false,
                })),
                currentBlocker: 'none',
                notes: '',
                driveLink: '',
                siteLink: '',
                startDate: c.createdAt,
                endDate: c.createdAt + 30 * 24 * 60 * 60 * 1000,
                updatedAt: Date.now()
              };
              healed = true;
            } else {
              const p = parsedProjects[c.id];
              if (!p.financials) {
                p.financials = { quoteAmount: 1500, amountPaid: 0 };
                healed = true;
              }
              if (!p.steps) {
                const initialSteps = DEFAULT_STEPS[c.projectType] || [];
                p.steps = initialSteps.map((label, idx) => ({
                  id: `s_${c.id}_${idx}`,
                  label,
                  isCompleted: false,
                }));
                healed = true;
              }
              if (!p.startDate) {
                p.startDate = c.createdAt;
                healed = true;
              }
              if (!p.endDate) {
                p.endDate = c.createdAt + 30 * 24 * 60 * 60 * 1000;
                healed = true;
              }
            }
          });

          setClients(parsedClients);
          setProjects(parsedProjects);
          if (healed) {
            localStorage.setItem('numtema_projects', JSON.stringify(parsedProjects));
          }
        } catch (err) {
          setClients(INITIAL_CLIENTS);
          setProjects(INITIAL_PROJECTS);
          localStorage.setItem('numtema_clients', JSON.stringify(INITIAL_CLIENTS));
          localStorage.setItem('numtema_projects', JSON.stringify(INITIAL_PROJECTS));
        }
      } else {
        setClients(INITIAL_CLIENTS);
        setProjects(INITIAL_PROJECTS);
        localStorage.setItem('numtema_clients', JSON.stringify(INITIAL_CLIENTS));
        localStorage.setItem('numtema_projects', JSON.stringify(INITIAL_PROJECTS));
      }
      setIsLoaded(true);
    }

    loadInitialData();
  }, []);

  const saveToStorage = (newClients: Client[], newProjects: Record<string, Project>) => {
    if (!isDbMode) {
      localStorage.setItem('numtema_clients', JSON.stringify(newClients));
      localStorage.setItem('numtema_projects', JSON.stringify(newProjects));
    }
  };

  const addClient = (
    clientData: Omit<Client, 'id' | 'createdAt'>,
    projectData?: {
      quoteAmount?: number;
      amountPaid?: number;
      startDate?: number;
      endDate?: number;
      notes?: string;
      steps?: string[];
    }
  ) => {
    // Optimistic ID mapping
    const clientId = typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID 
      ? window.crypto.randomUUID() 
      : 'c_' + Math.random().toString(36).substring(2, 11);

    const newClient: Client = {
      ...clientData,
      id: clientId,
      createdAt: Date.now(),
    };

    const initialSteps = projectData?.steps || DEFAULT_STEPS[clientData.projectType] || [];
    const newProject: Project = {
      id: clientId,
      financials: { 
        quoteAmount: projectData?.quoteAmount ?? 1500, 
        amountPaid: projectData?.amountPaid ?? 0 
      },
      steps: initialSteps.map((label, idx) => ({
        id: `s_${clientId}_${idx}`,
        label,
        isCompleted: false,
      })),
      currentBlocker: 'none',
      notes: projectData?.notes ?? '',
      driveLink: '',
      siteLink: '',
      startDate: projectData?.startDate ?? Date.now(),
      endDate: projectData?.endDate ?? (Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: Date.now(),
    };

    // Perform optimistic UI update
    const updatedClients = [newClient, ...clients];
    const updatedProjects = { ...projects, [clientId]: newProject };

    setClients(updatedClients);
    setProjects(updatedProjects);
    saveToStorage(updatedClients, updatedProjects);

    // If DB Mode, sync in background
    if (isDbMode) {
      fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: clientId,
          ...clientData,
          quoteAmount: projectData?.quoteAmount,
          amountPaid: projectData?.amountPaid,
          steps: initialSteps,
          startDate: projectData?.startDate,
          endDate: projectData?.endDate,
        }),
      }).catch(err => {
        console.error('Failed to sync new client to PostgreSQL:', err);
      });
    }

    return clientId;
  };

  const resetToDemo = () => {
    if (isDbMode) {
      console.warn('Reset to Demo is disabled in database mode.');
      return;
    }
    localStorage.removeItem('numtema_clients');
    localStorage.removeItem('numtema_projects');
    setClients(INITIAL_CLIENTS);
    setProjects(INITIAL_PROJECTS);
    localStorage.setItem('numtema_clients', JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem('numtema_projects', JSON.stringify(INITIAL_PROJECTS));
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    const updatedClients = clients.map((c) => {
      if (c.id === clientId) {
        const isArchivingChange = updates.isArchived !== undefined && c.isArchived !== updates.isArchived;
        return {
          ...c,
          ...updates,
          ...(isArchivingChange ? { archivedAt: updates.isArchived ? Date.now() : undefined } : {}),
        };
      }
      return c;
    });

    setClients(updatedClients);
    saveToStorage(updatedClients, projects);

    if (isDbMode) {
      fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updateType: 'client',
          data: updates,
        }),
      }).catch(err => {
        console.error('Failed to sync client update to PostgreSQL:', err);
      });
    }
  };

  const updateProject = (clientId: string, updates: Partial<Project>) => {
    let project = projects[clientId];
    if (!project) {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      const initialSteps = DEFAULT_STEPS[client.projectType] || [];
      project = {
        id: clientId,
        financials: { quoteAmount: 1500, amountPaid: 0 },
        steps: initialSteps.map((label, idx) => ({
          id: `s_${clientId}_${idx}`,
          label,
          isCompleted: false,
        })),
        currentBlocker: 'none',
        notes: '',
        driveLink: '',
        siteLink: '',
        startDate: client.createdAt,
        endDate: client.createdAt + 30 * 24 * 60 * 60 * 1000
      };
    }

    let updatedProjectFields = { ...project, ...updates, updatedAt: Date.now() };

    if (updates.steps) {
      const allDone = updates.steps.length > 0 && updates.steps.every(s => s.isCompleted);
      if (allDone && !project.completedAt) {
        updatedProjectFields.completedAt = Date.now();
      } else if (!allDone) {
        updatedProjectFields.completedAt = undefined;
      }
    }

    const updatedProjects = {
      ...projects,
      [clientId]: updatedProjectFields,
    };

    setProjects(updatedProjects);
    saveToStorage(clients, updatedProjects);

    if (isDbMode) {
      fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updateType: 'project',
          data: {
            quoteAmount: updates.financials?.quoteAmount !== undefined ? updates.financials.quoteAmount : updatedProjectFields.financials.quoteAmount,
            amountPaid: updates.financials?.amountPaid !== undefined ? updates.financials.amountPaid : updatedProjectFields.financials.amountPaid,
            currentBlocker: updates.currentBlocker,
            notes: updates.notes,
            driveLink: updates.driveLink,
            siteLink: updates.siteLink,
            startDate: updates.startDate,
            endDate: updates.endDate,
            completedAt: updatedProjectFields.completedAt,
          },
          steps: updates.steps,
        }),
      }).catch(err => {
        console.error('Failed to sync project update to PostgreSQL:', err);
      });
    }
  };

  const deleteClient = (clientId: string) => {
    const updatedClients = clients.filter((c) => c.id !== clientId);
    const updatedProjects = { ...projects };
    delete updatedProjects[clientId];

    setClients(updatedClients);
    setProjects(updatedProjects);
    saveToStorage(updatedClients, updatedProjects);

    if (isDbMode) {
      fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      }).catch(err => {
        console.error('Failed to sync delete to PostgreSQL:', err);
      });
    }
  };

  return {
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
    toggleTheme,
  };
}
