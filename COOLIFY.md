# Guide de Déploiement : Vercel, Coolify & Persistance des Données

Ce guide vous accompagne pas à pas pour déployer **Nümtema Office (Codenamex)** en production avec une persistance robuste et professionnelle.

---

## 1. Déploiement sur Vercel (Cloud Serverless)

Vercel est la plateforme native pour Next.js. Elle offre des performances exceptionnelles grâce aux fonctions Serverless et à un CDN mondial de pointe.

### Étapes de configuration :
1. **Pousser votre code sur GitHub :**
   Créez un dépôt privé ou public sur GitHub et poussez-y la totalité du projet.
2. **Importer sur Vercel :**
   - Connectez-vous à votre tableau de bord [Vercel](https://vercel.com).
   - Cliquez sur **Add New** -> **Project**.
   - Importez votre dépôt GitHub.
3. **Configurer les Variables d'Environnement :**
   Dans l'onglet de configuration avant le déploiement, ajoutez les variables suivantes :
   *   `GEMINI_API_KEY` : Votre clé API Google AI Studio / Gemini (nécessaire pour l'analyse des cahiers des charges et le bilan de santé).
   *   `APP_URL` : L'URL de production finale fournie par Vercel (ex: `https://numtema-office.vercel.app`).
4. **Lancer le déploiement :**
   Cliquez sur **Deploy**. Vercel détecte automatiquement le framework Next.js, exécute le build de production (`npm run build`) et met votre application en ligne en moins de 2 minutes.

---

## 2. Déploiement sur Coolify (Auto-Hébergement)

[Coolify](https://coolify.io) est une alternative d'hébergement open-source exceptionnelle ("self-hosted Vercel/Heroku") qui tourne sur votre propre serveur VPS (Scaleway, Hetzner, OVH, etc.).

### Option A : Déploiement natif via Nixpacks (Recommandé)
Coolify utilise **Nixpacks** pour analyser et construire automatiquement votre projet sans effort de configuration.
1. Connectez-vous à votre console Coolify.
2. Créez un **New Resource** -> **Application** -> **Public/Private GitHub Repository**.
3. Sélectionnez la branche de production (souvent `main` ou `master`).
4. **Configuration automatique de Coolify :**
   *   **Build Pack** : Sélectionnez **Nixpacks**.
   *   **Port** : Spécifiez le port `3000` (Next.js écoute sur ce port par défaut).
   *   **Build Command** : `npm run build`
   *   **Start Command** : `npm run start`
5. **Variables d'Environnement :**
   Configurez les variables d'environnement dans l'onglet **Environment Variables** de Coolify :
   ```env
   GEMINI_API_KEY=votre_cle_gemini_ici
   APP_URL=https://votre-domaine-coolify.com
   NODE_ENV=production
   ```
6. **Cliquez sur "Deploy".** Coolify va télécharger le code, exécuter le build et exposer votre application via son reverse proxy (Traefik ou Caddy) avec un certificat SSL Let's Encrypt automatique !

### Option B : Déploiement Dockerisé autonome
Si vous préférez une isolation absolue, l'architecture du projet est configurée en mode **Standalone** dans `next.config.ts`.
Vous pouvez construire une image Docker standard de votre application Next.js et la lancer sur Coolify en déclarant le service sous forme de conteneur.

---

## 3. Processus d'Intégration d'un Stockage Persistant (Database)

Actuellement, l'application utilise un moteur de stockage local basé sur le **`localStorage`** du navigateur (voir `./lib/store.ts`). C'est optimal pour une démo ou un usage individuel, mais pour un usage collaboratif ou multi-appareils de niveau production, vous devez enregistrer les fiches clients et les jalons de projets dans une base de données cloud.

Voici les deux meilleures méthodes pour y parvenir :

### Solution n°1 : Firebase Firestore (Recommandé - NoSQL Temps Réel)
Firebase Firestore s'intègre parfaitement avec notre interface de suivi en temps réel.

#### Étape A : Provisionner Firebase
Lancez la configuration de Firebase pour obtenir vos clés d'API. Vous disposerez alors d'un fichier `firebase-applet-config.json` contenant vos accès.

#### Étape B : Initialiser le SDK dans l'application
Installez l'SDK Firebase si ce n'est pas déjà fait :
```bash
npm install firebase
```
Créez un fichier de connexion (par exemple, `/lib/firebase.ts`) :
```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

#### Étape C : Adapter le Store (`/lib/store.ts`) pour synchroniser Firestore
Modifiez le store pour synchroniser les collections `clients` et `projects` dans Firestore au lieu du `localStorage` :

```typescript
import { collection, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Dans votre composant ou hook useStore :
useEffect(() => {
  // Écoute en direct des données Firestore
  const unsubClients = onSnapshot(collection(db, "clients"), (snapshot) => {
    const freshClients = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Client));
    setClients(freshClients);
  });

  const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
    const freshProjects: Record<string, Project> = {};
    snapshot.docs.forEach(d => {
      freshProjects[d.id] = d.data() as Project;
    });
    setProjects(freshProjects);
    setIsLoaded(true);
  });

  return () => {
    unsubClients();
    unsubProjects();
  };
}, []);
```

Ecrasez également la méthode de mise à jour pour sauvegarder dans Firestore :
```typescript
const updateProjectField = async (projectId: string, field: string, value: any) => {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, { [field]: value });
};
```

---

### Solution n°2 : Base de données SQL (PostgreSQL & Prisma ORM)

Si vous travaillez avec des données relationnelles, un serveur **PostgreSQL** couplé avec l'ORM **Prisma** est la solution de niveau entreprise par excellence. Elle permet d'assurer des contraintes de structure (clés étrangères, cascades, types stricts) et d'obtenir des performances maximales.

Le projet inclut déjà le schéma Prisma de production à l'adresse `/prisma/schema.prisma` et le client initialisé à l'adresse `/lib/prisma.ts`.

---

#### Étape A : Créer et configurer PostgreSQL dans Coolify

1. **Créer le Service de Base de Données :**
   - Dans le tableau de bord **Coolify**, allez dans le projet concerné.
   - Cliquez sur **New Resource** -> **Database** -> **PostgreSQL**.
   - Donnez-lui un nom (ex: `numtema-db`) et choisissez la version recommandée (ex: Postgres 16).
   - Coolify va provisionner un conteneur PostgreSQL isolé avec un volume persistant et générer automatiquement des identifiants (mot de passe, utilisateur et nom de base de données).

2. **Récupérer l'URL de connexion (Connection URI) :**
   - Coolify fournit deux URLs dans l'onglet de configuration de la base de données :
     - **Internal Connection String :** Utilisée si votre application Next.js tourne *sur le même serveur Coolify* (le réseau Docker privé). Très sécurisée car non exposée sur internet (ex: `postgresql://postgres:randompwd@numtema-db:5432/postgres`).
     - **External Connection String :** Utilisée si vous vous connectez depuis l'extérieur ou d'un autre serveur.
   - Copiez l'un de ces liens pour l'étape suivante.

