'use client';

import React, { useState, useMemo } from 'react';
import { 
  Flame, ShieldCheck, Layers, DollarSign, Clock, ArrowRight,
  CheckCircle2, Copy, Check, BookOpen, UserCheck, FileText,
  Lock, Scale, ListTodo, HelpCircle, Briefcase, Sparkles,
  Calculator, AlertCircle, MessageSquare, Coins, ChevronDown, ChevronUp,
  LayoutGrid, ShoppingBag, Globe, Palette
} from 'lucide-react';

interface CommercialArchitectureTabProps {
  theme: 'dark' | 'light';
}

interface OfferDetail {
  id: string;
  name: string;
  price: number;
  priceSuffix?: string;
  tagline: string;
  idealClient: string;
  problem: string;
  inclusions: string[];
  exclusions: string[];
  delays: string;
  acompteMin: number;
  pitch: string;
  icon: React.ReactNode;
}

export default function CommercialArchitectureTab({ theme }: CommercialArchitectureTabProps) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'offers' | 'pipeline' | 'discovery' | 'questionnaire' | 'objections' | 'clauses'>('offers');
  const [selectedOfferId, setSelectedOfferId] = useState<string>('presence_essentielle');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Playground/Simulator state
  const [selectedBaseOfferId, setSelectedBaseOfferId] = useState<string>('presence_essentielle');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [paymentInstallments, setPaymentInstallments] = useState<number>(2); // 2, 3, 5 or 10 times

  // Discovery call interactive state
  const [prepChecked, setPrepChecked] = useState<string[]>([]);
  const [activeProjectCategory, setActiveProjectCategory] = useState<'local' | 'coach' | 'consultant' | 'ecommerce' | 'funnelhub'>('local');
  const [discoveryClientName, setDiscoveryClientName] = useState<string>('');
  const [discoveryGoal, setDiscoveryGoal] = useState<string>('générer des contacts qualifiés');
  const [discoveryScoring, setDiscoveryScoring] = useState<Record<string, number>>({
    needs: 1,
    budget: 1,
    urgency: 1,
    assets: 1,
    decision: 2,
    fit: 1,
    potential: 1
  });
  const [activeDiscoverySection, setActiveDiscoverySection] = useState<'posture' | 'prep' | 'guide' | 'scoring' | 'summary'>('guide');

  // Accordion state for objections
  const [expandedObjection, setExpandedObjection] = useState<string | null>(null);

  // Local visibility questionnaire (Doc 10.1) state
  const [activeQuestSection, setActiveQuestSection] = useState<string>('meta');
  const [questMeta, setQuestMeta] = useState({
    companyName: '',
    referentName: '',
    phoneWhatsapp: '',
    contactEmail: '',
    mainCity: '',
    mainActivity: '', // Dedicated to Document 10.2
    fillingDate: new Date().toLocaleDateString('fr-FR'),
    associatedQuote: 'Présence Pro - 1500 €'
  });

  const [questAnswers, setQuestAnswers] = useState<Record<number, string>>({});
  
  // Pages requested states (Section 7)
  const [questPages, setQuestPages] = useState<Record<string, boolean>>({
    accueil: true,
    services: true,
    serv1: false,
    realisations: true,
    avis: true,
    apropos: true,
    faq: true,
    contact: true,
    zone: true,
    blog: false
  });

  // Client Drive checklist items (Section 11)
  const [questDrive, setQuestDrive] = useState<string[]>([]);

  // Selected Questionnaire Type: 'local' (Doc 10.1), 'vitrine' (Doc 10.2), 'formation' (Doc 10.3-A), 'coach' (Doc 10.3-B) or 'ecommerce' (Doc 10.4)
  const [selectedQuestionnaireType, setSelectedQuestionnaireType] = useState<'local' | 'vitrine' | 'formation' | 'coach' | 'ecommerce'>('local');

  // Vitrine questionnaire (Doc 10.2) state
  const [questAnswersVitrine, setQuestAnswersVitrine] = useState<Record<number, string>>({});
  const [questPagesVitrine, setQuestPagesVitrine] = useState<Record<string, boolean>>({
    accueil: true,
    apropos: true,
    services: true,
    serv1: false,
    realisations: true,
    avis: true,
    faq: true,
    contact: true,
    blog: false
  });
  const [questDriveVitrine, setQuestDriveVitrine] = useState<string[]>([]);

  // Formation questionnaire (Doc 10.3) state
  const [questAnswersFormation, setQuestAnswersFormation] = useState<Record<number, string>>({});
  const [questPagesFormation, setQuestPagesFormation] = useState<Record<string, boolean>>({
    landing: true,
    programme: true,
    apropos: true,
    faq: true,
    inscription: true,
    ressources: false,
    b2b: false
  });
  const [questDriveFormation, setQuestDriveFormation] = useState<string[]>([]);

  // Coach/Thérapeute questionnaire (Doc 10.3-B) state
  const [questAnswersCoach, setQuestAnswersCoach] = useState<Record<number, string>>({});
  const [questPagesCoach, setQuestPagesCoach] = useState<Record<string, boolean>>({
    accueil: true,
    apropos: true,
    methode: true,
    accompagnements: true,
    offre_detaillee: false,
    temoignages: true,
    ressources: false,
    faq: true,
    contact: true
  });
  const [questDriveCoach, setQuestDriveCoach] = useState<string[]>([]);

  // E-commerce questionnaire (Doc 10.4) state
  const [questAnswersEcommerce, setQuestAnswersEcommerce] = useState<Record<number, string>>({});
  const [questPagesEcommerce, setQuestPagesEcommerce] = useState<Record<string, boolean>>({
    accueil: true,
    boutique: true,
    produit: true,
    apropos: true,
    contact: true,
    faq: true,
    livraison: true,
    avis: false,
    blog: false,
    panier: true,
    legal: true
  });
  const [questDriveEcommerce, setQuestDriveEcommerce] = useState<string[]>([]);

  // Trigger copy to clipboard with instant state visual feedback
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const prepChecklist = useMemo(() => [
    { id: 'nom', text: 'Nom du prospect et activité repérés' },
    { id: 'msg', text: 'Message de contact initial relu avec attention' },
    { id: 'source', text: 'Source du contact identifiée (recommandation, WhatsApp, réseau)' },
    { id: 'old_site', text: 'Ancien site web ou profils de réseaux sociaux ouverts' },
    { id: 'type_v', text: 'Type de projet présumé (vitrine, e-commerce, local, funnelhub)' },
    { id: 'price_ind', text: 'Fourchette d\'offre probable pré-identifiée' },
    { id: 'note_pad', text: 'Questions sensibles rédigées et de quoi prendre des notes' },
    { id: 'acompte_rule', text: 'Rappel : pas de travail sans devis signé + acompte de démarrage' },
    { id: 'record_ok', text: 'Demander l’accord d’enregistrement de l’échange (pour le copywriting)' }
  ], []);

  const diagnosticBlocs = useMemo(() => [
    {
      id: 'bloc_a',
      title: 'Bloc A - Comprendre l’activité (5-8 min)',
      subtitle: 'Laisser le prospect verbaliser son modèle d’affaires avec ses propres mots.',
      questions: [
        { q: "“Présentez-moi votre activité simplement : vous faites quoi, pour qui, et avec quel résultat pour vos clients ?”", purpose: "Laisser parler libre pour capturer les mots exacts et les expressions magiques pour les headers." },
        { q: "“Aujourd’hui, votre client idéal, c’est qui ?”", purpose: "Cadrer sa cible principale et mettre de côté les cibles toxiques." },
        { q: "“Qu’est-ce qu’on doit comprendre en arrivant sur votre site en moins de 10 secondes ?”", purpose: "Déceler le focus du positionnement." },
        { q: "“Quelle offre ou quel service doit être le plus mis en avant ?”", purpose: "Hiérarchiser plutôt que créer un catalogue brouillon." }
      ]
    },
    {
      id: 'bloc_b',
      title: 'Bloc B - Clarifier le besoin (5-8 min)',
      subtitle: 'Sortir du simple outil technique stérile pour trouver l’objectif d’affaires.',
      questions: [
        { q: "“Quand vous dites que vous voulez un site, vous voulez surtout quoi : être plus crédible, être trouvé sur Google, recevoir plus de demandes, ou automatiser les rendez-vous ?”", purpose: "Valide si l\'offre raccord est Présence Essentielle, Pro ou Système Client." },
        { q: "“Aujourd’hui, qu’est-ce qui vous bloque le plus : le manque de visibilité, une image pas assez pro, ou trop de temps perdu en tâches manuelles ?”", purpose: "Cibler d\'éventuels modules optionnels payants." },
        { q: "“Si le site est pleinement réussi dans trois mois, qu’est-ce qui aura changé concrètement dans votre business ?”", purpose: "Associer le projet à un ROI commercial tangible." }
      ]
    },
    {
      id: 'bloc_c',
      title: 'Bloc C - Contenus et assets (5-7 min)',
      subtitle: 'Anticiper les blocages et sécuriser la vitesse de développement.',
      questions: [
        { q: "“Qu’avez-vous déjà sous la main : logo pro, photos HD, témoignages et avis authentiques, vidéos ?”", purpose: "Estimer le niveau de travail brut d\'intégration." },
        { q: "“Qui élaborera les textes de pages ? Avez-vous besoin d\'une option de copywriting de notre part ?”", purpose: "Ouvrir l\'option de module copywriting sémantique." },
        { q: "“Abonnements et nom de domaine : d\'accord pour l\'acheter vous-même pour rester souverain ?”", purpose: "Lever toute ambiguïté sur la facturation technique du tiers." }
      ]
    }
  ], []);

  const projectTypesQuestions = useMemo(() => [
    {
      type: 'local',
      name: 'Business Local',
      badge: 'Artisan, commerce local, profession libérale de proximité',
      questions: [
        '“Quelle est votre zone géographique d\'intervention prioritaire ?”',
        '“Avez-vous déjà une fiche Google Business Profile fonctionnelle avec des avis clients ?”',
        '“Les horaires, adresse physique, téléphone et catalogue de services locaux sont-ils fixés ?”'
      ],
      suggested: 'presence_essentielle',
      reason: 'Idéal pour le SEO Local et le contact direct WhatsApp.'
    },
    {
      type: 'coach',
      name: 'Coach / Thérapeute / Expert',
      badge: 'Accompagnement, services individuels, transformation',
      questions: [
        '“Quelle transformation ultime ou quel résultat promettez-vous à vos coachés ?”',
        '“Quelle est votre méthode distinctive ou vos piliers d\'expertise ?”',
        '“Quelles objections recevez-vous au téléphone avant que les gens n\'achètent vos packages ?”'
      ],
      suggested: 'presence_pro',
      reason: 'Idéal pour exprimer la singularité et la preuve sociale.'
    },
    {
      type: 'consultant',
      name: 'Consultant / Formateur',
      badge: 'B2B, agence, business cherchant des leads qualifiés',
      questions: [
        '“De quel aimant à prospects (Lead Magnet) ou ressource de capture disposez-vous ?”',
        '“Le site doit-il automatiser un appel qualifié (Calendly/TidyCal) ou offrir une capture de mail ?”',
        '“Preuves sociales : disposez-vous de cas d\'études clients ou d\'analyses détaillées ?”'
      ],
      suggested: 'systeme_client',
      reason: 'Idéal pour automatiser la capture et le calendrier de rendez-vous.'
    },
    {
      type: 'ecommerce',
      name: 'E-commerce',
      badge: 'Vente directe de biens physiques ou services packagés',
      questions: [
        '“Combien de produits différents souhaitez-vous mettre en vente au départ ?”',
        '“Vos politiques de livraison, stocks existants, retours et passerelles Stripe sont-ils prêts ?”',
        '“Est-ce un vrai catalogue transactionnel avec panier d\'achats ou une simple présentation vitrine ?”'
      ],
      suggested: 'ecommerce',
      reason: 'Idéal pour le checkout sans friction et le raccord logistique.'
    },
    {
      type: 'funnelhub',
      name: 'FunnelHub Signature',
      badge: 'Conférencier, expert d\'autorité, échelle multi-offres',
      questions: [
        '“Pourquoi vos tunnels de vente actuels semblent déconnectés de votre image globale ?”',
        '“Présentez-moi votre Value Ladder : offrez-vous des infoproduits, des bootcamps, de l\'individuel ?”',
        '“Avez-vous déjà un canal d\'autorité influent (podcast, newsletter active, LinkedIn fort) ?”'
      ],
      suggested: 'funnelhub_signature',
      reason: 'Idéal pour centraliser le storytelling émotionnel fort de l\'expert.'
    }
  ], []);

  const scoringCriteria = useMemo(() => [
    {
      key: 'needs',
      label: 'Clarté du Besoin',
      options: [
        { pts: 0, text: 'Flou artistique complet (veut des fonctionnalités gadget au hasard)' },
        { pts: 1, text: 'Intention définie (veut un site propre sans ciblage d\'accroche précis)' },
        { pts: 2, text: 'Objectif business limpide (sait ce qu\'il vend, à qui, et pourquoi)' }
      ]
    },
    {
      key: 'budget',
      label: 'Alignement Budget',
      options: [
        { pts: 0, text: 'Incohérent ou refuse d\'en parler ("faites-moi une reco gratuite d\'abord")' },
        { pts: 1, text: 'Négociation ouverte (conscient de la valeur, disposé aux plans en plusieurs fois)' },
        { pts: 2, text: 'Budget prêt et validé en phase avec nos formules officielles de l\'agence' }
      ]
    },
    {
      key: 'urgency',
      label: 'Mesure de l\'Urgence',
      options: [
        { pts: 0, text: 'Aucun calendrier ("on verra, pas pressé d\'ouvrir le site")' },
        { pts: 1, text: 'Timing souple (dans les 2 à 3 mois, pour préparer le lancement de saison)' },
        { pts: 2, text: 'Urgence d\'affaires avérée (lancement de produit ou événement imminent)' }
      ]
    },
    {
      key: 'assets',
      label: 'Assets disponibles',
      options: [
        { pts: 0, text: 'Rien du tout (pas de logo, pas d\'avis, aucune ligne de texte)' },
        { pts: 1, text: 'Éléments bruts partiels (un logo de dépannage Canva, des textes à reformuler)' },
        { pts: 2, text: 'Assets complets (photos pros commandées, témoignages et textes existants)' }
      ]
    },
    {
      key: 'decision',
      label: 'Preneur de Décision',
      options: [
        { pts: 0, text: 'N\'est pas décideur principal (doit faire valider par un associé ou comité distant)' },
        { pts: 1, text: 'Doit vérifier avec un tiers, mais reste l\'influenceur de marque majeur' },
        { pts: 2, text: 'Décideur autonome, immédiat et unique' }
      ]
    },
    {
      key: 'fit',
      label: 'Fit relationnel / Énergie',
      options: [
        { pts: 0, text: 'Négatif (toxique d\'entrée, méfiant, cherche le micro-management stérile)' },
        { pts: 1, text: 'Neutre / Distant (courtois, purement professionnel sans fioritures)' },
        { pts: 2, text: 'Amical et de haute confiance (forte écoute, respect total du métier d\'agence)' }
      ]
    },
    {
      key: 'potential',
      label: 'Potentiel commercial évolutif',
      options: [
        { pts: 0, text: 'Projet fermé "one-shot" sans perspectives additionnelles ni récurrence' },
        { pts: 1, text: 'Potentiel moyen (pourra souscrire à de la maintenance ou du SEO local plus tard)' },
        { pts: 2, text: 'Haute valeur (prêt pour un abonnement de support, du branding ou du copywriting)' }
      ]
    }
  ], []);

  const scoringTotal = useMemo(() => {
    return Object.values(discoveryScoring).reduce((sum, v) => sum + v, 0);
  }, [discoveryScoring]);

  const scoringAssessment = useMemo(() => {
    if (scoringTotal <= 5) {
      return {
        label: '⚠️ Prospect Risqué / Fragile (Score bas)',
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        advice: 'Cadrer de façon extrêmement rigide. Exiger un acompte réhaussé de 45%+ et un brief millimétré avant de bloquer le moindre calendrier, ou refuser poliment si le fit humain est négatif.'
      };
    } else if (scoringTotal <= 9) {
      return {
        label: '⚡ Prospect Moyen / Acceptable',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        advice: 'Formuler une offre socle simple (Présence Essentielle ou Pro). Limiter drastiquement la structure à trous offerte et borner strictement l\'éventuel échelonnement de paiement à 2 ou 3 fois sans dérogation.'
      };
    } else {
      return {
        label: '💎 Excellent Partenaire / Idéal !',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        advice: 'Excellente opportunité. Envoyer la recommandation rédigée sous 24 heures. Suggérer l\'offre phare (Présence Pro ou Système) agrémentée de modules payants pertinents (Local SEO, plan de maintenance récurrent).'
      };
    }
  }, [scoringTotal]);

  const followUpMessage = useMemo(() => {
    const projTypeObj = {
      local: { name: 'Business Local / Proximité', suggested: 'Présence Essentielle + Module SEO Local (1100 €HT)' },
      coach: { name: 'Coach / Thérapeute / Expert', suggested: 'Présence Pro (1500 €HT)' },
      consultant: { name: 'Consultant / Prestataire / Formateur', suggested: 'Système Client (2500 €HT)' },
      ecommerce: { name: 'E-commerce Clé en main', suggested: 'E-commerce (1800 €HT +)' },
      funnelhub: { name: 'FunnelHub d\'Autorité Pro', suggested: 'FunnelHub Signature (4000 €HT +)' }
    }[activeProjectCategory];

    return `Bonjour ${discoveryClientName || '[Prénom]'},

C'était un réel plaisir d'échanger sur votre activité aujourd'hui ! Afin que tout soit limpide de part et d'autre, voici la synthèse condensée de nos partages pour lancer votre projet en toute sérénité :

🎯 Votre Objectif clé : ${discoveryGoal || 'installer votre crédibilité visuelle et générer des contacts qualifiés.'}
💼 Profil identifié de projet : ${projTypeObj.name}

Recommandation d'architecture Nümtema :
Nous vous préconisons de partir sur notre formule [${projTypeObj.suggested}] pour consolider solidement vos fondations et éliminer définitivement vos freins.

Prochaines étapes convenues :
1. Devis officiel : Envoi de votre chiffrage transparent et calibré d'après notre appel.
2. Coup d'envoi de production : Démarrage officiel dès signature électronique et versement de l'acompte minimum légal.
3. Drive & Questionnaire de cadrage : Partage de votre propre Google Drive sécurisé pour centraliser vos logos, textes existants et avis de confiance.

Pour rappel, nos projets comprennent par défaut un maximum de deux cycles complets de retouches pour préserver d'un commun accord votre calendrier de livraison rapide. L'acquisition légale de votre adresse nom de domaine et hébergement reste sous votre propre gestion souveraine pour exclure toute dépendance technique.

Je reste à votre entière disposition d'un simple message pour répondre à vos interrogations !

Chaleureusement,
La production Nümtema`;
  }, [discoveryClientName, discoveryGoal, activeProjectCategory]);

  const localQuestSections = useMemo(() => [
    {
      id: "sect1",
      title: "1. Comprendre l’activité locale",
      desc: "Identifier ce que l’entreprise fait, pour qui, et pourquoi elle doit être trouvée localement.",
      questions: [
        { num: 1, text: "Quelle est votre activité principale ?", placeholder: "Ex: coiffure, plomberie, massage, garage, restauration...", example: "Plomberie, chauffage, débouchage urgent sani-rapide" },
        { num: 2, text: "Comment expliquez-vous votre activité à quelqu’un qui ne vous connaît pas ?", placeholder: "Réponse simple en 2 ou 3 phrases.", example: "Nous sommes des artisans de proximité intervenant en moins de 30 minutes au Havre pour toutes les pannes d'eau chaude, fuites ou réparation de canalisations." },
        { num: 3, text: "Depuis quand l’activité existe-t-elle ?", placeholder: "Date de création, ancienneté, reprise, lancement récent.", example: "Créé en 2021, activité florissante de 3 personnes." },
        { num: 4, text: "Quelles sont vos spécialités ou prestations les plus importantes ?", placeholder: "Listez les prestations à mettre en avant en priorité.", example: "Recherche de fuite non destructive, remplacement de ballon d'eau chaude, entretien de chaudière." },
        { num: 5, text: "Quelle prestation voulez-vous vendre ou recevoir le plus souvent grâce au site ?", placeholder: "Celle qui est rentable, stratégique ou la plus demandée.", example: "Le dépannage de fuites d'eau en urgence et le changement de chauffe-eau." },
        { num: 6, text: "Quels services ne voulez-vous pas mettre en avant ?", placeholder: "Services peu rentables, demandes fatigantes, prestations à éviter.", example: "L'installation de climatisation complète industrielle car cela demande trop de temps et de collaborateurs." },
        { num: 7, text: "Avez-vous une promesse simple ou une phrase de positionnement ?", placeholder: "Exemple : “Intervention rapide au Havre et alentours”.", example: "Dépannage plomberie d'urgence Le Havre - Intervention Garantie en 30 minutes 7j/7." },
        { num: 8, text: "Qu’est-ce qui vous différencie des concurrents locaux ?", placeholder: "Prix, rapidité, qualité, savoir-faire, proximité, avis, garantie, accueil, méthode.", example: "Réactivité (intervention sous 30 min), transparence des tarifs annoncés par téléphone avant venue, et 350 avis Google 4.9 étoiles." }
      ]
    },
    {
      id: "sect2",
      title: "2. Zone géographique et clientèle",
      desc: "Un site local doit parler à une zone précise, pas à la planète entière.",
      questions: [
        { num: 9, text: "Quelle est votre ville principale ?", placeholder: "Ville où vous voulez être le plus visible.", example: "Le Havre" },
        { num: 10, text: "Quelles villes, quartiers ou communes voulez-vous cibler ?", placeholder: "Listez les zones importantes par ordre de priorité.", example: "Montivilliers, Gonfreville-l'Orcher, Sainte-Adresse, Harfleur." },
        { num: 11, text: "Recevez-vous les clients sur place, intervenez-vous à domicile, ou les deux ?", placeholder: "Précisez : boutique, cabinet, atelier, déplacement, visio, livraison locale.", example: "Intervention uniquement à domicile chez le client." },
        { num: 12, text: "Quel rayon de déplacement acceptez-vous ?", placeholder: "Exemple : 10 km, 30 km, toute la Normandie, uniquement Le Havre.", example: "30 km maximum autour du Havre." },
        { num: 13, text: "Qui sont vos clients idéaux localement ?", placeholder: "Particuliers, professionnels, familles, seniors, entreprises, propriétaires, commerçants.", example: "Particuliers propriétaires de pavillons, mères de famille seules débordées, syndics de copropriété." },
        { num: 14, text: "Quelles demandes recevez-vous le plus souvent ?", placeholder: "Questions, urgences, devis, réservations, prix, disponibilité, horaires.", example: "Dégâts des eaux pendant la nuit, chauffe-eau en panne (plus d'eau chaude), WC complètement bouchés." },
        { num: 15, text: "Quels clients voulez-vous attirer davantage ?", placeholder: "Profil plus rentable, plus sérieux, mieux aligné.", example: "Des clients propriétaires à la recherche de rénovations complètes de salle de bain avec budget solide." },
        { num: 16, text: "Quels clients ou demandes voulez-vous filtrer ?", placeholder: "Demandes hors zone, prix trop bas, urgences impossibles, services non proposés.", example: "Les personnes cherchant uniquement le tarif le plus bas possible ou hors de notre secteur (ex: Rouen)." }
      ]
    },
    {
      id: "sect3",
      title: "3. Offres, services et informations à afficher",
      desc: "Transformer une liste de services en pages ou sections compréhensibles.",
      questions: [
        { num: 17, text: "Listez vos services principaux.", placeholder: "Un service par ligne si possible.", example: "1. Recherche de fuite d'urgence\n2. Remplacement et entretien chauffe-eau\n3. Débouchage express canalisations\n4. Rénovation de robinetterie / plomberie générale" },
        { num: 18, text: "Pour chaque service, quel problème résout-il ?", placeholder: "Exemple : “fuite d’eau”, “dos bloqué”, “besoin d’un nettoyage après chantier”.", example: "1. Recherche de fuite: Stopper la fuite avant d'endommager la maison.\n2. Chauffe-eau: Retrouver l'eau chaude sanitaire le jour-même." },
        { num: 19, text: "Pour chaque service, quel résultat le client obtient-il ?", placeholder: "Réparation, soulagement, maison propre, prise en charge, gain de temps.", example: "Une panne résolue de manière définitive, un artisan de confiance disponible immédiatement sans arnaque." },
        { num: 20, text: "Souhaitez-vous afficher les prix ?", placeholder: "Oui / non / à partir de / sur devis / fourchette.", example: "Oui, affichage clair des forfaits 'à partir de' (ex: Recherche de fuite à partir de 150€) pour instaurer une confiance absolue." },
        { num: 21, text: "Avez-vous des forfaits, packs ou prestations phares ?", placeholder: "Nom, contenu, prix, durée, conditions.", example: "Forfait Entretien Chaudière Annuel (99€, visite + attestation légale) et Forfait Débouchage Express (119€ sans suppléments)." },
        { num: 22, text: "Quelles informations pratiques doivent être visibles ?", placeholder: "Horaires, adresse, téléphone, parking, accès, zone, délai, urgence, rendez-vous.", example: "Horaires: 7j/7 de 7h00 à 22h00 d'urgence, téléphone principal visible en haut, zone d'intervention." },
        { num: 23, text: "Quelles questions les clients posent-ils toujours avant de réserver ou d’appeler ?", placeholder: "Ces questions alimenteront la FAQ.", example: "'Combien coûte le déplacement ?' / 'Êtes-vous agréés assurances ?' / 'Proposez-vous des facilités de paiement ?'" },
        { num: 24, text: "Quelles objections faut-il traiter ?", placeholder: "Prix, délais, confiance, déplacement, qualité, peur de se tromper, disponibilité.", example: "Désamorcer la crainte de l'arnaque parisienne des dépanneurs en mettant en avant nos certifications." }
      ]
    },
    {
      id: "sect4",
      title: "4. Google Business et visibilité Google",
      desc: "Pour un business local, la fiche Google est un actif commercial de premier choix.",
      questions: [
        { num: 25, text: "Avez-vous déjà une fiche Google Business ?", placeholder: "Oui / non / je ne sais pas.", example: "Oui, tout à fait." },
        { num: 26, text: "Avez-vous accès à cette fiche ?", placeholder: "Email utilisé, propriétaire actuel, accès à récupérer.", example: "Oui, nous avons l'adresse Gmail de gestion." },
        { num: 27, text: "Le nom, l’adresse, le téléphone et les horaires sont-ils corrects ?", placeholder: "Notez les corrections à faire.", example: "Oui, tout est à jour mais nous souhaitons optimiser les descriptions de prestations." },
        { num: 28, text: "Quelle catégorie Google correspond le mieux à votre activité ?", placeholder: "Exemple : salon de coiffure, plombier, thérapeute, restaurant, consultant.", example: "Plombier, Chauffagiste, Service de débouchage de canalisations." },
        { num: 29, text: "Avez-vous des photos récentes à ajouter sur Google ?", placeholder: "Local, équipe, produits, réalisations, avant/après, ambiance.", example: "Oui, 15 photos pro de nos camionnettes floquées et de l'équipe prêtes à l'intégration." },
        { num: 30, text: "Combien d’avis avez-vous aujourd’hui ?", placeholder: "Nombre approximatif et note moyenne si connue.", example: "125 avis reçus avec une note solide de 4.8 étoiles." },
        { num: 31, text: "Avez-vous une stratégie pour demander plus d’avis ?", placeholder: "Lien d’avis, message WhatsApp, QR code, automatisation.", example: "Nous envoyons un SMS automatique avec le lien de notre fiche dès la fin de chaque dépannage." },
        { num: 32, text: "Quels mots vos clients tapent-ils sur Google pour vous trouver ?", placeholder: "Exemple : “plombier Le Havre”, “massage relaxation Rouen”, “garage près de moi”.", example: "'Plombier Le Havre d'urgence' / 'Recherche fuite eau Le Havre' / 'Changement chauffe-eau Le Havre'" },
        { num: 33, text: "Quelles villes doivent apparaître dans les textes du site ?", placeholder: "Attention : uniquement les zones réellement servies.", example: "Le Havre, Harfleur, Montivilliers, Gonfreville-l'Orcher, Sainte-Adresse." },
        { num: 34, text: "Avez-vous déjà un site ou une page qui apparaît sur Google ?", placeholder: "URL, ancien site, Pages Jaunes, réseaux, annuaires.", example: "Uniquement notre fiche Google Business et de vieux annuaires obsolètes." }
      ]
    },
    {
      id: "sect5",
      title: "5. Preuves, avis et crédibilité locale",
      desc: "Un client local veut savoir si vous êtes sérieux, proche et fiable.",
      questions: [
        { num: 35, text: "Quels avis clients peut-on utiliser sur le site ?", placeholder: "Google, Facebook, SMS, WhatsApp, email, témoignages écrits.", example: "Avis Google officiels à synchroniser ou à recopier fidèlement." },
        { num: 36, text: "Peut-on afficher les prénoms, initiales ou photos ?", placeholder: "Précisez les autorisations.", example: "Oui, prénoms complets des clients (ex: Corinne M., Jean-Pierre D.) avec leur avis." },
        { num: 37, text: "Avez-vous des photos de réalisations ?", placeholder: "Avant/après, chantiers, prestations, produits, salle, cabinet, équipe.", example: "Oui, photos de salle de bains rénovées avant/après." },
        { num: 38, text: "Avez-vous des certifications, diplômes, labels ou assurances à afficher ?", placeholder: "Exemple : RGE, assurance pro, diplôme, formation, agrément, hygiène.", example: "Assurance décennale AXA Plomberie, label RGE Qualibat, agrément auprès de 12 assurances nationales." },
        { num: 39, text: "Avez-vous des chiffres fiables à afficher ?", placeholder: "Années d’expérience, nombre de clients, interventions, projets réalisés.", example: "+3500 dépannages réussis, 6 ans d'expérience locale et 98% de taux de satisfaction." },
        { num: 40, text: "Avez-vous des partenaires locaux à mentionner ?", placeholder: "Associations, commerces, fournisseurs, événements, collaborations.", example: "Distributeur Aubade Le Havre, grossiste Cedeo." },
        { num: 41, text: "Qu’est-ce qui rassure le plus vos clients aujourd’hui ?", placeholder: "Accueil, écoute, rapidité, expérience, avis, garantie, suivi, proximité.", example: "Notre prix annoncé fermement par téléphone avant de partir de l'atelier, et notre gentillesse." }
      ]
    },
    {
      id: "sect6",
      title: "6. Contact, conversion et parcours client",
      desc: "Le site doit provoquer une action claire : appel, WhatsApp, formulaire, rendez-vous ou devis.",
      questions: [
        { num: 42, text: "Quelle action principale voulez-vous que le visiteur fasse ?", placeholder: "Appeler, écrire sur WhatsApp, réserver, demander un devis, venir en boutique.", example: "Cliquer sur le bouton d'appel direct (sur smartphone) ou ouvrir un chat WhatsApp." },
        { num: 43, text: "Quel numéro doit être utilisé sur le site ?", placeholder: "Téléphone public, WhatsApp, standard, portable.", example: "07 45 43 42 64 (numéro de garde d'urgence accessible 7j/7)." },
        { num: 44, text: "Quelle adresse email reçoit les demandes ?", placeholder: "Adresse active et consultée régulièrement.", example: "contact@acrobat-lehavre.fr" },
        { num: 45, text: "Souhaitez-vous un formulaire de contact ?", placeholder: "Oui / non. Précisez les champs utiles.", example: "Oui, un formulaire simple pour les demandes de travaux programmés." },
        { num: 46, text: "Quelles informations faut-il demander dans le formulaire ?", placeholder: "Nom, téléphone, ville, besoin, urgence, photos, budget, créneau.", example: "Nom, Téléphone, Code postal / Ville, Description de la panne, et possibilité de joindre une photo." },
        { num: 47, text: "Utilisez-vous un outil de prise de rendez-vous ?", placeholder: "Calendly, Planity, Doctolib, Google Agenda, autre.", example: "Non, nous gérons tous nos rendez-vous par un simple appel téléphonique." },
        { num: 48, text: "Quel message doit apparaître après l’envoi du formulaire ?", placeholder: "Exemple : “Nous vous répondons sous 24h ouvrées”.", example: "Merci ! Votre demande est validée. Un technicien qualifié va vous rappeler dans les 30 minutes. À tout de suite !" },
        { num: 49, text: "Y a-t-il des demandes urgentes à traiter différemment ?", placeholder: "Urgence dépannage, réservation du jour, appel prioritaire.", example: "Oui ! Les fuites massives nécessitent un clic direct sur notre bouton d'appel 'URGENCES SANI-RAPIDE' rouge." }
      ]
    },
    {
      id: "sect8",
      title: "8. Identité visuelle, photos et contenus",
      desc: "Sans matière visuelle, un site local peut vite sembler générique.",
      questions: [
        { num: 55, text: "Avez-vous un logo officiel ?", placeholder: "Oui / non / à créer / à moderniser.", example: "Oui (un logo d'artisan traditionnel avec clé à molette disponible)." },
        { num: 56, text: "Avez-vous une charte graphique ou des couleurs existantes ?", placeholder: "Couleurs, polices, style, supports déjà utilisés.", example: "Couleurs bleu roi et orange de nos camionnettes." },
        { num: 57, text: "Quantes photos pouvez-vous fournir ?", placeholder: "Local, équipe, produits, prestations, véhicules, chantiers, avant/après.", example: "Portrait de notre équipe devant notre camionnette." },
        { num: 58, text: "Les photos sont-elles de bonne qualité ?", placeholder: "HD, téléphone, anciennes, à refaire, besoin d’un shooting.", example: "Oui, de bonne qualité, faites récemment." },
        { num: 59, text: "Avez-vous des vidéos utiles ?", placeholder: "Présentation, avis, coulisses, démonstration, visite du lieu.", example: "Non, pas de vidéos pour le moment." },
        { num: 60, text: "Qui fournit les textes de départ ?", placeholder: "Client, Nümtema à partir des réponses, textes existants à retravailler.", example: "Nümtema pour rédiger des textes élégants de copywriting à partir de ce questionnaire." },
        { num: 61, text: "Quel ton voulez-vous ?", placeholder: "Proche, premium, direct, rassurant, chaleureux, expert, simple.", example: "Chaleureux, ultra-professionnel, rassurant et très direct." },
        { num: 62, text: "Quels mots ne doivent pas être utilisés ?", placeholder: "Termes trop techniques, trop commerciaux, trop familiers, trop froids.", example: "Éviter les termes d'ingénierie trop complexes ('calcul de flux hydraulique')." }
      ]
    },
    {
      id: "sect9",
      title: "9. Réseaux sociaux et cohérence locale",
      desc: "Les réseaux peuvent soutenir la confiance, même s’ils ne remplacent pas le site.",
      questions: [
        { num: 63, text: "Quels réseaux utilisez-vous aujourd’hui ?", placeholder: "Facebook, Instagram, TikTok, LinkedIn, autre.", example: "Facebook uniquement." },
        { num: 64, text: "Quels liens doivent apparaître sur le site ?", placeholder: "URLs exactes.", example: "https://www.facebook.com/acrobat.plomberie.lehavre" },
        { num: 65, text: "Les profils sont-ils cohérents avec l’image souhaitée ?", placeholder: "Photo, bio, bannière, coordonnées, horaires.", example: "À moderniser. La bannière Facebook actuelle est obsolète." },
        { num: 66, text: "Souhaitez-vous harmoniser certains profils en option ?", placeholder: "Facebook, Instagram, Google Business, bannière, bio.", example: "Oui, nous aimerions l'option payante d'harmonisation de bannière Facebook." },
        { num: 67, text: "Publiez-vous des réalisations ou avis sur les réseaux ?", placeholder: "Contenus à réutiliser sur le site.", example: "De temps en temps, des photos de nos interventions de chantier." }
      ]
    },
    {
      id: "sect10",
      title: "10. Contraintes, timing et validation",
      desc: "Cadrer ce qui peut bloquer la production.",
      questions: [
        { num: 68, text: "Y a-t-il une date limite de mise en ligne ?", placeholder: "Lancement, événement, salon, ouverture, saison, urgence.", example: "Sous 3 semaines car nous lançons notre campagne locale Google Ads." },
        { num: 69, text: "Qui valide les textes et le design ?", placeholder: "Une seule personne référente, ou plusieurs décideurs ?", example: "Moi-même uniquement (Sébastien Dubois)." },
        { num: 70, text: "Qui fournit les accès nécessaires ?", placeholder: "Domaine, ancien site, Google Business, réseaux, email.", example: "Moi-même, j'ai les accès OVHcom de notre domaine existant." },
        { num: 71, text: "Avez-vous déjà un nom de domaine ?", placeholder: "Oui / non / à acheter. Rappel : domaine à la charge du client.", example: "Oui, www.acrobat-lehavre.fr." },
        { num: 72, text: "Avez-vous des obligations légales ou mentions spécifiques ?", placeholder: "Mentions légales, CGV, confidentialité, assurances, conditions de vente.", example: "Notre numéro SIRET et numéro de décennale à insérer obligatoirement." },
        { num: 73, text: "Certaines informations doivent-elles rester privées ?", placeholder: "Adresse personnelle, numéro, tarifs, photos, identité de clients.", example: "Oui, l'adresse de notre entrepôt de stockage ne doit pas être cliquable pour éviter les vols de métaux." },
        { num: 74, text: "Quels éléments manquent encore pour produire correctement ?", placeholder: "Photos, avis, logo, textes, accès, offres, prix, horaires.", example: "Rien, tout est prêt à vous être transféré sur le Google Drive partagé." }
      ]
    }
  ], []);

  const vitrineQuestSections = useMemo(() => [
    {
      id: "sect1",
      title: "1. Identité, activité et contexte",
      desc: "Comprendre qui vous êtes, ce que vous faites et ce que le site doit porter.",
      questions: [
        { num: 1, text: "Comment présentez-vous votre activité en une phrase simple ?", placeholder: "Exemple : “J’aide les particuliers à...” ou “Je propose des prestations de...”", example: "J'aide les créateurs d'entreprise et repreneurs à automatiser leur gestion administrative et commerciale grâce au no-code." },
        { num: 2, text: "Depuis quand exercez-vous cette activité ?", placeholder: "Lancement, activité installée, reconversion, reprise, développement.", example: "Activité lancée en indépendant depuis plus de 3 ans, après 10 ans en cabinet d'expertise." },
        { num: 3, text: "Quel est votre parcours ou votre histoire professionnelle ?", placeholder: "Ce qui donne du sens, de la légitimité ou de la confiance.", example: "Ancien responsable administratif et financier, l'expérience terrain m'a montré les freins des outils traditionnels." },
        { num: 4, text: "Qu’est-ce qui vous a poussé à créer ou développer cette activité ?", placeholder: "Motivation, mission, besoin du marché, expérience personnelle.", example: "Libérer du temps mental pour les dirigeants afin qu'ils se concentrent sur la rentabilité brute." },
        { num: 5, text: "Quels mots décrivent le mieux votre manière de travailler ?", placeholder: "Exemple : précis, chaleureux, rapide, artisanal, premium, humain, structuré.", example: "Structuré, pragmatique, ultra-réactif et hautement transparent." },
        { num: 6, text: "Quels mots ne doivent surtout pas décrire votre image ?", placeholder: "Trop cheap, trop froid, trop corporate, trop technique, trop amateur.", example: "Trop technique, incompréhensible (jargon informatique), ou amateur bricolo." },
        { num: 7, text: "Avez-vous déjà un slogan ou une phrase de positionnement ?", placeholder: "Même brouillon. Nümtema pourra la retravailler.", example: "Vos processus simplifiés, votre temps de cerveau libéré." }
      ]
    },
    {
      id: "sect2",
      title: "2. Objectif du site vitrine",
      desc: "Le site doit servir à quelque chose : rassurer, expliquer, vendre, recevoir des demandes ou professionnaliser l’image.",
      questions: [
        { num: 8, text: "Pourquoi voulez-vous créer ou refaire ce site maintenant ?", placeholder: "Lancement, crédibilité, besoin de clients, nouveau positionnement, ancien site dépassé.", example: "Je monte en gamme. Mes clients actuels sont par recommandation, mais je veux acquérir des leads froids en direct." },
        { num: 9, text: "Quel problème votre présence actuelle ne résout-elle pas ?", placeholder: "Manque de confiance, pas assez de demandes, image brouillonne, pas de vitrine claire.", example: "Ma page LinkedIn ne suffit plus à asseoir une autorité de consultant haut de gamme structuré." },
        { num: 10, text: "Quel résultat concret voulez-vous obtenir dans les 3 à 6 prochains mois ?", placeholder: "Plus de contacts, meilleure image, demandes qualifiées, prise de rendez-vous, visibilité.", example: "Décrocher au moins 5 appels de diagnostic qualifiés par mois via le site pour des paniers à 3500€+." },
        { num: 11, text: "Le site doit-il surtout rassurer, expliquer, vendre, filtrer ou présenter ?", placeholder: "Choisir une priorité principale, puis une priorité secondaire.", example: "Priorité 1 : Filtrer les demandes non qualifiées. Priorité 2 : Expliquer de façon limpide ma méthodologie." },
        { num: 12, text: "Qu’est-ce qu’un site réussi veut dire pour vous ?", placeholder: "Exemple : “les gens comprennent mon offre et m’écrivent facilement”.", example: "Un prospect arrive, dit 'j'ai tout compris à votre approche no-code', et bloque un rendez-vous sur mon calendrier." },
        { num: 13, text: "Qu’est-ce qui serait un échec, même si le site est beau ?", placeholder: "Exemple : pas de contact, message flou, visiteurs perdus, mauvaises demandes.", example: "Avoir un trafic qui repart immédiatement sans comprendre, ou recevoir des demandes d'étudiants cherchant des stages." }
      ]
    },
    {
      id: "sect3",
      title: "3. Clientèle cible et visiteurs du site",
      desc: "Un site vitrine clair parle à des personnes précises, pas à tout le monde.",
      questions: [
        { num: 14, text: "Qui voulez-vous attirer en priorité ?", placeholder: "Particuliers, professionnels, familles, dirigeants, jeunes entreprises, associations, autre.", example: "Dirigeants de PME et TPE de service (10 à 50 salariés), CFO et secrétaires généraux débordés." },
        { num: 15, text: "Quel est le profil idéal de votre client ?", placeholder: "Âge, situation, besoin, niveau de budget, urgence, maturité.", example: "CEO de 35-50 ans, à l'aise avec la tech de base, ayant un budget mensuel disponible pour des processus optimisés." },
        { num: 16, text: "Que vit cette personne juste avant de chercher vos services ?", placeholder: "Problème, désir, frustration, projet, urgence, besoin de confiance.", example: "Frustration énorme due à la double saisie obligatoire de données sur Excel et un CRM déconnecté." },
        { num: 17, text: "Quelles phrases vos clients disent-ils souvent avant de vous contacter ?", placeholder: "Mots exacts entendus en appel, DM, WhatsApp, rendez-vous.", example: "'Je passe 2 heures par jour à recopier des adresses' / 'On perd des infos clients tous les jours'." },
        { num: 18, text: "Quelles objections ou peurs faut-il traiter sur le site ?", placeholder: "Prix, confiance, délai, qualité, sérieux, résultat, peur de se tromper.", example: "'Est-ce que l'outil no-code va planter ?' / 'Que se passe-t-il si j'ai un problème technique ?' / 'Est-ce souverain ?'" },
        { num: 19, text: "Quels profils ou demandes ne voulez-vous pas attirer ?", placeholder: "Demandes hors budget, hors zone, hors expertise, clients indécis, services non proposés.", example: "Les auto-entrepreneurs seuls sans budget et cherchant des formations gratuites ou du dépannage Excel unitaire." }
      ]
    },
    {
      id: "sect4",
      title: "4. Offres, services et prestations",
      desc: "Transformer vos services en blocs compréhensibles et vendables.",
      questions: [
        { num: 20, text: "Listez vos services ou prestations principaux.", placeholder: "Un service par ligne si possible.", example: "1. Audit & Schéma Directeur des flux\n2. Intégration de Processus (Make/Zapier)\n3. Custom CRM (Airtable / Glide)\n4. Maintenance & Support Sérénité" },
        { num: 21, text: "Quel service voulez-vous mettre en avant en priorité ?", placeholder: "Le plus rentable, le plus stratégique ou le plus demandé.", example: "La création de CRM Customisé sur Airtable raccordé aux outils existants." },
        { num: 22, text: "Pour chaque service, quel problème résout-il ?", placeholder: "Exemple : manque de temps, besoin de réparation, besoin d’image, douleur, organisation.", example: "Airtable : Centraliser les données en seul endroit accessible en mobilité pour l'équipe commerciale." },
        { num: 23, text: "Pour chaque service, quel résultat le client obtient-il ?", placeholder: "Résultat concret, émotionnel ou pratique.", example: "Fin des tableurs Excel corrompus, alignement immédiat de la facturation et du closing." },
        { num: 24, text: "Avez-vous des packs, formules ou niveaux de prestation ?", placeholder: "Nom, contenu, prix, durée, conditions, limites.", example: "Formule 'Cadrage Initial' (1200€) and Formule 'Intégration Clé en Main' (à partir de 3500€)." },
        { num: 25, text: "Souhaitez-vous afficher les prix ?", placeholder: "Oui / non / à partir de / sur devis / fourchette.", example: "Afficher 'à partir de' pour rassurer sans figer la négociation complexe." },
        { num: 26, text: "Y a-t-il des services à ne pas afficher ou à mettre en retrait ?", placeholder: "Services peu rentables, pas encore prêts, demandes à éviter.", example: "Le développement d'applications mobiles grand public complexes sous Flutter." },
        { num: 27, text: "Quelles questions reviennent souvent sur vos prestations ?", placeholder: "Ces réponses serviront à la FAQ et au copywriting.", example: "'Qui paye la licence Airtable ?' / 'Puis-je modifier mes process tout seul après votre départ ?'" }
      ]
    },
    {
      id: "sect5",
      title: "5. Différenciation, preuves et crédibilité",
      desc: "Le visiteur doit comprendre pourquoi il peut vous faire confiance.",
      questions: [
        { num: 28, text: "Qu’est-ce qui vous différencie des concurrents ?", placeholder: "Méthode, expérience, qualité, proximité, spécialisation, rapidité, accompagnement.", example: "Double compétence : je parle métier/comptabilité autant que technique, pas de charabia de développeur." },
        { num: 29, text: "Quelles preuves pouvez-vous montrer ?", placeholder: "Avis, photos, réalisations, cas clients, chiffres, diplômes, certifications, médias.", example: "Certifications Airtable Partner, Make Advanced, et 12 avis de CEO enthousiastes." },
        { num: 30, text: "Avez-vous des témoignages clients utilisables ?", placeholder: "Google, Facebook, SMS, WhatsApp, email, avis écrits.", example: "Oui, des captures WhatsApp de compliments et 8 recommandations écrites LinkedIn." },
        { num: 31, text: "Peut-on afficher les prénoms, initiales, photos ou entreprises ?", placeholder: "Précisez les autorisations.", example: "Oui ! Prénoms, noms, postes et logos des entreprises de mes clients satisfaits." },
        { num: 32, text: "Avez-vous des réalisations ou exemples concrets à montrer ?", placeholder: "Portfolio, avant/après, chantiers, projets, photos, liens.", example: "Un schéma montrant l'avant/après (Excel manuel vs Airtable automatisé) ultra démonstratif." },
        { num: 33, text: "Avez-vous des chiffres fiables à afficher ?", placeholder: "Années d’expérience, nombre de clients, projets, interventions, accompagnements.", example: "+45 entreprises structurées, 700 heures de saisie économisées par an pour mes clients." },
        { num: 34, text: "Quels éléments renforcent votre légitimité ?", placeholder: "Diplôme, certification, formation, assurance, label, expérience, ancien métier.", example: "Diplômé Expert-comptable (DEC), Airtable Certified Creator." }
      ]
    },
    {
      id: "sect6",
      title: "6. Pages, structure, buts et V2",
      desc: "Bordons les pages de base indispensables pour la mise en ligne.",
      questions: [
        { num: 35, text: "Quelles pages sont indispensables dès la V1 ?", placeholder: "Accueil, services, contact, à propos, avis, réalisations, FAQ.", example: "Accueil, Services (CRM & Automation), Réalisations (3 cas clients), À propos et Contact." },
        { num: 36, text: "Quelles pages peuvent attendre une V2 ?", placeholder: "Blog, pages service détaillées, ressources, espace client, etc.", example: "Un blog de conseils SEO et un e-book de capture de prospects." },
        { num: 37, text: "Avez-vous un ancien site ou une page existante ?", placeholder: "URL + éléments à garder ou supprimer.", example: "Aucun site actuel, juste mon profil LinkedIn professionnel." },
        { num: 38, text: "Quel chemin idéal doit suivre le visiteur ?", placeholder: "Comprendre -> faire confiance -> choisir -> contacter.", example: "Atterrir sur l'Accueil, voir l'avant/après choquant, lire le cas client, puis réserver son appel." },
        { num: 39, text: "Quelle page ou section mérite le plus de soin ?", placeholder: "La page qui vend, rassure ou convertit le plus.", example: "Les cas d'études Réalisations car c'est là que réside la démonstration de ma valeur." }
      ]
    },
    {
      id: "sect7",
      title: "7. Textes, ton et messages clés",
      desc: "Les textes doivent sonner juste et vendre sans forcer.",
      questions: [
        { num: 40, text: "Avez-vous déjà des textes existants ?", placeholder: "Bio, services, posts, anciennes pages, plaquette, brochure, PDF.", example: "Ma présentation de services au format PDF de 4 pages et 5 posts LinkedIn à succès." },
        { num: 41, text: "Qui fournit la matière de départ ?", placeholder: "Vous, Nümtema à partir des réponses, ancien site, documents existants.", example: "Je fournis ma trame PDF et Nümtema rédige l'intégralité du copywriting pour le web." },
        { num: 42, text: "Quel ton voulez-vous adopter ?", placeholder: "Simple, premium, chaleureux, expert, direct, pédagogique, rassurant.", example: "Expert, éminemment pédagogique, structuré, droit au but." },
        { num: 43, text: "Quelles phrases voulez-vous absolument faire apparaître ?", placeholder: "Expressions, valeurs, promesses, mots récurrents.", example: "“Prenez des décisions basées sur des données fiables, pas sur le flair de vos équipes.”" },
        { num: 44, text: "Quelles phrases ou promesses faut-il éviter ?", placeholder: "Promesses trop fortes, termes interdits, formulations trompeuses.", example: "Éviter 'Gagnez 100 000€ en 2 jours' ou des affirmations surréalistes." },
        { num: 45, text: "Si le visiteur ne retient qu’une chose, que doit-il retenir ?", placeholder: "La phrase centrale du site.", example: "Nümtema rationalise et automatise l'outil de gestion des PME sans coder." },
        { num: 46, text: "Quels mots vos clients utilisent-ils naturellement ?", placeholder: "Mots simples, problèmes récurrents, termes de recherche.", example: "'Perte de factures', 'Rapprochement bancaire épuisant', 'Manque d'outil central'." }
      ]
    },
    {
      id: "sect8",
      title: "8. Identité visuelle, photos et inspirations",
      desc: "Le design doit soutenir votre crédibilité, pas décorer au hasard.",
      questions: [
        { num: 47, text: "Avez-vous un logo officiel ?", placeholder: "Oui / non / à créer / à moderniser.", example: "Oui, un logotype textuel minimaliste créé par un graphiste." },
        { num: 48, text: "Avez-vous des couleurs, polices ou une charte existante ?", placeholder: "Même approximatif : noir/or, bleu, beige, naturel, premium, etc.", example: "Gris anthracite très classe, blanc pur et touches de bleu de Prusse." },
        { num: 49, text: "Quelles photos pouvez-vous fournir ?", placeholder: "Portrait, atelier, bureau, prestations, réalisations, équipe, produits, ambiance.", example: "3 portraits professionnels en studio haute définition." },
        { num: 50, text: "Les photos sont-elles de bonne qualité ?", placeholder: "HD, téléphone, anciennes, à refaire, besoin d’un shooting.", example: "Oui, haute définition réalisées par un photographe de portrait d'affaires." },
        { num: 51, text: "Quel style visuel souhaitez-vous ?", placeholder: "Minimaliste, premium, artisanal, chaleureux, sobre, moderne, institutionnel.", example: "Extrêmement minimaliste, suisse, contemporain et haut de gamme." },
        { num: 52, text: "Quels sites aimez-vous ?", placeholder: "Liens ou captures + ce que vous aimez dedans.", example: "Le site de stripe.com pour son élégance épurée et ses schémas fluides." },
        { num: 53, text: "Quels sites ne voulez-vous surtout pas imiter ?", placeholder: "Trop chargé, trop froid, trop bas de gamme, trop générique.", example: "Les sites de SSII bleus génériques avec des photos libres de droits d'hommes en costume qui se serrent la main." },
        { num: 54, text: "Quelle émotion doit-on ressentir en arrivant sur le site ?", placeholder: "Confiance, clarté, sérieux, proximité, élégance, énergie, calme.", example: "Sérénité absolue (mes flux administratifs sont enfin sous contrôle)." }
      ]
    },
    {
      id: "sect9",
      title: "9. Contact, conversion et suivi",
      desc: "Le site doit orienter vers une action claire.",
      questions: [
        { num: 55, text: "Quelle action principale voulez-vous que le visiteur fasse ?", placeholder: "Appeler, envoyer un WhatsApp, remplir un formulaire, réserver, demander un devis.", example: "Planifier directement une session stratégique de cadrage offerte sur Calendly." },
        { num: 56, text: "Quel numéro doit apparaître sur le site ?", placeholder: "Téléphone public, WhatsApp, ligne pro.", example: "06 43 12 98 76 (numéro professionnel)." },
        { num: 57, text: "Quelle adresse email reçoit les demandes ?", placeholder: "Adresse active et consultée régulièrement.", example: "contact@consult-flow.fr" },
        { num: 58, text: "Souhaitez-vous un formulaire de contact ?", placeholder: "Oui / non. Précisez les champs utiles.", example: "Oui, un formulaire court de qualification en 3 étapes." },
        { num: 59, text: "Quelles informations faut-il demander dans le formulaire ?", placeholder: "Nom, email, téléphone, besoin, budget, urgence, ville, message.", example: "Nom, Enseigne, Chiffre d'affaires estimé, Logiciel actuellement défaillant et Description." },
        { num: 60, text: "Utilisez-vous un calendrier de rendez-vous ?", placeholder: "Calendly, Google Agenda, Doctolib, Planity, autre.", example: "Oui, Calendly intégré sur la page de contact et en bouton CTA." },
        { num: 61, text: "Quel message doit apparaître après une demande ?", placeholder: "Délai de réponse, prochaines étapes, informations complémentaires.", example: "Votre créneau est validé. Une checklist de préparation vous a été envoyée par courriel. À très vite !" },
        { num: 62, text: "Souhaitez-vous une demande d’avis après livraison/prestation ?", placeholder: "Lien Google, message WhatsApp, email, automatisation simple.", example: "Oui, un e-mail automatique demandant une recommandation sur ma fiche Google ou Trustpilot." }
      ]
    },
    {
      id: "sect10",
      title: "10. Visibilité, SEO de base et réseaux",
      desc: "Même un site vitrine simple doit être trouvable et cohérent.",
      questions: [
        { num: 63, text: "Quels mots vos clients tapent-ils pour vous trouver ?", placeholder: "Métier, service, ville, problème, spécialité.", example: "'Créateur Airtable France', 'Intégrateur Make CRM', 'Automatiser gestion PME'." },
        { num: 64, text: "Quelle zone géographique doit être mentionnée ?", placeholder: "Ville, région, France, francophonie, déplacement, visio.", example: "France entière (interventions à distance / visio), basé à Paris." },
        { num: 65, text: "Avez-vous une fiche Google Business ?", placeholder: "Oui / non / je ne sais pas. Si oui, accès disponible ?", example: "Oui, au nom de 'ConsultFlow - Automatisation administrative'." },
        { num: 66, text: "Quels réseaux sociaux utilisez-vous ?", placeholder: "Facebook, Instagram, TikTok, LinkedIn, Pinterest, autre.", example: "LinkedIn à 95%." },
        { num: 67, text: "Quels liens réseaux doivent apparaître sur le site ?", placeholder: "URLs exactes.", example: "https://www.linkedin.com/in/adrien-consultflow" },
        { num: 68, text: "Les réseaux sont-ils cohérents avec l’image du futur site ?", placeholder: "Photo, bio, bannière, contenus, coordonnées.", example: "À moderniser. La bannière LinkedIn mérite une refonte assortie." },
        { num: 69, text: "Souhaitez-vous harmoniser les réseaux en option ?", placeholder: "Bannière, photo, bio, visuels, templates, cohérence globale.", example: "Oui, absolument. Surtout la bannière de couverture LinkedIn." }
      ]
    },
    {
      id: "sect11",
      title: "11. Contraintes, accès et informations pratiques",
      desc: "Ce qui peut bloquer ou accélérer la production.",
      questions: [
        { num: 70, text: "Avez-vous déjà un nom de domaine ?", placeholder: "Oui / non / à acheter. Rappel : le nom de domaine est à la charge du client.", example: "Oui, consult-flow.fr chez Infomaniak." },
        { num: 71, text: "Avez-vous un ancien hébergement ou ancien prestataire ?", placeholder: "Accès, identifiants, contact, contraintes.", example: "Aucun." },
        { num: 72, text: "Qui valide les textes et le design ?", placeholder: "Une personne référente ou plusieurs décideurs ?", example: "Moi-même uniquement." },
        { num: 73, text: "Y a-t-il une date limite de mise en ligne ?", placeholder: "Lancement, événement, salon, ouverture, campagne.", example: "Sous 4 semaines pour fêter l'anniversaire du lancement." },
        { num: 74, text: "Avez-vous des obligations légales à afficher ?", placeholder: "Mentions légales, CGV, politique de confidentialité, assurances, conditions.", example: "Numéro de déclaration d'organisme de formation (NDA) et numéro SIRET." },
        { num: 75, text: "Certaines informations doivent-elles rester privées ?", placeholder: "Adresse personnelle, numéro privé, tarifs, clients, photos.", example: "Mon adresse personnelle (société domiciliée chez une entreprise de domiciliation)." },
        { num: 76, text: "Quels éléments manquent encore ?", placeholder: "Photos, logo, avis, textes, accès, offres, tarifs, pages légales.", example: "Je dois regrouper mes 12 logos clients récents à afficher sur l'accueil." }
      ]
    }
  ], []);

  const formationQuestSections = useMemo(() => [
    {
      id: "sect1",
      title: "1. Identité du formateur et légitimité",
      desc: "Le formateur compte autant que le programme. Mettez en avant crédibilité et postures.",
      questions: [
        { num: 1, text: "Comment souhaitez-vous être présenté en une phrase ?", placeholder: "Exemple: Sophie Durand, consultante senior et formatrice B2B...", example: "Sophie Durand, consultante senior et formatrice B2B cumulant 12 ans d'expérience." },
        { num: 2, text: "Quel est votre parcours en trois grandes étapes ?", placeholder: "Parcours d'études, premier déclic, création d'activité...", example: "1. Commerciale grands comptes, 2. Directrice commerciale, 3. Fondatrice de ScaleAcademy." },
        { num: 3, text: "Pourquoi êtes-vous légitime pour enseigner ce sujet ?", placeholder: "Années de pratique, statistiques, succès réels...", example: "J'ai personnellement formé et accompagné plus de 150 commerciaux avec ma méthode de closing." },
        { num: 4, text: "Quelles expériences, formations, diplômes ou résultats peuvent être affichés ?", placeholder: "Exemple: Certifié Qualiopi, NDA, références clients...", example: "Certifiée ICPF, Qualiopi de mon organisme de formation, et taux de closing B2B passant de 15% à 40%." },
        { num: 5, text: "Quelles qualités vous reconnaît-on souvent ?", placeholder: "Exemple: Pédagogue, structuré, praticien, exigeant...", example: "Grande pédagogue, pragmatique et orientée résultats rapides." },
        { num: 6, text: "Quelle part de votre histoire personnelle voulez-vous montrer ?", placeholder: "Pourquoi vous faites cela, le déclic, une épreuve surmontée...", example: "Mon premier échec en closing qui m'a forcé à structurer ma propre méthode." },
        { num: 7, text: "Quels mots ne voulez-vous surtout pas utiliser ?", placeholder: "Faux experts, termes racoleurs, jargon infopreneur...", example: "Ne pas utiliser de termes comme 'gourou', 'secret magique' ou 'devenez riche'." },
        { num: 8, text: "Quelle posture voulez-vous incarner ?", placeholder: "Expert, mentor, pédagogue, praticien, accompagnant, coach, consultant...", example: "Un mix de praticienne terrain et de mentor bienveillante." }
      ]
    },
    {
      id: "sect2",
      title: "2. Public cible et niveau des apprenants",
      desc: "Ciblez précisément pour que le bon profil se reconnaisse immédiatement.",
      questions: [
        { num: 9, text: "Qui doit suivre cette formation en priorité ?", placeholder: "Audience exacte: Débutants, managers, entrepreneurs...", example: "Commerciaux juniors ou indépendants souhaitant doubler leur taux de conversion d'appels." },
        { num: 10, text: "Le public est-il débutant, intermédiaire ou avancé ?", placeholder: "Niveau attendu au début de la formation.", example: "Intermédiaire (connaissent les bases de la vente mais butent sur l'objection de prix)." },
        { num: 11, text: "Quel est son contexte de travail ?", placeholder: "Reconversion, montée en compétences, croissance d'entreprise...", example: "Montée en compétences et recherche de performance commerciale immédiate." },
        { num: 12, text: "Quel problème vit-il avant de chercher une formation ?", placeholder: "Douleur principale, blocage au quotidien.", example: "Stress au téléphone, peur du rejet, et sensation de brader ses offres face aux objections." },
        { num: 13, text: "Qu'a-t-il déjà essayé avant d'arriver chez vous ?", placeholder: "Livres, tutoriels gratuits, autres formations concurrentes...", example: "Regarder des hacks de vente gratuits sur YouTube sans obtenir de résultats structurels." },
        { num: 14, text: "Quel vocabulaire comprend-il, et quel jargon éviter ?", placeholder: "Ajustez le niveau technique des textes.", example: "Ils comprennent 'lead', 'closing', 'B2B', mais éviter le jargon technique de programmation." },
        { num: 15, text: "Quels profils ne doivent pas être attirés par cette formation ?", placeholder: "Gagnez du temps en éliminant les mauvais profils.", example: "Les personnes cherchant de l'argent facile ou sans volonté de s'entraîner activement." },
        { num: 16, text: "Faut-il prévoir plusieurs portes d'entrée ?", placeholder: "Selon le niveau ou le statut de l'apprenant.", example: "Oui, un parcours d'initiation en e-learning et un parcours premium avec coaching individuel." }
      ]
    },
    {
      id: "sect3",
      title: "3. Problème pédagogique et transformation promise",
      desc: "Définissez la promesse d'accompagnement et la transformation réaliste.",
      questions: [
        { num: 17, text: "Quelles phrases vos futurs apprenants disent-ils avant ?", placeholder: "Verbatims réels des prospects.", example: "'Je déteste forcer les gens, je ne sais pas comment justifier mon prix.'" },
        { num: 18, text: "Quel blocage concret la formation doit-elle résoudre ?", placeholder: "Point de blocage précis.", example: "Le moment d'annoncer les tarifs et le traitement des objections courantes." },
        { num: 19, text: "Que veulent-ils réussir après la formation ?", placeholder: "Leurs objectifs profonds.", example: "Conclure leurs contrats sereinement, sans avoir l'impression de forcer." },
        { num: 20, text: "Quelles erreurs font-ils souvent ?", placeholder: "Erreurs fréquentes sans accompagnement.", example: "Donner trop d'arguments techniques et baisser le prix dès la première hésitation." },
        { num: 21, text: "Quelles peurs ou objections reviennent par rapport à votre formation ?", placeholder: "Trop cher, trop long, peur d'échouer, non adapté...", example: "Peur de ne pas avoir le temps pour s'entraîner ou d'être trop timide." },
        { num: 22, text: "Quelle transformation réaliste peut-on promettre ?", placeholder: "Promesse forte mais honnête.", example: "Maîtriser une trame de closing en 5 étapes pour convertir au moins 1 appel sur 3." },
        { num: 23, text: "Quelles promesses refusez-vous de faire ?", placeholder: "Évitez le sur-marketing.", example: "Promettre que tout le monde deviendra millionnaire sans effort en 30 jours." },
        { num: 24, text: "Si l'apprenant ne retient qu'une chose, laquelle ?", placeholder: "Cœur du message.", example: "Le closing n'est pas de la manipulation, c'est de l'aide à la décision d'achat." }
      ]
    },
    {
      id: "sect4",
      title: "4. Offre de formation et valeur commerciale",
      desc: "Détaillez le format, les tarifs et les modalités commerciales.",
      questions: [
        { num: 25, text: "Quel est le nom officiel ou provisoire de la formation ?", placeholder: "Nom impactant et mémorisable.", example: "Closing Masterclass B2B" },
        { num: 26, text: "Quel format propose-vous ?", placeholder: "Visio, présentiel, hybride, e-learning...", example: "Hybride: 20 heures d'e-learning et 6 sessions de simulations de vente en visio collective." },
        { num: 27, text: "Quelle est la durée de la formation ?", placeholder: "Nombre d'heures, semaines, idéal d'apprentissage.", example: "Parcours de 6 semaines, environ 4 heures de travail par semaine." },
        { num: 28, text: "Quel prix est validé ou envisagé ?", placeholder: "Tarif public ou sur-mesure.", example: "1490 € net de taxe." },
        { num: 29, text: "Le paiement est-il échelonné ou finançable ?", placeholder: "Qualiopi, CPF, OPCO, paiement en plusieurs fois...", example: "Financement CPF et OPCO possible via notre partenaire certificateur." },
        { num: 30, text: "Y a-t-il plusieurs niveaux ou options ?", placeholder: "Version Standard vs Version Premium.", example: "Option Standard (e-learning + collectifs) et Option VIP (avec coaching individuel)." },
        { num: 31, text: "Que comprend exactement l'offre ?", placeholder: "Accès, supports, fiches, communauté, exercices...", example: "Accès à vie à la plateforme, 6 masterclasses, fiches de traitement des objections, communauté sur Slack." },
        { num: 32, text: "Quelle offre doit être mise en avant en priorité ?", placeholder: "L'offre reine du site.", example: "Le parcours hybride de 6 semaines." }
      ]
    },
    {
      id: "sect5",
      title: "5. Programme, modules et progression pédagogique",
      desc: "Bordez la structure d'apprentissage étape par étape.",
      questions: [
        { num: 33, text: "Quels sont les modules principaux de la formation ?", placeholder: "Titres ou thématiques des modules.", example: "M1: Mindset & Confiance, M2: Trame d'appel, M3: Traitement des objections, M4: Posture de Closing." },
        { num: 34, text: "Quel est l'ordre logique des modules ?", placeholder: "Pourquoi cette progression ?", example: "On commence par la psychologie avant d'aborder les scripts de vente." },
        { num: 35, text: "Que l'apprenant sait-il faire après chaque module ?", placeholder: "Objectifs pédagogiques intermédiaires.", example: "À la fin du module 2, il sait structurer un diagnostic de 30 minutes sans bégayer." },
        { num: 36, text: "Quels exercices ou cas pratiques sont inclus ?", placeholder: "Validation des étapes.", example: "Enregistrement de simulations d'appels réels avec retour personnalisé par mémo vocal." },
        { num: 37, text: "Quels supports seront fournis ?", placeholder: "Fiches PDF, templates, grilles de scoring...", example: "Grille d'évaluation d'appel en format Notion et livret PDF d'entraînement." },
        { num: 38, text: "Y a-t-il une évaluation, un quiz ou un projet final ?", placeholder: "Modalités d'évaluation.", example: "Examen final de simulation de closing évalué par un jury de formateurs." },
        { num: 39, text: "Quels prérequis sont indispensables ?", placeholder: "Matériel, compétences préalables...", example: "Avoir déjà une offre commerciale définie à vendre." },
        { num: 40, text: "Quelles parties du programme peuvent être affichées publiquement ?", placeholder: "Pour préserver votre propriété intellectuelle.", example: "Tout le plan de cours détaillé est libre, mais les scripts précis sont réservés aux inscrits." }
      ]
    },
    {
      id: "sect6",
      title: "6. Méthode, mécanisme unique et différenciation",
      desc: "Expliquez votre spécificité technique pour justifier la valeur.",
      questions: [
        { num: 41, text: "Avez-vous un nom de méthode ou un cadre spécifique ?", placeholder: "Exemple: Méthode des 4C, Framework de closing...", example: "La Méthode ARC (Alignement, Révélation, Conclusion)." },
        { num: 42, text: "Quelles étapes reviennent dans votre manière d'enseigner ?", placeholder: "Pratique, théorie, feedback, itération...", example: "Théorie courte, simulation immédiate et correction de groupe." },
        { num: 43, text: "Qu'est-ce qui vous différencie de la concurrence ?", placeholder: "Votre avantage concurrentiel.", example: "Pas de scripts rigides et agressifs. Nous apprenons un closing éthique basé sur l'empathie." },
        { num: 44, text: "Quelle part est théorique vs pratique ?", placeholder: "Pour rassurer sur l'action concrète.", example: "80% de pratique et d'ateliers en direct, seulement 20% de théorie passive." },
        { num: 45, text: "Quels outils ou modèles enseignez-vous ?", placeholder: "Notion, Miro, grilles de vente...", example: "L'outil de diagnostic commercial Notion et le simulateur de script." },
        { num: 46, text: "Quelles erreurs votre méthode évite-t-elle ?", placeholder: "Frustrations de l'élève.", example: "Évite de passer pour un vendeur d'encyclopédies insistant et de perdre ses clients de recommandation." },
        { num: 47, text: "Quels mots doivent revenir souvent dans le site ?", placeholder: "Mots-clés de positionnement.", example: "Éthique, sérénité, closing B2B, persuasion, valeur ajoutée, conversion." },
        { num: 48, text: "Quels mots ou angles doivent disparaître ?", placeholder: "Éléments nuisibles à votre univers.", example: "Bannir les notions de 'manipulation', 'psychologie inversée', et 'forcer la vente'." }
      ]
    },
    {
      id: "sect7",
      title: "7. Preuves, résultats et crédibilité",
      desc: "La crédibilité se prouve par le concret. Listez vos résultats réels.",
      questions: [
        { num: 49, text: "Combien de personnes ou équipes avez-vous formées ?", placeholder: "Statistiques d'élèves.", example: "Plus de 150 indépendants et 15 équipes de vente en entreprise." },
        { num: 50, text: "Quels résultats concrets vos apprenants ont-ils obtenus ?", placeholder: "Exemple: +30% de chiffre d'affaires, retour sur investissement...", example: "Un de nos élèves a signé son premier contrat à 5000€ après seulement 3 semaines de formation." },
        { num: 51, text: "Quels témoignages peut-on utiliser ?", placeholder: "Citations phares de vos anciens élèves.", example: "'La formation m'a débloqué financièrement. Je m'amuse enfin à vendre.' - Marion, Copywriter." },
        { num: 52, text: "Peut-on afficher les prénoms, photos ou logos ?", placeholder: "Niveau d'anonymat requis.", example: "Oui, tous nos élèves de l'exemple ont donné leur accord écrit pour être affichés." },
        { num: 53, text: "Avez-vous des captures d'avis, e-mails ou Slack ?", placeholder: "Preuves instantanées hautement crédibles.", example: "Des captures d'écran de notre groupe Slack où les élèves partagent leurs victoires." },
        { num: 54, text: "Avez-vous des études de cas détaillées ?", placeholder: "Parcours complet d'un élève de A à Z.", example: "L'étude de cas d'Alexandre qui est passé de 0 à 10k€/mois grâce au closing." },
        { num: 55, text: "Quels chiffres sont certains et validés ?", placeholder: "Taux de satisfaction, note globale...", example: "Taux de complétion de 94% et note moyenne de 4.9/5 sur le CPF." },
        { num: 56, text: "Quelles preuves ne doivent pas être affichées ?", placeholder: "Éléments confidentiels ou non prouvables.", example: "Les captures contenant des chiffres d'affaires de clients sans leur autorisation explicite." }
      ]
    },
    {
      id: "sect8",
      title: "8. Inscription, conversion et parcours d'achat",
      desc: "Définissez le chemin logique pour transformer le visiteur en apprenant.",
      questions: [
        { num: 57, text: "Quelle action principale voulez-vous que le visiteur fasse ?", placeholder: "Le call-to-action roi.", example: "Réserver un appel de diagnostic gratuit de 15 minutes." },
        { num: 58, text: "Quel est le parcours d'inscription ?", placeholder: "Paiement direct, candidature, appel stratégique...", example: "Candidature via formulaire, puis rendez-vous téléphonique pour valider le niveau et le financement." },
        { num: 59, text: "Y a-t-il un questionnaire de préqualification ?", placeholder: "Pour trier les prospects.", example: "Oui, un formulaire Calendly demandant l'activité, le niveau et le CA actuel." },
        { num: 60, text: "Quels champs de formulaire sont indispensables ?", placeholder: "Nom, email, CA, objectifs...", example: "Prénom, Email, Téléphone, Compte CPF disponible (Oui/Non), CA mensuel actuel." },
        { num: 61, text: "Quel message doit s'afficher après l'envoi ?", placeholder: "Instructions de confirmation.", example: "'Merci ! Votre session est pré-réservée, vérifiez vos emails pour confirmer l'appel.'" },
        { num: 62, text: "Quelle adresse email reçoit les alertes ?", placeholder: "Centralisation des leads.", example: "contact@scaleacademy.fr" },
        { num: 63, text: "Quel outil utilisez-vous pour les rendez-vous ou ventes ?", placeholder: "Calendly, Stripe, Podia, Thrivecart, Sendinblue...", example: "Calendly raccordé à Zoom et Stripe pour les options de paiements directs." },
        { num: 64, text: "Qu'est-ce que vous voulez absolument éviter ?", placeholder: "Appels non qualifiés, gâcheurs de temps...", example: "Les personnes qui cherchent juste à utiliser leurs droits CPF 'pour s'occuper' sans projet professionnel." }
      ]
    },
    {
      id: "sect9",
      title: "9. Pages du site et architecture",
      desc: "Déterminez l'arborescence des pages pour votre portail de formation.",
      questions: [
        { num: 65, text: "Quelle page est indispensable en V1 ?", placeholder: "Généralement la Landing Page de la formation phare.", example: "La page de vente longue de l'offre 'Closing Masterclass B2B'." },
        { num: 66, text: "Faut-il une page dédiée pour chaque formation ?", placeholder: "Si catalogue d'offres multiples.", example: "Pour l'instant non, une seule grande page d'offre phare suffit pour lancer." },
        { num: 67, text: "Faut-il une page de présentation du formateur ?", placeholder: "Crédibilité de l'expert.", example: "Oui, intégrée directement dans la page principale via une superbe section 'Mon histoire'." },
        { num: 68, text: "Faut-il une FAQ dédiée ?", placeholder: "Pour casser les doutes récurrents de manière autonome.", example: "Oui, 6 questions précises sur le financement, le niveau requis et le temps nécessaire." },
        { num: 69, text: "Faut-il une page de ressources ou un blog ?", placeholder: "Stratégie de contenu long terme.", example: "Non, nous allons concentrer le trafic sur la page de capture en V1." },
        { num: 70, text: "Faut-il une section spéciale pour les entreprises / RH ?", placeholder: "Offres de groupes ou devis OPCO.", example: "Oui, un encart 'Vous êtes un organisme ou une équipe de vente ?' renvoyant vers un formulaire de devis." },
        { num: 71, text: "Quel chemin doit suivre un visiteur froid ?", placeholder: "Séquence de découverte.", example: "Publicité LinkedIn -> Lead Magnet (Guide PDF) -> Séquence email -> Page de vente -> Appel." },
        { num: 72, text: "Quel chemin doit suivre un prospect chaud ?", placeholder: "Séquence d'achat rapide.", example: "Recommandation -> Recherche Google -> Page de vente -> Réservation d'appel immédiate." }
      ]
    },
    {
      id: "sect10",
      title: "10. Contenus, ressources et lead magnet",
      desc: "Nourrissez votre audience pour asseoir votre autorité.",
      questions: [
        { num: 73, text: "Quels contenus de valeur possédez-vous déjà ?", placeholder: "Articles, vidéos de cours, posts LinkedIn...", example: "Une série de 3 vidéos privées d'études de cas de vente." },
        { num: 74, text: "Devez-vous migrer des contenus d'un ancien site ?", placeholder: "Articles de blog, fiches...", example: "Rien à migrer, c'est une création de site à partir de zéro." },
        { num: 75, text: "Présentez-vous un extrait gratuit de la formation ?", placeholder: "Vidéo teaser, premier module offert...", example: "Oui, nous offrons le Module 1 (Psychologie de la vente) en échange d'un email." },
        { num: 76, text: "Quel lead magnet pertinent voulez-vous pousser ?", placeholder: "Guide, checklist, simulateur...", example: "Notre guide PDF : 'La grille d'évaluation des 10 objections de vente les plus courantes'." },
        { num: 77, text: "Quels sujets de fond expliquez-vous régulièrement ?", placeholder: "Piliers de contenu.", example: "Le closing éthique, comment annoncer son tarif sans rougir, l'empathie commerciale." },
        { num: 78, text: "Souhaitez-vous une intégration de newsletter ?", placeholder: "Pour garder le contact avec vos prospects.", example: "Oui, un formulaire d'inscription simple pour notre newsletter hebdomadaire." },
        { num: 79, text: "Quels canaux de diffusion utilisez-vous ?", placeholder: "LinkedIn, YouTube, Instagram...", example: "LinkedIn à 90% pour notre acquisition de prospection naturelle." },
        { num: 80, text: "Quels types de contenus doivent rester confidentiels ?", placeholder: "À ne pas exposer sans inscription.", example: "Les enregistrements vidéos de nos simulations d'élèves." }
      ]
    },
    {
      id: "sect11",
      title: "11. Identité visuelle, ambiance et assets",
      desc: "L'univers graphique doit traduire la qualité pédagogique.",
      questions: [
        { num: 81, text: "Avez-vous déjà un logo ou des couleurs définies ?", placeholder: "Charte graphique existante ou couleurs aimées.", example: "Oui, couleurs épurées : beige chaud, chocolat foncé et une touche d'or pour le côté premium." },
        { num: 82, text: "Quels visuels professionnels du formateur possédez-vous ?", placeholder: "Photos portrait HD, photos d'ateliers...", example: "3 photos portrait professionnelles en studio avec un fond neutre et des vêtements élégants." },
        { num: 83, text: "Avez-vous des captures d'écran de l'espace membre ?", placeholder: "Pour montrer le sérieux de l'infrastructure.", example: "Oui, des mockups de notre espace membre hébergé sur Podia." },
        { num: 84, text: "Quelle ambiance émotionnelle souhaitez-vous installer ?", placeholder: "Chaleureux, institutionnel, moderne, technique, académique...", example: "Moderne, chaleureux, haut de gamme et extrêmement professionnel." },
        { num: 85, text: "Quels sites de formation prenez-vous en référence ?", placeholder: "Ce que vous appréciez ailleurs.", example: "J'aime la clarté et l'élégance minimaliste de la plateforme Masterclass.com." },
        { num: 86, text: "Quels styles graphiques détestez-vous ?", placeholder: "Ce qu'il faut bannir.", example: "Les pages de ventes sur-chargées de rouge clignotant avec des faux comptes à rebours anxiogènes." },
        { num: 87, text: "Quelle sensation doit-on avoir en arrivant ?", placeholder: "Confiance, sérieux, accessibilité...", example: "Une sensation de clarté, de compétence indéniable et de bienveillance." },
        { num: 88, text: "Faut-il harmoniser vos profils de réseaux sociaux ?", placeholder: "Bannières LinkedIn, signatures d'email...", example: "Oui, j'aimerais recevoir un gabarit de bannière LinkedIn raccord avec le nouveau site." }
      ]
    },
    {
      id: "sect12",
      title: "12. SEO, visibilité et acquisition de trafic",
      desc: "Définissez comment votre cible cherchera et trouvera votre offre sur Google.",
      questions: [
        { num: 89, text: "Quels mots-clés votre cible tape-t-elle sur Google ?", placeholder: "Exemple: formation vente B2B, apprendre le closing...", example: "formation closing éthique, comment closer en B2B, vaincre objections de prix" },
        { num: 90, text: "Y a-t-il une contrainte géographique ?", placeholder: "Local, régional, francophonie...", example: "Aucune, l'ensemble du marché francophone en distanciel." },
        { num: 91, text: "Faut-il cibler des recherches d'entreprises (B2B) ?", placeholder: "Pour une prise en charge OPCO.", example: "Oui, intégrer les bons mots-clés liés au plan de développement des compétences." },
        { num: 92, text: "Quels concurrents ressortent en premier ?", placeholder: "Vos concurrents directs sur le web.", example: "Les gros organismes généralistes de formation commerciale et quelques indépendants closing." },
        { num: 93, text: "Quels sujets de blog ou FAQ méritent d'être traités ?", placeholder: "Pour capter du clic organique.", example: "Un article sur 'La différence entre négocier et closer un contrat'." },
        { num: 94, text: "Quels canaux vous amènent le plus de monde actuellement ?", placeholder: "Réseau, bouche-à-oreille, pub...", example: "Le bouche-à-oreille d'anciens clients et mes publications LinkedIn." },
        { num: 95, text: "Envisagez-vous de la publicité payante ?", placeholder: "Google Ads, LinkedIn Ads, Facebook Ads...", example: "Oui, des tests en LinkedIn Ads sur un segment qualifié de dirigeants d'agences." },
        { num: 96, text: "Quels indicateurs suivra-t-on en priorité ?", placeholder: "Inscriptions de leads, réservations d'appels, CA direct...", example: "Taux de conversion formulaire -> appel réservé, et nombre d'appels de diagnostic mensuels." }
      ]
    },
    {
      id: "sect13",
      title: "13. Cadre légal, administratif et conformité formation",
      desc: "La vente de formation exige un cadre réglementaire strict. Listez vos obligations.",
      questions: [
        { num: 97, text: "Quel est le statut juridique de l'organisme de formation ?", placeholder: "Auto-entreprise, SASU, SAS, SARL, portage...", example: "SAS, habilitée à délivrer des formations avec un numéro d'activité déclaré." },
        { num: 98, text: "Vos Conditions Générales de Vente sont-elles rédigées ?", placeholder: "CGV obligatoires pour la formation.", example: "Rédigées par un cabinet d'avocats, prêtes à être rattachées au pied de page." },
        { num: 99, text: "Devez-vous afficher un Règlement Intérieur or Règles de remboursement ?", placeholder: "Réglementation Qualiopi.", example: "Oui, le règlement intérieur sera téléchargeable en format PDF dans le pied de page." },
        { num: 100, text: "La formation débouche-t-elle sur une certification officielle ?", placeholder: "RNCP, RS, certification partenaire...", example: "Oui, certification de compétences validée par notre partenaire certificateur officiel." },
        { num: 101, text: "Quels critères Certifications (ex: Qualiopi, CPF) sont remplis ?", placeholder: "Logos obligatoires à afficher sur le site.", example: "Le logo Qualiopi obligatoire avec la mention de la catégorie d'action." },
        { num: 102, text: "Avez-vous une Politique de Confidentialité RGPD ?", placeholder: "Conformité d'usage sur le traitement des données.", example: "Oui, intégrable sur notre page de politique de données." },
        { num: 103, text: "Prévoyez-vous une politique d'accessibilité handicap ?", placeholder: "Obligation légale Qualiopi.", example: "Oui, une mention stipulant notre référent handicap et notre protocole d'accueil." },
        { num: 104, text: "Qui validera définitivement les textes administratifs ?", placeholder: "Vérifiez la conformité avant le lancement.", example: "Moi-même avec l'appui de mon alternant juridique." }
      ]
    }
  ], []);

  const coachQuestSections = useMemo(() => [
    {
      id: "sect1",
      title: "1. Posture professionnelle et identité",
      desc: "Comprendre qui vous êtes, comment vous voulez être présenté et ce que votre site doit incarner.",
      questions: [
        { num: 1, text: "Comment présentez-vous votre activité en une phrase simple ?", placeholder: "Exemple : “J’accompagne les personnes qui...”", example: "J'accompagne les dirigeants à retrouver du sens et de l'équilibre." },
        { num: 2, text: "Quel intitulé professionnel souhaitez-vous afficher ?", placeholder: "Coach, thérapeute, praticien, consultant...", example: "Coach professionnel et Praticien EMDR." },
        { num: 3, text: "Quel est votre parcours en trois grandes étapes ?", placeholder: "Avant votre activité actuelle, moment de bascule, pratique actuelle.", example: "10 ans cadre dirigeant, burn-out salvateur, formation certifiante en coaching." },
        { num: 4, text: "Pourquoi avez-vous choisi ce métier ou cette pratique ?", placeholder: "Motivation profonde, expérience personnelle, mission.", example: "Pour éviter que d'autres cadres ne s'épuisent comme je l'ai fait." },
        { num: 5, text: "Qu’est-ce qui vous rend légitime aujourd’hui ?", placeholder: "Expérience, formation, résultats, posture, vécu.", example: "Mon vécu corporatif et mes certifications reconnues par l'État." },
        { num: 6, text: "Quelles valeurs doivent transparaître sur le site ?", placeholder: "Écoute, sécurité, clarté, douceur, exigence...", example: "Écoute bienveillante, exigence de la méthode, liberté." },
        { num: 7, text: "Quels mots vous décrivent le mieux ?", placeholder: "Profond, doux, direct, scientifique, spirituel...", example: "Pragmatique, structuré et bienveillant." },
        { num: 8, text: "Quels mots ne doivent surtout pas être utilisés pour vous présenter ?", placeholder: "Trop magique, trop médical, trop commercial...", example: "Pas de gourou, pas de 'solution magique', rien de new-age." }
      ]
    },
    {
      id: "sect2",
      title: "2. Cible, visiteurs et situations de départ",
      desc: "Un site d’accompagnement doit parler à une personne réelle, avec un besoin réel.",
      questions: [
        { num: 9, text: "Qui voulez-vous accompagner en priorité aujourd’hui ?", placeholder: "Particuliers, entrepreneurs, femmes, parents, dirigeants...", example: "Des chefs d'entreprises de PME et leurs comités de direction." },
        { num: 10, text: "Quel type de personne vous contacte le plus souvent ?", placeholder: "Profil actuel, pas forcément le profil idéal.", example: "Des managers intermédiaires épuisés." },
        { num: 11, text: "Quelle cible voulez-vous attirer davantage ?", placeholder: "La cible que le site doit aider à développer.", example: "Des dirigeants qui veulent anticiper la crise de sens avant le burn-out." },
        { num: 12, text: "Quelle cible ne voulez-vous plus attirer ?", placeholder: "Mauvais fit, demandes hors cadre, urgence non adaptée.", example: "Les personnes en urgence psychiatrique qui nécessitent un suivi médical." },
        { num: 13, text: "Dans quel état arrive votre client avant de vous contacter ?", placeholder: "Confusion, fatigue, transition, blocage...", example: "Perte de sens totale et épuisement chronique sans savoir pourquoi." },
        { num: 14, text: "Quelles phrases vos clients disent-ils souvent avant une première séance ?", placeholder: "Les mots exacts sont précieux", example: "'Je gère tout mais je me sens vide' / 'Je ne dors plus la nuit'." },
        { num: 15, text: "Qu’a-t-il déjà essayé avant de venir vers vous ?", placeholder: "Thérapie, coaching, lecture, rien...", example: "Ils ont souvent lu des livres de développement personnel ou vu un psy." },
        { num: 16, text: "Quel niveau de maturité a votre client idéal ?", placeholder: "Découverte, déjà accompagné, sceptique...", example: "Souvent sceptiques au départ sur la valeur du coaching." }
      ]
    },
    {
      id: "sect3",
      title: "3. Problèmes, désirs, objections et transformation",
      desc: "Formuler une promesse claire sans exagération.",
      questions: [
        { num: 17, text: "Quels problèmes concrets votre accompagnement aide-t-il à clarifier ou traverser ?", placeholder: "Problèmes émotionnels, relationnels, décisionnels...", example: "Prendre une décision difficile (revente, séparation de associés) sans culpabilité." },
        { num: 18, text: "Quels désirs profonds reviennent souvent chez vos clients ?", placeholder: "Se comprendre, oser changer, s’apaiser...", example: "Vouloir retrouver du temps pour soi et sa famille." },
        { num: 19, text: "Quelles peurs ou objections faut-il traiter ?", placeholder: "Prix, jugement, efficacité, confidentialité...", example: "La peur que tout le monde dans l'entreprise sache qu'ils se font coacher." },
        { num: 20, text: "Quelle transformation réaliste peut-on promettre ?", placeholder: "Transformation crédible, observable...", example: "Retrouver de la clarté dans ses choix et un système d'organisation écologique pour soi." },
        { num: 21, text: "Qu’est-ce que vous refusez de promettre ?", placeholder: "Guérison garantie, miracle...", example: "Je ne promets pas qu'ils ne fermeront pas leur entreprise si c'est la seule issue saine." },
        { num: 22, text: "Que comprend ou ressent souvent une personne après votre accompagnement ?", placeholder: "Clarté, apaisement, décision...", example: "Un immense soulagement et une grande liberté de choix." },
        { num: 23, text: "Quelle phrase doit résumer votre différence ?", placeholder: "Votre proposition de valeur unique.", example: "Je vous aide à redevenir l'architecte de votre vie, pas seulement le dirigeant de votre boîte." }
      ]
    },
    {
      id: "sect4",
      title: "4. Méthode, cadre et déroulé de l’accompagnement",
      desc: "Rendre votre pratique lisible et rassurante.",
      questions: [
        { num: 24, text: "Comment se déroule une première séance ou un premier échange ?", placeholder: "Accueil, clarification, plan...", example: "Un appel découverte de 30 min offert pour valider le fit mutuel." },
        { num: 25, text: "Quelles étapes reviennent souvent dans votre accompagnement ?", placeholder: "Nommer les étapes (comprendre, libérer...)", example: "1. Diagnostic. 2. Levée de freins. 3. Plan d'action. 4. Ancrage." },
        { num: 26, text: "Quels outils, approches ou méthodes utilisez-vous ?", placeholder: "Coaching, hypnose, sophrologie, PNL...", example: "Questionnement socratique, PNL et systémique." },
        { num: 27, text: "Quels outils doivent rester secondaires ?", placeholder: "Pour éviter de disperser le message.", example: "La PNL ne doit pas être mise en avant comme outil marketing principal." },
        { num: 28, text: "Quelle est votre posture pendant l’accompagnement ?", placeholder: "Guide, miroir, coach, facilitateur...", example: "Je suis un miroir bienveillant mais intransigeant qui confronte." },
        { num: 29, text: "Quelle place laissez-vous à la liberté et aux choix du client ?", placeholder: "Responsabilité, consentement...", example: "Le client est 100% responsable de ses actes. Je ne décide jamais à sa place." },
        { num: 30, text: "Y a-t-il un cadre de confidentialité ou de sécurité à expliquer ?", placeholder: "Confidentialité, non-jugement...", example: "Secret professionnel absolu et espace de totale non-jugement garanti par mon code de déontologie." },
        { num: 31, text: "Qu’est-ce qui se passe entre les séances ?", placeholder: "Exercices, notes, messages...", example: "Je donne des 'actions-défis' à réaliser entre nos séances." },
        { num: 32, text: "À quel moment recommandez-vous de ne pas travailler avec vous ?", placeholder: "Hors cadre, urgence médicale...", example: "Si l'épuisement relève de la dépression sévère, j'oriente vers un professionnel de santé." }
      ]
    },
    {
      id: "sect5",
      title: "5. Offres, formats et parcours d’accompagnement",
      desc: "Organiser les séances et programmes comme des portes d’entrée claires.",
      questions: [
        { num: 33, text: "Quelles offres ou séances sont disponibles aujourd’hui ?", placeholder: "Nom, objectif, format, prix...", example: "Séance ponctuelle (150€) et Programme 'Renaissance Dirigeant' de 4 mois." },
        { num: 34, text: "Quelle offre doit être la porte d’entrée principale ?", placeholder: "Séance découverte, appel, programme...", example: "L'appel clarté stratégique de 30 minutes offertes." },
        { num: 35, text: "Quelle offre est la plus importante commercialement ?", placeholder: "La plus rentable, transformatrice...", example: "Le parcours d'accompagnement sur 4 mois." },
        { num: 36, text: "Quelle offre attire les mauvais profils ou doit être repositionnée ?", placeholder: "À masquer, renommer...", example: "Je veux arrêter les séances à l'unité car elles n'apportent pas de résultats profonds." },
        { num: 37, text: "Quels formats proposez-vous ?", placeholder: "Présentiel, visio, audio, groupe...", example: "Exclusivement en visio (Zoom) ou en immersion 2 jours à la campagne." },
        { num: 38, text: "Quelles durées sont validées ?", placeholder: "45 min, 3 mois, annuel...", example: "Les séances durent 1h15, les programmes 4 à 6 mois." },
        { num: 39, text: "Quels prix ou fourchettes peut-on afficher ?", placeholder: "Prix fixes, sur devis, non affichés...", example: "À partir de 1500€ pour les accompagnements de groupe." },
        { num: 40, text: "Faut-il créer une offre premium ou un accompagnement long ?", placeholder: "Mentorat, cycle...", example: "Oui, un accompagnement VIP à l'année incluant le mentoring business." },
        { num: 41, text: "Pour chaque offre : quel problème, quel résultat, format et CTA ?", placeholder: "À remplir si possible...", example: "Programme Renaissance -> Souffle retrouvé et décisions claires." }
      ]
    },
    {
      id: "sect6",
      title: "6. Preuves, crédibilité et réassurance",
      desc: "Ne montrer que des éléments vrais, validés et utiles.",
      questions: [
        { num: 42, text: "Quels témoignages peut-on utiliser ?", placeholder: "Avis Google, emails, retours après séance...", example: "J'ai 12 avis Google My Business de clients ravis." },
        { num: 43, text: "Peut-on afficher les prénoms, initiales, photos ou métiers ?", placeholder: "Préciser les autorisations...", example: "Seulement le prénom et la fonction. (ex: Marc, CEO tech)." },
        { num: 44, text: "Quels chiffres peut-on afficher avec certitude ?", placeholder: "Années d’expérience, séances...", example: "Plus de 500 heures d'accompagnement certifiées." },
        { num: 45, text: "Quelles formations, diplômes ou certifications doivent apparaître ?", placeholder: "Ce qui justifie votre cadre.", example: "Praticien certifié EMDR, Coach PCC (ICF)." },
        { num: 46, text: "Avez-vous des médias, podcasts, conférences à montrer ?", placeholder: "Liens, logos, médias...", example: "Intervention sur le podcast Génération Do It Yourself." },
        { num: 47, text: "Avez-vous des photos professionnelles utilisables ?", placeholder: "Portrait, cabinet...", example: "Oui, shooting professionnel l'an dernier au cabinet." },
        { num: 48, text: "Quelles preuves doivent rester privées ou non affichées ?", placeholder: "Cas sensibles, confidentialité...", example: "Aucun témoignage de mes clients du comité exécutif de la banque XYZ." }
      ]
    },
    {
      id: "sect7",
      title: "7. Ton, copywriting et messages clés",
      desc: "Trouver les mots qui respectent votre posture et parlent aux bonnes personnes.",
      questions: [
        { num: 54, text: "Quel ton souhaitez-vous adopter ?", placeholder: "Doux, clair, direct, premium, clinique...", example: "Chaleureux, direct, sans tabou, profondément bienveillant." },
        { num: 55, text: "Quelles phrases voulez-vous absolument faire apparaître ?", placeholder: "Mots personnels, slogans...", example: "'Vous n'êtes pas seul face à ces responsabilités.'" },
        { num: 56, text: "Quelles formulations faut-il éviter ?", placeholder: "Trop magique, trop commercial...", example: "Éviter les promesses de bonheur instantané ou le langage corporate creux." },
        { num: 57, text: "Quelle différence voulez-vous marquer avec les concurrents ?", placeholder: "Pas gourou, pas de coaching agressif...", example: "Je cible la racine psychologique, pas seulement les astuces d'agenda." },
        { num: 58, text: "Que doit comprendre le visiteur en moins de 10 secondes ?", placeholder: "Promesse centrale.", example: "J'accompagne les dirigeants épuisés à reprendre le contrôle de leur vie sans tout changer." },
        { num: 59, text: "Quelles objections doivent être traitées dans la FAQ ?", placeholder: "Prix, durée, efficacité...", example: "'Est-ce confidentiel ?' et 'Combien de temps avant de voir un résultat ?'" },
        { num: 60, text: "Avez-vous déjà des textes existants à reprendre ?", placeholder: "Site, posts, LinkedIn...", example: "J'ai ma section Info LinkedIn qui résume bien." }
      ]
    },
    {
      id: "sect8",
      title: "8. Conversion, prise de rendez-vous et qualification",
      desc: "Définir exactement ce que le visiteur doit faire.",
      questions: [
        { num: 61, text: "Quelle action principale voulez-vous que le visiteur fasse ?", placeholder: "Réserver, appeler, envoyer un WhatsApp...", example: "Idéalement, réserver un Appel Découverte de 30 min." },
        { num: 62, text: "Avez-vous un système de réservation ?", placeholder: "Calendly, Doctolib, Planity...", example: "Je travaille avec Calendly connecté à mon Google Agenda." },
        { num: 63, text: "Faut-il qualifier les demandes avant de donner accès au calendrier ?", placeholder: "Oui/non. Utile si filtrage.", example: "Oui, un formulaire avant la prise de rendez-vous pour trier les curieux." },
        { num: 64, text: "Quels champs sont indispensables dans le formulaire ?", placeholder: "Nom, email, objectif...", example: "Nom, Prénom, Taille d'entreprise, Motivation en 1 phrase." },
        { num: 65, text: "Proposez-vous un appel gratuit ou d’orientation ?", placeholder: "Durée, conditions...", example: "Appel de 30 minutes offert, sans engagement commercial lourd." },
        { num: 66, text: "Quel message doit apparaître après une demande ?", placeholder: "Prochaines étapes...", example: "'Félicitations, vous venez de faire le premier pas. Voici quoi préparer...'" },
        { num: 67, text: "Quelles demandes voulez-vous éviter ?", placeholder: "Urgences, hors spécialité...", example: "Je veux éviter les personnes qui cherchent juste à ventiler gratuitement." }
      ]
    },
    {
      id: "sect9",
      title: "9. Identité visuelle, ambiance et assets",
      desc: "Le design doit soutenir la confiance.",
      questions: [
        { num: 68, text: "Avez-vous un logo officiel ou une identité existante ?", placeholder: "Charte, flyer...", example: "Juste un logo à base de lettrage simple et les polices Google de base." },
        { num: 69, text: "Quelle ambiance visuelle souhaitez-vous ?", placeholder: "Sobre, premium, douce, spirituelle...", example: "Premium, apaisant, avec de l'espace vide (bcp de blanc et de couleurs minérales)." },
        { num: 70, text: "Quelles couleurs ou matières vous représentent ?", placeholder: "Noir/or, beige, bleu, vert...", example: "Bleu profond/nuit, écru et vert d'eau." },
        { num: 71, text: "Avez-vous des photos professionnelles ?", placeholder: "Portrait, cabinet...", example: "3 chouettes photos avec vue sur mer." },
        { num: 72, text: "Quels sites aimez-vous visuellement ?", placeholder: "Liens + ce que vous aimez...", example: "J'aime l'approche minimaliste du site de la marque Aesop." },
        { num: 73, text: "Quels sites ou styles voulez-vous éviter ?", placeholder: "Trop voyant, trop médical, amateur...", example: "Pas les sites avec plein de boutons oranges énormes." },
        { num: 74, text: "Quelle émotion doit-on ressentir en arrivant sur le site ?", placeholder: "Sécurité, apaisement, énergie...", example: "De l'ancrage et de la possibilité de respirer." }
      ]
    },
    {
      id: "sect10",
      title: "10. SEO, contenus et légal",
      desc: "Préparer la visibilité et l’autorité sans sacrifier la clarté.",
      questions: [
        { num: 75, text: "Quels mots vos clients utilisent-ils pour vous trouver ?", placeholder: "Métier, problème, méthode...", example: "'Burnout dirigeant', 'Coach exécutif Lyon'." },
        { num: 76, text: "Quelle zone géographique doit être travaillée ?", placeholder: "Ville, région, France...", example: "Essentiellement pour le cabinet sur Lyon centre et la Suisse francophone." },
        { num: 77, text: "Avez-vous une fiche Google Business ?", placeholder: "Oui / à créer...", example: "Oui, active avec 15 avis." },
        { num: 78, text: "Souhaitez-vous une ressource offerte pour capter des emails ?", placeholder: "Guide, checklist...", example: "Peut-être un auto-diagnostic de prévention de l'épuisement pro." },
        { num: 79, text: "Quels réseaux sociaux doivent être reliés au site ?", placeholder: "Instagram, LinkedIn...", example: "LinkedIn uniquement." },
        { num: 82, text: "Votre activité est-elle réglementée ?", placeholder: "Psychologue, pro de santé...", example: "Non, je ne propose pas d'actes médicaux ou thérapeutiques stricts." },
        { num: 83, text: "Quelles mentions légales ou déontologiques doivent apparaître ?", placeholder: "Confidentialité, limites...", example: "Mentionner que ce n'est pas un substitut médical." },
        { num: 84, text: "Qui validera le contenu final ?", placeholder: "Personne clé pour éviter les allers-retours.", example: "Uniquement moi-même." }
      ]
    }
  ], []);

  const ecommerceQuestSections = useMemo(() => [
    {
      id: "sect1",
      title: "1. Identité du projet et cadre business",
      desc: "Comprendre la marque, le porteur de projet et l'image souhaitée.",
      questions: [
        { num: 1, text: "Quel est le nom officiel ou souhaité de la marque ?", placeholder: "Nom...", example: "Maison Nuage" },
        { num: 2, text: "Quelle est l’histoire du projet ?", placeholder: "Origine, valeurs...", example: "Création de bougies artisanales éco-responsables après une reconversion." },
        { num: 3, text: "Qui porte officiellement le projet ?", placeholder: "Nom, entreprise, rôle...", example: "Marie Dupont, présidente SASU, gestion complète." },
        { num: 4, text: "Le projet est-il déjà immatriculé ?", placeholder: "Oui / Non / En cours...", example: "Oui, depuis 2022." },
        { num: 5, text: "Qui sera le vendeur affiché sur le site ?", placeholder: "Nom, SIRET...", example: "SAS Maison Nuage, Siret X, contact@..." },
        { num: 6, text: "S’agit-il d’une seule marque ou de plusieurs univers ?", placeholder: "Une ou plusieurs...", example: "Une seule marque." },
        { num: 7, text: "Qui prend les décisions finales sur le site ?", placeholder: "Décideur...", example: "Moi-même." },
        { num: 8, text: "Qui valide les textes, les prix, les photos et les pages légales ?", placeholder: "Validateur...", example: "Moi-même." },
        { num: 9, text: "Quelle image voulez-vous donner ?", placeholder: "Artisanale, Premium...", example: "Premium, Naturelle, Artisanale." },
        { num: 10, text: "Quels mots ne doivent surtout pas décrire votre marque ?", placeholder: "Industriel, bas de gamme...", example: "Pas 'pas cher', pas 'gadget'." }
      ]
    },
    {
      id: "sect2",
      title: "2. Objectifs commerciaux et modèle de vente",
      desc: "Identifier les buts du site et la façon dont il génère du chiffre d'affaires.",
      questions: [
        { num: 11, text: "Quel est l’objectif principal du site ?", placeholder: "Vendre, présenter...", example: "Vendre en direct (B2C)." },
        { num: 12, text: "Quel résultat voulez-vous obtenir dans les 3 premiers mois ?", placeholder: "Ventes, visites...", example: "Faire mes 50 premières ventes ligne régulières." },
        { num: 13, text: "Quel résultat voulez-vous obtenir dans les 12 prochains mois ?", placeholder: "Ventes, CA...", example: "Remplacer le revenu des marchés physiques." },
        { num: 14, text: "Combien de ventes par mois visez-vous au départ ?", placeholder: "10, 50, 100...", example: "30-50" },
        { num: 15, text: "Quel panier moyen visez-vous ?", placeholder: "50€, 150€...", example: "45 €" },
        { num: 16, text: "Quels produits ou offres sont les plus rentables ?", placeholder: "Produits phares...", example: "Les coffrets cadeau de 3 bougies." },
        { num: 17, text: "Quels produits doivent être mis en avant dès la page d’accueil ?", placeholder: "Nouveautés...", example: "Le coffret découverte et la nouvelle collection Hiver." },
        { num: 18, text: "Avez-vous déjà vendu ces produits ailleurs ?", placeholder: "Instagram, Etsy...", example: "Oui, en marchés et sur Instagram." },
        { num: 19, text: "Quel canal apporte aujourd’hui le plus de clients ?", placeholder: "Canal principal...", example: "Instagram." },
        { num: 20, text: "Quel est le frein principal actuel ?", placeholder: "Stock, paiement...", example: "Organiser les commandes manuellement via MP Instagram, perte de temps." },
        { num: 21, text: "Souhaitez-vous vendre aux particuliers, pros ou les deux ?", placeholder: "B2C, B2B...", example: "B2C uniquement pour l'instant." },
        { num: 22, text: "Souhaitez-vous afficher les prix ou qualifier les demandes ?", placeholder: "Prix visibles, sur devis...", example: "Prix visibles avec achat direct." }
      ]
    },
    {
      id: "sect3",
      title: "3. Cible client, positionnement et confiance",
      desc: "Définir à qui on vend et pourquoi ils achètent.",
      questions: [
        { num: 23, text: "À qui s’adressent les produits en priorité ?", placeholder: "Cible...", example: "Femmes 25-45 ans, éco-sensibles." },
        { num: 24, text: "Quel est le profil du client idéal ?", placeholder: "Âge, budget...", example: "Recherche des cadeaux qualitatifs ou des moments bien-être." },
        { num: 25, text: "Dans quelles situations achète-t-il vos produits ?", placeholder: "Cadeau, routine...", example: "Cadeau 50%, Pour soi 50%." },
        { num: 26, text: "Qu’est-ce que le client doit comprendre en moins de 10 secondes ?", placeholder: "Message clé...", example: "Bougies naturelles coulées à la main en France." },
        { num: 27, text: "Qu’est-ce qui rend vos produits différents des autres ?", placeholder: "Différenciateur...", example: "La cire végétale certifiée et des parfums exclusifs sans CMR." },
        { num: 28, text: "Quels concurrents ou marques aimez-vous ?", placeholder: "Liens...", example: "My Jolie Candle, Diptyque." },
        { num: 29, text: "Qu’aimez-vous chez ces concurrents ?", placeholder: "Design, navigation...", example: "L'élégance de la fiche produit." },
        { num: 30, text: "Que voulez-vous éviter par rapport aux concurrents ?", placeholder: "Ce qu'on ne veut pas...", example: "L'aspect industriel, je veux qu'on sente la main de l'artisan." },
        { num: 31, text: "Quels arguments rassurent vos clients ?", placeholder: "Qualité, avis...", example: "Artisanal, non toxique, avis clients." },
        { num: 32, text: "Quelles objections reviennent souvent avant l’achat ?", placeholder: "Prix, odeur...", example: '\"Est-ce que ça sent vraiment quand on l\'allume ?\"' },
        { num: 33, text: "Avez-vous des avis ou témoignages utilisables ?", placeholder: "Oui, non...", example: "Oui, plein de messages Instagram." },
        { num: 34, text: "Peut-on afficher les prénoms, photos ou captures de témoignages ?", placeholder: "Format avis...", example: "Oui, avec les prénoms." }
      ]
    },
    {
      id: "sect4",
      title: "4. Catalogue produits - Structure et lancement",
      desc: "Préparer l'organisation des rayons du magasin.",
      questions: [
        { num: 35, text: "Combien de produits souhaitez-vous mettre en ligne au lancement ?", placeholder: "1-10, 50...", example: "Environ 12 références." },
        { num: 36, text: "Listez les produits ou gammes prioritaires pour la V1.", placeholder: "Gammes...", example: "Gamme signature, gamme saisonnière, accessoires." },
        { num: 37, text: "Quels produits peuvent attendre une V2 ?", placeholder: "A reporter...", example: "Les diffuseurs de parfum à tiges." },
        { num: 38, text: "Avez-vous déjà les noms définitifs des produits ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 39, text: "Avez-vous déjà les catégories du catalogue ?", placeholder: "Oui / Non...", example: "Oui (Parfums fleuris, boisés, accessoires)." },
        { num: 40, text: "Quelles catégories voulez-vous afficher au menu ?", placeholder: "Au menu principal...", example: "Bougies classiques, Coffrets Cadeaux, Nouveautés." },
        { num: 41, text: "Avez-vous des collections saisonnières ?", placeholder: "Oui / Non...", example: "Oui (Noël, Printemps)." },
        { num: 42, text: "Avez-vous des produits personnalisés ?", placeholder: "Mots gravés...", example: "Possible d'ajouter un petit mot sur une carte cadeau." },
        { num: 43, text: "Avez-vous des coffrets, bundles ou packs ?", placeholder: "Lots...", example: "Oui, lot de 3 bougies au choix." },
        { num: 44, text: "Y a-t-il des produits numériques ou services associés ?", placeholder: "PDF, ateliers...", example: "Peut-être un atelier de création (à réserver en ligne)." },
        { num: 45, text: "Souhaitez-vous des filtres produits ?", placeholder: "Filtres liste...", example: "Filtre par famille olfactive : boisée, fleurie..." },
        { num: 46, text: "Souhaitez-vous une recherche interne sur la boutique ?", placeholder: "Barre de recherche...", example: "Oui." }
      ]
    },
    {
      id: "sect5",
      title: "5. Fiches produits détaillées",
      desc: "S'assurer que toutes les infos de vente sont prêtes.",
      questions: [
        { num: 47, text: "Pour chaque produit, avez-vous un nom définitif ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 48, text: "Pour chaque produit, avez-vous un prix validé ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 49, text: "Pour chaque produit, avez-vous une description courte ?", placeholder: "Oui / Non...", example: "À rédiger." },
        { num: 50, text: "Pour chaque produit, avez-vous une description longue ?", placeholder: "Oui / Non...", example: "À rédiger avec l'aide de Nümtema." },
        { num: 51, text: "Quelles informations techniques doivent apparaître ?", placeholder: "Poids, composition...", example: "Poids (200g), durée de combustion (40h), compo." },
        { num: 52, text: "Quelles photos pouvez-vous fournir par produit ?", placeholder: "Packshot, ambiance...", example: "Packshot fond blanc + 2 photos ambiance." },
        { num: 53, text: "Avez-vous besoin d’une direction artistique photo ?", placeholder: "Besoin de shoot...", example: "Oui je cherche un photographe." },
        { num: 54, text: "Avez-vous des variantes à gérer ?", placeholder: "Tailles, couleurs...", example: "Oui (Taille 150g ou 250g)." },
        { num: 55, text: "Combien de variantes maximum par produit ?", placeholder: "Nombre...", example: "3 au max." },
        { num: 56, text: "Souhaitez-vous afficher des produits recommandés ?", placeholder: "Cross-sell...", example: "Oui 'Aimerez aussi'." },
        { num: 57, text: "Souhaitez-vous des avis clients sur les fiches produits ?", placeholder: "Oui / Non...", example: "Oui, avec des étoiles." },
        { num: 58, text: "Souhaitez-vous afficher des labels, garanties ou badges ?", placeholder: "Fait main, bio...", example: "Badge 'Fait main en France', '100% Naturel'." },
        { num: 59, text: "Quelle information doit rassurer avant le bouton d’achat ?", placeholder: "Livraison, paiement...", example: "Livraison sous 48h, Paiement sécurisé." }
      ]
    },
    {
      id: "sect6",
      title: "6. Prix, marges, promotions et TVA",
      desc: "Le cadre financier indispensable avant d'encaisser.",
      questions: [
        { num: 60, text: "Tous les prix de vente sont-ils validés ?", placeholder: "Oui, non...", example: "Oui." },
        { num: 61, text: "Avez-vous calculé vos coûts de fabrication ou d’achat ?", placeholder: "Oui, non...", example: "Oui." },
        { num: 62, text: "Avez-vous calculé vos marges ?", placeholder: "Oui, non...", example: "Oui, très important." },
        { num: 63, text: "Les prix doivent-ils être TTC, HT ou autre ?", placeholder: "Format d'affichage...", example: "TTC." },
        { num: 64, text: "Votre situation TVA est-elle claire ?", placeholder: "Auto-entreprise ou assujetti...", example: "Auto-entreprise donc 'TVA non applicable'." },
        { num: 65, text: "Souhaitez-vous proposer des codes promo ?", placeholder: "Oui / Non...", example: "Oui, -10% pour la newsletter." },
        { num: 66, text: "Souhaitez-vous des remises par quantité ?", placeholder: "Oui / Non...", example: "Non." },
        { num: 67, text: "Souhaitez-vous des cartes cadeaux ?", placeholder: "Oui / Non...", example: "Oui, cartes numériques." },
        { num: 68, text: "Souhaitez-vous des ventes flash ou promotions saisonnières ?", placeholder: "Oui / Non...", example: "Occasionnellement (Black Friday)." },
        { num: 69, text: "Souhaitez-vous des frais supplémentaires (pack cadeau) ?", placeholder: "Oui / Non...", example: "Option emballage cadeau + 3€." }
      ]
    },
    {
      id: "sect7",
      title: "7. Paiement, panier et compte client",
      desc: "Le tunnel d'achat et la gestion des comptes.",
      questions: [
        { num: 70, text: "Voulez-vous un vrai panier avec paiement en ligne ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 71, text: "Quels moyens de paiement voulez-vous accepter ?", placeholder: "CB, Paypal...", example: "CB via Stripe et PayPal, Apple Pay." },
        { num: 72, text: "Qui encaisse les paiements ?", placeholder: "Entreprise...", example: "Mon compte entreprise SASU." },
        { num: 73, text: "Avez-vous déjà un compte Stripe, PayPal ou autre ?", placeholder: "Accès existants...", example: "À créer." },
        { num: 74, text: "Souhaitez-vous proposer le paiement en plusieurs fois ?", placeholder: "3x sans frais...", example: "Non le panier ne le justifie pas." },
        { num: 75, text: "Souhaitez-vous permettre la commande sans création de compte ?", placeholder: "Oui / Non...", example: "Oui, achat invité possible." },
        { num: 76, text: "Souhaitez-vous un espace client ?", placeholder: "Suivi commande...", example: "Oui." },
        { num: 77, text: "Souhaitez-vous une facture automatique ?", placeholder: "Oui / Non...", example: "Automatique si possible avec l'outil de la boutique." },
        { num: 78, text: "Consentement newsletter au checkout ?", placeholder: "Case à cocher...", example: "Oui." },
        { num: 79, text: "Souhaitez-vous une relance de panier abandonné (email) ?", placeholder: "Oui / Non...", example: "Oui, automatique à H+24." }
      ]
    },
    {
      id: "sect8",
      title: "8. Stock, commandes et organisation interne",
      desc: "La logistique et votre travail quotidien avec le site.",
      questions: [
        { num: 80, text: "Quel stock réel avez-vous au lancement ?", placeholder: "Quantités...", example: "Une centaine d'unités de chaque." },
        { num: 81, text: "Le stock est-il centralisé ou réparti sur plusieurs lieux ?", placeholder: "Entrepôts...", example: "Centralisé chez moi." },
        { num: 82, text: "Qui met à jour le stock ?", placeholder: "Humain, ERP...", example: "Moi via le back-office." },
        { num: 83, text: "Souhaitez-vous masquer automatiquement les produits en rupture ?", placeholder: "Oui / Non...", example: "Non, afficher 'Rupture' avec 'Me prévenir au retour'." },
        { num: 84, text: "Souhaitez-vous autoriser les précommandes ?", placeholder: "Oui / Non...", example: "Rarement." },
        { num: 85, text: "Qui prépare les commandes ?", placeholder: "Moi, prestataire...", example: "Moi-même." },
        { num: 86, text: "Quel délai de préparation pouvez-vous tenir ?", placeholder: "24h, 48h...", example: "Expéditions 2x par semaine." },
        { num: 87, text: "Avez-vous besoin d’un tableau de suivi spécial des commandes ?", placeholder: "Au-delà du CMS...", example: "Le gestionnaire de commandes Shopify suffira." },
        { num: 88, text: "Qui reçoit les notifications de commande (email admin) ?", placeholder: "Emails...", example: "Email contact." },
        { num: 89, text: "Souhaitez-vous automatiser des statuts de commande vers le client ?", placeholder: "Expédié, livré...", example: "Reçu et Expédié." },
        { num: 90, text: "Avez-vous besoin de gérer des lots, numéros de série ou traçabilité ?", placeholder: "Oui / Non...", example: "Non." },
        { num: 91, text: "Y a-t-il des contraintes de production à expliquer au client ?", placeholder: "Fabrication spéciale...", example: "Non, stock réel." }
      ]
    },
    {
      id: "sect9",
      title: "9. Livraison, retours et service client",
      desc: "Sujets sensibles qui génèrent le plus de support ou d'insatisfaction.",
      questions: [
        { num: 92, text: "Dans quelles zones voulez-vous livrer ?", placeholder: "France, Europe...", example: "France métropolitaine et Belgique." },
        { num: 93, text: "Quels modes de livraison voulez-vous proposer ?", placeholder: "Colissimo, Relay...", example: "Mondial Relay, Colissimo domicile." },
        { num: 94, text: "Comment voulez-vous calculer les frais de livraison ?", placeholder: "Poids, Forfait...", example: "Forfait fixe (4,90€ Point relais)." },
        { num: 95, text: "Quel seuil pourrait déclencher la livraison gratuite ?", placeholder: "Montant...", example: "69€" },
        { num: 96, text: "Vos emballages sont-ils prêts et testés ?", placeholder: "Oui / Non...", example: "Oui, boites spéciales." },
        { num: 97, text: "Les produits sont-ils fragiles, lourds, périssables ou réglementés ?", placeholder: "Fragile...", example: "Verre fragile, bien indiquer." },
        { num: 98, text: "Quelle politique de retour souhaitez-vous afficher ?", placeholder: "14 jours, frais...", example: "14 jours, retour à la charge du client." },
        { num: 99, text: "Comment gérez-vous les produits personnalisés face aux retours ?", placeholder: "Non remboursables...", example: "Pas remboursables." },
        { num: 100, text: "Avez-vous besoin d’une FAQ livraison/retours ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 101, text: "Quel canal de service client doit être mis en avant ?", placeholder: "Email, WhatsApp...", example: "Email contact et Dm Insta." },
        { num: 102, text: "Qui répond aux messages clients ?", placeholder: "Support...", example: "Moi." },
        { num: 103, text: "Souhaitez-vous un modèle de message automatique après commande ?", placeholder: "Séquence SAV...", example: "Message de remerciement et infos d'expédition." }
      ]
    },
    {
      id: "sect10",
      title: "10. Cadre légal, conformité et responsabilités",
      desc: "Protection de l'entreprise et respect du cadre réglementaire.",
      questions: [
        { num: 104, text: "Les mentions légales existent-elles déjà ?", placeholder: "Oui / Non...", example: "Non, à faire." },
        { num: 105, text: "Les CGV existent-elles déjà ?", placeholder: "Oui / Non...", example: "Non, je dois contacter un avocat." },
        { num: 106, text: "La politique de confidentialité existe-t-elle déjà ?", placeholder: "Oui / Non...", example: "À paramétrer via l'outil du site." },
        { num: 107, text: "La politique de retour/remboursement existe-t-elle déjà ?", placeholder: "Oui / Non...", example: "Non, à rédiger." },
        { num: 108, text: "Qui fournit les textes légaux ?", placeholder: "Vous, Juriste...", example: "Je me charge de les faire rédiger par un pro." },
        { num: 109, text: "Vos produits nécessitent-ils des précautions ou notices ?", placeholder: "Allergies, Dangers...", example: "Obligatoire (Norme AFNOR bougies)." },
        { num: 110, text: "Avez-vous une assurance professionnelle adaptée ?", placeholder: "RC Pro...", example: "RC Pro en cours." },
        { num: 111, text: "Avez-vous des obligations spécifiques liées à votre secteur ?", placeholder: "Bio, CE...", example: "Réglementation CLP." },
        { num: 112, text: "Le client doit-il accepter des conditions spécifiques avant achat ?", placeholder: "Case CGV...", example: "Case CGV au panier obligatoire." },
        { num: 113, text: "Faut-il prévoir une page 'Conseils d’utilisation / sécurité' ?", placeholder: "Oui / Non...", example: "Oui." }
      ]
    },
    {
      id: "sect11",
      title: "11. Design, contenu, SEO et conversion",
      desc: "L'enrobage marketing pour vendre mieux.",
      questions: [
        { num: 114, text: "Avez-vous un logo officiel ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 115, text: "Avez-vous une charte graphique ou des couleurs validées ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 116, text: "Quels sites aimez-vous visuellement ?", placeholder: "Liens...", example: "J'aime la structure épurée." },
        { num: 117, text: "Quels sites ne voulez-vous surtout pas imiter ?", placeholder: "On fuit...", example: "Pas AliExpress." },
        { num: 118, text: "Quelle ambiance doit transmettre la boutique ?", placeholder: "Luxe, fun, bio...", example: "Premium, apaisant, authentique." },
        { num: 119, text: "Quelles pages doivent exister dès la V1 ?", placeholder: "Accueil, shop, contact...", example: "Accueil, La Boutique, À propos, Contact, FAQ." },
        { num: 120, text: "Quel CTA principal doit apparaître ?", placeholder: "Bouton...", example: "Découvrir la collection (vers boutique)." },
        { num: 121, text: "Quels mots-clés Google sont importants pour le SEO ?", placeholder: "Bougie parfumée...", example: "Bougie naturelle coulée main." },
        { num: 122, text: "Souhaitez-vous un blog ou des ressources ?", placeholder: "Oui / Non...", example: "Oui en V2." },
        { num: 123, text: "Souhaitez-vous connecter les réseaux sociaux (flux feed) ?", placeholder: "Insta, TikTok...", example: "Flux Insta en bas de page." },
        { num: 124, text: "Souhaitez-vous installer un suivi analytics ?", placeholder: "GA4, Pixel...", example: "Meta Pixel et GA4." },
        { num: 125, text: "Souhaitez-vous une newsletter ?", placeholder: "Capture mail...", example: "Popup pour 10% sur premier achat." }
      ]
    },
    {
      id: "sect12",
      title: "12. Technique, outils et accès",
      desc: "Prérequis d'environnement et de plateforme e-commerce.",
      questions: [
        { num: 126, text: "Avez-vous déjà un nom de domaine ?", placeholder: "Oui / Non...", example: "Oui, sur OVH." },
        { num: 127, text: "Quel est le nom de domaine souhaité ?", placeholder: "www...", example: "www.maison-nuage.com" },
        { num: 128, text: "Avez-vous déjà une plateforme e-commerce ?", placeholder: "Oui / Non...", example: "Pas encore." },
        { num: 129, text: "Avez-vous une préférence technique ?", placeholder: "Shopify, Woo...", example: "Idéalement Shopify pour m'y retrouver." },
        { num: 130, text: "Avez-vous déjà des emails professionnels ?", placeholder: "contact@...", example: "Oui, rattaché au domaine." },
        { num: 131, text: "Quels accès faudra-t-il fournir ?", placeholder: "Domaine, réseaux...", example: "Accès OVH et Stripe." },
        { num: 132, text: "Qui administrera la boutique après livraison ?", placeholder: "Client, Dev...", example: "Moi-même." },
        { num: 133, text: "Avez-vous besoin d’une formation de prise en main (vidéo) ?", placeholder: "Oui / Non...", example: "Oui." },
        { num: 134, text: "Avez-vous besoin d’une maintenance mensuelle ?", placeholder: "Oui / Non...", example: "Peut-être." },
        { num: 135, text: "Quelles évolutions sont prévues après la V1 ?", placeholder: "B2B, Abonnements...", example: "Vente B2B aux concept stores." }
      ]
    },
    {
      id: "sect13",
      title: "13. Cas avancés (Multivendeurs, B2B)",
      desc: "À vérifier uniquement si le e-commerce cible un écosystème complexe.",
      questions: [
        { num: 136, text: "Y a-t-il plusieurs créateurs, marques, vendeurs ou structures ?", placeholder: "Marketplace...", example: "Non, une seule marque." },
        { num: 137, text: "Faut-il filtrer les produits par vendeur, créateur ou collection ?", placeholder: "Filtre vendeur...", example: "Non applicable." },
        { num: 138, text: "Les revenus doivent-ils être répartis automatiquement ?", placeholder: "Oui / Non...", example: "Non applicable." },
        { num: 139, text: "Chaque vendeur doit-il avoir un accès admin limité ?", placeholder: "Oui / Non...", example: "Non applicable." },
        { num: 140, text: "Souhaitez-vous vendre à des professionnels avec tarifs spécifiques ?", placeholder: "Prix grossistes...", example: "À l'avenir oui." },
        { num: 141, text: "Souhaitez-vous gérer des devis ou commandes sur demande ?", placeholder: "Bouton devis...", example: "Formulaire contact B2B." },
        { num: 142, text: "Souhaitez-vous vendre des abonnements ?", placeholder: "Box mensuelle...", example: "Peut-être une box saison." },
        { num: 143, text: "Souhaitez-vous du multilingue ou multi-devise ?", placeholder: "En, De, GBP...", example: "Français/Euro." },
        { num: 144, text: "Souhaitez-vous connecter un outil externe (ERP, CRM) via API ?", placeholder: "Comptabilité, Logistique...", example: "E-mailing Klaviyo." },
        { num: 145, text: "Quel point rend le projet potentiellement sur-mesure selon vous ?", placeholder: "Spécificité...", example: "Personnaliser le pot avec une gravure avant l'ajout panier." }
      ]
    }
  ], []);

  const currentSubSections = useMemo(() => {
    if (selectedQuestionnaireType === 'local') {
      return [
        { id: 'meta', label: '📝 Infos Générales', desc: 'Identité dossier & devis' },
        { id: 'sect1', label: '🗣️ 1. Activité locale', desc: 'Modèle affaires & Spécialités' },
        { id: 'sect2', label: '🗺️ 2. Zone & Clientèle', desc: 'Villes cibles & Clients' },
        { id: 'sect3', label: '🎯 3. Offres & Services', desc: 'Prestations & Objections' },
        { id: 'sect4', label: '🔍 4. Google Business', desc: 'Profile GMB & SEO local' },
        { id: 'sect5', label: '🛡️ 5. Preuves & Crédibilité', desc: 'Témoignages & garanties' },
        { id: 'sect6', label: '📲 6. Parcours Conversion', desc: 'Actions cibles & Formulaires' },
        { id: 'sect7', label: '📑 7. Pages & Structure', desc: 'Tableau des pages à livrer' },
        { id: 'sect8', label: '🎨 8. Identité & Contenus', desc: 'Logos, photos-valeurs & tons' },
        { id: 'sect9', label: '🌐 9. Cohérence Réseaux', desc: 'Facebook, Instagram & GMB' },
        { id: 'sect10', label: '⏳ 10. Timing & Légals', desc: 'Dates, SIRET & accès' },
        { id: 'drive', label: '🗂️ 11. Checklist Drive', desc: 'Assets clients à rassembler' },
        { id: 'reco', label: '📈 12. Analyse Clinique', desc: 'Orientation Nümtema' },
        { id: 'invite', label: '💬 13. Invitation WhatsApp', desc: 'Message prêt-à-partager' }
      ] as const;
    } else if (selectedQuestionnaireType === 'vitrine') {
      return [
        { id: 'meta', label: '📝 Infos Générales', desc: 'Identité dossier & activity' },
        { id: 'sect1', label: '🗣️ 1. Identité & Contexte', desc: 'Histoire, valeurs, mots' },
        { id: 'sect2', label: '🚀 2. Objectifs site', desc: 'Problèmes, succès & échecs' },
        { id: 'sect3', label: '🎯 3. Clientèle cible', desc: 'Profil idéal, douleurs, peurs' },
        { id: 'sect4', label: '💎 4. Offres & Services', desc: 'Prestations, packs, tarifs' },
        { id: 'sect5', label: '🛡️ 5. Différenciation', desc: 'Preuves, témoignages, légitimité' },
        { id: 'sect6', label: '📑 6. Pages & Checklist', desc: 'Pages indispensables en V1' },
        { id: 'sect7', label: '✍️ 7. Messages clés', desc: 'Copywriting, ton, slogan' },
        { id: 'sect8', label: '🎨 8. Identité visuelle', desc: 'Photos, logo, émotions site' },
        { id: 'sect9', label: '📲 9. Contact & Fermeture', desc: 'CTA principal, Calendly, formulaire' },
        { id: 'sect10', label: '🔍 10. SEO & Réseaux', desc: 'Mots clés, Google Business' },
        { id: 'sect11', label: '⏳ 11. Cadrage & Accès', desc: 'Timing, légals, devis' },
        { id: 'drive', label: '🗂️ 12. Checklist Drive', desc: 'Assets clients de départ' },
        { id: 'reco', label: '📈 13. Analyse Clinique', desc: 'Rapport interne Nümtema' },
        { id: 'invite', label: '💬 14. Message Client', desc: 'WhatsApp ou E-mail d\'envoi' }
      ] as const;
    } else if (selectedQuestionnaireType === 'coach') {
      return [
        { id: 'meta', label: '📝 Infos Générales', desc: 'Identité dossier & devis' },
        { id: 'sect1', label: '🗣️ 1. Posture & Identité', desc: 'Slogan, parcours, légitimité' },
        { id: 'sect2', label: '🎯 2. Cible & Visiteurs', desc: 'Profil idéal, urgence' },
        { id: 'sect3', label: '🚀 3. Analyse & Transformation', desc: 'Problèmes, peurs, résultats' },
        { id: 'sect4', label: '⚖️ 4. Cadre Accompagnement', desc: 'Méthode, limites, éthique' },
        { id: 'sect5', label: '💎 5. Offres & Formats', desc: 'Packages, durée, tarification' },
        { id: 'sect6', label: '🛡️ 6. Preuves & Légitimité', desc: 'Témoignages, certifications' },
        { id: 'sect7', label: '✍️ 7. Ton & Messages', desc: 'Copywriting, phrases clés' },
        { id: 'sect8', label: '📲 8. Prise de RDV', desc: 'Calendly, formulaire, filtres' },
        { id: 'sect9', label: '🎨 9. Identité visuelle', desc: 'Logo, ambiance, photos' },
        { id: 'sect10', label: '🔍 10. SEO & Légals', desc: 'Mots clés, Google Business, droits' },
        { id: 'sect11', label: '📑 11. Pages du site', desc: 'Structure et page demandées' },
        { id: 'drive', label: '🗂️ 12. Checklist Drive', desc: 'Assets coach à verser' },
        { id: 'reco', label: '📈 13. Analyse Clinique', desc: 'Rapport interne Nümtema' },
        { id: 'invite', label: '💬 14. Message Client', desc: 'WhatsApp ou e-mail d\'envoi' }
      ] as const;
    } else if (selectedQuestionnaireType === 'ecommerce') {
      return [
        { id: 'meta', label: '📝 Infos Générales', desc: 'Identité dossier & devis' },
        { id: 'sect1', label: '🏷️ 1. Identité Marque', desc: 'Décideurs, image, ambition' },
        { id: 'sect2', label: '📈 2. Stratégie CA', desc: 'Objectifs, canaux, panier' },
        { id: 'sect3', label: '🎯 3. Cible & Freins', desc: 'Profil client, objections' },
        { id: 'sect4', label: '🛍️ 4. Catalogue', desc: 'Organisation, architecture' },
        { id: 'sect5', label: '📝 5. Fiches Produits', desc: 'Contenu, variantes, photos' },
        { id: 'sect6', label: '💶 6. Prix & Promo', desc: 'Marges, TVA, codes' },
        { id: 'sect7', label: '💳 7. Panier & Checkout', desc: 'Paiement, Stripe' },
        { id: 'sect8', label: '📦 8. Stock & Admin', desc: 'Prépa commandes, flux' },
        { id: 'sect9', label: '🚚 9. Logistique & SAV', desc: 'Livraison, emballage' },
        { id: 'sect10', label: '⚖️ 10. Légal & CGV', desc: 'Conformité, RGPD' },
        { id: 'sect11', label: '🎨 11. Marketing & SEO', desc: 'Design, acquisition' },
        { id: 'sect12', label: '⚙️ 12. Tech & Accès', desc: 'Shopify, CMS, domaine' },
        { id: 'sect13', label: '🧩 13. Avancé (B2B)', desc: 'Multi-vendeurs, Sur-mesure' },
        { id: 'sect_pages', label: '📑 Checklist Pages', desc: 'Arborescence V1 site' },
        { id: 'drive', label: '🗂️ 14. Checklist Drive', desc: 'Médias & accès boutique' },
        { id: 'reco', label: '📈 15. Analyse Clinique', desc: 'Rapport technique interne' },
        { id: 'invite', label: '💬 16. Message Client', desc: 'WhatsApp ou e-mail' }
      ] as const;
    } else {
      return [
        { id: 'meta', label: '📝 Infos Générales', desc: 'Identité dossier & devis' },
        { id: 'sect1', label: '🎓 1. Identité & Posture', desc: 'Qui, quoi, parcours, compétences' },
        { id: 'sect2', label: '🎯 2. Public & Niveaux', desc: 'Auditeur cible et niveau requis' },
        { id: 'sect3', label: '🚀 3. Objectifs & Promesse', desc: 'Blocage levé, transformation promise' },
        { id: 'sect4', label: '💎 4. Offre & Commercial', desc: 'Format, durée, prix, CPF' },
        { id: 'sect5', label: '📑 5. Programme & Modules', desc: 'Modules, exercices, supports, plan' },
        { id: 'sect6', label: '⭐ 6. Mécanisme Unique', desc: 'Nom, framework, différenciation' },
        { id: 'sect7', label: '🛡️ 7. Preuves & Résultats', desc: 'Témoignages, avis, légitimité' },
        { id: 'sect8', label: '📲 8. Parcours d\'Achat', desc: 'CTA stratégique, formulaire, Stripe' },
        { id: 'sect9', label: '🌐 9. Pages & Structure', desc: 'Pages requises & sitemap' },
        { id: 'sect10', label: '✍️ 10. Contenus & Lead Magnet', desc: 'Fichiers, guides d\'autorité, séquences' },
        { id: 'sect11', label: '🎨 11. Identité Visuelle', desc: 'Logos, visuels membres, émotions' },
        { id: 'sect12', label: '🔍 12. SEO & Mots clés', desc: 'Performance de recherche, trafic' },
        { id: 'sect13', label: '⚖️ 13. Cadre & Conformance', desc: 'NDA, mentions, CGV, accessibilité' },
        { id: 'drive', label: '🗂️ 14. Checklist Drive', desc: 'Assets formation à verser' },
        { id: 'reco', label: '📈 15. Analyse Clinique', desc: 'Rapport interne Nümtema' },
        { id: 'invite', label: '💬 16. Message Client', desc: 'WhatsApp ou e-mail d\'envoi' }
      ] as const;
    }
  }, [selectedQuestionnaireType]);

  const compiledQuestMarkdownVitrine = useMemo(() => {
    let md = `# QUESTIONNAIRE SITE VITRINE (Document 10.2)
*Nümtema Agency Digital Marketing - Document Interne & Client*

## 📝 INFOS CLIENT & DOSSIER ASSOCIÉ
- **Enseigne / Entreprise :** ${questMeta.companyName || 'Non renseigné'}
- **Référent projet :** ${questMeta.referentName || 'Non renseigné'}
- **Téléphone / WhatsApp :** ${questMeta.phoneWhatsapp || 'Non renseigné'}
- **Email de contact :** ${questMeta.contactEmail || 'Non renseigné'}
- **Activité principale :** ${questMeta.mainActivity || 'Non renseigné'}
- **Date de remplissage :** ${questMeta.fillingDate || 'Non renseigné'}
- **Offre / Devis raccord :** ${questMeta.associatedQuote || 'Non renseigné'}

---

`;

    vitrineQuestSections.forEach(sect => {
      md += `## ${sect.title}\n*${sect.desc}*\n\n`;
      sect.questions.forEach(q => {
        const val = questAnswersVitrine[q.num] || '';
        md += `### Q${q.num}. ${q.text}\n> ${val ? val : '*Réponse vide / À clarifier lors du cadrage*'}\n\n`;
      });
      md += `\n`;
    });

    md += `## 📑 PAGES ET STRUCTURE RETRANCHÉES
Nous avons convenu de borner le périmètre du site vitrine de la manière suivante :
- **Accueil :** ${questPagesVitrine.accueil ? '✅ Oui (Présenter l\'activité, la promesse, les services et le CTA principal)' : '❌ Non'}
- **À propos :** ${questPagesVitrine.apropos ? '✅ Oui (Raconter le parcours, la posture, la légitimité)' : '❌ Non'}
- **Services / prestations :** ${questPagesVitrine.services ? '✅ Oui (Expliquer l\'offre sans perdre le visiteur)' : '❌ Non'}
- **Service détaillé 1 :** ${questPagesVitrine.serv1 ? '✅ Oui (Prestation stratégique ou rentable ciblée)' : '❌ Non'}
- **Réalisations / portfolio :** ${questPagesVitrine.realisations ? '✅ Oui (Montrer le travail, les résultats ou exemples concrets)' : '❌ Non'}
- **Avis clients :** ${questPagesVitrine.avis ? '✅ Oui (Créer de la confiance)' : '❌ Non'}
- **FAQ :** ${questPagesVitrine.faq ? '✅ Oui (Répondre aux objections et questions fréquentes)' : '❌ Non'}
- **Contact :** ${questPagesVitrine.contact ? '✅ Oui (Permettre d\'appeler, écrire, réserver ou demander un devis)' : '❌ Non'}
- **Blog / conseils :** ${questPagesVitrine.blog ? '✅ Oui (Option de visibilité et d\'autorité)' : '❌ Non'}

---

## 🗂️ CHECKLIST DU DRIVE CLIENT À FOURNIR (Section 12)
Déposé par le client dans l'espace partagé sécurisé :
`;

    const driveItemsVitrine = [
      { id: 'logo', label: 'Logo officiel' },
      { id: 'charte', label: 'Charte ou couleurs' },
      { id: 'portrait', label: 'Photos portrait / équipe' },
      { id: 'prestat', label: 'Photos métier / prestations' },
      { id: 'realisations', label: 'Réalisations / portfolio' },
      { id: 'avis', label: 'Avis clients utilisables' },
      { id: 'textes_existants', label: 'Textes existants' },
      { id: 'services', label: 'Liste des services' },
      { id: 'tarifs', label: 'Tarifs ou fourchettes si affichés' },
      { id: 'socials', label: 'Liens réseaux sociaux' },
      { id: 'domain', label: 'Accès ancien site / domaine' },
      { id: 'gmb', label: 'Fiche Google Business' },
      { id: 'certifs', label: 'Certifications / diplômes' },
      { id: 'brochures', label: 'Brochures ou PDF existants' },
      { id: 'legals', label: 'Mentions légales / documents juridiques' },
      { id: 'site_ref', label: 'Sites de référence' }
    ];

    driveItemsVitrine.forEach(item => {
      const isChecked = questDriveVitrine.includes(item.id);
      md += `${isChecked ? '✅' : '❌'} - ${item.label}\n`;
    });

    md += `\n---
*Généré avec l'outil de cadrage interactif site vitrine Nümtema Agency - Version 1.0 (Doc 10.2)*`;

    return md;
  }, [questMeta, questAnswersVitrine, questPagesVitrine, questDriveVitrine, vitrineQuestSections]);

  const compiledQuestMarkdownFormation = useMemo(() => {
    let md = `# QUESTIONNAIRE FORMATION PROFESSIONNELLE (Document 10.3)
*Nümtema Agency Digital Marketing - Document Interne & Client d'Ingénierie Pédagogique*

## 📝 INFOS CLIENT & DOSSIER ASSOCIÉ
- **Organisme / Entreprise :** ${questMeta.companyName || 'Non renseigné'}
- **Référent projet :** ${questMeta.referentName || 'Non renseigné'}
- **Téléphone / WhatsApp :** ${questMeta.phoneWhatsapp || 'Non renseigné'}
- **Email de contact :** ${questMeta.contactEmail || 'Non renseigné'}
- **Activité principale :** ${questMeta.mainActivity || 'Non renseigné'}
- **Date de remplissage :** ${questMeta.fillingDate || 'Non renseigné'}
- **Offre / Devis raccord :** ${questMeta.associatedQuote || 'Non renseigné'}

---

`;

    formationQuestSections.forEach(sect => {
      md += `## ${sect.title}\n*${sect.desc}*\n\n`;
      sect.questions.forEach(q => {
        const val = questAnswersFormation[q.num] || '';
        md += `### Q${q.num}. ${q.text}\n> ${val ? val : '*Réponse vide / À clarifier lors du cadrage*'}\n\n`;
      });
      md += `\n`;
    });

    md += `## 📑 STRUCTURE DES PAGES SOUHAITÉES EN V1
Nous avons borné le périmètre du portail de formation de la manière suivante :
- **Landing Page (Présentation de l'offre reine) :** ${questPagesFormation.landing ? '✅ Oui' : '❌ Non'}
- **Page Programme Détaillé (Détails des modules de cours) :** ${questPagesFormation.programme ? '✅ Oui' : '❌ Non'}
- **Page Formateur & Biographie (Crédibilité & Confiance) :** ${questPagesFormation.apropos ? '✅ Oui' : '❌ Non'}
- **FAQ Formation (Objections administratives & pédagogiques) :** ${questPagesFormation.faq ? '✅ Oui' : '❌ Non'}
- **Page Inscription / Candidature (Formulaire de conversion) :** ${questPagesFormation.inscription ? '✅ Oui' : '❌ Non'}
- **Page Ressources / Blog (Lead Magnet d'acquisition SEO) :** ${questPagesFormation.ressources ? '✅ Oui' : '❌ Non'}
- **Page Entreprise / B2B Devis (Prise en charge OPCO) :** ${questPagesFormation.b2b ? '✅ Oui' : '❌ Non'}

---

## 🗂️ CHECKLIST DU DRIVE FORMATION (Section 14)
Déposé par le client dans l'espace partagé sécurisé :
`;

    const driveItemsFormation = [
      { id: 'logo', label: 'Logo de l\'organisme et variantes' },
      { id: 'charte', label: 'Charte graphique, couleurs, polices' },
      { id: 'portrait', label: 'Photos professionnelles portrait du formateur (HD)' },
      { id: 'prestat', label: 'Photos d\'ateliers, de cours ou de sessions collectives (visuels)' },
      { id: 'realisations', label: 'Témoignages vidéos, captures Slack, avis écrits' },
      { id: 'avis', label: 'Chiffres de satisfaction certifiés (note CPF, taux de complétion)' },
      { id: 'textes_existants', label: 'Supports de formation existants, PDF, diapositives' },
      { id: 'services', label: 'Programme officiel ou plan détaillé des modules de cours' },
      { id: 'tarifs', label: 'Grille de tarifs de la formation et modalités de financement' },
      { id: 'socials', label: 'Liens vers vos réseaux sociaux de diffusion (LinkedIn, YouTube)' },
      { id: 'domain', label: 'Accès au domaine d\'hébergement ou au LMS de cours' },
      { id: 'gmb', label: 'Formulaire d\'évaluation et de candidature Calendly connecté' },
      { id: 'certifs', label: 'Certificats de compétences et documentation Qualiopi valides' },
      { id: 'brochures', label: 'Guide ou Lead magnet gratuit de capture d\'emails' },
      { id: 'legals', label: 'Règlement intérieur, CGV d\'organisme de formation et mentions légales' },
      { id: 'site_ref', label: 'Sites de formation ou de vente de cours inspirants' }
    ];

    driveItemsFormation.forEach(item => {
      const isChecked = questDriveFormation.includes(item.id);
      md += `${isChecked ? '✅' : '❌'} - ${item.label}\n`;
    });

    md += `\n---
*Généré avec l'outil d'ingénierie d'offres de formation Nümtema Agency - Version 1.0 (Doc 10.3-A)*`;

    return md;
  }, [questMeta, questAnswersFormation, questPagesFormation, questDriveFormation, formationQuestSections]);

  const compiledQuestMarkdownCoach = useMemo(() => {
    let md = `# QUESTIONNAIRE POSTURE + ACCOMPAGNEMENT Coach / Thérapeute (Document 10.3-B)
*Nümtema Agency Digital Marketing - Document Interne & Client*

## 📝 INFOS CLIENT & DOSSIER ASSOCIÉ
- **Structure / Marque :** ${questMeta.companyName || 'Non renseigné'}
- **Référent projet :** ${questMeta.referentName || 'Non renseigné'}
- **Téléphone / WhatsApp :** ${questMeta.phoneWhatsapp || 'Non renseigné'}
- **Email de contact :** ${questMeta.contactEmail || 'Non renseigné'}
- **Ville / Visio :** ${questMeta.mainCity || 'Non renseigné'}
- **Métier affiché :** ${questMeta.mainActivity || 'Non renseigné'}
- **Date de remplissage :** ${questMeta.fillingDate || 'Non renseigné'}
- **Offre / Devis raccord :** ${questMeta.associatedQuote || 'Non renseigné'}

---

`;

    coachQuestSections.forEach(sect => {
      md += `## ${sect.title}\n*${sect.desc}*\n\n`;
      sect.questions.forEach(q => {
        const val = questAnswersCoach[q.num] || '';
        md += `### Q${q.num}. ${q.text}\n> ${val ? val : '*Réponse vide / À clarifier lors du cadrage*'}\n\n`;
      });
      md += `\n`;
    });

    md += `## 📑 PAGES ET STRUCTURE RETRANCHÉES
Nous avons convenu de borner le périmètre du site d'accompagnement de la manière suivante :
- **Accueil (Présenter promesse, public, et CTA) :** ${questPagesCoach.accueil ? '✅ Oui' : '❌ Non'}
- **À propos / parcours (Créer confiance) :** ${questPagesCoach.apropos ? '✅ Oui' : '❌ Non'}
- **Méthode / approche (Rendre la pratique claire) :** ${questPagesCoach.methode ? '✅ Oui' : '❌ Non'}
- **Accompagnements (Choisir la bonne porte d'entrée) :** ${questPagesCoach.accompagnements ? '✅ Oui' : '❌ Non'}
- **Offre détaillée (Valoriser un accompagnement prioritaire) :** ${questPagesCoach.offre_detaillee ? '✅ Oui' : '❌ Non'}
- **Témoignages (Preuve sociale) :** ${questPagesCoach.temoignages ? '✅ Oui' : '❌ Non'}
- **Ressources / blog (Autorité et SEO) :** ${questPagesCoach.ressources ? '✅ Oui' : '❌ Non'}
- **FAQ (Traiter les objections) :** ${questPagesCoach.faq ? '✅ Oui' : '❌ Non'}
- **RDV / contact (Convertir) :** ${questPagesCoach.contact ? '✅ Oui' : '❌ Non'}

---

## 🗂️ CHECKLIST DU DRIVE CLIENT À FOURNIR
Déposé par le client dans l'espace partagé sécurisé :
`;

    const driveItemsCoach = [
      { id: 'logo', label: 'Logo officiel ou charte visuelle' },
      { id: 'portrait', label: 'Photos professionnel portrait' },
      { id: 'cabinet', label: 'Photos cabinet ou lieu' },
      { id: 'bio', label: 'Bio ou texte de présentation existant' },
      { id: 'offres', label: 'Liste complète des offres et tarifs' },
      { id: 'diplomes', label: 'Diplômes ou certifications' },
      { id: 'avis', label: 'Témoignages utilisables / Avis' },
      { id: 'liens_rdv', label: 'Lien de système de RDV direct (Calendly / Doctolib)' },
      { id: 'socials', label: 'Liens vers les réseaux sociaux' },
      { id: 'textes_existants', label: 'Anciens textes, flyers, brochures, posts' },
      { id: 'ressource', label: 'Ressource gratuite éventuelle (PDF)' },
      { id: 'legals', label: 'Cadre légal, déontologie ou mentions légales (si besoin)' },
      { id: 'domain', label: 'Accès / identité de l\'ancien domaine (si existant)' }
    ];

    driveItemsCoach.forEach(item => {
      const isChecked = questDriveCoach.includes(item.id);
      md += `${isChecked ? '✅' : '❌'} - ${item.label}\n`;
    });

    md += `\n---
*Généré avec l'outil d'ingénierie d'offres Nümtema Agency - Version 1.0 (Doc 10.3-B)*`;

    return md;
  }, [questMeta, questAnswersCoach, questPagesCoach, questDriveCoach, coachQuestSections]);

  const compiledQuestMarkdownEcommerce = useMemo(() => {
    let md = `# QUESTIONNAIRE E-COMMERCE COMPLET (Document 10.4)
*Nümtema Agency Digital Marketing - Document Interne & Client - Version 1.0*

## 📝 INFOS CLIENT & BOUTIQUE
- **Site E-commerce / Marque :** ${questMeta.companyName || 'Non renseigné'}
- **Référent projet :** ${questMeta.referentName || 'Non renseigné'}
- **Téléphone / WhatsApp :** ${questMeta.phoneWhatsapp || 'Non renseigné'}
- **Email de contact :** ${questMeta.contactEmail || 'Non renseigné'}
- **Siège / Expédition :** ${questMeta.mainCity || 'Non renseigné'}
- **Secteur / Catalogue :** ${questMeta.mainActivity || 'Non renseigné'}
- **Date de remplissage :** ${questMeta.fillingDate || 'Non renseigné'}
- **Offre / Devis raccord :** ${questMeta.associatedQuote || 'Non renseigné'}

---

`;

    ecommerceQuestSections.forEach(sect => {
      md += `## ${sect.title}\n*${sect.desc}*\n\n`;
      sect.questions.forEach(q => {
        const val = questAnswersEcommerce[q.num] || '';
        md += `### Q${q.num}. ${q.text}\n> ${val ? val : '*Réponse vide / À clarifier lors du cadrage*'}\n\n`;
      });
      md += `\n`;
    });

    md += `## 📑 PAGES ET STRUCTURE RETRANCHÉES
Nous avons convenu des pages suivantes pour la V1 :
- **Accueil (Shop the look / Bestsellers) :** ${questPagesEcommerce.accueil ? '✅ Oui' : '❌ Non'}
- **Boutique / Catalogue Global :** ${questPagesEcommerce.boutique ? '✅ Oui' : '❌ Non'}
- **Fiches Produits (Modèle détaillé) :** ${questPagesEcommerce.produit ? '✅ Oui' : '❌ Non'}
- **À propos / Notre marque :** ${questPagesEcommerce.apropos ? '✅ Oui' : '❌ Non'}
- **Panier / Checkout :** ${questPagesEcommerce.panier ? '✅ Oui' : '❌ Non'}
- **Livraison & Retours (Modalités) :** ${questPagesEcommerce.livraison ? '✅ Oui' : '❌ Non'}
- **Service Client & Contact :** ${questPagesEcommerce.contact ? '✅ Oui' : '❌ Non'}
- **FAQ (Questions fréquentes) :** ${questPagesEcommerce.faq ? '✅ Oui' : '❌ Non'}
- **Blog / SEO Mag :** ${questPagesEcommerce.blog ? '✅ Oui' : '❌ Non'}
- **Preuve sociale / Avis certifiés :** ${questPagesEcommerce.avis ? '✅ Oui' : '❌ Non'}
- **Mentions légales & CGV :** ${questPagesEcommerce.legal ? '✅ Oui' : '❌ Non'}

---

## 🗂️ CHECKLIST DU DRIVE CLIENT À FOURNIR
Déposé par le client dans l'espace partagé sécurisé e-commerce :
`;

    const driveItemsEcommerce = [
      { id: 'logo', label: 'Logo et charte graphique (typos, couleurs)' },
      { id: 'marque', label: 'Histoire de l\'entreprise, valeurs, photos de l\'équipe' },
      { id: 'catalogue', label: 'Tableau des produits (Références, Noms, Prix, Stock, Poids)' },
      { id: 'photos', label: 'Dossier de photos triées par produit (HD)' },
      { id: 'vente', label: 'Validation des informations bancaires (RIB, Moyens paiments)' },
      { id: 'frais', label: 'Grille des frais de livraison validée (grille de poids/forfait)' },
      { id: 'preuves', label: 'Avis, témoignages, presse, labels, certifications Bio/CE' },
      { id: 'legal', label: 'CGV, Mentions Légales, Pol. de Retour (Validées juridiquement)' },
      { id: 'acces', label: 'Accès domaine / hébergement / Shopify / Stripe / Réseaux sociaux' }
    ];

    driveItemsEcommerce.forEach(item => {
      const isChecked = questDriveEcommerce.includes(item.id);
      md += `${isChecked ? '✅' : '❌'} - ${item.label}\n`;
    });

    md += `\n---
*Généré avec l'outil d'ingénierie E-commerce Nümtema Agency - Version 1.0 (Doc 10.4)*`;

    return md;
  }, [questMeta, questAnswersEcommerce, questPagesEcommerce, questDriveEcommerce, ecommerceQuestSections]);

  const handleLoadExampleVitrine = () => {
    setQuestMeta({
      companyName: 'ConsultFlow',
      referentName: 'Adrien Martin',
      phoneWhatsapp: '06 43 12 98 76',
      contactEmail: 'contact@consult-flow.fr',
      mainCity: 'Paris',
      mainActivity: 'Automatisation administrative & No-Code',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Présence Pro - 1500 €'
    });

    const exampleAnswers: Record<number, string> = {};
    vitrineQuestSections.forEach(sect => {
      sect.questions.forEach(q => {
        exampleAnswers[q.num] = q.example;
      });
    });

    setQuestAnswersVitrine(exampleAnswers);
    setQuestPagesVitrine({
      accueil: true,
      apropos: true,
      services: true,
      serv1: true,
      realisations: true,
      avis: true,
      faq: true,
      contact: true,
      blog: false
    });
    setQuestDriveVitrine(['logo', 'charte', 'portrait', 'prestat', 'realisations', 'services', 'socials']);
  };

  const handleLoadExampleFormation = () => {
    setQuestMeta({
      companyName: 'ScaleAcademy France',
      referentName: 'Sophie Durand',
      phoneWhatsapp: '06 87 65 43 21',
      contactEmail: 'sophie@scaleacademy.fr',
      mainCity: 'Paris / Distanciel',
      mainActivity: 'Organisme de Formation & Coaching B2B',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Système Client - 2200 €'
    });

    const exampleAnswers: Record<number, string> = {};
    formationQuestSections.forEach(sect => {
      sect.questions.forEach(q => {
        exampleAnswers[q.num] = q.example;
      });
    });

    setQuestAnswersFormation(exampleAnswers);
    setQuestPagesFormation({
      landing: true,
      programme: true,
      apropos: true,
      faq: true,
      inscription: true,
      ressources: true,
      b2b: false
    });
    setQuestDriveFormation(['logo', 'charte', 'portrait', 'prestat', 'realisations', 'avis', 'services', 'tarifs', 'certifs', 'legals']);
  };

  const handleLoadExampleCoach = () => {
    setQuestMeta({
      companyName: 'Renaissance Coaching',
      referentName: 'Valérie Lambert',
      phoneWhatsapp: '06 12 34 56 78',
      contactEmail: 'valerie@renaissance-coaching.com',
      mainCity: 'Lyon',
      mainActivity: 'Coach Dirigeants & EMDR',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'FunnelHub Signature - 3500 €'
    });

    const exampleAnswers: Record<number, string> = {};
    coachQuestSections.forEach(sect => {
      sect.questions.forEach(q => {
        exampleAnswers[q.num] = q.example;
      });
    });

    setQuestAnswersCoach(exampleAnswers);
    setQuestPagesCoach({
      accueil: true,
      apropos: true,
      methode: true,
      accompagnements: true,
      offre_detaillee: true,
      temoignages: true,
      ressources: true,
      faq: true,
      contact: true
    });
    setQuestDriveCoach(['logo', 'portrait', 'cabinet', 'bio', 'offres', 'avis', 'socials']);
  };

  const handleClearAllVitrine = () => {
    setQuestMeta({
      companyName: '',
      referentName: '',
      phoneWhatsapp: '',
      contactEmail: '',
      mainCity: '',
      mainActivity: '',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Présence Pro - 1500 €'
    });
    setQuestAnswersVitrine({});
    setQuestPagesVitrine({
      accueil: true,
      apropos: true,
      services: true,
      serv1: false,
      realisations: true,
      avis: true,
      faq: true,
      contact: true,
      blog: false
    });
    setQuestDriveVitrine([]);
  };

  const handleClearAllFormation = () => {
    setQuestMeta({
      companyName: '',
      referentName: '',
      phoneWhatsapp: '',
      contactEmail: '',
      mainCity: '',
      mainActivity: '',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Présence Pro - 1500 €'
    });
    setQuestAnswersFormation({});
    setQuestPagesFormation({
      landing: true,
      programme: true,
      apropos: true,
      faq: true,
      inscription: true,
      ressources: false,
      b2b: false
    });
    setQuestDriveFormation([]);
  };

  const handleClearAllCoach = () => {
    setQuestMeta({
      companyName: '',
      referentName: '',
      phoneWhatsapp: '',
      contactEmail: '',
      mainCity: '',
      mainActivity: '',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Présence Pro - 1500 €'
    });
    setQuestAnswersCoach({});
    setQuestPagesCoach({
      accueil: true,
      apropos: true,
      methode: true,
      accompagnements: true,
      offre_detaillee: false,
      temoignages: true,
      ressources: false,
      faq: true,
      contact: true
    });
    setQuestDriveCoach([]);
  };

  const handleLoadExampleEcommerce = () => {
    setQuestMeta({
      companyName: 'Maison Nuage',
      referentName: 'Marie Dupont',
      phoneWhatsapp: '06 12 34 56 78',
      contactEmail: 'contact@maison-nuage.com',
      mainCity: 'Bordeaux',
      mainActivity: 'Bougies artisanales éco-responsables',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Système Client e-commerce - 2800 €'
    });

    const exampleAnswers: Record<number, string> = {};
    ecommerceQuestSections.forEach(sect => {
      sect.questions.forEach(q => {
        exampleAnswers[q.num] = q.example;
      });
    });

    setQuestAnswersEcommerce(exampleAnswers);
    setQuestPagesEcommerce({
      accueil: true,
      boutique: true,
      produit: true,
      apropos: true,
      contact: true,
      faq: true,
      livraison: true,
      avis: true,
      blog: false,
      panier: true,
      legal: true
    });
    setQuestDriveEcommerce(['logo', 'marque', 'catalogue', 'photos', 'vente', 'frais', 'legal']);
  };

  const handleClearAllEcommerce = () => {
    setQuestMeta({
      companyName: '',
      referentName: '',
      phoneWhatsapp: '',
      contactEmail: '',
      mainCity: '',
      mainActivity: '',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Système Client e-commerce - 1800 €'
    });
    setQuestAnswersEcommerce({});
    setQuestPagesEcommerce({
      accueil: true,
      boutique: true,
      produit: true,
      apropos: true,
      contact: true,
      faq: true,
      livraison: true,
      avis: false,
      blog: false,
      panier: true,
      legal: true
    });
    setQuestDriveEcommerce([]);
  };

  const handleLoadExample = () => {
    setQuestMeta({
      companyName: 'AcroBat Plomberie Le Havre',
      referentName: 'Sébastien Dubois',
      phoneWhatsapp: '07 45 43 42 64',
      contactEmail: 'contact@acrobat-lehavre.fr',
      mainCity: 'Le Havre',
      mainActivity: 'Artisan Plombier Chauffagiste',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Présence Pro - 1500 €'
    });

    const exampleAnswers: Record<number, string> = {};
    localQuestSections.forEach(sect => {
      sect.questions.forEach(q => {
        exampleAnswers[q.num] = q.example;
      });
    });

    setQuestAnswers(exampleAnswers);
    setQuestPages({
      accueil: true,
      services: true,
      serv1: true,
      realisations: true,
      avis: true,
      apropos: true,
      faq: true,
      contact: true,
      zone: true,
      blog: false
    });
    setQuestDrive(['logo', 'photos_l', 'photos_e', 'hours', 'services', 'certifs']);
  };

  const handleClearAll = () => {
    setQuestMeta({
      companyName: '',
      referentName: '',
      phoneWhatsapp: '',
      contactEmail: '',
      mainCity: '',
      mainActivity: '',
      fillingDate: new Date().toLocaleDateString('fr-FR'),
      associatedQuote: 'Présence Pro - 1500 €'
    });
    setQuestAnswers({});
    setQuestPages({
      accueil: true,
      services: true,
      serv1: false,
      realisations: true,
      avis: true,
      apropos: true,
      faq: true,
      contact: true,
      zone: true,
      blog: false
    });
    setQuestDrive([]);
  };

  const compiledQuestMarkdown = useMemo(() => {
    let md = `# QUESTIONNAIRE VISIBILITÉ LOCALE (Document 10.1)
*Nümtema Agency Digital Marketing - Document Interne & Client*

## 📝 INFOS CLIENT & DOSSIER ASSOCIÉ
- **Enseigne / Entreprise :** ${questMeta.companyName || 'Non renseigné'}
- **Référent projet :** ${questMeta.referentName || 'Non renseigné'}
- **Téléphone / WhatsApp :** ${questMeta.phoneWhatsapp || 'Non renseigné'}
- **Email de contact :** ${questMeta.contactEmail || 'Non renseigné'}
- **Ville principale :** ${questMeta.mainCity || 'Non renseigné'}
- **Date de remplissage :** ${questMeta.fillingDate || 'Non renseigné'}
- **Offre / Devis raccord :** ${questMeta.associatedQuote || 'Non renseigné'}

---

`;

    // Process all 10 sections
    localQuestSections.forEach(sect => {
      md += `## ${sect.title}\n*${sect.desc}*\n\n`;
      sect.questions.forEach(q => {
        const val = questAnswers[q.num] || '';
        md += `### Q${q.num}. ${q.text}\n> ${val ? val : '*Réponse vide / À clarifier lors du cadrage*'}\n\n`;
      });
      md += `\n`;
    });

    // Page Checklist Section 7
    md += `## 📑 PAGES ET STRUCTURE RETRANCHÉES (Section 7)
Nous avons convenu de borner le périmètre du site local de la manière suivante :
- **Accueil :** ${questPages.accueil ? '✅ Oui (Présenter l\'activité, la zone, la promesse, CTA)' : '❌ Non'}
- **Services / Prestations :** ${questPages.services ? '✅ Oui (Expliquer de façon limpide l\'ensemble de l\'offre)' : '❌ Non'}
- **Service détaillé 1 :** ${questPages.serv1 ? '✅ Oui (Prestation stratégique ou rentable ciblée)' : '❌ Non'}
- **Réalisations / Galerie :** ${questPages.realisations ? '✅ Oui (Preuves visuelles des chantiers/interventions)' : '❌ Non'}
- **Avis clients :** ${questPages.avis ? '✅ Oui (Témoignages synchronisés pour terrasser les doutes)' : '❌ Non'}
- **À propos / Équipe :** ${questPages.apropos ? '✅ Oui (Proximité humaine et gages de conformité)' : '❌ Non'}
- **FAQ :** ${questPages.faq ? '✅ Oui (Désamorçage d\'objections à l\'écrit de manière autonome)' : '❌ Non'}
- **Contact / Accès :** ${questPages.contact ? '✅ Oui (Horaires, carte, téléphone, formulaire)' : '❌ Non'}
- **Zone d’intervention :** ${questPages.zone ? '✅ Oui (Clarifier exactement ou nous nous déplaçons)' : '❌ Non'}
- **Blog / Conseils :** ${questPages.blog ? '✅ Oui (Levier SEO performant additionnel)' : '❌ Non'}

---

## 🗂️ CHECKLIST DU DRIVE CLIENT À FOURNIR (Section 11)
Déposé par le client dans l'espace partagé sécurisé :
`;

    const driveItems = [
      { id: 'logo', label: 'Logo officiel' },
      { id: 'photos_l', label: 'Photos du lieu' },
      { id: 'photos_e', label: 'Photos de l’équipe' },
      { id: 'photos_p', label: 'Photos des prestations/réalisations' },
      { id: 'avis', label: 'Avis clients utilisables' },
      { id: 'socials', label: 'Liens réseaux sociaux' },
      { id: 'gmb', label: 'Accès Google Business' },
      { id: 'domain', label: 'Accès ancien site/domaine' },
      { id: 'hours', label: 'Horaires exacts' },
      { id: 'addr', label: 'Adresse et zone d’intervention' },
      { id: 'services', label: 'Liste des services' },
      { id: 'tarifs', label: 'Tarifs ou fourchettes si affichés' },
      { id: 'certifs', label: 'Certifications / diplômes' },
      { id: 'assur', label: 'Assurance / labels' },
      { id: 'legals', label: 'Mentions légales / documents juridiques' },
      { id: 'site_ref', label: 'Sites de référence' }
    ];

    driveItems.forEach(item => {
      const isChecked = questDrive.includes(item.id);
      md += `${isChecked ? '✅' : '❌'} - ${item.label}\n`;
    });

    md += `\n---
*Généré avec l'outil de cadrage interactif Nümtema Agency - Version 1.0*`;

    return md;
  }, [questMeta, questAnswers, questPages, questDrive, localQuestSections]);

  // Define Nümtema commercial offer tiers
  const offersList: OfferDetail[] = useMemo(() => [
    {
      id: 'presence_essentielle',
      name: 'Présence Essentielle',
      price: 800,
      tagline: 'L’entrée de gamme premium pour exister et rassurer.',
      idealClient: 'Artisan, commerçant local, indépendant, profession libérale débutante.',
      problem: 'Le client est invisible sur le web, n\'a pas d\'adresse e-mail professionnelle ni de support de légitimité.',
      inclusions: [
        'Site web de 1 à 3 pages (Accueil, Services, Contact)',
        'Design 100% responsive et adapté au mobile',
        'Bouton de contact direct / Intégration WhatsApp',
        'SEO Local de base (Mots-clés insérés, indexation Google)',
        'Mise en ligne rapide et aide à l\'organisation du contenu'
      ],
      exclusions: [
        'Pas de rédaction copywriting complète (travail sur structures)',
        'Pas de système d\'automatisation ou d\'outils tiers avancés',
        'Pas de boutique e-commerce ou catalogue',
        'Frais de nom de domaine et hébergement non inclus',
        'Limité à 2 cycles de retouches maximum'
      ],
      delays: '7 à 10 jours',
      acompteMin: 200,
      pitch: 'Avoir un site structuré qui valide immédiatement votre professionnalisme à un prix fixe et maîtrisé.',
      icon: <Globe className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 'presence_pro',
      name: 'Présence Pro',
      price: 1500,
      tagline: 'L’offre phare pour clarifier le message et convertir.',
      idealClient: 'Coach sérieux, thérapeute, consultant, prestataire de services, marque en croissance.',
      problem: 'Le client a un site obsolète ou n\'arrive pas à exprimer sa singularité ; son message est brouillon.',
      inclusions: [
        'Site web de 4 à 5 pages (Accueil, À propos, Services détaillé, Contact + Blog/FAQ)',
        'Copywriting guidé et structuration du message clé',
        'Section de preuves sociales (témoignages, logos d\'autorité)',
        'Formulaires de contact avancés ou demande de devis simple',
        'SEO sémantique optimisé (recherche de mots-clés stratégiques)'
      ],
      exclusions: [
        'Pas d\'intégrations CRM complexes ni d\'automatisation d\'emails',
        'Pas de module boutique e-commerce',
        'Hébergement et domaine restant à la charge du client',
        'Modifications importantes de structure après validation de maquette'
      ],
      delays: '15 à 20 jours',
      acompteMin: 550,
      pitch: 'Un site qui aligne votre positionnement réel avec vos mots pour que vos contacts se transforment en clients.',
      icon: <Layers className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'systeme_client',
      name: 'Système Client',
      price: 2500,
      priceSuffix: '+',
      tagline: 'La machine de capture et de rendez-vous automatique.',
      idealClient: 'Infopreneur, agence, formateur, business cherchant à automatiser ses leads.',
      problem: 'Le client perd trop de temps à qualifier ses prospects et à caler des appels manuellement.',
      inclusions: [
        'Site orienté conversion (5 à 8 pages)',
        'Tunnel d\'acquisition simple / Page de capture "Lead Magnet"',
        'Intégration d\'outil de prise de RDV automatique (Calendly/TidyCal)',
        'Chatbot ou questionnaire intelligent de pré-qualification',
        'Automatisation email de bienvenue intégrée',
        'Tracking complet des conversions (Pixel Facebook, GA4)'
      ],
      exclusions: [
        'Rédaction de séquences emails au-delà de 3 emails',
        'Gestion ou budget de campagnes publicitaires',
        'Cession de code source non expressément spécifiée'
      ],
      delays: '25 à 35 jours',
      acompteMin: 800,
      pitch: 'Dépasser le simple site vitrine pour en faire un collaborateur commercial qui qualifie et prend vos rendez-vous 24h/24.',
      icon: <UserCheck className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      price: 1800,
      priceSuffix: '+',
      tagline: 'Le catalogue ou la boutique sans chaos opérationnel.',
      idealClient: 'Créateur de produit physique, marque de vêtements, artisan d\'art, commerçant physique.',
      problem: 'Le client souhaite vendre en direct mais craint le désordre technique des stocks et livraisons.',
      inclusions: [
        'Catalogue en ligne ou boutique complète (jusqu\'à 25 produits configurés)',
        'Intégration Stripe / PayPal sécurisée',
        'Gestionnaire de livraison (Colissimo, Mondial Relay, etc.)',
        'Gestion simple des stocks et alertes',
        'Génération automatique de factures et emails transactionnels'
      ],
      exclusions: [
        'Saisie de centaines de variantes (forfait extra nécessaire)',
        'Production de photographies de produits',
        'Validation légitimes des CGV (à la charge du client)'
      ],
      delays: '30 à 40 jours',
      acompteMin: 600,
      pitch: 'Lancer un canal de vente sécurisé et autonome, avec une interface rassurante pour vos clients.',
      icon: <ShoppingBag className="w-5 h-5 text-purple-500" />
    },
    {
      id: 'funnelhub_signature',
      name: 'FunnelHub Signature',
      price: 4000,
      priceSuffix: '+',
      tagline: 'Le centre d’autorité absolue et multi-offres.',
      idealClient: 'Formateur d\'élite, conférencier, expert reconnu, entrepreneur d\'infoproduit.',
      problem: 'L\'expert a des tunnels éparpillés, une image décousue et n\'arrive pas à valoriser son échelle d\'offres.',
      inclusions: [
        'Architecture globale de marque complète sur-mesure',
        'Foyer d\'autorité central unifiant tous vos tunnels et offres',
        'Storytelling fort et copywriting de haut niveau émotionnel',
        'Intégration de l\'écosystème d\'offres complet (Value Ladder)',
        'Blog / Hub de contenu optimisé',
        'Entonnoir de vente multi-offres intégré',
        'Planification et maintenance renforcées incluses 1 mois'
      ],
      exclusions: [
        'Abonnements logiciels d\'hébergement de tunnel complexes',
        'Frais publicitaires tiers'
      ],
      delays: '45 à 60 jours',
      acompteMin: 1500,
      pitch: 'Installer votre quartier général digital, asseoir votre légitimité de leader et présenter de façon irrésistible l\'ensemble de vos offres.',
      icon: <AwardIcon className="w-5 h-5 text-amber-500" />
    }
  ], []);

  // Modules optionnels
  const modulesAvailable = useMemo(() => [
    { id: 'seo_local', name: 'SEO Local & Fiche GMB', price: 300, desc: 'Optimisation Google Business Profile, mots-clés de ville et avis.' },
    { id: 'branding_simple', name: 'Branding Simple', price: 200, desc: 'Moodboard visuel, palette de 3 couleurs, guides de typographies.' },
    { id: 'logo_simple', name: 'Logo Simple', price: 100, desc: 'Création d\'un logo épuré en formats web haute définition.' },
    { id: 'pack_contenus', name: 'Pack Contenus de Lancement', price: 400, desc: '3 publications réseaux, structure d\'une newsletter, rédaction d\'une FAQ.' },
    { id: 'chatbot_simple', name: 'Chatbot Simple d\'Orientation', price: 250, desc: 'Formulaire de FAQ automatique pour rediriger les clients fatigués d\'attendre.' },
    { id: 'maintenance_mensuelle', name: 'Maintenance & Support (par mois)', price: 90, desc: 'Petites retouches, sécurité mensuelle, rapports de surveillance.' }
  ], []);

  // Pipeline client en 13 étapes
  const pipelineSteps = [
    { num: 1, name: 'Prise de contact', desc: 'Arrivée du lead via WhatsApp, recommandation ou téléphone.', objective: 'Qualifier rapidement si projet viable', doc: 'Message WhatsApp de réponse type' },
    { num: 2, name: 'Appel découverte', desc: 'Échange enregistré de 20-30 min avec accord préalable.', objective: 'Extraire besoins stratégiques, dits et non-dits', doc: 'Script d’appel découverte' },
    { num: 3, name: 'Compte-rendu stratégique', desc: 'Envoi d\'un récapitulatif condensé et de premières directions.', objective: 'Montrer une compréhension absolue', doc: 'Compte-rendu d’appel' },
    { num: 4, name: 'Proposition', desc: 'Recommandation d\'offre cadrée + modules complémentaires.', objective: 'Éviter le devis libre et vague', doc: 'Grille d’offres officielle' },
    { num: 5, name: 'Validation + Acompte', desc: 'Signature formelle du devis et paiement de l’acompte minimum.', objective: 'Bloquer le créneau de production légalement', doc: 'Modèle de devis + clauses en béton' },
    { num: 6, name: 'Questionnaire adapté', desc: 'Envoi de questions chirurgicales selon la thématique.', objective: 'Récupérer le contenu brut pour bosser', doc: 'Questionnaire d\'activité' },
    { num: 7, name: 'Collecte des éléments', desc: 'Mise en place d\'un Google Drive pour centraliser logos, textes et visuels.', objective: 'Éviter le chaos des échanges WhatsApp', doc: 'Checklist client structurée' },
    { num: 8, name: 'Prototype', desc: 'Conception et présentation d\'une première maquette ou page test.', objective: 'Valider la direction visuelle avant déploiement', doc: 'Lien de pré-rendu' },
    { num: 9, name: 'Production', desc: 'Intégration et raccord de l\'ensemble des pages et raccordements.', objective: 'Construire le système digital complet', doc: 'Code & Déploiement Vercel' },
    { num: 10, name: 'Retouches', desc: 'Deux cycles de retouches structurés maximum.', objective: 'Serrer le temps de livraison sans dérives', doc: 'Fiche d’allers-retours client' },
    { num: 11, name: 'Mise en ligne', desc: 'Branchement du domaine client et déploiement en production.', objective: 'Ouvrir les portes au public', doc: 'Passage en direct' },
    { num: 12, name: 'Livraison + Avis', desc: 'Envoi d\'une vidéo de livraison, de consignes, et du lien d\'avis Google.', objective: 'Créer de la preuve sociale instantanée', doc: 'Email de clôture + Demande d\'avis' },
    { num: 13, name: 'Maintenance', desc: 'Support post-livraison cadré ou forfait de surveillance continu.', objective: 'Générer du revenu récurrent', doc: 'Contrat de maintenance mensuelle' }
  ];

  // Playbook des objections
  const objectionsPlaybook = [
    { 
      id: 'cher_3_pages', 
      q: '“800 € pour seulement 3 pages, c’est cher ! Mes confrères font un site complet pour 500 €.”', 
      ans: '« Je comprends tout à fait votre comparaison. La différence, c’est que mes confrères vous vendent un outil vide destiné à rester une brochure invisible. De mon côté, je ne conçois pas seulement des pages : je configure une présence visible. À 800 €, vous intégrez le SEO local de base pour être trouvé par vos clients de proximité, un appel à l\'action direct via WhatsApp pour capter les demandes immédiatement, et un cadrage de message qui rassure. C’est un investissement commercial actif, pas une brochure passive. »',
      tip: 'Insister sur l\'aspect actif (WhatsApp, SEO, design mobile pro) par rapport à un site inerte.'
    },
    { 
      id: 'cycles_retouches', 
      q: '“Pourquoi limiter les retouches à 2 cycles maximum ? Je veux pouvoir retoucher à l\'infini.”', 
      ans: '« C’est justement pour protéger vos propres délais. Plus un projet s’éternise dans les détails, plus l’ouverture de votre business en ligne est retardée. En limitant à 2 cycles, nous nous focalisons sur ce qui compte vraiment. Nous présentons d’abord un prototype de style pour valider le visuel général, puis nous faisons une relecture complète. Cela nous permet de livrer un projet efficace en moins de 10 jours. Tout changement de direction majeur hors brief est bien sûr possible, mais fera l’objet d’un devis complémentaire. »',
      tip: 'Expliquer que la limite protège LEUR temps et garantit une mise en ligne rapide.'
    },
    { 
      id: 'nom_domaine', 
      q: '“Le nom de domaine et l’hébergement ne sont pas compris dans les 800 € ?”', 
      ans: '« Non, et c’est une sécurité pour vous. Je refuse que vous soyez otage technique de mon agence. Le nom de domaine et l’abonnement d’hébergement (environ 20 à 60 € par an) sont souscrits à votre nom, avec vos propres informations de paiement. Ainsi, vous restez l’unique propriétaire légitime de votre site. Je vous accompagne pas à pas lors du branchement pour que l’opération se fasse en toute simplicité en 5 minutes. »',
      tip: 'Tourner l\'exclusion en argument de souveraineté et de sécurité pour le client.'
    },
    { 
      id: 'paiement_plusieurs', 
      q: '“Puis-je payer en plusieurs fois, ou au résultat ?”', 
      ans: '« Pour tout projet, un acompte est obligatoire pour réserver le créneau stratégique dans notre calendrier de production. En revanche, pour faciliter votre trésorerie, nous proposons des facilités de paiement sans frais selon le montant du projet (par exemple, 1 acompte de 200 € au démarrage et le solde échelonné sur 2 à 3 fois). La mise en ligne finale intervient une fois que l’accord de règlement convenu a été validé. »',
      tip: 'Refuser catégoriquement le paiement "au résultat". Cadrer l\'échelonnement réglementé.'
    },
    { 
      id: 'pas_textes', 
      q: '“Je n\'ai pas le temps de rédiger les textes, pouvez-vous tout inventer ?”', 
      ans: '« Un site sans votre authenticité ne convertira jamais. Vos textes doivent refléter vos mots. Cependant, je sais que la page blanche fait peur. C’est pourquoi avec l\'offre Présence Essentielle, je ne vous laisse pas seul : je vous fournis des structures de textes à trous, basées sur nos échanges d\'appel. Si vous voulez déléguer entièrement la plume pour un style percutant et professionnel, je vous invite à ajouter le module "copywriting de positionnement" de notre gamme. »',
      tip: 'Vendre l\'esprit collaboratif de l\'offre de base ou orienter vers un module d\'option payante.'
    }
  ];

  // Clauses contractuelles
  const clausesContractuelles = [
    {
      title: 'Acompte obligatoire avant démarrage',
      text: 'Le projet de production démarre officiellement uniquement après la signature formelle du présent devis et la réception validée du versement de l’acompte minimum convenu de [MONTANT_ACOMPTE] €. Aucun créneau de développement ne pourra être bloqué en l’absence de ce paiement.',
      usage: 'À placer en premier dans les conditions financières du devis.'
    },
    {
      title: 'Cadrage des cycles de retouche',
      text: 'Le tarif proposé comprend par défaut un maximum de 2 cycles complets de retouches et corrections mineures par phase de validation (maquette initiale et mise en ligne). Toute modification de structure, ajout de pages imprévues ou changement d\'orientation artistique demandé après validation écrite donnera lieu à l’émission d’un avenant pécuniaire payant.',
      usage: 'Indispensable pour éviter que le projet dérape financièrement.'
    },
    {
      title: 'Abonnements et nom de domaine à la charge exclusive du client',
      text: 'Les frais relatifs à l\'achat, au renouvellement et à l\'hébergement du nom de domaine, ainsi que les éventuelles licences de plug-ins payants, restent à la charge exclusive du client. Nümtema Agency assurera l’assistance de raccordement technique mais la facturation directe incombe au souscripteur.',
      usage: 'Idéal pour lever toute ambiguïté sur les coûts récurrents tiers.'
    },
    {
      title: 'Propriété technique et absence de cession automatique de code',
      text: 'Le site web est livré prêt à l’emploi via l\'URL finale spécifiée. La cession exclusive des lignes de code source brutes ou l\'accès total de développeur externe n’est pas comprise par défaut dans la prestation de base, sauf dérogation validée d\'un accord contractuel écrit express.',
      usage: 'Protège votre savoir-faire technique contre le pillage.'
    }
  ];

  // Simulator core calculations
  const simulationData = useMemo(() => {
    const baseOffer = offersList.find(o => o.id === selectedBaseOfferId);
    if (!baseOffer) return { total: 0, acompte: 0, balance: 0, installmentsList: [] };

    const basePrice = baseOffer.price;
    const modulePrice = selectedModules.reduce((sum, modId) => {
      const p = modulesAvailable.find(m => m.id === modId);
      return sum + (p ? p.price : 0);
    }, 0);

    const total = basePrice + modulePrice;

    // Acompte minimum logic based on official payments terms rule
    // - 800€: 200€
    // - 1200€: 300€
    // - 1500€: 500€
    // - 1800€: 600€
    // - 3000€: 1000€
    // - 4000€: 1500€
    // - 5000€: 2000€
    let acompte = 200;
    if (total >= 5000) acompte = Math.round(total * 0.4);
    else if (total >= 4000) acompte = 1500;
    else if (total >= 3000) acompte = 1000;
    else if (total >= 1800) acompte = 600;
    else if (total >= 1500) acompte = 500;
    else if (total >= 1200) acompte = 400;
    else if (total >= 1000) acompte = 300;
    else acompte = baseOffer.acompteMin;

    const balance = total - acompte;

    // Payment split breakdown
    const installmentsList = [];
    const validCount = Math.min(paymentInstallments, total >= 3000 ? 10 : (total >= 1500 ? 5 : 3));
    
    installmentsList.push({ count: 1, label: 'Acompte immédiat (Lancement de production)', amount: acompte });
    
    if (validCount > 1) {
      const restPercent = balance / (validCount - 1);
      for (let i = 2; i <= validCount; i++) {
        let text = `Échéance ${i}`;
        if (i === validCount) {
          text = `Échéance ${i} (Solde à la mise en ligne)`;
        } else {
          text = `Échéance ${i} (En cours de production)`;
        }
        installmentsList.push({
          count: i,
          label: text,
          amount: Math.round(restPercent)
        });
      }
    } else {
      installmentsList.push({ count: 2, label: 'Solde final à la livraison', amount: balance });
    }

    // Commercial proposal preview string
    const offerNames: Record<string, string> = {
      presence_essentielle: 'Présence Essentielle',
      presence_pro: 'Présence Pro',
      systeme_client: 'Système Client',
      ecommerce: 'E-commerce',
      funnelhub_signature: 'FunnelHub Signature'
    };

    const modsText = selectedModules.length > 0 
      ? `\nModules complémentaires activés :\n` + selectedModules.map(m => ` - ${modulesAvailable.find(mod => mod.id === m)?.name} (${modulesAvailable.find(mod => mod.id === m)?.price} €)`).join('\n')
      : '';

    const splitText = validCount > 1
      ? `\nFacilités de paiement en ${validCount} fois découpées comme suit :\n` + installmentsList.map((i, idx) => ` - Échéance ${idx+1} : ${i.amount} € (${i.label})`).join('\n')
      : `\nConditions de règlement : ${acompte} € d'acompte au lancement, et le solde de ${balance} € à la mise en ligne.`;

    const proposalMarkdown = `Bonjour,

Folie, j'ai le plaisir de vous transmettre notre proposition d'accompagnement sur-mesure pour votre projet.

Formule sélectionnée : Offre ${offerNames[selectedBaseOfferId]} (${basePrice} €)${modsText}

Montant Total de l'accompagnement : ${total} € HT

${splitText}

Règles de cadrage Nümtema Agency :
- Le démarrage de la production intervient après signature du devis et validation du virement d'acompte.
- 2 cycles de retouches maximum sont compris pour figer l'excellence visuelle et préserver votre calendrier de livraison.
- L'achat légitime de votre adresse hébergement et nom de domaine reste à votre charge directe (vous restez souverain).

Je reste disponible d'un message pour caler notre coup d'envoi.

Chaleureusement,
La production Nümtema`;

    return { total, acompte, balance, installmentsList, proposalMarkdown, validCount };
  }, [selectedBaseOfferId, selectedModules, paymentInstallments, offersList, modulesAvailable]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 select-none" id="commercial-architecture-pane">
      {/* Dynamic Upper Hero */}
      <div className={`p-6 rounded-2xl border mb-6 relative overflow-hidden backdrop-blur-md shadow-lg transition-all ${
        isDark 
          ? 'bg-gradient-to-r from-blue-950/20 via-[#0a142c]/50 to-[#030712] border-white/[0.05]' 
          : 'bg-white border-slate-200/80 shadow-slate-100'
      }`}>
        <div className="absolute top-0 right-0 w-[300px] h-full bg-blue-600/5 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 pr-6">
            <div className={`text-[10px] uppercase font-black tracking-widest font-mono inline-flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg border ${
              isDark ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Référentiel Stratégique Nümtema</span>
            </div>
            <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Architecture Commerciale & Process Client
            </h2>
            <p className={`text-xs md:text-sm font-medium max-w-3xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Visualisez la grille des offres officielles de l’agence, simulez les acompte et plans de règlement à la volée, exploitez le guide de désamorçage d’objections et conservez des contrats sains de 800 € à 5000 €+.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 border p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.02]">
            {(['offers', 'pipeline', 'discovery', 'questionnaire', 'objections', 'clauses'] as const).map(tab => {
              const label = { 
                offers: 'Offres & Simulateur', 
                pipeline: 'Process 13 Étapes', 
                discovery: 'Appel Découverte 💡', 
                questionnaire: 'Questionnaires Cadrage 📑',
                objections: 'Objections Playbook', 
                clauses: 'Clauses Béton' 
              }[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-xs font-black tracking-wide rounded-lg cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-sky-450 text-neutral-950 font-black shadow-md'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-650 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {copiedText && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white text-xs font-black tracking-widest uppercase px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Contenu {copiedText} copié !</span>
        </div>
      )}

      {/* VIEWPORT 1: OFFERS & DYNAMIC CALCULATOR SIMULATOR */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          {/* List of Offers and Specifications */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            {offersList.map(offer => {
              const isActive = selectedOfferId === offer.id;
              return (
                <button
                  key={offer.id}
                  onClick={() => setSelectedOfferId(offer.id)}
                  className={`p-4 rounded-xl text-left border flex flex-col justify-between transition-all relative ${
                    isActive 
                      ? isDark 
                        ? 'bg-sky-500/10 border-sky-500/40 text-sky-450 shadow-[0_0_15px_rgba(56,189,248,0.08)]' 
                        : 'bg-blue-50/80 border-blue-400/80 text-blue-900 shadow-sm'
                      : isDark
                        ? 'bg-[#0a0f21]/40 border-white/[0.04] hover:bg-[#0c132b]/80 hover:border-white/[0.08] text-zinc-400'
                        : 'bg-white border-slate-200/70 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-lg border ${
                        isActive 
                          ? 'bg-sky-500/10 border-sky-400/20' 
                          : isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-slate-50 border-slate-200/50'
                      }`}>
                        {offer.icon}
                      </div>
                      <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${
                        isActive 
                          ? 'bg-sky-500/15 text-sky-400 dark:text-sky-300' 
                          : isDark ? 'bg-white/5 text-zinc-500' : 'bg-slate-100 text-slate-500'
                      }`}>
                        MIN. {offer.acompteMin}€
                      </span>
                    </div>
                    
                    <div className="min-w-0">
                      <h3 className={`font-black tracking-tight text-sm truncate ${
                        isActive 
                          ? isDark ? 'text-white' : 'text-blue-950' 
                          : isDark ? 'text-zinc-200' : 'text-slate-800'
                      }`}>{offer.name}</h3>
                      <p className={`text-[10px] truncate leading-none mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{offer.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mt-3 pt-3 border-t border-dashed border-zinc-200/10 dark:border-zinc-800/80 w-full">
                    <span className="text-[10px] uppercase font-bold text-zinc-550 dark:text-zinc-500">DÈS</span>
                    <span className={`text-base font-black font-mono ${isActive ? 'text-blue-600 dark:text-sky-400' : 'text-zinc-300 dark:text-zinc-400'}`}>
                      {offer.price} €{offer.priceSuffix}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Show details for selected offer inside a beautifully robust dashboard panel */}
          {(() => {
            const offer = offersList.find(o => o.id === selectedOfferId)!;
            return (
              <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 rounded-2xl border ${
                isDark ? 'bg-[#091122]/60 border-white/[0.04]' : 'bg-white border-slate-200/70 shadow-sm'
              }`}>
                {/* Specific features column */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-sky-500/10 border border-sky-400/15">
                      {offer.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{offer.name} <span className="text-sm font-semibold text-zinc-500">— {offer.price} €{offer.priceSuffix}</span></h3>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{offer.tagline}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Inclusions de l’offre
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {offer.inclusions.map((inc, i) => (
                          <li key={i} className="text-xs font-semibold flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 select-none shrink-0" />
                            <span className={isDark ? 'text-zinc-300' : 'text-slate-650'}>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5 ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Exclusions de base
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {offer.exclusions.map((exc, i) => (
                          <li key={i} className="text-xs font-semibold flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 select-none shrink-0" />
                            <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Operations constraints for contracts */}
                <div className={`lg:col-span-2 p-5 rounded-xl space-y-4 border ${
                  isDark ? 'bg-black/30 border-white/[0.04]' : 'bg-slate-50/50 border-slate-150'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-widest font-mono ${isDark ? 'text-sky-400' : 'text-blue-700'}`}>Cadrage Commercial & Contractuel</h4>
                  
                  <div className="space-y-3 divide-y divide-zinc-200/10 dark:divide-zinc-805/40 text-xs">
                    <div className="flex justify-between py-2 items-center">
                      <span className="font-bold text-zinc-500 dark:text-zinc-450">Acompte Minimum Obligatoire</span>
                      <span className={`font-black font-mono px-2 py-1 rounded ${isDark ? 'bg-sky-500/10 text-sky-400' : 'bg-blue-105 text-blue-700'}`}>{offer.acompteMin} €</span>
                    </div>

                    <div className="flex justify-between py-2 items-center">
                      <span className="font-bold text-zinc-500 dark:text-zinc-450">Délai estimé de livraison</span>
                      <span className={`font-black flex items-center gap-1 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {offer.delays}
                      </span>
                    </div>

                    <div className="flex flex-col py-2 gap-1.5">
                      <span className="font-bold text-zinc-500 dark:text-zinc-450">Cible & Client Idéal</span>
                      <span className={`font-bold leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{offer.idealClient}</span>
                    </div>

                    <div className="flex flex-col py-2 gap-1.5">
                      <span className="font-bold text-zinc-500 dark:text-zinc-450">Problème d&apos;affaires résolu</span>
                      <span className={`font-bold leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{offer.problem}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleCopy(
`Proposition d'accompagnement Nümtema : Offre ${offer.name} (${offer.price} €)
- Inclusions : ${offer.inclusions.join(', ')}
- Hors Domaine et hébergement.
- Échéances de règlement : ${offer.acompteMin} d'acompte initial, solde à la livraison.`,
                        `${offer.name}`
                      )}
                      className={`w-full py-2 border rounded-xl font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isDark 
                          ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] text-slate-300' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Copier la fiche condensée</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* DYNAMIC PITCH & ACCELERATE PLAYGROUND SIMULATOR */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className={`w-5 h-5 ${isDark ? 'text-sky-400' : 'text-blue-500'}`} />
              <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Simulateur de Devis & Échelonnement de Paiement</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Panel: Build Quote Options */}
              <div className={`lg:col-span-3 p-5 rounded-2xl border space-y-5 ${
                isDark ? 'bg-black/20 border-white/[0.04]' : 'bg-white border-slate-205 shadow-sm'
              }`}>
                <h4 className={`text-xs font-black uppercase tracking-widest font-mono ${isDark ? 'text-zinc-450' : 'text-slate-500'}`}>Étape 1 : Choisir la Formule de Base</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {offersList.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedBaseOfferId(item.id);
                        // reset selected modules that might not make sense or trigger compatible check
                      }}
                      className={`p-3 border rounded-xl text-left transition-all ${
                        selectedBaseOfferId === item.id
                          ? isDark 
                            ? 'bg-sky-500/10 border-sky-405 text-sky-400' 
                            : 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                          : isDark
                            ? 'bg-white/[0.02] border-white/[0.04] text-zinc-400 hover:border-white/[0.06]'
                            : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      <div className="text-xs font-black truncate">{item.name}</div>
                      <div className="text-[11px] font-mono mt-1 opacity-80">{item.price} €</div>
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className={`text-xs font-black uppercase tracking-widest font-mono ${isDark ? 'text-zinc-450' : 'text-slate-500'}`}>Étape 2 : Activer des Modules et Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {modulesAvailable.map(mod => {
                      const isChecked = selectedModules.includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedModules(prev => prev.filter(id => id !== mod.id));
                            } else {
                              setSelectedModules(prev => [...prev, mod.id]);
                            }
                          }}
                          className={`p-3 border rounded-xl text-left transition-all flex justify-between items-start ${
                            isChecked
                              ? isDark 
                                ? 'bg-sky-500/10 border-sky-505/30 text-sky-400' 
                                : 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold shadow-sm'
                              : isDark
                                ? 'bg-white/[0.02] border-white/[0.04] text-zinc-400 hover:border-white/[0.06]'
                                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="space-y-1 pr-4">
                            <span className="text-xs font-extrabold flex items-center gap-1.5">
                              {isChecked && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                              {mod.name}
                            </span>
                            <p className={`text-[10px] leading-tight-short ${isDark ? 'text-zinc-500' : 'text-slate-450'}`}>{mod.desc}</p>
                          </div>
                          <span className="text-xs font-mono font-black shrink-0">+{mod.price}€</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Steps slider based on installment eligibility rules */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-xs font-black uppercase tracking-widest font-mono ${isDark ? 'text-zinc-455' : 'text-slate-500'}`}>Étape 3 : Échelonnement possible</h4>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-550">Éligibilité automatique</span>
                  </div>

                  <div className="flex gap-2">
                    {[2, 3, 5, 10].map(count => {
                      const baseOffer = offersList.find(o => o.id === selectedBaseOfferId);
                      const isEligible = count === 2 
                        || (count === 3 && simulationData.total >= 800)
                        || (count === 5 && simulationData.total >= 1500)
                        || (count === 10 && simulationData.total >= 3000);

                      const isSelected = paymentInstallments === count && isEligible;

                      return (
                        <button
                          key={count}
                          disabled={!isEligible}
                          onClick={() => setPaymentInstallments(count)}
                          className={`flex-1 py-2.5 border rounded-xl text-center text-xs font-black transition-all relative ${
                            !isEligible
                              ? 'opacity-30 cursor-not-allowed border-dashed bg-transparent text-zinc-600'
                              : isSelected
                                ? isDark 
                                  ? 'bg-sky-500/10 border-sky-400 text-sky-400 shadow-md' 
                                  : 'bg-blue-60 to-blue-50 border-blue-400 text-blue-900 border-2'
                                : isDark
                                  ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] text-zinc-400'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                          }`}
                        >
                          <span>{count} fois</span>
                          {isSelected && <span className="absolute -top-1.5 -right-1 bg-emerald-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[9px] border border-white">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className={`text-[10px] italic ${isDark ? 'text-zinc-500' : 'text-slate-450'}`}>
                    * 3 fois dès 800 €, 5 fois dès 1500 €, 10 fois dès 3000 € d&apos;après notre grille de facilités interne.
                  </p>
                </div>
              </div>

              {/* Right Panel: Render results */}
              <div className={`lg:col-span-2 p-5 rounded-2xl border space-y-5 flex flex-col justify-between ${
                isDark ? 'bg-[#091122]/80 border-white/[0.04]' : 'bg-slate-50 border-slate-200/80 shadow-inner'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-black uppercase tracking-widest font-mono ${isDark ? 'text-sky-400' : 'text-blue-700'}`}>Bilan Budgétaire Proposition</h4>
                    <span className="p-1 rounded bg-[#0fa5e9]/5 border border-[#38bdf8]/10 text-sky-400"><Coins className="w-4 h-4" /></span>
                  </div>

                  {/* Financial results */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-450">Budget Global Prestation</span>
                      <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{simulationData.total} €</span>
                    </div>

                    <div className="h-[1px] bg-dashed bg-zinc-200/10 dark:bg-zinc-805/40 my-1" />

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-black tracking-widest font-mono text-zinc-500 dark:text-zinc-500">Calendrier des encaissements</span>
                      
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {simulationData.installmentsList.map((inst, index) => (
                          <div key={index} className={`p-2.5 rounded-xl border flex justify-between items-center text-xs font-semibold ${
                            index === 0
                              ? isDark ? 'bg-sky-500/5 border-sky-500/15 text-sky-400' : 'bg-blue-50/60 border-blue-200 text-blue-700'
                              : isDark ? 'bg-white/[0.02] border-white/[0.04] text-zinc-350' : 'bg-white border-slate-200/80 text-slate-700 shadow-sm'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 text-[9px] font-black rounded-full flex items-center justify-center border shrink-0 ${
                                index === 0 
                                  ? 'bg-sky-500/10 border-sky-400 dark:text-sky-300' 
                                  : 'bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700'
                              }`}>{inst.count}</span>
                              <span className="truncate max-w-[170px]">{inst.label}</span>
                            </div>
                            <span className="font-mono font-black shrink-0">{inst.amount} €</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Markdown text copied action */}
                <div className="space-y-2 pt-4">
                  <div className={`p-3 rounded-xl border font-mono text-[9.5px] leading-relaxed select-text overflow-y-auto h-24 ${
                    isDark ? 'bg-black/40 border-white/[0.04] text-sky-400/80' : 'bg-white border-slate-200/80 text-slate-600'
                  }`}>
                    {simulationData.proposalMarkdown.substring(0, 150)}...
                    <div className="text-[8px] uppercase tracking-wider font-extrabold text-zinc-500 mt-2">Texte de proposition complet prêt à copier pour WhatsApp / Devis</div>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(simulationData.proposalMarkdown, 'Proposition')}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-sky-405 to-cyan-405 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-102 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier la proposition commerciale</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
            {/* VIEWPORT: INTEGRATED CO-QUESTIONNAIRES ROADMAP 10.1 & 10.2 */}
      {activeTab === 'questionnaire' && (
        <div className="space-y-6 animate-slide-in">
          {/* Header & Main Switcher */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-zinc-200/5 pb-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] uppercase font-black tracking-widest font-mono px-2 py-0.5 rounded ${
                  selectedQuestionnaireType === 'local' 
                    ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                    : selectedQuestionnaireType === 'vitrine'
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                      : selectedQuestionnaireType === 'formation'
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                }`}>
                  {selectedQuestionnaireType === 'local' 
                    ? 'Document 10.1 — Nümtema Local' 
                    : selectedQuestionnaireType === 'vitrine'
                      ? 'Document 10.2 — Nümtema Vitrine'
                      : selectedQuestionnaireType === 'formation'
                        ? 'Document 10.3-A — Formation & LMS'
                        : selectedQuestionnaireType === 'coach'
                          ? 'Document 10.3-B — Coach & Thérapeute'
                          : 'Document 10.4 — Nümtema E-commerce'}
                </span>
                <span className={`text-[9.5px] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                  • Cadrage Scientifique & Copywriting
                </span>
              </div>
              <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedQuestionnaireType === 'local' 
                  ? 'Questionnaire Visibilité Locale & Cadrage Projet' 
                  : selectedQuestionnaireType === 'vitrine'
                    ? 'Questionnaire de Cadrage Site Vitrine & Autorité'
                    : selectedQuestionnaireType === 'formation'
                      ? 'Questionnaire d\'Ingénierie Pédagogique (Formation)'
                      : selectedQuestionnaireType === 'coach'
                        ? 'Questionnaire Posture & Accompagnement (Coach)'
                        : 'Questionnaire E-commerce (Catalogue & Boutique)'}
              </h3>
            </div>

            {/* Switcher Pills between 10.1, 10.2, 10.3-A, 10.3-B */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1 border p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.01]">
                <button
                  onClick={() => {
                    setSelectedQuestionnaireType('local');
                    setActiveQuestSection('meta');
                  }}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    selectedQuestionnaireType === 'local'
                      ? 'bg-purple-600/15 border border-purple-500/30 text-purple-400 font-extrabold'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  📍 Local (10.1)
                </button>
                <button
                  onClick={() => {
                    setSelectedQuestionnaireType('vitrine');
                    setActiveQuestSection('meta');
                  }}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    selectedQuestionnaireType === 'vitrine'
                      ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-extrabold'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  🌐 Vitrine (10.2)
                </button>
                <button
                  onClick={() => {
                    setSelectedQuestionnaireType('formation');
                    setActiveQuestSection('meta');
                  }}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    selectedQuestionnaireType === 'formation'
                      ? 'bg-amber-600/15 border border-amber-500/30 text-amber-500 font-extrabold'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  🎓 Formation (10.3A)
                </button>
                <button
                  onClick={() => {
                    setSelectedQuestionnaireType('coach');
                    setActiveQuestSection('meta');
                  }}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    selectedQuestionnaireType === 'coach'
                      ? 'bg-emerald-600/15 border border-emerald-500/30 text-emerald-500 font-extrabold'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  🌱 Coach (10.3B)
                </button>
                <button
                  onClick={() => {
                    setSelectedQuestionnaireType('ecommerce');
                    setActiveQuestSection('meta');
                  }}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    selectedQuestionnaireType === 'ecommerce'
                      ? 'bg-sky-600/15 border border-sky-500/30 text-sky-500 font-extrabold'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  🛒 E-commerce (10.4)
                </button>
              </div>

              {selectedQuestionnaireType === 'local' ? (
                <button
                  onClick={handleLoadExample}
                  className="px-3 py-2 bg-purple-600/15 border border-purple-500/30 hover:bg-purple-600/25 text-purple-400 font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Exemple Artisan</span>
                </button>
              ) : selectedQuestionnaireType === 'vitrine' ? (
                <button
                  onClick={handleLoadExampleVitrine}
                  className="px-3 py-2 bg-indigo-600/15 border border-indigo-500/30 hover:bg-indigo-600/25 text-indigo-400 font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Exemple Consultant</span>
                </button>
              ) : selectedQuestionnaireType === 'formation' ? (
                <button
                  onClick={handleLoadExampleFormation}
                  className="px-3 py-2 bg-amber-600/15 border border-amber-500/30 hover:bg-amber-600/25 text-amber-500 font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Exemple LMS</span>
                </button>
              ) : selectedQuestionnaireType === 'coach' ? (
                <button
                  onClick={handleLoadExampleCoach}
                  className="px-3 py-2 bg-emerald-600/15 border border-emerald-500/30 hover:bg-emerald-600/25 text-emerald-500 font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Exemple Coach</span>
                </button>
              ) : (
                <button
                  onClick={handleLoadExampleEcommerce}
                  className="px-3 py-2 bg-sky-600/15 border border-sky-500/30 hover:bg-sky-600/25 text-sky-500 font-black text-xs uppercase tracking-wide rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Exemple Shop</span>
                </button>
              )}

              <button
                onClick={selectedQuestionnaireType === 'local' ? handleClearAll : selectedQuestionnaireType === 'vitrine' ? handleClearAllVitrine : selectedQuestionnaireType === 'formation' ? handleClearAllFormation : selectedQuestionnaireType === 'coach' ? handleClearAllCoach : handleClearAllEcommerce}
                className={`px-3 py-2 border rounded-xl font-bold text-xs uppercase tracking-wide transition-all cursor-pointer ${
                  isDark 
                    ? 'border-white/5 hover:bg-white/5 text-zinc-450' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-550'
                }`}
              >
                Vider
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column: Vertical Sub-tab Navigator (Category Switcher) */}
            <div className="xl:col-span-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block px-1">
                SECTIONS DU CADRAGE
              </span>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-1 bg-black/[0.1] dark:bg-white/[0.01] p-1.5 border rounded-2xl">
                {currentSubSections.map(sub => {
                  const isActive = activeQuestSection === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveQuestSection(sub.id)}
                      className={`px-3 py-2 text-left rounded-xl cursor-pointer transition-all flex flex-col gap-0.5 border ${
                        isActive
                          ? selectedQuestionnaireType === 'local'
                            ? 'bg-purple-600/15 border-purple-500/30 text-purple-400 font-extrabold shadow-sm'
                            : selectedQuestionnaireType === 'vitrine'
                              ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400 font-extrabold shadow-sm'
                              : selectedQuestionnaireType === 'formation'
                                ? 'bg-amber-600/15 border-amber-500/30 text-amber-500 font-extrabold shadow-sm'
                                : 'bg-emerald-600/15 border-emerald-500/30 text-emerald-500 font-extrabold shadow-sm'
                          : isDark 
                            ? 'border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]' 
                            : 'border-transparent text-slate-655 hover:text-slate-950 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-black tracking-tight">{sub.label}</span>
                      <span className="text-[9px] font-medium opacity-60 leading-none truncate block md:hidden xl:block">
                        {sub.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle Column: Interactive Form & inputs according to active section */}
            <div className="xl:col-span-5 space-y-4">
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-black/20 border-white/[0.04]' : 'bg-white border-slate-205 shadow-sm'} space-y-4`}>
                
                {/* SECTION: METADATA */}
                {activeQuestSection === 'meta' && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="space-y-0.5">
                      <h4 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Infos Client & Dossier Associé
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Paramétrez l&apos;en-tête du document officiel raccordé à la facturation.
                      </p>
                    </div>

                    <div className="space-y-3.5 pt-2 text-xs font-semibold">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Nom de l’entreprise / Enseigne :</label>
                        <input
                          type="text"
                          value={questMeta.companyName}
                          onChange={(e) => setQuestMeta(prev => ({ ...prev, companyName: e.target.value }))}
                          placeholder="Ex: Boulangerie Traditionnelle, ConsultFlow"
                          className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                            isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Nom du référent projet :</label>
                        <input
                          type="text"
                          value={questMeta.referentName}
                          onChange={(e) => setQuestMeta(prev => ({ ...prev, referentName: e.target.value }))}
                          placeholder="Ex: Sébastien Dubois, Adrien Martin"
                          className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                            isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Téléphone / WhatsApp :</label>
                          <input
                            type="text"
                            value={questMeta.phoneWhatsapp}
                            onChange={(e) => setQuestMeta(prev => ({ ...prev, phoneWhatsapp: e.target.value }))}
                            placeholder="Ex: 06 45 43 42 64"
                            className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Email de contact :</label>
                          <input
                            type="text"
                            value={questMeta.contactEmail}
                            onChange={(e) => setQuestMeta(prev => ({ ...prev, contactEmail: e.target.value }))}
                            placeholder="Ex: contact@acrobat-lehavre.fr"
                            className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Ville principale de prestation :</label>
                          <input
                            type="text"
                            value={questMeta.mainCity}
                            onChange={(e) => setQuestMeta(prev => ({ ...prev, mainCity: e.target.value }))}
                            placeholder="Ex: Le Havre, Paris"
                            className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Date de remplissage :</label>
                          <input
                            type="text"
                            value={questMeta.fillingDate}
                            onChange={(e) => setQuestMeta(prev => ({ ...prev, fillingDate: e.target.value }))}
                            placeholder="Ex: 01/06/2026"
                            className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>

                      {selectedQuestionnaireType === 'vitrine' && (
                        <div className="flex flex-col gap-1.5 animate-fade-in">
                          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Activité principale de l&apos;indépendant :</label>
                          <input
                            type="text"
                            value={questMeta.mainActivity}
                            onChange={(e) => setQuestMeta(prev => ({ ...prev, mainActivity: e.target.value }))}
                            placeholder="Ex: Consultant No-Code, Graphiste, Avocat"
                            className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Offre ou devis associé :</label>
                        <select
                          value={questMeta.associatedQuote}
                          onChange={(e) => setQuestMeta(prev => ({ ...prev, associatedQuote: e.target.value }))}
                          className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-sky-445 ${
                            isDark ? 'bg-[#0b1022] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="Présence Essentielle - 800 €">Présence Essentielle - 800 €</option>
                          <option value="Présence Pro - 1500 €">Présence Pro - 1500 €</option>
                          <option value="Système Client - 2200 €">Système Client - 2200 €</option>
                          <option value="Sur-mesure / Multi-sites">Sur-mesure / Multi-sites</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* LOOP SECTIONS (1-10, 1-11 or 1-13 except page structures/checklists/reco/invite) */}
                {selectedQuestionnaireType === 'local' ? (
                  localQuestSections.some(s => s.id === activeQuestSection) && (() => {
                    const sect = localQuestSections.find(s => s.id === activeQuestSection)!;
                    return (
                      <div className="space-y-4 animate-slide-in">
                        <div className="space-y-1">
                          <h4 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {sect.title}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {sect.desc}
                          </p>
                        </div>

                        <div className="space-y-4 pt-2 divide-y divide-zinc-200/5 dark:divide-zinc-850/40">
                          {sect.questions.map((q) => (
                            <div key={q.num} className="flex flex-col gap-2 pt-3 first:pt-0 border-none">
                              <div className="flex justify-between items-start gap-4">
                                <span className={`text-xs font-black tracking-tight leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                  Q{q.num}. {q.text}
                                </span>
                                
                                <button
                                  onClick={() => {
                                    setQuestAnswers(prev => ({
                                      ...prev,
                                      [q.num]: q.example
                                    }));
                                  }}
                                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
                                    isDark 
                                      ? 'bg-purple-950/20 border-purple-800/30 text-purple-400 hover:bg-purple-900/30' 
                                      : 'bg-purple-50 border-purple-150 text-purple-705 hover:bg-purple-100'
                                  }`}
                                  title="Charger la réponse modèle dans ce champ"
                                >
                                  💡 Exemple
                                </button>
                              </div>

                              <textarea
                                value={questAnswers[q.num] || ''}
                                onChange={(e) => {
                                  setQuestAnswers(prev => ({
                                    ...prev,
                                    [q.num]: e.target.value
                                  }));
                                }}
                                placeholder={q.placeholder}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-xl font-medium text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 ${
                                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                ) : selectedQuestionnaireType === 'vitrine' ? (
                  vitrineQuestSections.some(s => s.id === activeQuestSection && s.id !== 'sect6') && (() => {
                    const sect = vitrineQuestSections.find(s => s.id === activeQuestSection)!;
                    return (
                      <div className="space-y-4 animate-slide-in">
                        <div className="space-y-1">
                          <h4 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {sect.title}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {sect.desc}
                          </p>
                        </div>

                        <div className="space-y-4 pt-2 divide-y divide-zinc-200/5 dark:divide-zinc-850/40">
                          {sect.questions.map((q) => (
                            <div key={q.num} className="flex flex-col gap-2 pt-3 first:pt-0 border-none">
                              <div className="flex justify-between items-start gap-4">
                                <span className={`text-xs font-black tracking-tight leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                  Q{q.num}. {q.text}
                                </span>
                                
                                <button
                                  onClick={() => {
                                    setQuestAnswersVitrine(prev => ({
                                      ...prev,
                                      [q.num]: q.example
                                    }));
                                  }}
                                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
                                    isDark 
                                      ? 'bg-indigo-950/20 border-indigo-800/30 text-indigo-400 hover:bg-indigo-900/30' 
                                      : 'bg-indigo-50 border-indigo-150 text-indigo-705 hover:bg-indigo-100'
                                  }`}
                                  title="Charger la réponse modèle dans ce champ"
                                >
                                  💡 Exemple
                                </button>
                              </div>

                              <textarea
                                value={questAnswersVitrine[q.num] || ''}
                                onChange={(e) => {
                                  setQuestAnswersVitrine(prev => ({
                                    ...prev,
                                    [q.num]: e.target.value
                                  }));
                                }}
                                placeholder={q.placeholder}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-xl font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-450 focus:border-indigo-450 ${
                                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                ) : selectedQuestionnaireType === 'formation' ? (
                  formationQuestSections.some(s => s.id === activeQuestSection && s.id !== 'sect9') && (() => {
                    const sect = formationQuestSections.find(s => s.id === activeQuestSection)!;
                    return (
                      <div className="space-y-4 animate-slide-in">
                        <div className="space-y-1">
                          <h4 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {sect.title}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {sect.desc}
                          </p>
                        </div>

                        <div className="space-y-4 pt-2 divide-y divide-zinc-200/5 dark:divide-zinc-850/40">
                          {sect.questions.map((q) => (
                            <div key={q.num} className="flex flex-col gap-2 pt-3 first:pt-0 border-none">
                              <div className="flex justify-between items-start gap-4">
                                <span className={`text-xs font-black tracking-tight leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                  Q{q.num}. {q.text}
                                </span>
                                
                                <button
                                  onClick={() => {
                                    setQuestAnswersFormation(prev => ({
                                      ...prev,
                                      [q.num]: q.example
                                    }));
                                  }}
                                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
                                    isDark 
                                      ? 'bg-amber-950/20 border-amber-850/30 text-amber-400 hover:bg-amber-900/30' 
                                      : 'bg-amber-50 border-amber-150 text-amber-600 hover:bg-amber-100'
                                  }`}
                                  title="Charger la réponse modèle dans ce champ"
                                >
                                  💡 Exemple
                                </button>
                              </div>

                              <textarea
                                value={questAnswersFormation[q.num] || ''}
                                onChange={(e) => {
                                  setQuestAnswersFormation(prev => ({
                                    ...prev,
                                    [q.num]: e.target.value
                                  }));
                                }}
                                placeholder={q.placeholder}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-xl font-medium text-xs focus:outline-none focus:ring-1 focus:ring-amber-450 focus:border-amber-450 ${
                                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                ) : selectedQuestionnaireType === 'coach' ? (
                  coachQuestSections.some(s => s.id === activeQuestSection && s.id !== 'sect11') && (() => {
                    const sect = coachQuestSections.find(s => s.id === activeQuestSection)!;
                    return (
                      <div className="space-y-4 animate-slide-in">
                        <div className="space-y-1">
                          <h4 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {sect.title}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {sect.desc}
                          </p>
                        </div>

                        <div className="space-y-4 pt-2 divide-y divide-zinc-200/5 dark:divide-zinc-850/40">
                          {sect.questions.map((q) => (
                            <div key={q.num} className="flex flex-col gap-2 pt-3 first:pt-0 border-none">
                              <div className="flex justify-between items-start gap-4">
                                <span className={`text-xs font-black tracking-tight leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                  Q{q.num}. {q.text}
                                </span>
                                
                                <button
                                  onClick={() => {
                                    setQuestAnswersCoach(prev => ({
                                      ...prev,
                                      [q.num]: q.example
                                    }));
                                  }}
                                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
                                    isDark 
                                      ? 'bg-emerald-950/20 border-emerald-850/30 text-emerald-400 hover:bg-emerald-900/30' 
                                      : 'bg-emerald-50 border-emerald-150 text-emerald-600 hover:bg-emerald-100'
                                  }`}
                                  title="Charger la réponse modèle dans ce champ"
                                >
                                  💡 Exemple
                                </button>
                              </div>

                              <textarea
                                value={questAnswersCoach[q.num] || ''}
                                onChange={(e) => {
                                  setQuestAnswersCoach(prev => ({
                                    ...prev,
                                    [q.num]: e.target.value
                                  }));
                                }}
                                placeholder={q.placeholder}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-xl font-medium text-xs focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 ${
                                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  ecommerceQuestSections.some(s => s.id === activeQuestSection && s.id !== 'sect_pages') && (() => {
                    const sect = ecommerceQuestSections.find(s => s.id === activeQuestSection)!;
                    return (
                      <div className="space-y-4 animate-slide-in">
                        <div className="space-y-1">
                          <h4 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {sect.title}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {sect.desc}
                          </p>
                        </div>

                        <div className="space-y-4 pt-2 divide-y divide-zinc-200/5 dark:divide-zinc-850/40">
                          {sect.questions.map((q) => (
                            <div key={q.num} className="flex flex-col gap-2 pt-3 first:pt-0 border-none">
                              <div className="flex justify-between items-start gap-4">
                                <span className={`text-xs font-black tracking-tight leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                  Q{q.num}. {q.text}
                                </span>
                                
                                <button
                                  onClick={() => {
                                    setQuestAnswersEcommerce(prev => ({
                                      ...prev,
                                      [q.num]: q.example
                                    }));
                                  }}
                                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-all shrink-0 ${
                                    isDark 
                                      ? 'bg-sky-950/20 border-sky-850/30 text-sky-400 hover:bg-sky-900/30' 
                                      : 'bg-sky-50 border-sky-150 text-sky-600 hover:bg-sky-100'
                                  }`}
                                  title="Charger la réponse modèle dans ce champ"
                                >
                                  💡 Exemple
                                </button>
                              </div>

                              <textarea
                                value={questAnswersEcommerce[q.num] || ''}
                                onChange={(e) => {
                                  setQuestAnswersEcommerce(prev => ({
                                    ...prev,
                                    [q.num]: e.target.value
                                  }));
                                }}
                                placeholder={q.placeholder}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-xl font-medium text-xs focus:outline-none focus:ring-1 focus:ring-sky-450 focus:border-sky-450 ${
                                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-250 text-slate-800'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* PAGES CHECKLIST FOR 10.1 (sect7) */}
                {selectedQuestionnaireType === 'local' && activeQuestSection === 'sect7' && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        7. Pages, sections et structure du site
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Cochez d&apos;un commun accord les pages incluses ou programmées en V1 pour borner le devis.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {([
                        { key: 'accueil', name: 'Accueil', role: 'Vitrines avec CTA de conversion direct, promesse forte et avis' },
                        { key: 'services', name: 'Services / prestations', role: 'Présentation claire et synthétique de vos services métier' },
                        { key: 'serv1', name: 'Service détaillé 1', role: 'Prestation cible très rentable rédigée en détail' },
                        { key: 'realisations', name: 'Réalisations / galerie', role: 'Photos avant-après, chantiers, produits finis' },
                        { key: 'avis', name: 'Avis clients', role: 'Blocs d’assurance sociale pour rassurer et convaincre' },
                        { key: 'apropos', name: 'À propos / équipe', role: 'Proximité locale, diplômes et histoire de l’enseigne' },
                        { key: 'faq', name: 'FAQ', role: 'Traitement préemptif des questions tarifaires et doutes' },
                        { key: 'contact', name: 'Contact / accès', role: 'Horaires, carte interactive, téléphone et e-mail' },
                        { key: 'zone', name: 'Zone d’intervention', role: 'Villes and secteurs précis desservis régulièrement' },
                        { key: 'blog', name: 'Blog / conseils', role: 'Option SEO local pour truster le moteur de recherche Google' }
                      ] as const).map(pg => {
                        const isChecked = questPages[pg.key];
                        return (
                          <button
                            key={pg.key}
                            onClick={() => {
                              setQuestPages(prev => ({
                                ...prev,
                                [pg.key]: !isChecked
                              }));
                            }}
                            className={`p-3 border rounded-xl text-left transition-all flex items-start gap-3 w-full cursor-pointer ${
                              isChecked 
                                ? isDark 
                                  ? 'bg-purple-500/5 border-purple-500/20 text-purple-450 shadow-inner' 
                                  : 'bg-purple-50/60 border-purple-200 text-purple-950 font-semibold'
                                : isDark
                                  ? 'bg-transparent border-white/[0.04] text-zinc-400 hover:bg-white/[0.02]'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                              isChecked 
                                ? 'bg-purple-600 border-purple-500 text-neutral-950 font-black text-[10px]' 
                                : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                            }`}>
                              {isChecked && "✓"}
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs font-black tracking-tight">{pg.name}</span>
                              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>{pg.role}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PAGES CHECKLIST FOR 10.2 (sect6) */}
                {selectedQuestionnaireType === 'vitrine' && activeQuestSection === 'sect6' && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        6. Structure, pages and structure de confiance du site
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Bordez les pages de base indispensables pour la mise en ligne du site d&apos;autorité.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {([
                        { key: 'accueil', name: 'Accueil d\'Autorité', role: 'Promesse forte, ciblage immédiat, présentation des piliers de services, preuve sociale et CTA principal' },
                        { key: 'apropos', name: 'À propos / Posture', role: 'Histoire, mission, valeurs, posture, parcours et éléments de différenciation' },
                        { key: 'services', name: 'Services / Prestations', role: 'Présentation de la gamme de services / offres, de la méthodologie' },
                        { key: 'serv1', name: 'Focus service ou pack stratégique', role: 'Mise en valeur d’une offre majeure particulièrement rentable ou recherchée' },
                        { key: 'realisations', name: 'Réalisations / Références', role: 'Démonstrations de résultats, études de cas clients détaillées' },
                        { key: 'avis', name: 'Preuves & Avis clients', role: 'Captures, témoignages certifiés ou synchronisés pour terrasser le doute' },
                        { key: 'faq', name: 'FAQ', role: 'Désamorçage autonome des doutes ou peurs récurrentes liés aux prestations' },
                        { key: 'contact', name: 'Contact / RDV', role: 'Coordonnées directes, formulaire qualifiant et intégration agenda' },
                        { key: 'blog', name: 'Blog / Conseils', role: 'Levier SEO long terme and relais d’autorité (V2 ou intégrée)' }
                      ] as const).map(pg => {
                        const isChecked = questPagesVitrine[pg.key];
                        return (
                          <button
                            key={pg.key}
                            onClick={() => {
                              setQuestPagesVitrine(prev => ({
                                ...prev,
                                [pg.key]: !isChecked
                              }));
                            }}
                            className={`p-3 border rounded-xl text-left transition-all flex items-start gap-3 w-full cursor-pointer ${
                              isChecked 
                                ? isDark 
                                  ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400 shadow-inner' 
                                  : 'bg-indigo-50/60 border-indigo-200 text-indigo-950 font-semibold'
                                : isDark
                                  ? 'bg-transparent border-white/[0.04] text-zinc-400 hover:bg-white/[0.02]'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                              isChecked 
                                ? 'bg-indigo-600 border-indigo-500 text-neutral-950 font-black text-[10px]' 
                                : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                            }`}>
                              {isChecked && "✓"}
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs font-black tracking-tight">{pg.name}</span>
                              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>{pg.role}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PAGES CHECKLIST FOR 10.3 (sect9) */}
                {selectedQuestionnaireType === 'formation' && activeQuestSection === 'sect9' && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        9. Structure des pages et architecture pédagogique
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Cochez d&apos;un commun accord les pages incluses dans le portail de formation en ligne pour borner le devis.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {([
                        { key: 'landing', name: 'Landing Offre Reine (Page d\'inscription)', role: 'Accroche forte, bénéfice transformationnel, détails de la méthode, preuve d\'autorité et CTA stratégique' },
                        { key: 'programme', name: 'Programme Détaillé des Cours', role: 'Détail exhaustif des modules, syllabus, objectifs visés par cours et livrables pédagogiques requis' },
                        { key: 'apropos', name: 'Formateur & Biographie / posture', role: 'Parcours professionnel, certifications, diplômes, publications et histoire personnelle du formateur' },
                        { key: 'faq', name: 'FAQ Formation Administratives', role: 'Prise en charge CPF, OPCO, de l\'évaluation des auditeurs, rythme, accès LMS et pré-requis' },
                        { key: 'inscription', name: 'Page Inscription / Candidature', role: 'Formulaire de qualification des candidats pour entretien ou Stripe/checkout synchronisé' },
                        { key: 'ressources', name: 'Ressources / Lead magnet', role: 'Guides de formation gratuits, pdfs d\'autorité, newsletters de capture d\'emails pour nurturer' },
                        { key: 'b2b', name: 'Espace Entreprise / B2B Devis', role: 'Solutions sur-mesure d\'ingénierie d\'affaires pour former les salariés d\'un groupe' }
                      ] as const).map(pg => {
                        const isChecked = questPagesFormation[pg.key];
                        return (
                          <button
                            key={pg.key}
                            onClick={() => {
                              setQuestPagesFormation(prev => ({
                                ...prev,
                                [pg.key]: !isChecked
                              }));
                            }}
                            className={`p-3 border rounded-xl text-left transition-all flex items-start gap-3 w-full cursor-pointer ${
                              isChecked 
                                ? isDark 
                                  ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 shadow-inner' 
                                  : 'bg-amber-50/60 border-amber-200 text-amber-950 font-semibold'
                                : isDark
                                  ? 'bg-transparent border-white/[0.04] text-zinc-400 hover:bg-white/[0.02]'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                              isChecked 
                                ? 'bg-amber-600 border-amber-500 text-neutral-950 font-black text-[10px]' 
                                : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                            }`}>
                              {isChecked && "✓"}
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs font-black tracking-tight">{pg.name}</span>
                              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>{pg.role}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PAGES CHECKLIST FOR 10.3-B (sect11) */}
                {selectedQuestionnaireType === 'coach' && activeQuestSection === 'sect11' && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        11. Pages et structure du site d&apos;accompagnement
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Définissez avec le client quelles portes d&apos;entrée de son site il souhaite ouvrir.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {([
                        { key: 'accueil', name: 'Le sas d\'Accueil (Page d\'attraction)', role: 'Accroche forte, problème clé, solution, preuve d\'autorité et appel à l\'action' },
                        { key: 'apropos', name: 'Moi / Mon Parcours (Page de réassurance)', role: 'L\'histoire à l\'origine de la pratique, les valeurs et les raisons qui fondent la légitimité' },
                        { key: 'methode', name: 'Ma Méthode / Mon Cadre (Page de clarté)', role: 'Les outils utilisés, ce qui se passe pendant une séance, et les limites du cadre de travail' },
                        { key: 'accompagnements', name: 'Mes Accompagnements (Page d\'orientation)', role: 'Le catalogue organisé : individuel, groupe, présentiel, visio, ateliers, tarifs de base' },
                        { key: 'offre_detaillee', name: 'Zoom sur l\'Offre Phare (Page de vente douce)', role: 'Une page entière dédiée au programme premium ou processus principal sur X mois' },
                        { key: 'temoignages', name: 'Histoires de clients / Avis (Page Preuve Sociale)', role: 'Revue détaillée de cas de transformations réussies ou accumulation d\'avis Google' },
                        { key: 'ressources', name: 'Ressources / Articles (Page de trafic)', role: 'Partage d\'outils, exercices ou réflexions pour travailler le SEO et nurturer les prospects' },
                        { key: 'faq', name: 'FAQ / Questions fréquentes (Page de filtrage)', role: 'Traiter de manière transparente les doutes (remboursé par mutuelle, durée, arrêts médicaux...)' },
                        { key: 'contact', name: 'Contact et Prise de RDV (Page de conversion)', role: 'Liens de réservation (Calendly/Doctolib), formulaire de qualification et adresse cabinet' }
                      ] as const).map(pg => {
                        const isChecked = questPagesCoach[pg.key];
                        return (
                          <button
                            key={pg.key}
                            onClick={() => {
                              setQuestPagesCoach(prev => ({
                                ...prev,
                                [pg.key]: !isChecked
                              }));
                            }}
                            className={`p-3 border rounded-xl text-left transition-all flex items-start gap-3 w-full cursor-pointer ${
                              isChecked 
                                ? isDark 
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-inner' 
                                  : 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-semibold'
                                : isDark
                                  ? 'bg-transparent border-white/[0.04] text-zinc-400 hover:bg-white/[0.02]'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                              isChecked 
                                ? 'bg-emerald-600 border-emerald-500 text-neutral-950 font-black text-[10px]' 
                                : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                            }`}>
                              {isChecked && "✓"}
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs font-black tracking-tight">{pg.name}</span>
                              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>{pg.role}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PAGES CHECKLIST FOR 10.4 (sect_pages) */}
                {selectedQuestionnaireType === 'ecommerce' && activeQuestSection === 'sect_pages' && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Checklist Pages du Site
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Bordez les pages nécessaires pour la V1 E-commerce.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {([
                        { key: 'accueil', name: 'Accueil', role: 'Page d\'entrée avec "Shop the look", Mises en avant, Bestsellers' },
                        { key: 'boutique', name: 'Catalogue Global', role: 'Toutes les catégories de produits, filtres, tri' },
                        { key: 'produit', name: 'Fiche Produit (modèle)', role: 'Photos, prix, variantes, détails, ajouter au panier, réassurance' },
                        { key: 'apropos', name: 'À propos / Histoire', role: 'Qui sommes-nous, nos valeurs, équipe' },
                        { key: 'panier', name: 'Panier & Checkout', role: 'Tunnel de commande direct ou en page séparée' },
                        { key: 'livraison', name: 'Livraison & Retours', role: 'Conditions d\'expédition, frais, délais légaux' },
                        { key: 'contact', name: 'Service Client / Contact', role: 'Mail, téléphone, horaire, WhatsApp' },
                        { key: 'faq', name: 'FAQ / Aide', role: 'Questions récurrentes pour réduire la charge de support' },
                        { key: 'blog', name: 'Blog / Edito (SEO)', role: 'Articles d\'influence et de référencement' },
                        { key: 'avis', name: 'Témoignages / Preuve sociale', role: 'Avis certifiés Yotpo ou TrustPilot' },
                        { key: 'legal', name: 'Mentions & CGV e-commerce', role: 'Strictement obligatoire juridiquement (Stripe/Paypal)' }
                      ] as const).map(pg => {
                        const isChecked = questPagesEcommerce[pg.key];
                        return (
                          <button
                            key={pg.key}
                            onClick={() => {
                              setQuestPagesEcommerce(prev => ({
                                ...prev,
                                [pg.key]: !isChecked
                              }));
                            }}
                            className={`p-3 border rounded-xl text-left transition-all flex items-start gap-3 w-full cursor-pointer ${
                              isChecked 
                                ? isDark 
                                  ? 'bg-sky-500/5 border-sky-500/20 text-sky-450 shadow-inner' 
                                  : 'bg-sky-50/60 border-sky-200 text-sky-950 font-semibold'
                                : isDark
                                  ? 'bg-transparent border-white/[0.04] text-zinc-400 hover:bg-white/[0.02]'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                              isChecked 
                                ? 'bg-sky-600 border-sky-500 text-neutral-950 font-black text-[10px]' 
                                : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                            }`}>
                              {isChecked && "✓"}
                            </span>
                            <div className="space-y-0.5">
                              <span className="text-xs font-black tracking-tight">{pg.name}</span>
                              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-550' : 'text-slate-500'}`}>{pg.role}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION: CLIENT DRIVE CHECKLIST */}
                {activeQuestSection === 'drive' && (
                  <div className="space-y-4 animate-slide-in">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {selectedQuestionnaireType === 'local' ? '11. Checklist Drive à fournir' : selectedQuestionnaireType === 'vitrine' ? '12. Checklist Drive à fournir (Vitrine)' : selectedQuestionnaireType === 'formation' ? '12. Checklist Drive à fournir (Formation)' : '12. Checklist Drive à fournir (Coach)'}
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        Partagez cette liste au client pour qu&apos;il centralise ses médias et accès officiels sous 48h.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                      {selectedQuestionnaireType === 'local' ? (
                        [
                          { id: 'logo', label: 'Logo officiel' },
                          { id: 'photos_l', label: 'Photos du lieu' },
                          { id: 'photos_e', label: 'Photos de l’équipe' },
                          { id: 'photos_p', label: 'Photos des prestations/réalisations' },
                          { id: 'avis', label: 'Avis clients utilisables' },
                          { id: 'socials', label: 'Liens réseaux sociaux' },
                          { id: 'gmb', label: 'Accès Google Business' },
                          { id: 'domain', label: 'Accès ancien site/domaine' },
                          { id: 'hours', label: 'Horaires exacts' },
                          { id: 'addr', label: 'Adresse et zone d’intervention' },
                          { id: 'services', label: 'Liste des services' },
                          { id: 'tarifs', label: 'Tarifs ou fourchettes si affichés' },
                          { id: 'certifs', label: 'Certifications / diplômes' },
                          { id: 'assur', label: 'Assurance / labels' },
                          { id: 'legals', label: 'Mentions légales / documents juridiques' },
                          { id: 'site_ref', label: 'Sites de référence' }
                        ].map(item => {
                          const isChecked = questDrive.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (isChecked) {
                                  setQuestDrive(prev => prev.filter(x => x !== item.id));
                                } else {
                                  setQuestDrive(prev => [...prev, item.id]);
                                }
                              }}
                              className={`p-3 border rounded-xl text-left transition-all flex items-start gap-2 cursor-pointer ${
                                isChecked 
                                  ? isDark 
                                    ? 'bg-purple-505/5 border-purple-500/20 text-purple-400' 
                                    : 'bg-purple-50 border-purple-200 text-purple-900 shadow-sm'
                                  : isDark
                                    ? 'bg-transparent border-white/[0.04] text-zinc-400'
                                    : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                isChecked 
                                  ? 'bg-purple-600 border-purple-200 text-neutral-950 font-black text-[10px]' 
                                  : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                              }`}>
                                {isChecked && "✓"}
                              </span>
                              <span className="text-xs font-bold leading-normal">{item.label}</span>
                            </button>
                          );
                        })
                      ) : selectedQuestionnaireType === 'vitrine' ? (
                        [
                          { id: 'logo', label: 'Logo officiel' },
                          { id: 'charte', label: 'Charte ou couleurs' },
                          { id: 'portrait', label: 'Photos portrait / équipe' },
                          { id: 'prestat', label: 'Photos métier / prestations' },
                          { id: 'realisations', label: 'Réalisations / portfolio' },
                          { id: 'avis', label: 'Avis clients utilisables' },
                          { id: 'textes_existants', label: 'Textes existants' },
                          { id: 'services', label: 'Liste des services' },
                          { id: 'tarifs', label: 'Tarifs ou fourchettes si affichés' },
                          { id: 'socials', label: 'Liens réseaux sociaux' },
                          { id: 'domain', label: 'Accès ancien site / domaine' },
                          { id: 'gmb', label: 'Fiche Google Business' },
                          { id: 'certifs', label: 'Certifications / diplômes' },
                          { id: 'brochures', label: 'Brochures ou PDF existants' },
                          { id: 'legals', label: 'Mentions légales / documents juridiques' },
                          { id: 'site_ref', label: 'Sites de référence' }
                        ].map(item => {
                          const isChecked = questDriveVitrine.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (isChecked) {
                                  setQuestDriveVitrine(prev => prev.filter(x => x !== item.id));
                                } else {
                                  setQuestDriveVitrine(prev => [...prev, item.id]);
                                }
                              }}
                              className={`p-3 border rounded-xl text-left transition-all flex items-start gap-2 cursor-pointer ${
                                  isChecked 
                                    ? isDark 
                                      ? 'bg-indigo-505/5 border-indigo-500/20 text-indigo-400' 
                                      : 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm'
                                    : isDark
                                      ? 'bg-transparent border-white/[0.04] text-zinc-400'
                                      : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                  isChecked 
                                    ? 'bg-indigo-600 border-indigo-200 text-neutral-950 font-black text-[10px]' 
                                    : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                              }`}>
                                {isChecked && "✓"}
                              </span>
                              <span className="text-xs font-bold leading-normal">{item.label}</span>
                            </button>
                          );
                        })
                      ) : selectedQuestionnaireType === 'formation' ? (
                        [
                          { id: 'logo', label: 'Logo de l\'organisme et variantes' },
                          { id: 'charte', label: 'Charte graphique, couleurs, polices' },
                          { id: 'portrait', label: 'Photos professionnelles portrait du formateur (HD)' },
                          { id: 'prestat', label: 'Photos d\'ateliers, de cours ou de sessions collectives (visuels)' },
                          { id: 'realisations', label: 'Témoignages vidéos, captures Slack, avis écrits' },
                          { id: 'avis', label: 'Chiffres de satisfaction certifiés (note CPF, taux de complétion)' },
                          { id: 'textes_existants', label: 'Supports de formation existants, PDF, diapositives' },
                          { id: 'services', label: 'Programme officiel ou plan détaillé des modules de cours' },
                          { id: 'tarifs', label: 'Grille de tarifs de la formation et modalités de financement' },
                          { id: 'socials', label: 'Liens vers vos réseaux sociaux de diffusion (LinkedIn, YouTube)' },
                          { id: 'domain', label: 'Accès au domaine d\'hébergement ou au LMS de cours' },
                          { id: 'gmb', label: 'Formulaire d\'évaluation et de candidature Calendly connecté' },
                          { id: 'certifs', label: 'Certificats de compétences et documentation Qualiopi valides' },
                          { id: 'brochures', label: 'Guide ou Lead magnet gratuit de capture d\'emails' },
                          { id: 'legals', label: 'Règlement intérieur, CGV d\'organisme de formation et mentions légales' },
                          { id: 'site_ref', label: 'Sites de formation ou de vente de cours inspirants' }
                        ].map(item => {
                          const isChecked = questDriveFormation.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (isChecked) {
                                  setQuestDriveFormation(prev => prev.filter(x => x !== item.id));
                                } else {
                                  setQuestDriveFormation(prev => [...prev, item.id]);
                                }
                              }}
                              className={`p-3 border rounded-xl text-left transition-all flex items-start gap-2 cursor-pointer ${
                                isChecked 
                                  ? isDark 
                                    ? 'bg-amber-505/5 border-amber-500/20 text-amber-400' 
                                    : 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm'
                                  : isDark
                                    ? 'bg-transparent border-white/[0.04] text-zinc-400'
                                    : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                isChecked 
                                  ? 'bg-amber-600 border-amber-200 text-neutral-950 font-black text-[10px]' 
                                  : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                              }`}>
                                {isChecked && "✓"}
                              </span>
                              <span className="text-xs font-bold leading-normal">{item.label}</span>
                            </button>
                          );
                        })
                      ) : selectedQuestionnaireType === 'coach' ? (
                        [
                          { id: 'logo', label: 'Logo officiel ou charte visuelle' },
                          { id: 'portrait', label: 'Photos professionnel portrait' },
                          { id: 'cabinet', label: 'Photos cabinet ou lieu' },
                          { id: 'bio', label: 'Bio ou texte de présentation existant' },
                          { id: 'offres', label: 'Liste complète des offres et tarifs' },
                          { id: 'diplomes', label: 'Diplômes ou certifications' },
                          { id: 'avis', label: 'Témoignages utilisables / Avis' },
                          { id: 'liens_rdv', label: 'Lien de système de RDV direct (Calendly / Doctolib)' },
                          { id: 'socials', label: 'Liens vers les réseaux sociaux' },
                          { id: 'textes_existants', label: 'Anciens textes, flyers, brochures, posts' },
                          { id: 'ressource', label: 'Ressource gratuite éventuelle (PDF)' },
                          { id: 'legals', label: 'Cadre légal, déontologie ou mentions légales (si besoin)' },
                          { id: 'domain', label: 'Accès / identité de l\'ancien domaine (si existant)' }
                        ].map(item => {
                          const isChecked = questDriveCoach.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (isChecked) {
                                  setQuestDriveCoach(prev => prev.filter(x => x !== item.id));
                                } else {
                                  setQuestDriveCoach(prev => [...prev, item.id]);
                                }
                              }}
                              className={`p-3 border rounded-xl text-left transition-all flex items-start gap-2 cursor-pointer ${
                                isChecked 
                                  ? isDark 
                                    ? 'bg-emerald-505/5 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm'
                                  : isDark
                                    ? 'bg-transparent border-white/[0.04] text-zinc-400'
                                    : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                isChecked 
                                  ? 'bg-emerald-600 border-emerald-200 text-neutral-950 font-black text-[10px]' 
                                  : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                              }`}>
                                {isChecked && "✓"}
                              </span>
                              <span className="text-xs font-bold leading-normal">{item.label}</span>
                            </button>
                          );
                        })
                      ) : (
                        [
                          { id: 'logo', label: 'Logo et charte graphique' },
                          { id: 'marque', label: 'Histoire & photos d\'équipe' },
                          { id: 'catalogue', label: 'Tableau des produits (Réf, Prix, Stock)' },
                          { id: 'photos', label: 'Dossier de photos triées par produit' },
                          { id: 'vente', label: 'Infos bancaires (Stripe/RIB)' },
                          { id: 'frais', label: 'Grille des frais de livraison validée' },
                          { id: 'preuves', label: 'Avis, témoignages, labels' },
                          { id: 'legal', label: 'CGV & Pol. de Retour (Validées)' },
                          { id: 'acces', label: 'Accès domaine & Shopify' }
                        ].map(item => {
                          const isChecked = questDriveEcommerce.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (isChecked) {
                                  setQuestDriveEcommerce(prev => prev.filter(x => x !== item.id));
                                } else {
                                  setQuestDriveEcommerce(prev => [...prev, item.id]);
                                }
                              }}
                              className={`p-3 border rounded-xl text-left transition-all flex items-start gap-2 cursor-pointer ${
                                isChecked 
                                  ? isDark 
                                    ? 'bg-sky-505/5 border-sky-500/20 text-sky-400' 
                                    : 'bg-sky-50 border-sky-200 text-sky-900 shadow-sm'
                                  : isDark
                                    ? 'bg-transparent border-white/[0.04] text-zinc-400'
                                    : 'bg-white border-slate-200'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                isChecked 
                                  ? 'bg-sky-600 border-sky-200 text-neutral-950 font-black text-[10px]' 
                                  : isDark ? 'border-zinc-700 bg-black/40' : 'border-slate-350 bg-white'
                              }`}>
                                {isChecked && "✓"}
                              </span>
                              <span className="text-xs font-bold leading-normal">{item.label}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* CLINICAL RECOMMENDATIONS SECTION */}
                {activeQuestSection === 'reco' && selectedQuestionnaireType === 'local' && (() => {
                  // Perform clinical algorithm based on parameters for 10.1
                  const totalFilledAnswers = Object.values(questAnswers).filter(Boolean).length;
                  const totalQuestions = localQuestSections.reduce((sum, s) => sum + s.questions.length, 0);
                  const isLargeScale = Object.values(questPages).filter(Boolean).length > 6 || (questAnswers[10] && questAnswers[10].length > 50);
                  const needsSEO = questPages.blog || (questAnswers[32] && questAnswers[32].length > 15);
                  const missingPhotos = questAnswers[57]?.toLowerCase().includes("non") || questAnswers[29]?.toLowerCase().includes("non") || !questDrive.includes('photos_l');

                  let recomFormula = "Présence Essentielle - 800 €";
                  let recomReason = "L'activité semble simple et concentrée sur un seul secteur géographique sans besoin d'intégration lourde ou de volume de pages conséquent.";
                  let iconColor = "text-sky-400";
                  let badgeBg = "bg-sky-500/10 border-sky-500/20";

                  if (isLargeScale || needsSEO) {
                    recomFormula = "Présence Pro - 1500 €";
                    recomReason = "Le client exprime un besoin SEO local (blog cimenté, plusieurs villes ciblées) ou requiert plus de 5 pages structurées avec copywriting renforcé.";
                    iconColor = "text-blue-400";
                    badgeBg = "bg-blue-500/10 border-blue-500/20";
                  }

                  if (questAnswers[47]?.toLowerCase().includes("calend") || questAnswers[46]?.toLowerCase().includes("photo") || questAnswers[49]?.toLowerCase().includes("urgence")) {
                    recomFormula = "Système Client - 2200 €";
                    recomReason = "Le client requiert un filtrage poussé des demandes via formulaire qualifiant (photos à uploader, pannes d'urgence, aiguillage automatique) ou prise de RDV autonome.";
                    iconColor = "text-purple-400";
                    badgeBg = "bg-purple-500/10 border-purple-500/20";
                  }

                  const percent = Math.round((totalFilledAnswers / totalQuestions) * 100);

                  return (
                    <div className="space-y-4 animate-slide-in font-semibold text-xs leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          12. Lecture interne Nümtema - Analyse Clinique Local
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Analyse intelligente en temps réel basée sur le comportement du formulaire et des options choisies.
                        </p>
                      </div>

                      {/* Barometer */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500">Maturité du Document 10.1 :</span>
                          <span className={percent === 100 ? 'text-emerald-400' : 'text-amber-400'}>{percent}% ({totalFilledAnswers} / {totalQuestions} Rép.)</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-sky-405 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Clinical suggestion block */}
                      <div className={`p-4 rounded-xl border space-y-2.5 ${badgeBg}`}>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className={`w-4 h-4 ${iconColor}`} />
                          <span className={`text-[11px] font-black uppercase tracking-wide ${iconColor}`}>SÉLECTION D’OFFRE SCIENTIFIQUE</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{recomFormula}</h5>
                          <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-zinc-350' : 'text-slate-655'}`}>
                            {recomReason}
                          </p>
                        </div>
                      </div>

                      {/* Warnings and signals */}
                      <div className="space-y-2 pt-2 border-t border-dashed border-zinc-200/5 dark:border-zinc-800/60">
                        <span className="text-[10px] font-black uppercase text-zinc-550 tracking-wider">SIGNAUX ALERTE CONSTATÉS :</span>
                        
                        <div className="space-y-2 text-[10.5px]">
                          {missingPhotos && (
                            <div className="flex items-start gap-2 text-rose-450 leading-tight">
                              <span className="font-mono">⚠️</span>
                              <span><strong>Photos absentes ou de faible qualité repérées :</strong> Prévoir obligatoirement le module d&apos;option Copywriting / Pack Shooting Local d&apos;entrée de jeu.</span>
                            </div>
                          )}

                          {needsSEO && (
                            <div className="flex items-start gap-2 text-sky-400 leading-tight">
                              <span className="font-mono">💡</span>
                              <span><strong>Volonté SEO d&apos;autorité rédigée :</strong> Une campagne de Backlinking Local ou une option SEO d&apos;écriture de contenu mensuelle récurrente est fortement suggérée.</span>
                            </div>
                          )}

                          {!questDrive.includes('gmb') && (
                            <div className="flex items-start gap-2 text-amber-450 leading-tight">
                              <span className="font-mono">⚡</span>
                              <span><strong>Accès Google Business en attente :</strong> À débloquer de toute urgence. L&apos;indexation et le SEO local dépendent de la liaison à cette fiche.</span>
                            </div>
                          )}

                          {!missingPhotos && !needsSEO && (
                            <span className="italic text-zinc-500 block text-[10px]">Aucun signal mineur ou anomalie détectée pour le moment. Le dossier est impeccablement bordé !</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {activeQuestSection === 'reco' && selectedQuestionnaireType === 'vitrine' && (() => {
                  // Perform clinical algorithm based on parameters for 10.2
                  const totalFilledAnswers = Object.values(questAnswersVitrine).filter(Boolean).length;
                  const totalQuestions = vitrineQuestSections.reduce((sum, s) => sum + s.questions.length, 0);
                  const isLargeScale = Object.values(questPagesVitrine).filter(Boolean).length > 6;
                  const needsSEO = questAnswersVitrine[63]?.length > 15;
                  const missingPhotos = !questDriveVitrine.includes('portrait') || !questDriveVitrine.includes('prestat');

                  let recomFormula = "Présence Essentielle - 800 €";
                  let recomReason = "L'activité de l'indépendant semble concentrée sur un périmètre clair doté de quelques pages simples sans besoin d'expertises programmatiques d'automatisation poussées.";
                  let iconColor = "text-sky-400";
                  let badgeBg = "bg-sky-500/10 border-sky-500/20";

                  if (isLargeScale || needsSEO) {
                    recomFormula = "Présence Pro - 1500 €";
                    recomReason = "Plusieurs services distincts sont répertoriés, exigeant un copywriting de persuasion guidé, des études de cas détaillées et une structure multi-pages solide pour attirer des leads froids.";
                    iconColor = "text-blue-400";
                    badgeBg = "bg-blue-500/10 border-blue-500/20";
                  }

                  if (questAnswersVitrine[58]?.toLowerCase().includes("contact") || questAnswersVitrine[60]?.toLowerCase().includes("calend") || questAnswersVitrine[24]?.toLowerCase().includes("pack") || questAnswersVitrine[24]?.toLowerCase().includes("formule")) {
                    recomFormula = "Système Client - 2200 €";
                    recomReason = "Le prestataire désire des formulaires avancés de qualification, des liaisons Calendly / Google Agenda synchronisés et un tunnel de relance structuré d'appel stratégique.";
                    iconColor = "text-purple-400";
                    badgeBg = "bg-purple-500/10 border-purple-500/20";
                  }

                  const percent = Math.round((totalFilledAnswers / totalQuestions) * 100);

                  return (
                    <div className="space-y-4 animate-slide-in font-semibold text-xs leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          13. Lecture interne Nümtema - Analyse Clinique Vitrine
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Diagnostic en temps réel basé sur vos réponses au Questionnaire Site Vitrine (Doc 10.2).
                        </p>
                      </div>

                      {/* Barometer */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500">Maturité du Document 10.2 :</span>
                          <span className={percent === 100 ? 'text-emerald-400' : 'text-amber-400'}>{percent}% ({totalFilledAnswers} / {totalQuestions} Rép.)</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-sky-405 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Clinical suggestion block */}
                      <div className={`p-4 rounded-xl border space-y-2.5 ${badgeBg}`}>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className={`w-4 h-4 ${iconColor}`} />
                          <span className={`text-[11px] font-black uppercase tracking-wide ${iconColor}`}>SÉLECTION D’OFFRE SCIENTIFIQUE</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{recomFormula}</h5>
                          <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-zinc-350' : 'text-slate-655'}`}>
                            {recomReason}
                          </p>
                        </div>
                      </div>

                      {/* Warnings and signals */}
                      <div className="space-y-2 pt-2 border-t border-dashed border-zinc-200/5 dark:border-zinc-800/60">
                        <span className="text-[10px] font-black uppercase text-zinc-550 tracking-wider">SIGNAUX ALERTE CONSTATÉS :</span>
                        
                        <div className="space-y-2 text-[10.5px]">
                          {missingPhotos && (
                            <div className="flex items-start gap-2 text-rose-450 leading-tight">
                              <span className="font-mono">⚠️</span>
                              <span><strong>Manque d&apos;illustrations ou portaits de marque :</strong> Sans photos authentiques, le site risque d&apos;avoir un style impersonnel. Suggérez l&apos;option séance portrait ou banques pro ciblées.</span>
                            </div>
                          )}

                          {needsSEO && (
                            <div className="flex items-start gap-2 text-sky-400 leading-tight">
                              <span className="font-mono">💡</span>
                              <span><strong>Mots clés SEO fournis :</strong> Intégrez une optimisation sémantique dès la V1 pour asseoir la visibilité organique.</span>
                            </div>
                          )}

                          {!questDriveVitrine.includes('logo') && (
                            <div className="flex items-start gap-2 text-amber-450 leading-tight">
                              <span className="font-mono">⚡</span>
                              <span><strong>Logo à concevoir ou vectoriser :</strong> Intégrez l&apos;option de logotype d&apos;identité visuelle pour éviter de bloquer l&apos;en-tête du site.</span>
                            </div>
                          )}

                          {!missingPhotos && !needsSEO && (
                            <span className="italic text-zinc-500 block text-[10px]">Aucun signal d&apos;alerte détecté. Dossier parfaitement fluide !</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {activeQuestSection === 'reco' && selectedQuestionnaireType === 'formation' && (() => {
                  // Perform clinical algorithm based on parameters for 10.3
                  const totalFilledAnswers = Object.values(questAnswersFormation).filter(Boolean).length;
                  const totalQuestions = formationQuestSections.reduce((sum, s) => sum + s.questions.length, 0);
                  const isLargeScale = Object.values(questPagesFormation).filter(Boolean).length > 5;
                  const needsSEO = questAnswersFormation[101]?.length > 15; // audience/SEO
                  const missingPhotos = !questDriveFormation.includes('portrait') || !questDriveFormation.includes('prestat');

                  let recomFormula = "Accompagnement Essentiel - 1500 €";
                  let recomReason = "La formation ou l'offre d'e-learning cible une audience ciblée avec des modules d'apprentissage standards de base, sans intégrations LMS sur-mesure complexes.";
                  let iconColor = "text-amber-400";
                  let badgeBg = "bg-amber-500/10 border-amber-500/20";

                  if (isLargeScale || needsSEO) {
                    recomFormula = "Ingénierie Pro - 2500 €";
                    recomReason = "Plusieurs cours d'envergure, une stratégie de lead magnet d'autorité, de multiples pages de présentation programmatiques et un travail de référencement poussé pour capter du trafic organique qualifié.";
                    iconColor = "text-amber-500";
                    badgeBg = "bg-amber-500/10 border-amber-500/30";
                  }

                  if (questAnswersFormation[103]?.toLowerCase().includes("opco") || questAnswersFormation[105]?.toLowerCase().includes("qualiopi") || questAnswersFormation[106]?.toLowerCase().includes("financement") || questPagesFormation.b2b) {
                    recomFormula = "Système LMS & B2B - 3500 €";
                    recomReason = "L'organisme de formation vise des financements publics (CPF, OPCO) exigeant l'édition stricte de certificats Qualiopi valides, des tunnels de vente B2B complexes, et des intégrations automatiques de feuilles d'émargement pédagogiques.";
                    iconColor = "text-amber-600";
                    badgeBg = "bg-amber-700/10 border-amber-600/30";
                  }

                  const percent = Math.round((totalFilledAnswers / totalQuestions) * 100);

                  return (
                    <div className="space-y-4 animate-slide-in font-semibold text-xs leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          15. Lecture interne Nümtema - Analyse Clinique Formation
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Diagnostic en temps réel basé sur vos réponses au Questionnaire Formation (Doc 10.3).
                        </p>
                      </div>

                      {/* Barometer */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500">Maturité du Document 10.3 :</span>
                          <span className={percent === 100 ? 'text-emerald-400' : 'text-amber-400'}>{percent}% ({totalFilledAnswers} / {totalQuestions} Rép.)</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Clinical suggestion block */}
                      <div className={`p-4 rounded-xl border space-y-2.5 ${badgeBg}`}>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className={`w-4 h-4 ${iconColor}`} />
                          <span className={`text-[11px] font-black uppercase tracking-wide ${iconColor}`}>SÉLECTION D’OFFRE SCIENTIFIQUE</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{recomFormula}</h5>
                          <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-zinc-350' : 'text-slate-655'}`}>
                            {recomReason}
                          </p>
                        </div>
                      </div>

                      {/* Warnings and signals */}
                      <div className="space-y-2 pt-2 border-t border-dashed border-zinc-200/5 dark:border-zinc-800/60">
                        <span className="text-[10px] font-black uppercase text-zinc-550 tracking-wider">SIGNAUX ALERTE CONSTATÉS :</span>
                        
                        <div className="space-y-2 text-[10.5px]">
                          {missingPhotos && (
                            <div className="flex items-start gap-2 text-rose-450 leading-tight">
                              <span className="font-mono">⚠️</span>
                              <span><strong>Photos d&apos;autorité ou portrait absents :</strong> Une formation en ligne repose sur la confiance et l&apos;avatar de l&apos;expert. Intégrez une option de shooting haut de gamme.</span>
                            </div>
                          )}

                          {needsSEO && (
                            <div className="flex items-start gap-2 text-sky-400 leading-tight">
                              <span className="font-mono">💡</span>
                              <span><strong>Stratégie d&apos;acquisition organique stipulée :</strong> Une planification de contenu (SEO / Blogging d&apos;expertise) et de lead magnet est nécessaire dès la mise en ligne.</span>
                            </div>
                          )}

                          {!questDriveFormation.includes('logo') && (
                            <div className="flex items-start gap-2 text-rose-400 leading-tight">
                              <span className="font-mono">⚡</span>
                              <span><strong>Matériel graphique de l&apos;organisme non fourni :</strong> Retard potentiel sur le branding. Intégrez la liaison d&apos;un pack identité visuelle.</span>
                            </div>
                          )}

                          {!missingPhotos && !needsSEO && (
                            <span className="italic text-zinc-500 block text-[10px]">Aucun signal d&apos;alerte détecté. Dossier parfaitement fluide !</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {activeQuestSection === 'reco' && selectedQuestionnaireType === 'coach' && (() => {
                  // Perform clinical algorithm based on parameters for 10.3-B
                  const totalFilledAnswers = Object.values(questAnswersCoach).filter(Boolean).length;
                  const totalQuestions = coachQuestSections.reduce((sum, s) => sum + s.questions.length, 0);
                  const isLargeScale = Object.values(questPagesCoach).filter(Boolean).length > 5;
                  const needsSEO = questAnswersCoach[78]?.length > 15; // audience/SEO lead magnet
                  const missingPhotos = !questDriveCoach.includes('portrait') || !questDriveCoach.includes('cabinet');

                  let recomFormula = "Accompagnement Essentiel - 1500 €";
                  let recomReason = "Cadrage clair avec des offres lisibles sur un périmètre restreint. Focus sur la conversion d'appels découverte depuis la page accueil et les accompagnements de base.";
                  let iconColor = "text-emerald-400";
                  let badgeBg = "bg-emerald-500/10 border-emerald-500/20";

                  if (isLargeScale || needsSEO) {
                    recomFormula = "Coach Autorité - 2500 €";
                    recomReason = "Nécessite la mise en place d'une autorité crédible : pages d'offres détaillées complexes, optimisation SEO avec lead magnets, et un système complet pour valoriser des offres long-terme premium.";
                    iconColor = "text-emerald-500";
                    badgeBg = "bg-emerald-500/10 border-emerald-500/30";
                  }

                  const percent = Math.round((totalFilledAnswers / totalQuestions) * 100);

                  return (
                    <div className="space-y-4 animate-slide-in font-semibold text-xs leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          13. Lecture interne Nümtema - Analyse Clinique Coach
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Diagnostic en temps réel basé sur vos réponses au Questionnaire Coach (Doc 10.3-B).
                        </p>
                      </div>

                      {/* Barometer */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500">Maturité du Document 10.3-B :</span>
                          <span className={percent === 100 ? 'text-emerald-400' : 'text-emerald-400'}>{percent}% ({totalFilledAnswers} / {totalQuestions} Rép.)</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Clinical suggestion block */}
                      <div className={`p-4 rounded-xl border space-y-2.5 ${badgeBg}`}>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className={`w-4 h-4 ${iconColor}`} />
                          <span className={`text-[11px] font-black uppercase tracking-wide ${iconColor}`}>SÉLECTION D’OFFRE SCIENTIFIQUE</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{recomFormula}</h5>
                          <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-zinc-350' : 'text-slate-655'}`}>
                            {recomReason}
                          </p>
                        </div>
                      </div>

                      {/* Warnings and signals */}
                      <div className="space-y-2 pt-2 border-t border-dashed border-zinc-200/5 dark:border-zinc-800/60">
                        <span className="text-[10px] font-black uppercase text-zinc-550 tracking-wider">SIGNAUX ALERTE CONSTATÉS :</span>
                        
                        <div className="space-y-2 text-[10.5px]">
                          {missingPhotos && (
                            <div className="flex items-start gap-2 text-rose-450 leading-tight">
                              <span className="font-mono">⚠️</span>
                              <span><strong>Absence visuelle d&apos;authenticité :</strong> Le métier de l&apos;accompagnement exige de la confiance. Des photos professionnelles portrait et cabinet sont indispensables.</span>
                            </div>
                          )}

                          {needsSEO && (
                            <div className="flex items-start gap-2 text-sky-400 leading-tight">
                              <span className="font-mono">💡</span>
                              <span><strong>Ressources gratuites :</strong> Le client a exprimé l&apos;envie de capter de l&apos;e-mail via un lead magnet, attention à dimensionner la partie formulaire et RGPD.</span>
                            </div>
                          )}

                          {!missingPhotos && !needsSEO && (
                            <span className="italic text-zinc-500 block text-[10px]">Aucun signal d&apos;alerte détecté. Stratégie d&apos;accompagnement fluide !</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {activeQuestSection === 'reco' && selectedQuestionnaireType === 'ecommerce' && (() => {
                  // Perform clinical algorithm based on parameters for 10.4
                  const totalFilledAnswers = Object.values(questAnswersEcommerce).filter(Boolean).length;
                  const totalQuestions = ecommerceQuestSections.reduce((sum, s) => sum + s.questions.length, 0);
                  const isLargeScale = Object.values(questPagesEcommerce).filter(Boolean).length > 7;
                  const needsSEO = questAnswersEcommerce[113]?.length > 15; // SEO strategy
                  const missingPhotos = !questDriveEcommerce.includes('photos') || !questDriveEcommerce.includes('catalogue');

                  let recomFormula = "Système e-commerce - 1800 €";
                  let recomReason = "Catalogue limité avec tunnel d'achat simple. Focus sur l'optimisation des conversions frontales sur Shopify.";
                  let iconColor = "text-sky-400";
                  let badgeBg = "bg-sky-500/10 border-sky-500/20";

                  if (isLargeScale || needsSEO) {
                    recomFormula = "e-commerce Autorité - 3500 €";
                    recomReason = "Catalogue volumineux, stratégies SEO complexes, pages de marque avancées et intégrations tierces approfondies.";
                    iconColor = "text-sky-500";
                    badgeBg = "bg-sky-500/10 border-sky-500/30";
                  }

                  const percent = Math.round((totalFilledAnswers / totalQuestions) * 100) || 0;

                  return (
                    <div className="space-y-4 animate-slide-in font-semibold text-xs leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          15. Lecture interne Nümtema - Analyse Clinique e-commerce
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Diagnostic en temps réel basé sur vos réponses au Questionnaire e-commerce (Doc 10.4).
                        </p>
                      </div>

                      {/* Barometer */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-zinc-500">Maturité du Document 10.4 :</span>
                          <span className={percent === 100 ? 'text-sky-400' : 'text-sky-400'}>{percent}% ({totalFilledAnswers} / {totalQuestions} Rép.)</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Clinical suggestion block */}
                      <div className={`p-4 rounded-xl border space-y-2.5 ${badgeBg}`}>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className={`w-4 h-4 ${iconColor}`} />
                          <span className={`text-[11px] font-black uppercase tracking-wide ${iconColor}`}>SÉLECTION D’OFFRE SCIENTIFIQUE</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{recomFormula}</h5>
                          <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-zinc-350' : 'text-slate-655'}`}>
                            {recomReason}
                          </p>
                        </div>
                      </div>

                      {/* Warnings and signals */}
                      <div className="space-y-2 pt-2 border-t border-dashed border-zinc-200/5 dark:border-zinc-800/60">
                        <span className="text-[10px] font-black uppercase text-zinc-550 tracking-wider">SIGNAUX ALERTE CONSTATÉS :</span>
                        
                        <div className="space-y-2 text-[10.5px]">
                          {missingPhotos && (
                            <div className="flex items-start gap-2 text-rose-450 leading-tight">
                              <span className="font-mono">⚠️</span>
                              <span><strong>Absence du catalogue ou photos :</strong> L&apos;intégration des produits sera bloquée ! Vous devez clarifier l&apos;import avec un tableau produit conforme et les images associées.</span>
                            </div>
                          )}

                          {needsSEO && (
                            <div className="flex items-start gap-2 text-sky-400 leading-tight">
                              <span className="font-mono">💡</span>
                              <span><strong>Stratégie SEO :</strong> Une campagne sur les fiches produits et des articles de blogs d&apos;autorité demandera beaucoup de copywriting.</span>
                            </div>
                          )}

                          {!missingPhotos && !needsSEO && (
                            <span className="italic text-zinc-500 block text-[10px]">Aucun signal d&apos;alerte détecté. Cadrage e-commerce fluide !</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* INVITATION MESSAGE SECTION */}
                {activeQuestSection === 'invite' && selectedQuestionnaireType === 'local' && (() => {
                  const clientName = questMeta.referentName || '[Prénom]';
                  const invitationMessage = `Bonjour ${clientName},

Merci pour la validation du devis et le versement de l’acompte. Je vous envoie le questionnaire de visibilité locale (Document 10.1). Il va me permettre de récupérer les informations essentielles : activité, zone géographique, services, horaires, photos, avis clients, fiche Google Business, réseaux sociaux et action principale à mettre en avant sur le site.

Répondez simplement avec vos mots. Ce n’est pas grave si certaines réponses ne sont pas parfaites : nous les clarifierons ensemble pendant le cadrage.

Pensez aussi à déposer les éléments utiles dans le Drive partagé : logo, photos, avis, textes existants, liens réseaux, accès Google Business, ancien site ou domaine si vous en avez un.

Dès réception des réponses et des éléments, je prépare le cadrage final avant la première direction de page.`;

                  return (
                    <div className="space-y-4 animate-slide-in text-xs font-semibold leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          13. Message d&apos;intégration - Invitation WhatsApp / Mail
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Texte pré-formateur personnalisé d&apos;un clic à envoyer pour accueillir le client dès signature de son devis.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border leading-relaxed text-[11px] font-bold font-mono ${
                        isDark ? 'bg-black/30 border-white/[0.04] text-zinc-350' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-inner'
                      }`}>
                        {invitationMessage.split('\n\n').map((para, i) => (
                          <p key={i} className="mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopy(invitationMessage, "Message Client")}
                        className="w-full mt-2 py-2.5 bg-[#10b981] hover:bg-[#059669] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copier l&apos;invitation WhatsApp personnalisée</span>
                      </button>
                    </div>
                  );
                })()}

                {activeQuestSection === 'invite' && selectedQuestionnaireType === 'vitrine' && (() => {
                  const clientName = questMeta.referentName || '[Prénom]';
                  const invitationMessage = `Bonjour ${clientName},

Merci pour la validation du devis et le versement de l’acompte. Je vous envoie le questionnaire site vitrine (Document 10.2). Il va me permettre de récupérer les informations importantes : activité, objectifs, offres, cible, preuves, avis clients, pages souhaitées, textes, photos, style visuel, contact et éléments techniques.

Répondez simplement avec vos mots. Ce n’est pas grave si certaines réponses ne sont pas parfaites : nous les clarifierons ensemble pendant le cadrage.

Pensez aussi à déposer les éléments utiles dans le Drive partagé : logo, photos, avis, textes existants, liens réseaux, accès ancien site ou domaine si vous en avez un.

Dès réception des réponses et des éléments, je prépare le cadrage final avant la première direction de page.`;

                  return (
                    <div className="space-y-4 animate-slide-in text-xs font-semibold leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          14. Message d&apos;intégration - Invitation WhatsApp / Mail (Vitrine)
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Texte personnalisé d&apos;accueil prêt à l’envoi suite à l’acompte d&apos;un projet de Site Vitrine 10.2.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border leading-relaxed text-[11px] font-bold font-mono ${
                        isDark ? 'bg-black/30 border-white/[0.04] text-zinc-350' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-inner'
                      }`}>
                        {invitationMessage.split('\n\n').map((para, i) => (
                          <p key={i} className="mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopy(invitationMessage, "Message Client Vitrine")}
                        className="w-full mt-2 py-2.5 bg-[#10b981] hover:bg-[#059669] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copier l&apos;invitation WhatsApp 10.2</span>
                      </button>
                    </div>
                  );
                })()}

                {activeQuestSection === 'invite' && selectedQuestionnaireType === 'formation' && (() => {
                  const clientName = questMeta.referentName || '[Prénom]';
                  const invitationMessage = `Bonjour ${clientName},

Merci pour la validation du devis et le versement de l’acompte. Je vous envoie le questionnaire d'ingénierie de formation (Document 10.3). Il va me permettre de structurer les aspects pédagogiques et techniques de votre portail : modules, syllabus, public cible, OPCO/financement, tarifs et mécanique d'acquisition d'élèves.

Répondez simplement avec vos mots. Ce n’est pas grave si certaines réponses ne sont pas parfaites : nous les clarifierons ensemble pendant le cadrage.

Pensez à déposer les éléments utiles dans le Drive partagé : logo de l'organisme, photos portrait HD, photos de sessions, témoignages d'élèves, supports PDF existants et règlements ou CGV.

Dès réception de vos réponses et éléments, je prépare le cadrage final pédagogique de votre LMS.`;

                  return (
                    <div className="space-y-4 animate-slide-in text-xs font-semibold leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          16. Message d&apos;intégration - Invitation WhatsApp / Mail (Formation)
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Texte personnalisé d&apos;accueil prêt à l’envoi suite à l’acompte d&apos;un projet de Portail Formation 10.3.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border leading-relaxed text-[11px] font-bold font-mono ${
                        isDark ? 'bg-black/30 border-white/[0.04] text-zinc-350' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-inner'
                      }`}>
                        {invitationMessage.split('\n\n').map((para, i) => (
                          <p key={i} className="mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopy(invitationMessage, "Message Client Formation")}
                        className="w-full mt-2 py-2.5 bg-[#10b981] hover:bg-[#059669] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copier l&apos;invitation WhatsApp 10.3-A</span>
                      </button>
                    </div>
                  );
                })()}

                {activeQuestSection === 'invite' && selectedQuestionnaireType === 'coach' && (() => {
                  const clientName = questMeta.referentName || '[Prénom]';
                  const invitationMessage = `Bonjour ${clientName},

Merci pour la validation du devis et le versement de l’acompte. Je vous envoie le questionnaire "Posture & Accompagnement" (Document 10.3-B). Il va m'aider à comprendre précisément votre pratique, vos clients, vos offres d’accompagnement et le ton juste que l'on doit adopter pour votre site.

Répondez simplement avec vos mots. Ne cherchez pas la phrase parfaite, soyez honnête, je m'occuperai de lisser l'ensemble et nous vérifierons tout lors du cadrage.

Pensez à déposer les éléments dans le Drive partagé : logo s'il existe, des photos professionnelles portrait et cabinet, des témoignages clients et les textes de vos offres.

Dès réception des réponses et des médias, je préparerai notre cadrage de démarrage.`;

                  return (
                    <div className="space-y-4 animate-slide-in text-xs font-semibold leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          14. Message d&apos;intégration - Invitation WhatsApp / Mail (Coach)
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Texte personnalisé d&apos;accueil prêt à l’envoi suite à l’acompte d&apos;un projet de coaching.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border leading-relaxed text-[11px] font-bold font-mono ${
                        isDark ? 'bg-black/30 border-white/[0.04] text-zinc-350' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-inner'
                      }`}>
                        {invitationMessage.split('\n\n').map((para, i) => (
                          <p key={i} className="mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopy(invitationMessage, "Message Client Coach")}
                        className="w-full mt-2 py-2.5 bg-[#10b981] hover:bg-[#059669] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copier l&apos;invitation WhatsApp 10.3-B</span>
                      </button>
                    </div>
                  );
                })()}

                {activeQuestSection === 'invite' && selectedQuestionnaireType === 'ecommerce' && (() => {
                  const clientName = questMeta.referentName || '[Prénom]';
                  const invitationMessage = `Bonjour ${clientName},

Merci pour la validation du devis et le versement de l’acompte. Je vous envoie le questionnaire "Boutique E-commerce" (Document 10.4). Il va m'aider à comprendre précisément votre image de marque, votre catalogue, votre stratégie de prix et la logistique qui fera fonctionner la boutique.

Répondez simplement avec vos mots. Ne cherchez pas la perfection littéraire : renseignez la matière, je m'occuperai de lisser l'ensemble pour la mise en ligne. Le plus important est que la vision stratégique globale soit claire.

Pensez à déposer les éléments techniques dans le Drive partagé : votre tableau d'import de produits certifié, toutes vos photos (très important), vos grilles de frais de livraison, l'identité visuelle et les accès de domaine.

Je prépare les trames backend dès la réception. On reste en contact !`;

                  return (
                    <div className="space-y-4 animate-slide-in text-xs font-semibold leading-relaxed">
                      <div className="space-y-1">
                        <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          16. Message d&apos;intégration - Invitation WhatsApp / Mail (E-commerce)
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                          Texte personnalisé d&apos;accueil prêt à l’envoi suite à l’acompte d&apos;un projet e-commerce.
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border leading-relaxed text-[11px] font-bold font-mono ${
                        isDark ? 'bg-black/30 border-white/[0.04] text-zinc-350' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-inner'
                      }`}>
                        {invitationMessage.split('\n\n').map((para, i) => (
                          <p key={i} className="mb-2 last:mb-0">{para}</p>
                        ))}
                      </div>

                      <button
                        onClick={() => handleCopy(invitationMessage, "Message Client E-commerce")}
                        className="w-full mt-2 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copier l&apos;invitation WhatsApp 10.4</span>
                      </button>
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* Right Column: Live Compiled paper mockup markdown view */}
            <div className="xl:col-span-4 space-y-4">
              <div className={`p-5 rounded-2xl border sticky top-4 flex flex-col justify-between space-y-5 h-auto ${
                isDark ? 'bg-[#091122]/85 border-white/[0.04]' : 'bg-slate-100/60 border-slate-250 shadow-sm'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${
                      selectedQuestionnaireType === 'local' 
                        ? 'text-purple-400'
                        : selectedQuestionnaireType === 'vitrine'
                          ? 'text-indigo-400'
                          : selectedQuestionnaireType === 'formation'
                            ? 'text-amber-400'
                            : selectedQuestionnaireType === 'coach'
                              ? 'text-emerald-400'
                              : 'text-sky-400'
                    }`}>
                      {selectedQuestionnaireType === 'local' 
                        ? 'DOCUMENT FINI LOCAL (10.1) 📄' 
                        : selectedQuestionnaireType === 'vitrine'
                          ? 'DOCUMENT FINI VITRINE (10.2) 📄'
                          : selectedQuestionnaireType === 'formation'
                            ? 'DOCUMENT FINI FORMATION (10.3-A) 📄'
                            : selectedQuestionnaireType === 'coach'
                              ? 'DOCUMENT FINI COACH (10.3-B) 📄'
                              : 'DOCUMENT FINI E-COMMERCE (10.4) 📄'}
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      readOnly
                      value={
                        selectedQuestionnaireType === 'local' 
                          ? compiledQuestMarkdown 
                          : selectedQuestionnaireType === 'vitrine'
                            ? compiledQuestMarkdownVitrine
                            : selectedQuestionnaireType === 'formation'
                              ? compiledQuestMarkdownFormation
                              : selectedQuestionnaireType === 'coach'
                                ? compiledQuestMarkdownCoach
                                : compiledQuestMarkdownEcommerce
                      }
                      className={`w-full p-4 rounded-xl border font-mono text-[9.5px] leading-relaxed resize-none h-[420px] focus:outline-none select-text ${
                        isDark ? 'bg-black/50 border-white/[0.04] text-zinc-400' : 'bg-white border-slate-200 text-slate-700 shadow-inner'
                      }`}
                    />
                    
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        Markdown Fini
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (selectedQuestionnaireType === 'local') {
                        handleCopy(compiledQuestMarkdown, "Document 10.1 complet");
                      } else if (selectedQuestionnaireType === 'vitrine') {
                        handleCopy(compiledQuestMarkdownVitrine, "Document 10.2 complet");
                      } else if (selectedQuestionnaireType === 'formation') {
                        handleCopy(compiledQuestMarkdownFormation, "Document 10.3-A complet");
                      } else if (selectedQuestionnaireType === 'coach') {
                        handleCopy(compiledQuestMarkdownCoach, "Document 10.3-B complet");
                      } else {
                        handleCopy(compiledQuestMarkdownEcommerce, "Document 10.4 complet");
                      }
                    }}
                    className={`w-full py-3 text-neutral-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-2xl hover:scale-102 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedQuestionnaireType === 'local'
                        ? 'bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-650'
                        : selectedQuestionnaireType === 'vitrine'
                          ? 'bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-500'
                          : selectedQuestionnaireType === 'formation'
                            ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600'
                            : selectedQuestionnaireType === 'coach'
                              ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600'
                              : 'bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copier le Document {selectedQuestionnaireType === 'local' ? '10.1' : selectedQuestionnaireType === 'vitrine' ? '10.2' : selectedQuestionnaireType === 'formation' ? '10.3-A' : selectedQuestionnaireType === 'coach' ? '10.3-B' : '10.4'} complet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT: DISCOVERY CALL INTERACTIVE SCRIPT */}
      {activeTab === 'discovery' && (
        <div className="space-y-6 animate-slide-in">
          {/* Internal subtab switcher for Discovery Call */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/5 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Script de Qualification Directe — Appel Onboarding
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {([
                { id: 'posture', label: '1. Posture & Accroche 🗣️' },
                { id: 'prep', label: '2. Préparation 📝' },
                { id: 'guide', label: '3. Guide Diagnostic 💡' },
                { id: 'scoring', label: '4. Scoring Prospect 📈' },
                { id: 'summary', label: '5. Compte-Rendu WhatsApp 📲' }
              ] as const).map(sub => {
                const isActive = activeDiscoverySection === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveDiscoverySection(sub.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 font-extrabold'
                        : isDark ? 'text-zinc-400 hover:text-white hover:bg-white/[0.02]' : 'text-slate-650 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBSECTION 1: POSTURE & ACCROCHE */}
          {activeDiscoverySection === 'posture' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-black/20 border-white/[0.04]' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
                  <h4 className={`text-xs font-black uppercase tracking-widest font-mono ${isDark ? 'text-sky-400' : 'text-blue-700'}`}>
                    Cadre relationnel & Posture
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-650'}`}>
                    On ne vend pas un design tout de suite. D&apos;abord, on extrait la matière : ce que le client veut construire, à qui il parle, quelle offre il vend, quelles preuves il possède, quel résultat le site doit produire et quelle action le visiteur doit faire.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold">
                    {[
                      { r: "Demander l'accord d'enregistrement", p: "Permet de récupérer les mots exacts du client, les besoins explicites et les non-dits utiles au copywriting sémantique." },
                      { r: "Clarifier avant de chiffrer", p: "Un devis sans objectif précis finit toujours en projet flou, sous-facturé ou interminable." },
                      { r: "Reformuler régulièrement", p: "Le client doit sentir que vous le comprenez parfaitement. La reformulation prépare déjà la signature." },
                      { r: "Ne pas promettre trop tôt", p: "On ne promet pas une formule au hasard avant de valider la maturité et la préparation réelle de l'interlocuteur." },
                      { r: "Faire payer le flou", p: "Si le client ne sait pas ce qu'il veut, proposez d'abord un cadrage stratégique facturable plutôt que de produire à l'aveugle gratuitement." }
                    ].map((rule, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border ${isDark ? 'bg-[#0a0f21]/30 border-white/[0.04]' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`font-black text-[11px] uppercase tracking-wide flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                          <Check className="w-3.5 h-3.5" />
                          {rule.r}
                        </div>
                        <p className={`text-[10px] leading-relaxed mt-1 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{rule.p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hook Script copyable on the right panel */}
              <div className="lg:col-span-2 space-y-4">
                <div className={`p-5 rounded-2xl border flex flex-col justify-between h-full ${isDark ? 'bg-[#091122]/80 border-white/[0.04]' : 'bg-slate-100/60 border-slate-200'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#0fa5e9]" />
                      <h4 className={`text-xs font-black uppercase tracking-widest font-mono ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        Script Verbal d’Ouverture (Message Prêt)
                      </h4>
                    </div>

                    <div className={`p-4 rounded-xl border leading-relaxed text-[11px] font-bold font-mono ${isDark ? 'bg-black/30 border-white/[0.04] text-zinc-350' : 'bg-white border-slate-200 text-slate-700 shadow-inner'}`}>
                      &ldquo;Avant qu’on commence, je vous préviens : je peux enregistrer l’échange avec votre accord. Ce n’est pas pour diffuser quoi que ce soit, c’est simplement pour ne rien perdre de votre vision, de vos mots, de vos besoins et des détails importants du projet.

                      L’objectif aujourd’hui n’est pas de vous vendre une formule au hasard. Je vais d’abord comprendre votre activité, votre objectif, ce que vous avez déjà, ce qui manque, puis je pourrai vous recommander le niveau de projet le plus adapté.

                      À la fin de l’échange, soit je vous oriente vers une offre claire, soit je vous dis franchement qu’il faut d’abord cadrer davantage avant de faire un devis sérieux.&rdquo;
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(
                      `Avant qu’on commence, je vous préviens : je peux enregistrer l’échange avec votre accord. Ce n’est pas pour diffuser quoi que ce soit, c’est simplement pour ne rien perdre de votre vision, de vos mots, de vos besoins et des détails importants du projet.\n\nL’objectif aujourd’hui n’est pas de vous vendre une formule au hasard. Je vais d’abord comprendre votre activité, votre objectif, ce que vous avez déjà, ce qui manque, puis je pourrai vous recommander le niveau de projet le plus adapté.\n\nÀ la fin de l’échange, soit je vous oriente vers une offre claire, soit je vous dis franchement qu’il faut d’abord cadrer davantage avant de faire un devis sérieux.`,
                      "Script d'ouverture"
                    )}
                    className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-extrabold text-[11px] text-neutral-950 uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier l&apos;accroche d&apos;ouverture</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUBSECTION 2: PREPARATION TIMELINE */}
          {activeDiscoverySection === 'prep' && (
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#091122]/60 border-white/[0.04]' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <h4 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Checklist d&apos;Avant-Appel</h4>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Prendre 2 minutes pour passer les cases au vert avant de lancer le coup de téléphone.</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-zinc-500">Préparation :</span>
                  <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                    prepChecked.length === prepChecklist.length 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                  }`}>
                    {prepChecked.length} / {prepChecklist.length} ({Math.round((prepChecked.length / prepChecklist.length) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-300"
                  style={{ width: `${(prepChecked.length / prepChecklist.length) * 105}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {prepChecklist.map((item) => {
                  const isChecked = prepChecked.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isChecked) {
                          setPrepChecked(prev => prev.filter(id => id !== item.id));
                        } else {
                          setPrepChecked(prev => [...prev, item.id]);
                        }
                      }}
                      className={`p-3.5 border rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isChecked 
                          ? isDark 
                            ? 'bg-sky-500/5 border-sky-500/20 text-sky-450 shadow-inner shadow-sky-500/5' 
                            : 'bg-emerald-50/60 border-emerald-250 text-emerald-950 font-semibold shadow-sm'
                          : isDark
                            ? 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:bg-white/[0.02]'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-655'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked 
                          ? 'bg-emerald-500 border-emerald-400 text-neutral-950 font-black text-xs' 
                          : isDark ? 'border-zinc-700 bg-[#060a16]' : 'border-slate-350 bg-white'
                      }`}>
                        {isChecked && "✓"}
                      </span>
                      <span className="text-xs font-semibold leading-relaxed">{item.text}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setPrepChecked(prepChecklist.map(i => i.id))}
                  className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 border rounded-lg transition-all cursor-pointer ${
                    isDark ? 'border-white/5 hover:bg-white/5 text-zinc-400' : 'border-slate-200 hover:bg-slate-50 text-slate-705'
                  }`}
                >
                  Tout cocher
                </button>
              </div>
            </div>
          )}

          {/* SUBSECTION 3: DIAG_GUIDE WITH GENERAL BLOCKS & CUSTOM TYPES */}
          {activeDiscoverySection === 'guide' && (
            <div className="space-y-6">
              {/* General Diagnostic Blocs */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {diagnosticBlocs.map(bloc => (
                  <div 
                    key={bloc.id} 
                    className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-black/20 border-white/[0.04]' : 'bg-white border-slate-205 shadow-sm'}`}
                  >
                    <div className="space-y-1">
                      <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{bloc.title}</h4>
                      <p className={`text-[10px] font-bold leading-normal ${isDark ? 'text-[#0fa5e9]' : 'text-blue-800'}`}>{bloc.subtitle}</p>
                    </div>

                    <div className="space-y-3">
                      {bloc.questions.map((item, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-xl border space-y-2 ${isDark ? 'bg-[#0a0f21]/40 border-white/[0.02]' : 'bg-slate-50 border-slate-150'}`}
                        >
                          <div className={`text-xs font-bold leading-relaxed italic ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                            {item.q}
                          </div>
                          
                          <div className="flex justify-between items-center gap-3 pt-1 border-t border-dashed border-zinc-200/5 dark:border-zinc-800/40">
                            <span className="text-[9px] uppercase font-bold text-zinc-500">
                              💡 Objectif : {item.purpose}
                            </span>
                            
                            <button
                              onClick={() => handleCopy(item.q, 'Question')}
                              className={`p-1 hover:bg-white/[0.05] rounded transition-all cursor-pointer ${isDark ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                              title="Copier la question"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Questions by project types */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#091122]/60 border-white/[0.04]' : 'bg-white border-slate-200 shadow-sm'} space-y-5`}>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-0.5">
                    <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Questions Spécifiques par Branche Client
                    </h4>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Filtrez les questions chirurgicales d&apos;onboarding selon le métier de votre interlocuteur.
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap items-center gap-2 bg-black/[0.06] dark:bg-white/[0.01] p-1 border rounded-xl">
                    {projectTypesQuestions.map(p => {
                      const isActive = activeProjectCategory === p.type;
                      return (
                        <button
                          key={p.type}
                          onClick={() => setActiveProjectCategory(p.type as any)}
                          className={`px-3 py-1.5 text-xs font-black tracking-wide rounded-lg cursor-pointer transition-all ${
                            isActive 
                              ? 'bg-blue-600 text-neutral-950 font-black shadow-md'
                              : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-655 hover:text-slate-950'
                          }`}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Render questions for active project type */}
                {(() => {
                  const activeType = projectTypesQuestions.find(t => t.type === activeProjectCategory)!;
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pt-2">
                      <div className="lg:col-span-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest font-mono px-2 py-1 rounded bg-[#a855f7]/5 border border-[#a855f7]/20 text-purple-400`}>
                            {activeType.badge}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {activeType.questions.map((q, idx) => (
                            <div 
                              key={idx}
                              className={`p-3.5 rounded-xl border flex justify-between items-start gap-4 ${
                                isDark ? 'bg-black/30 border-white/[0.04]' : 'bg-slate-50 border-slate-150 shadow-sm'
                              }`}
                            >
                              <div className={`text-xs font-black italic leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                {q}
                              </div>
                              <button
                                onClick={() => handleCopy(q, 'Question')}
                                className={`p-1.5 border border-dashed rounded-lg transition-all shrink-0 cursor-pointer ${
                                  isDark ? 'border-zinc-700 text-zinc-500 hover:text-white hover:bg-white/5' : 'border-slate-350 text-slate-550 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                                title="Copier"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Side Recommendation for Nümtema sales member */}
                      <div className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col justify-between ${
                        isDark ? 'bg-black/30 border-white/[0.04]' : 'bg-slate-50 border-slate-200/80 shadow-inner'
                      }`}>
                        <div className="space-y-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${isDark ? 'text-sky-400' : 'text-blue-700'}`}>
                            FORMULE RECOMMANDÉE NÜMTEMA
                          </span>

                          <div className="space-y-2">
                            <h5 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {offersList.find(o => o.id === activeType.suggested)?.name}
                            </h5>
                            <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                              {offersList.find(o => o.id === activeType.suggested)?.tagline}
                            </p>
                          </div>

                          <div className={`p-3 rounded-xl border text-[11px] font-semibold leading-relaxed flex items-start gap-2 ${
                            isDark ? 'bg-sky-500/5 border-sky-500/10 text-sky-400' : 'bg-blue-50 border-blue-150 text-blue-700'
                          }`}>
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 select-none shrink-0" />
                            <span><strong>Raisonnement : </strong>{activeType.reason}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-dashed border-zinc-200/10 dark:border-zinc-800/80">
                          <button
                            onClick={() => {
                              setSelectedOfferId(activeType.suggested);
                              setActiveTab('offers');
                            }}
                            className={`w-full py-2 border rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isDark 
                                ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] text-white' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                            }`}
                          >
                            <span>Visualiser la formule complète</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Warnings and Red Flags during conversation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#991b1b]/5 border-[#f87171]/10' : 'bg-rose-50/20 border-rose-150 shadow-sm'} space-y-3`}>
                  <h4 className="text-xs font-black uppercase tracking-widest font-mono text-rose-500">
                    🚨 Signaux Rouges & Alerte Dérives
                  </h4>
                  
                  <div className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    <div className="flex gap-2">
                      <span className="text-rose-500 font-mono shrink-0">■</span>
                      <span><strong>Le client ne sait pas ce qu&apos;il veut :</strong> Gros risque d&apos;allers-retours infinis. Proposez d&apos;abord un cadrage payant de 200€ au lieu d&apos;un gros devis imprécis.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-rose-500 font-mono shrink-0">■</span>
                      <span><strong>Veut tout pour un petit budget :</strong> Décalage de valeur. Renvoyez fermement à notre formule Présence Essentielle minimale brute de base.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-rose-500 font-mono shrink-0">■</span>
                      <span><strong>Zéro asset disponible :</strong> Pas de photos, pas de textes, pas de logo. Ajoutez obligatoirement le module d&apos;option Copywriting ou Branding au devis.</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#065f46]/5 border-[#34d399]/10' : 'bg-emerald-50/20 border-emerald-150 shadow-sm'} space-y-3`}>
                  <h4 className="text-xs font-black uppercase tracking-widest font-mono text-emerald-500">
                    🛡️ Règles Finales de Sécurisation Nümtema
                  </h4>
                  
                  <div className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    <div className="flex gap-2">
                      <span className="text-emerald-500 font-mono shrink-0">✓</span>
                      <span><strong>Pas de production sans cadre :</strong> Aucun développement ne démarre sans avoir reçu le devis signé électroniquement de part et d&apos;autre.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-emerald-500 font-mono shrink-0">✓</span>
                      <span><strong>Pas de démarrage sans acompte :</strong> L&apos;acompte minimum officiel est exigé et encaissé sur notre compte bancaire avant de réserver le calendrier.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-emerald-500 font-mono shrink-0">✓</span>
                      <span><strong>Pas de design sans questionnaire :</strong> Le client remplit obligatoirement son questionnaire d&apos;activité avant le début du maquettage.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBSECTION 4: INTERACTIVE SCORING CALCULATOR */}
          {activeDiscoverySection === 'scoring' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Scoring criteria left side */}
              <div className="lg:col-span-8 space-y-4">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-black/20 border-white/[0.04]' : 'bg-white border-slate-205 shadow-sm'} space-y-4`}>
                  <div className="space-y-0.5">
                    <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Grille de Scoring Prospect
                    </h4>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Évaluez la qualité de l&apos;interlocuteur pendant l&apos;échange pour valider le niveau d&apos;engagement de l&apos;agence.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {scoringCriteria.map((crit) => (
                      <div 
                        key={crit.key}
                        className={`p-3.5 rounded-xl border space-y-2.5 ${isDark ? 'bg-[#0a0f21]/40 border-white/[0.04]' : 'bg-slate-50 border-slate-150'}`}
                      >
                        <span className={`text-[11px] font-black uppercase tracking-wider font-mono ${isDark ? 'text-zinc-350' : 'text-slate-600'}`}>{crit.label}</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {crit.options.map((opt) => {
                            const isSelected = discoveryScoring[crit.key] === opt.pts;
                            return (
                              <button
                                key={opt.pts}
                                onClick={() => {
                                  setDiscoveryScoring(prev => ({
                                    ...prev,
                                    [crit.key]: opt.pts
                                  }));
                                }}
                                className={`p-2.5 border rounded-lg text-left text-[11px] leading-snug font-semibold transition-all cursor-pointer relative flex flex-col justify-between ${
                                  isSelected
                                    ? isDark 
                                      ? 'bg-sky-500/10 border-sky-400 text-sky-400 font-extrabold shadow-sm' 
                                      : 'bg-blue-50 border-blue-400 text-blue-900 font-extrabold border-2'
                                    : isDark
                                      ? 'bg-white/[0.01] border-white/[0.02] text-zinc-400 hover:border-white/[0.05]'
                                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-655'
                                }`}
                              >
                                <span>{opt.text}</span>
                                <span className={`text-[9px] font-black font-mono mt-1 px-1.5 py-0.5 rounded ${
                                  isSelected 
                                    ? isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-blue-105 text-blue-700'
                                    : isDark ? 'bg-white/5 text-zinc-550' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {opt.pts} {opt.pts === 1 ? 'point' : 'points'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Score Results sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <div className={`p-5 rounded-2xl border sticky top-4 flex flex-col justify-between space-y-5 h-auto ${
                  isDark ? 'bg-[#091122]/80 border-white/[0.04]' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}>
                  <div className="space-y-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${isDark ? 'text-sky-400' : 'text-blue-700'}`}>
                      ÉVALUATION EN DIRECT
                    </span>

                    <div className="text-center py-5 rounded-2xl bg-black/25 dark:bg-black/55 border border-zinc-200/5 space-y-1">
                      <div className={`text-4xl font-mono font-black ${
                        scoringTotal >= 10 ? 'text-emerald-400' : (scoringTotal >= 6 ? 'text-amber-400' : 'text-rose-455')
                      }`}>
                        {scoringTotal} <span className="text-lg opacity-40">/ 14</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-zinc-500">Points Accumulés</span>
                    </div>

                    <div className={`p-4 rounded-xl border ${scoringAssessment.color} space-y-2`}>
                      <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                        <span>{scoringAssessment.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed font-bold opacity-90">{scoringAssessment.advice}</p>
                    </div>

                    <div className="space-y-2 text-xs font-semibold">
                      <span className="text-[10px] uppercase font-black text-zinc-500 dark:text-zinc-500 leading-none">Baromètre Nümtema :</span>
                      <ul className="space-y-1.5 pl-1 text-[10px] divide-y divide-zinc-200/5 dark:divide-zinc-850/40">
                        <li className="flex justify-between py-1">
                          <span className="text-rose-400 font-extrabold">0 à 5 points :</span>
                          <span className="text-zinc-400">Fragile (cadrer fortement, accompte 45%+)</span>
                        </li>
                        <li className="flex justify-between py-1">
                          <span className="text-amber-400 font-extrabold">6 à 9 points :</span>
                          <span className="text-zinc-400">Moyen (limiter aux offres socles)</span>
                        </li>
                        <li className="flex justify-between py-1">
                          <span className="text-emerald-400 font-extrabold">10 à 14 points :</span>
                          <span className="text-zinc-400">Bon prospect (envoyer devis complet)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setDiscoveryScoring({ needs: 1, budget: 1, urgency: 1, assets: 1, decision: 2, fit: 1, potential: 1 })}
                      className={`w-full py-2 border rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                        isDark 
                          ? 'bg-transparent border-white/5 hover:bg-white/5 text-zinc-450' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-550'
                      }`}
                    >
                      Réinitialiser le scoring
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBSECTION 5: LIVE COMPTE-RENDU WHATSAPP GENERATOR */}
          {activeDiscoverySection === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side: Input options to dynamically compile the WhatsApp output */}
              <div className="lg:col-span-5 space-y-4">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-black/20 border-white/[0.04]' : 'bg-white border-slate-205 shadow-sm'} space-y-4`}>
                  <div className="space-y-0.5">
                    <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Variable de Synthèse de l&apos;Appel
                    </h4>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Complétez les variables en direct pour compiler instantanément le compte-rendu légitime.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-extrabold text-zinc-550 dark:text-zinc-450 uppercase text-[10px] tracking-wider">Prénom ou Nom du Prospect :</label>
                      <input 
                        type="text" 
                        value={discoveryClientName}
                        onChange={(e) => setDiscoveryClientName(e.target.value)}
                        placeholder="Ex: Folie, Jean, Isabelle"
                        className={`px-3 py-2 border rounded-xl font-bold transition-all focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                          isDark ? 'bg-black/40 border-white/10 text-white focus:border-sky-400/40' : 'bg-white border-slate-250 text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-extrabold text-zinc-550 dark:text-zinc-450 uppercase text-[10px] tracking-wider">Objectif Client prioritaire :</label>
                      <input 
                        type="text" 
                        value={discoveryGoal}
                        onChange={(e) => setDiscoveryGoal(e.target.value)}
                        placeholder="Ex: asseoir votre autorité, vendre vos infoproduits"
                        className={`px-3 py-2 border rounded-xl font-bold transition-all focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                          isDark ? 'bg-black/40 border-white/10 text-white focus:border-sky-400/40' : 'bg-white border-slate-250 text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="font-extrabold text-zinc-550 dark:text-zinc-450 uppercase text-[10px] tracking-wider">Type de Projet & Recommandation :</label>
                      <div className="grid grid-cols-2 gap-2">
                        {projectTypesQuestions.map(p => {
                          const isActive = activeProjectCategory === p.type;
                          return (
                            <button
                              key={p.type}
                              onClick={() => setActiveProjectCategory(p.type as any)}
                              className={`p-2.5 border rounded-xl text-left text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                                isActive 
                                  ? isDark ? 'bg-sky-500/10 border-sky-450 text-sky-450' : 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm'
                                  : isDark ? 'bg-white/[0.01] border-white/5 text-zinc-500' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <div>{p.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Message Output Compiled */}
              <div className="lg:col-span-7 space-y-4">
                <div className={`p-5 rounded-2xl border flex flex-col justify-between h-full ${
                  isDark ? 'bg-[#091122]/80 border-white/[0.04]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="space-y-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${isDark ? 'text-sky-400' : 'text-blue-700'}`}>
                      COMPTE-RENDU PRÊT À EXPÉDIER
                    </span>

                    <textarea
                      readOnly
                      value={followUpMessage}
                      className={`w-full p-4 rounded-xl border font-mono text-[10.5px] leading-relaxed resize-none h-80 focus:outline-none select-text ${
                        isDark ? 'bg-black/50 border-white/[0.04] text-zinc-350' : 'bg-white border-slate-200 text-slate-700 shadow-inner'
                      }`}
                    />
                  </div>

                  <button
                    onClick={() => handleCopy(followUpMessage, 'Message Client')}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 via-sky-405 to-cyan-405 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-102 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le compte-rendu de suivi (WhatsApp/Email)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEWPORT 2: THE 13-STAGE CLIENT PIPELINE EXPLORER */}
      {activeTab === 'pipeline' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <ListTodo className={`w-5 h-5 ${isDark ? 'text-sky-400' : 'text-blue-500'}`} />
            <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Process Client Officiel Nümtema Agency</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pipelineSteps.map((step) => (
              <div
                key={step.num}
                className={`p-4 rounded-xl border space-y-3 relative ${
                  isDark 
                    ? 'bg-[#0a0f21]/50 border-white/[0.04]' 
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="absolute top-4 right-4 text-3xl font-black font-mono opacity-10 dark:opacity-5 select-none">{step.num}</div>
                
                <div className="space-y-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest font-mono text-zinc-500 dark:text-zinc-500`}>Étape {step.num}</span>
                  <h4 className={`text-sm font-black leading-tight ${isDark ? 'text-slate-205' : 'text-slate-900'}`}>{step.name}</h4>
                </div>

                <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500 shadow-none'}`}>{step.desc}</p>
                
                <div className="space-y-1.5 pt-2 border-t border-dashed border-zinc-200/10 dark:border-zinc-800/80">
                  <div className="text-[10px] leading-tight-short">
                    <span className="font-extrabold text-[#0fa5e9] dark:text-sky-400">Objectif : </span>
                    <span className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{step.objective}</span>
                  </div>
                  <div className="text-[10px] leading-tight-short">
                    <span className="font-extrabold text-blue-650 dark:text-[#a855f7]">Support : </span>
                    <span className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{step.doc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEWPORT 3: OBJECTIONS METHODOLOGY WORKBOOK */}
      {activeTab === 'objections' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle className={`w-5 h-5 ${isDark ? 'text-sky-400' : 'text-blue-500'}`} />
            <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Playbook Arguments & Réponses aux Objections</h3>
          </div>

          <div className="space-y-3">
            {objectionsPlaybook.map((obj) => {
              const isExpanded = expandedObjection === obj.id;
              return (
                <div
                  key={obj.id}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isExpanded 
                      ? isDark ? 'bg-sky-500/5 border-sky-450/40' : 'bg-blue-50/50 border-blue-300'
                      : isDark ? 'bg-[#0a0f21]/20 border-white/[0.04] hover:bg-[#0c132b]/50' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => setExpandedObjection(isExpanded ? null : obj.id)}
                    className="w-full p-4 text-left flex justify-between items-center cursor-pointer"
                  >
                    <span className={`text-xs md:text-sm font-black pr-6 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{obj.q}</span>
                    <span className="shrink-0 text-zinc-500">{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3.5 border-t border-dashed border-zinc-200/10 dark:border-zinc-805/40 pt-4">
                      <div className={`p-4 rounded-xl border leading-relaxed text-xs font-semibold font-mono ${
                        isDark ? 'bg-black/40 border-white/[0.04] text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        {obj.ans}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="text-[10px] font-bold text-zinc-500">
                          <span className="text-amber-500">Conseil Nümtema : </span>
                          <span>{obj.tip}</span>
                        </div>

                        <button
                          onClick={() => handleCopy(obj.ans, 'Argument')}
                          className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                            isDark 
                              ? 'bg-sky-500/10 border-sky-505/20 text-sky-400 hover:bg-sky-500/15' 
                              : 'bg-white border-blue-200 hover:bg-blue-50 text-blue-700 shadow-sm'
                          }`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le script verbal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEWPORT 4: CLAUSES CONTRACTUELLES NOIR SUR BLANC */}
      {activeTab === 'clauses' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Scale className={`w-5 h-5 ${isDark ? 'text-sky-400' : 'text-blue-500'}`} />
            <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Clauses Contractuelles Noir sur Blanc (Protéger son temps)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-in">
            {clausesContractuelles.map((clause, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  isDark 
                    ? 'bg-[#0a0f21]/50 border-white/[0.04]' 
                    : 'bg-white border-slate-205 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <h4 className={`text-xs md:text-sm font-black flex items-center gap-2 ${isDark ? 'text-slate-105' : 'text-slate-900'}`}>
                    <span className="p-1 rounded bg-[#a855f7]/5 border border-[#a855f7]/15 text-purple-400"><FileText className="w-3.5 h-3.5" /></span>
                    {clause.title}
                  </h4>
                  <div className={`p-3.5 rounded-xl border leading-relaxed text-[11px] font-bold font-mono ${
                    isDark ? 'bg-black/30 border-white/[0.04] text-zinc-350' : 'bg-slate-50 border-slate-150 text-slate-700'
                  }`}>
                    {clause.text}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1 border-t border-dashed border-zinc-200/10 dark:border-zinc-800/80">
                  <span className={`text-[9.5px] italic font-semibold ${isDark ? 'text-zinc-500' : 'text-slate-450'}`}>{clause.usage}</span>
                  
                  <button
                    onClick={() => handleCopy(clause.text, 'Clause')}
                    className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDark 
                        ? 'bg-sky-500/10 border-sky-500/10 hover:bg-sky-500/15 text-sky-400' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier la clause</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Quick fallback inline icon for higher authority banner
function AwardIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
      />
    </svg>
  );
}
