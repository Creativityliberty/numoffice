import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper function to call Gemini generateContent with auto-retries on 503/transient errors, and fallback to a secondary model
async function generateContentWithRetry(aiClient: any, params: any, retries = 3, delayMs = 1500) {
  let lastError: any = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await aiClient.models.generateContent(params);
    } catch (error: any) {
      lastError = error;
      const errMsg = String(error?.message || error || "");
      const isTransient = errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("429") || errMsg.includes("Too Many Requests") || errMsg.includes("high demand") || errMsg.includes("ResourceExhausted") || errMsg.includes("overloaded");
      if (isTransient) {
        console.warn(`[Gemini API] Transient error (attempt ${attempt + 1}/${retries}): ${errMsg}. Retrying in ${delayMs * Math.pow(1.5, attempt)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(1.5, attempt)));
        continue;
      }
      throw error;
    }
  }

  // All retries with primary model failed, let's try fallback to gemini-3.1-flash-lite
  if (params.model === "gemini-3.5-flash") {
    try {
      console.warn("[Gemini API] Falling back to secondary model gemini-3.1-flash-lite...");
      const fallbackParams = { ...params, model: "gemini-3.1-flash-lite" };
      return await aiClient.models.generateContent(fallbackParams);
    } catch (fallbackError: any) {
      console.error("[Gemini API] Fallback model also failed:", fallbackError);
    }
  }

  throw lastError;
}

// Post route to handle director requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, clients, projects, userPrompt } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "La clé d'API GEMINI_API_KEY n'est pas configurée dans les variables d'environnement." },
        { status: 500 }
      );
    }

    if (action === "health-check") {
      // Prompt for production health check
      const systemInstruction = `Tu es le Directeur de Production Virtuel de l'agence web Nümtema.
Ton rôle est d'analyser l'état de production des projets en cours d'après la liste des clients et projets fournie, de détecter les risques (retards financiers, blocages, livraisons en suspens) et de donner 3 recommandations stratégiques exploitables pour optimiser la production aujourd'hui.

Analyse attentivement :
1. Blocages : projets ayant un blocker différent de 'none' (ex: attente_textes, attente_paiement).
2. Écarts financiers : par exemple, un projet très avancé (> 50%) mais avec une faible proportion payée (< 30%).
3. Délais de livraison : proximité de la date de fin par rapport à l'état d'avancement (étapes complétées).
4. Surcharge : répartition équitable.

Retourne un rapport strictement au format JSON correspondant au schéma spécifié.`;

      const prompt = `Voici la liste des clients :
${JSON.stringify(clients, null, 2)}

Voici l'état des projets correspondants :
${JSON.stringify(projects, null, 2)}

Effectue une analyse rigoureuse et remplis le schéma JSON. Reste professionnel, dynamique et encourageant (ton d'un "Directeur de production" talentueux, orienté croissance d'agence).`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthScore: {
                type: Type.INTEGER,
                description: "Score de santé global de l'agence de 0 à 100",
              },
              summary: {
                type: Type.STRING,
                description: "Un court résumé stratégique de la situation actuelle.",
              },
              risks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clientId: { type: Type.STRING, description: "ID du client ou projet concerné" },
                    clientName: { type: Type.STRING, description: "Nom du client ou de l'entreprise" },
                    level: { type: Type.STRING, description: "Niveau de risque: high, medium, low" },
                    type: { type: Type.STRING, description: "Type de risque: financier, bloquant, delai, inctif" },
                    description: { type: Type.STRING, description: "Explication claire et percutante du risque" },
                  },
                  required: ["clientId", "clientName", "level", "type", "description"]
                },
                description: "La liste des anomalies et risques de production identifiés.",
              },
              priorities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Top 3 des actions/priorités concrètes et prioritaires de la journée pour débloquer la croissance.",
              }
            },
            required: ["healthScore", "summary", "risks", "priorities"]
          }
        }
      });

      const resultText = response.text || "{}";
      return NextResponse.json(JSON.parse(resultText));

    } else if (action === "command") {
      if (!userPrompt) {
        return NextResponse.json({ error: "Le paramètre userPrompt est obligatoire." }, { status: 400 });
      }

      const systemInstruction = `Tu es l'Assistant de Production IA intelligent de Nümtema Office.
Ton travail est de comprendre la commande de l'utilisateur (écrite ou dictée) afin de créer ou modifier un client et son projet associé dans le système de suivi.

Voici la Grille Officielle des Offres de Nümtema Agency à utiliser pour toute création ou conseil de devis :
- 'presence_essentielle' (Présence Essentielle) : 800 € fixe. Acompte standard de 200 €. Pour les indépendants, artisans, activités locales simples. Site 1 à 3 pages, contact direct.
- 'presence_pro' (Présence Pro) : 1200 à 1500 €. Acompte standard de 300 à 500 €. Pour coachs, thérapeutes, consultants sérieux. 4 à 5 pages, confiance et conversion claire.
- 'systeme_client' (Système Client) : 1800 à 2500 €+. Acompte standard de 600 à 800 €. Pour business voulant des rendez-vous et qualifications (formulaires qualifiants, chatbot simple, tunnel).
- 'ecommerce' (E-commerce) : 1800 €+ de départ. Acompte de 600 €+. Boutique en ligne ou catalogue selon la maturité.
- 'funnelhub_signature' (FunnelHub Signature) : 3000 à 5000 €+. Acompte standard de 1000 à 2000 €+. Pour experts et formateurs, centre d'autorité complet (storytelling, value ladder, offres multiples).
- 'sur_mesure' (Sur-mesure) : 5000 €+. Acompte standard de 2000 €+. Projets complexes, automatisations fortes.
- 'formation_atelier' (Workshop / Formation) et 'autre' pour le reste.

Règles importantes d'affaires :
- Le projet démarre uniquement après la signature du devis et la réception de l'acompte minimum.
- 2 cycles de retouche maximum sont inclus par défaut. Tout extra doit faire l'objet d'un avenant pécuniaire.
- Le nom de domaine et l'hébergement restent à la charge exclusive du client.
- Les textes légaux (Mentions, CGV) doivent être fournis ou validés par le client.
- Pas de cession automatique de code source sans accord contractuel écrit.

Voici les règles de modélisation de notre base de données :
- Types de projets (projectType) acceptés : 'site_vitrine' (Site Web Vitrine), 'e_commerce' (Boutique E-commerce), 'flyers' (Graphisme / Flyers), 'funnel_hub' (Funnel Hub), 'google_business' (Fiche Google Business), 'logo' (Identité de Logo), 'formation' (Académie / Formation).
- Offres commerciales (offerName) acceptées : 'presence_essentielle', 'presence_pro', 'systeme_client', 'ecommerce', 'funnelhub_signature', 'sur_mesure', 'formation_atelier', 'autre'.

Quand l'utilisateur demande de créer un projet/client :
1. Extrais intelligemment le nom du projet/entreprise (ex: "Boulangerie Dupont"), le nom du contact ("Marc Dupont"), l'email, le téléphone. S'ils sont absents, invente des coordonnées génériques cohérentes ou basées sur le nom.
2. Identifie le projectType et l'offerName les plus proches de sa description. S'aligner scrupuleusement avec la grille officielle ci-dessus pour pré-remplir le budget (quoteAmount) et l'acompte (amountPaid).
3. Génère Optionnellement une liste d'étapes de suivi adaptées ("steps") sous forme de tableau de chaînes de caractères si l'utilisateur demande des étapes spécifiques ou si tu proposes 4-6 étapes d'accompagnement idéales et sur-mesure pour ce type de projet.
4. Détermine également le 'currentBlocker' si précisé (ex: "attente_photos", etc.).

Retourne une réponse JSON structurée qui décrit l'action à exécuter par notre frontend pour mettre à jour l'application en direct.`;

      const promptContext = `Liste des clients existants pour référence (pour éviter les doublons ou si l'utilisateur demande une mise à jour d'un client existant):
${JSON.stringify(clients, null, 2)}

Commande utilisateur : "${userPrompt}"`;

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: promptContext,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              understood: {
                type: Type.BOOLEAN,
                description: "true si la commande a été comprise et peut être exécutée en base",
              },
              feedback: {
                type: Type.STRING,
                description: "Un message chaleureux expliquant ce qui a été fait (ex: 'Projet Boulangerie Dupont créé avec succès ! J'ai initialisé le devis à 1200€ et configuré 5 jalons.')",
              },
              commandAction: {
                type: Type.STRING,
                description: "Action à exécuter: 'create_client', 'update_project_notes', 'unknown'",
              },
              clientData: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Nom du contact (ex: Jean Claude)" },
                  company: { type: Type.STRING, description: "Nom de l'entreprise (ex: Boulangerie Dupont)" },
                  email: { type: Type.STRING, description: "Adresse email du contact" },
                  phone: { type: Type.STRING, description: "Téléphone de contact" },
                  projectType: { type: Type.STRING, description: "L'un des types de projets valides" },
                  offerName: { type: Type.STRING, description: "L'une des offres valides" },
                },
                required: ["name", "company", "email", "phone", "projectType", "offerName"]
              },
              projectData: {
                type: Type.OBJECT,
                properties: {
                  quoteAmount: { type: Type.NUMBER, description: "Montant total du devis" },
                  amountPaid: { type: Type.NUMBER, description: "Montant acompte versé" },
                  notes: { type: Type.STRING, description: "Notes de suivi associées" },
                  currentBlocker: { type: Type.STRING, description: "Jalon bloquant actuel" },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Jalons personnalisés sur-mesure pour le projet (ex: ['Briefing', 'Zonage', 'Maquette', 'Ajustement', 'Livraison'])",
                  }
                },
                required: ["quoteAmount", "amountPaid"]
              }
            },
            required: ["understood", "feedback", "commandAction"]
          }
        }
      });

      const resultText = response.text || "{}";
      return NextResponse.json(JSON.parse(resultText));
    } else if (action === "analyze-brief") {
      const { fileBase64, fileType, fileName } = body;

      const parts: any[] = [];
      if (fileBase64 && fileType) {
        parts.push({
          inlineData: {
            mimeType: fileType,
            data: fileBase64
          }
        });
      }

      parts.push({
        text: `Tu es le Directeur de Production Virtuel de l'agence web Nümtema.
Analyse attentivement le document de brief ou cahier des charges fourni${fileName ? ` (Nom du fichier : "${fileName}")` : ""}.
Extrais le nom du client (contact), le nom de l'entreprise ou projet, l'e-mail, le téléphone, le type de projet optimal, l'offre commerciale optimale, estime le budget adéquat (Frais d'agence global en euros) d'après les livrables décrits, l'acompte typique, le délai de livraison estimé en jours, rédige une fiche technique / étude de besoins très détaillée, structurée et élégante en français (en markdown avec objectifs, de quoi il s'agit, technologies recommandées) et génère une liste de jalons ou d'étapes d'accompagnement sur-mesure de 4 à 6 étapes clés bien calibrées.

Voici notre Grille Officielle des Offres Nümtema Agency de référence à utiliser scrupuleusement pour choisir l'offre commerciale la plus proche, configurer son prix ("quoteAmount") et son acompte ("amountPaid") :
- 'presence_essentielle' : 800 € fixe (Acompte : 200 €). Pour sites de 1 à 3 pages simples, artisans, visibilité rapide.
- 'presence_pro' : 1200 à 1500 € (Acompte : 300 à 500 €). Pour sites de 4 à 5 pages de confiance, design et copywriting pro.
- 'systeme_client' : 1800 à 2500 €+ (Acompte : 600 à 800 €). Pour intégration de rendez-vous qualifiés, formulaires, questionnaires, chatbot simple.
- 'ecommerce' : 1800 €+ de départ (Acompte : 600 €+). Pour boutiques ou catalogues de produits sérieux.
- 'funnelhub_signature' : 3000 à 5000 €+ (Acompte : 1000 à 2000 €). Pour experts, autorité complète, value ladder, offres premium.
- 'sur_mesure' : 5000 €+ (Acompte : 2000 €+). Pour architectures d'affaires complexes.

Règles de cadrage importantes d'affaires :
- Le budget ne comprend jamais l'achat du nom de domaine ni de l'hébergement (à la charge du client).
- Il n'y a pas de cession de code source automatique à la livraison.
- 2 cycles de retouche maximum sont autorisés par phase de validation.
- Les livrables légaux doivent être produits ou validés par le client.

Voici les valeurs de champ autorisées pour notre base de données :
- Types de projets (projectType) acceptés : 'site_vitrine', 'e_commerce', 'flyers', 'funnel_hub', 'google_business', 'logo', 'formation'
- Offres commerciales (offerName) acceptées : 'presence_essentielle', 'presence_pro', 'systeme_client', 'ecommerce', 'funnelhub_signature', 'sur_mesure', 'formation_atelier', 'autre'

Génère une réponse JSON valide correspondant au schéma attendu pour configurer immédiatement ce projet sur notre plateforme.`
      });

      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: parts,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              understood: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              clientData: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  company: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  projectType: { type: Type.STRING, description: "L'un des projectType valides" },
                  offerName: { type: Type.STRING, description: "L'un des offerName valides" }
                },
                required: ["name", "company", "email", "phone", "projectType", "offerName"]
              },
              projectData: {
                type: Type.OBJECT,
                properties: {
                  quoteAmount: { type: Type.NUMBER },
                  amountPaid: { type: Type.NUMBER },
                  estimatedDays: { type: Type.NUMBER, description: "Délai de livraison estimé en jours" },
                  notes: { type: Type.STRING, description: "Le cahier des charges ou fiche technique généré, rédigé en Markdown structuré et professionnel." },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Jalons personnalisés sur-mesure (ex: ['Brief initial', 'Zoning', 'Design Maquette', 'Intégration', 'Livraison'])"
                  }
                },
                required: ["quoteAmount", "amountPaid", "estimatedDays", "notes", "steps"]
              }
            },
            required: ["understood", "feedback", "clientData", "projectData"]
          }
        }
      });

      const resultText = response.text || "{}";
      return NextResponse.json(JSON.parse(resultText));
    }

    return NextResponse.json({ error: "Action non reconnue." }, { status: 400 });

  } catch (error: any) {
    console.error("Error in director API:", error);
    let friendlyMessage = "Une erreur est survenue lors du traitement.";
    try {
      const errMsg = String(error?.message || error || "");
      if (errMsg.includes("{")) {
        // Safe parse in case it contains an embedded JSON object from Google SDK
        const startIdx = errMsg.indexOf("{");
        const jsonStr = errMsg.substring(startIdx);
        const parsed = JSON.parse(jsonStr);
        if (parsed?.error?.message) {
          friendlyMessage = parsed.error.message;
        } else {
          friendlyMessage = errMsg;
        }
      } else {
        friendlyMessage = errMsg;
      }
    } catch (e) {
      if (error?.message) friendlyMessage = error.message;
    }

    // Translate standard high demand / 503 limits dynamically
    if (friendlyMessage.includes("503") || friendlyMessage.includes("UNAVAILABLE") || friendlyMessage.includes("high demand") || friendlyMessage.includes("overloaded")) {
      friendlyMessage = "Le service d'intelligence artificielle subit actuellement une forte demande. Nos équipes régulent le flux automatiquement. Veuillez patienter quelques instants puis réessayer.";
    }

    return NextResponse.json(
      { error: friendlyMessage },
      { status: 500 }
    );
  }
}