---

#### Étape B : Configurer les dépendances et le Schéma de Production

1. **Installer l'environnement Prisma :**
   Si vous clonez le dépôt dans un environnement neuf, exécutez ces commandes :
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Le Schéma Prisma (`/prisma/schema.prisma`) :**
   Le schéma que nous avons configuré gère la synchronisation parfaite avec les types de l'application :

   ```prisma
   // /prisma/schema.prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model Client {
     id          String    @id @default(uuid())
     name        String
     company     String
     email       String
     phone       String
     projectType String    // site_vitrine | e_commerce | flyers | ...
     offerName   String    // presence_pro | systeme_client | ...
     createdAt   DateTime  @default(now())
     isArchived  Boolean   @default(false)
     archivedAt  DateTime?
     project     Project?
   }

   model Project {
     id             String    @id
     client         Client    @relation(fields: [id], references: [id], onDelete: Cascade)
     quoteAmount    Float     @default(0.0)
     amountPaid     Float     @default(0.0)
     currentBlocker String    @default("none")
     notes          String    @default("") @db.Text
     driveLink      String    @default("") @db.Text
     siteLink       String    @default("") @db.Text
     startDate      DateTime  @default(now())
     endDate        DateTime
     completedAt    DateTime?
     updatedAt      DateTime  @updatedAt
     steps          Step[]
   }

   model Step {
     id          String    @id @default(uuid())
     projectId   String
     project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
     label       String
     isCompleted Boolean   @default(false)
     completedAt DateTime?
   }
   ```

3. **Singleton Prisma Client (`/lib/prisma.ts`) :**
   Pour éviter de saturer le pool de connexions SQL de PostgreSQL lors de recharges à chaud (HMR) durant le développement Next.js, nous utilisons ce singleton :
   ```typescript
   import { PrismaClient } from '@prisma/client';

   const globalForPrisma = global as unknown as { prisma: PrismaClient };

   export const prisma =
     globalForPrisma.prisma ||
     new PrismaClient({
       log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
     });

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   ```

