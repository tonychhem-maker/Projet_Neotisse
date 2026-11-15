# Site Neotisse — Passation

Site vitrine de l'association **Neotisse** (médiation scientifique autour des savoir-faire textiles anciens) : front React, back-office Sanity CMS, formulaires via Formspree + une fonction serverless.

---

## 1. Architecture du dépôt

```
Projet_Neotisse/
├── frontend/          Site public (React + Vite)
│   ├── api/           Fonction serverless (dépôt d'avis du livre d'or)
│   ├── public/        Images statiques (logos partenaires, photos de repli…)
│   └── src/
│       ├── components/
│       │   ├── layout/   Header, Footer
│       │   ├── sections/ Blocs de pages (carte Leaflet, listes, héros…)
│       │   └── ui/       Primitives partagées (Formulaire.jsx, Bouton, Honeypot…)
│       ├── data/         Contenus de repli (affichés tant que Sanity est vide)
│       ├── lib/          Client Sanity, requêtes GROQ, formulaires, reveal, smooth scroll
│       └── pages/        Une page = un fichier .jsx + son .css
├── sanity/            Studio Sanity (back-office)
│   └── schemas/       Schémas des documents (collections + singletons)
├── scripts/           Outils internes (extraction Figma)
└── Docs/              Brief, design, TODO
```

## 2. Stack technique

