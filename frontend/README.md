# Front-end Neotisse

Site vitrine de l'association Neotisse — React + Vite + Tailwind CSS v4, contenu piloté par Sanity CMS.

## Démarrage

```bash
npm install
npm run dev
```

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les identifiants Sanity :

| Variable | Description |
|---|---|
| `VITE_SANITY_PROJECT_ID` | ID du projet Sanity |
| `VITE_SANITY_DATASET` | Nom du dataset (défaut : `production`) |

Sans ces variables, le site affiche le contenu de prévisualisation défini dans chaque page.

## Structure

Le dépôt contient deux applications :

| Dossier | Rôle |
|---|---|
| `frontend/` | Site public — React + Vite + Tailwind |
| `sanity/` | Back office Sanity Studio (schémas et structure du desk) |

### Front-end

```
src/
  components/
    layout/    Header, Footer, ScrollToTop
    sections/  Hero, AboutBlock, WorkshopFormats, Partners, ClosingCta
    ui/        Button, SectionTitle, PageHeader, Placeholder, Field, Honeypot
  data/        navigation.js (plan du site), home.js (contenu de repli)
  lib/         sanity.js, queries.js, reveal.js, smoothScroll.js, forms.js
  pages/       une page par route + pages/legal/
```

### Sanity Studio

```
schemas/
  documents/   homePage, aboutPage, contactInfo (singletons)
               workshop, post, partner, teamMember, testimonial, availability
               legalPage, siteSettings
  objects/     seo, openGraph, richText, link
structure.js   arborescence du back office (singletons verrouillés)
```

Démarrage du studio :

```bash
cd sanity
cp .env.example .env      # renseigner SANITY_STUDIO_PROJECT_ID
npm install
npm run dev               # http://localhost:3333
```

## Formulaires

Le site n'a pas de backend : les formulaires passent par un endpoint **Formspree**
(ou équivalent). Renseigner dans `frontend/.env` :

| Variable | Usage |
|---|---|
| `VITE_CONTACT_FORM_ENDPOINT` | Formulaire de contact |
| `VITE_TESTIMONIAL_FORM_ENDPOINT` | Livre d'or (facultatif, retombe sur l'endpoint contact) |

Tant que l'endpoint n'est pas renseigné, un avertissement s'affiche sous le formulaire.

**Livre d'or — modération** : les messages n'y sont pas publiés automatiquement.
Après validation dans le studio, passer le document `testimonial` de
`status: pending` à `status: published` et renseigner `publishedAt`.

## Charte graphique (Tailwind)

| Token | Valeur |
|---|---|
| `bg-cream` / `text-cream` | #F4EFE6 |
| `bg-pine` / `text-pine` | #095228 |
| `bg-leaf` / `text-leaf` | #35985F |
| `bg-sand` / `border-sand` | #E4DCCE |
| `font-serif` | Boldonse |
| `font-sans` | Outfit |
| `text-h1` / `text-h2` / `text-body` | 96px / 64px / 18px |

## Animations au scroll

Le défilement fluide et les animations sont gérés par **Lenis** + **GSAP
ScrollTrigger**, initialisés dans `src/lib/smoothScroll.js` via le hook
`useSmoothScroll()`, appelé une seule fois dans `App.jsx`.

```js
import { gsap, ScrollTrigger } from '../lib/smoothScroll'
```

- `prefers-reduced-motion: reduce` → Lenis n'est pas instancié, le défilement natif est conservé.
- Le build sépare les librairies en chunks (`vendor-gsap`, `vendor-sanity`, `vendor-react`)
  pour préserver le cache navigateur.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run preview` — prévisualisation du build
- `npm run lint` — oxlint
