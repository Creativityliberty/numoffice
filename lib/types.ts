export type ProjectType = 'site_vitrine' | 'e_commerce' | 'flyers' | 'funnel_hub' | 'google_business' | 'logo' | 'formation';
export type OfferType = 'presence_essentielle' | 'presence_pro' | 'systeme_client' | 'ecommerce' | 'funnelhub_signature' | 'sur_mesure' | 'formation_atelier' | 'autre';
export type Blocker = 'none' | 'attente_devis' | 'attente_acompte' | 'attente_questionnaire' | 'attente_photos' | 'attente_textes' | 'attente_validation' | 'attente_solde' | 'attente_retour';

export interface Step {
  id: string;
  label: string;
  isCompleted: boolean;
  completedAt?: number;
}

export interface Project {
  id: string;
  financials: {
    quoteAmount: number;
    amountPaid: number;
  };
  steps: Step[];
  currentBlocker: Blocker;
  notes: string;
  driveLink: string;
  siteLink: string;
  updatedAt?: number;
  startDate?: number; // Project start date
  endDate?: number; // Project end date (deadline)
  completedAt?: number; // Project completion date
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  offerName: string;
  createdAt: number;
  isArchived?: boolean;
  archivedAt?: number; // Archiving date for each project
}

export const BLOCKER_LABELS: Record<Blocker, string> = {
  'none': 'Aucun bloquant',
  'attente_devis': 'Attente devis',
  'attente_acompte': 'Attente acompte',
  'attente_questionnaire': 'Attente questionnaire',
  'attente_photos': 'Attente photos',
  'attente_textes': 'Attente textes',
  'attente_validation': 'Attente validation',
  'attente_solde': 'Attente solde',
  'attente_retour': 'Attente retour client',
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'site_vitrine': 'Site Vitrine',
  'e_commerce': 'E-commerce',
  'flyers': 'Flyer / Print',
  'funnel_hub': 'FunnelHub',
  'google_business': 'Google Business',
  'logo': 'Création Logo',
  'formation': 'Formation / Atelier',
};

export const OFFER_LABELS: Record<OfferType, string> = {
  'presence_essentielle': 'Présence Essentielle',
  'presence_pro': 'Présence Pro',
  'systeme_client': 'Système Client',
  'ecommerce': 'E-commerce',
  'funnelhub_signature': 'FunnelHub Signature',
  'sur_mesure': 'Sur-mesure',
  'formation_atelier': 'Workshop / Formation',
  'autre': 'Autre',
};

export const DEFAULT_STEPS: Record<ProjectType, string[]> = {
  'site_vitrine': [
    'Brief initial', 'Cahier des charges', 'Zoning & Wireframe', 'Maquette UI', 'Validation maquette', 
    'Intégration / Dév', 'Contenu textuel', 'SEO de base', 'Validation finale', 'Mise en ligne', 'Lier nom domaine'
  ],
  'e_commerce': [
    'Brief initial', 'Cahier des charges', 'Maquette UI', 'Intégration Shopify/Stripe', 'Fiches produits', 
    'Mise en place panier', 'SEO ecommerce', 'Tests paiements', 'Validation finale', 'Mise en ligne'
  ],
  'flyers': [
    'Brief', 'Moodboard', 'Proposition V1', 'Sélection / Retouches', 'Validation finale', 'Préparation fichier imprimeur'
  ],
  'funnel_hub': [
    'Stratégie tunnel', 'Copywriting page capture', 'Design UI', 'Intégration Système.io/ClickFunnels', 
    'Automation email', 'Tests conversion', 'Mise en ligne'
  ],
  'google_business': [
    'Création fiche', 'Optimisation SEO local', 'Ajout photos', 'Description & Services', 'Lien avis', 'Validation Google'
  ],
  'logo': [
    'Brief', 'Devis', 'Acompte', 'Inspiration / Moodboard', 'Propositions V1', 'Validation', 
    'Retouches', 'Fichiers finaux', 'Paiement', 'Livraison', 'Projet ancré'
  ],
  'formation': [
    'Quel type d\'atelier', 'Préparation du livret', 'Impression du livret', 'Date de l\'atelier fixée', 
    'Publication & Communication', 'Contacter la liste'
  ]
};