| Bloc | Techno |
|---|---|
| Front | React 19, Vite 8 (rolldown), React Router 7, Tailwind CSS 4 |
| Animations | GSAP + ScrollTrigger, Lenis (scroll fluide), reveals CSS (IntersectionObserver) |
| Carte | Leaflet (page Déplacements) |
| Contenus | Sanity v6 (Studio), requêtes GROQ côté front (`src/lib/queries.js`) |
| Formulaires | Formspree (e-mail) + fonction serverless (livre d'or → Sanity) |
| Lint | oxlint (`npm run lint`) |

## 3. Démarrage rapide

Prérequis : **Node.js ≥ 20**.

```bash
# Front (port 5173)
cd frontend
npm install
npm run dev

# Studio Sanity (port 3333) — dans un second terminal
cd sanity
npm install
npm run dev
```

Autres commandes front : `npm run build` (production), `npm run preview` (prévisualisation du build, port 4173), `npm run lint`.

## 4. Variables d'environnement

### `frontend/.env` (public, préfixe `VITE_` — jamais de secret ici)

```
VITE_SANITY_PROJECT_ID=k7jmb6gr
VITE_SANITY_DATASET=production
VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/mqppvpvl      # contact
VITE_TESTIMONIAL_FORM_ENDPOINT=https://formspree.io/f/mgaajajq  # livre d'or (repli)
# VITE_TESTIMONIAL_API_ENDPOINT=  # (prod) URL de la fonction serverless
```

### `sanity/.env` (privé — **ne jamais committer**)

```
SANITY_STUDIO_PROJECT_ID=k7jmb6gr
SANITY_STUDIO_DATASET=production
SANITY_API_WRITE_TOKEN=<token Editor>   # requis uniquement pour écrire via script
```

> Les deux `.env` sont dans le `.gitignore`. **Règle de sécurité** : un token d'écriture Sanity ne va JAMAIS dans une variable `VITE_*` (exposée au navigateur).

## 5. Contenus (Sanity)

- Projet : **k7jmb6gr**, dataset **production** — Studio accessible en ligne via `npm run deploy` (dans `sanity/`) ou en local sur le port 3333.
- **Collections** : `workshop` (ateliers), `workshopFormat` (formats du déroulé accueil), `post` (actualités), `partner`, `teamMember` (équipe), `testimonial` (livre d'or, avec modération), `deplacement` (points de la carte), `availability` (disponibilités).
- **Singletons** : `siteSettings` (baseline, coordonnées, réseaux), `homePage`, `aboutPage`, `ateliersPage`, `contactInfo`, `deplacementsPage`, `livreDorPage`, `actualitesPage`, `legalPage`.
- Le front lit les contenus via `src/lib/queries.js` (`useSanityContent`) avec **repli local** (`src/data/*`) tant qu'un champ est vide : le site reste complet sans back-office rempli.
- **CORS** : les origines de lecture doivent être autorisées dans sanity.io/manage → API → CORS. Actuellement : `http://localhost:5173`. **À ajouter** : `http://localhost:4173` et le domaine de production.

## 6. Formulaires

| Formulaire | Envoi |
|---|---|
| Contact | Formspree (`VITE_CONTACT_FORM_ENDPOINT`) — champs : nom, prénom, email, objet (dropdown), message, consentement |
| Livre d'or | **Priorité** : la fonction serverless crée le témoignage dans Sanity (`status: pending` → file « à modérer » du Studio). **Repli** : Formspree si la fonction n'est pas configurée |

Les deux partagent le composant global `frontend/src/components/ui/Formulaire.jsx` (demi-largeur, placeholders fins gris, coins droits).

### La fonction serverless (`frontend/api/submit-testimonial.js`)

À déployer chez l'hébergeur (Vercel / Netlify Functions) avec ces variables **côté serveur** (sans `VITE_`) :

```
SANITY_WRITE_TOKEN=<token avec droit write>
SANITY_PROJECT_ID=k7jmb6gr
SANITY_DATASET=production
```

Puis renseigner `VITE_TESTIMONIAL_API_ENDPOINT` (ex. `https://neotisse.fr/api/submit-testimonial`) côté front. La fonction gère le CORS (origines de dev + prod déjà listées dedans).

## 7. Déploiement — checklist

1. **Front** : `npm run build` dans `frontend/` → publier le dossier `dist` sur l'hébergeur (SPA : rediriger toutes les routes vers `index.html`).
2. **Studio** : `npm run deploy` dans `sanity/` (hébergé sur `*.sanity.studio`).
3. **Fonction serverless** : déployer `frontend/api/submit-testimonial.js` + variables `SANITY_WRITE_TOKEN`, `SANITY_PROJECT_ID`, `SANITY_DATASET`.
4. **Sanity CORS** : autoriser l'origine de production (+ 4173 si preview).
5. **Variables front** chez l'hébergeur : `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_CONTACT_FORM_ENDPOINT`, `VITE_TESTIMONIAL_FORM_ENDPOINT`, `VITE_TESTIMONIAL_API_ENDPOINT`.

## 8. Pages (routes)

| Route | Page |
|---|---|
| `/` | Accueil (héros, présentation, formats d'atelier, partenaires, CTA final) |
| `/ateliers-de-mediation-textile` | Ateliers (héros animé, formats, sections Conférences / Expérimentation, CTA) |
| `/a-propos` | À propos (bannière, grande image, démarche, équipe) |
| `/actualites`, `/actualites/:slug` | Actualités + détail (contenu riche) |
| `/deplacements` | Déplacements (liste + carte de France Leaflet, points cliquables) |
| `/partenaires` | Partenaires |
| `/contact` | Contact (formulaire + coordonnées) |
| `/livre-d-or`, `/livre-d-or/laisser-un-mot` | Livre d'or + dépôt d'avis |
| `/mentions-legales`, `/politique-de-confidentialite`, `/politique-de-cookies` | Pages légales (type `legalPage`) |
| `*` | 404 |

## 9. Conventions du code

- Commentaires et noms de classes en **français** (BEM pour le CSS : `.bloc__element--modifieur`).
- Tailwind pour les composants, CSS fichiers dédiés pour les pages.
- Échelle typographique : `calc(N * var(--u))` = N px de la maquette 1440 (`--u` = 1/14.4 de la largeur). Corps de texte uniforme : **DM Sans 400, 18u, interligne 1,6**.
- **Aucun coin arrondi** (règle design du client), couleurs charte : vert sapin `#0b4f2a`, vert moyen `#2f8a55`/`#35985f`, crème `#f4efe6`, sable `#e9e1d5`.
- Animations d'apparition : jamais de contenu masqué sans JS (système `.rv-root` / `lib/reveal.js`), respect de `prefers-reduced-motion`.

## 10. Reste à faire (au moment de la passation)

- [ ] Téléverser dans Sanity : photos de l'équipe (2 fiches `teamMember`), image de couverture de l'actualité Festival, logos des partenaires.
- [ ] Ajouter les origines CORS Sanity : `http://localhost:4173` + domaine de production.
- [ ] Déployer la fonction serverless + configurer `VITE_TESTIMONIAL_API_ENDPOINT`.
- [ ] Vérifier/renouveler le token d'écriture Sanity (celui utilisé pour le remplissage initial a transité en clair : le révoquer après passation si toujours actif).