---

#### Étape C : Configurer Coolify pour exécuter les Générations et Migrations

Pour que Prisma fonctionne dans le conteneur de déploiement Coolify (via Nixpacks), vous devez ajuster ou configurer les commandes de build.

1. **Ajouter la variable d'environnement dans Coolify :**
   Dans l'onglet **Environment Variables** de votre application Next.js sur Coolify, ajoutez :
   `DATABASE_URL` = `<votre_uri_de_connexion_copie_precedemment>`

2. **Étape de Build automatique :**
   Nixpacks détecte automatiquement Prisma si `prisma/schema.prisma` est présent et prépare le client. Cependant, pour garantir que le client soit toujours régénéré au build, ajustez votre script de build dans le `package.json` ou la configuration d'application dans Coolify :
   *   **Build Command** sur Coolify : `npx prisma generate && npm run build`
   *   *(Optionnel)* **Démarrage / Release Command** : Avant le démarrage, pour appliquer les nouveaux schémas de table en production à chaque mise à jour de code sans perte de données, configurez une commande de pré-déploiement :
       `npx prisma migrate deploy`

---

#### Étape D : Développer les API Routes Next.js (App Router)

Pour lier votre frontend (auparavant relié au localstorage) à votre nouvelle base de données SQL PostgreSQL de production, vous créez des routes API sécurisées dans `/app/api/` qui feront l'interface avec Prisma.

##### 1. Route API pour les Clients et Projets (`/app/api/clients/route.ts`) :
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Récupérer tous les clients avec leurs projets et jalons associés
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        project: {
          include: {
            steps: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(clients);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Créer un nouveau client ainsi que son projet par défaut de manière transactionnelle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, projectType, offerName, quoteAmount, steps } = body;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Création du client
      const newClient = await tx.client.create({
        data: {
          name,
          company,
          email,
          phone,
          projectType,
          offerName,
        }
      });

      // 2. Création du projet associé
      await tx.project.create({
        data: {
          id: newClient.id, // Relation 1:1 partagée
          quoteAmount: quoteAmount || 1500,
          amountPaid: 0,
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Échéance standard à 30 jours
          steps: {
            create: (steps || []).map((label: string) => ({
              label,
              isCompleted: false,
            }))
          }
        }
      });

      return newClient;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

##### 2. Route API d'édition individuelle d'un client/projet (`/app/api/clients/[id]/route.ts`) :
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Mettre à jour les informations du client ou du projet via Prisma
    if (body.updateType === 'client') {
      const updatedClient = await prisma.client.update({
        where: { id },
        data: body.data,
      });
      return NextResponse.json(updatedClient);
    } else if (body.updateType === 'project') {
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          ...body.data,
          // Exemple d'action sur les jalons/étapes
          steps: body.steps ? {
            deleteMany: {}, // Réinitialise les étapes existantes
            create: body.steps.map((s: any) => ({
              label: s.label,
              isCompleted: s.isCompleted,
              completedAt: s.completedAt ? new Date(s.completedAt) : null,
            }))
          } : undefined
        },
        include: { steps: true }
      });
      return NextResponse.json(updatedProject);
    }

    return NextResponse.json({ error: 'updateType invalide' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // Supprime le client (la suppression en cascade supprime le projet et les étapes grâce au onDelete: Cascade)
    await prisma.client.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

---

## 4. Architecture et Organisation du Projet

Le projet respecte les plus hauts standards de clean architecture imposés par Next.js (App Router) :
*   📦 `/app/` : Gère le routage et les points d'entrée (Layout global, Styling global global.css, page principale, et les API de production de l'IA).
*   📦 `/components/` : Contient l'interface modulaire d'exécution de production (le ficher `app-content.tsx` qui regroupe la gestion visuelle du pipeline de projets, de la trésorerie et le panneau d'AI Director).
*   📦 `/lib/` : Contient de la logique pure, les types typesafe (`types.ts`) et les hooks de gestion d'état réutilisables (`store.ts`).
*   📦 Config : Les fichiers de configuration (`next.config.ts`, `postcss.config.mjs`, `tsconfig.json`) sont épurés pour garantir des temps de build ultra-rapides et éviter toute erreur de typage au déploiement.
*   🚦 **Vérifications de Production** : Le projet dispose d’un linter ESLint strict et fonctionnel à 100%, validé avec succès sans la moindre alerte ! Votre build est prêt à être déployé de manière fluide et stable.
