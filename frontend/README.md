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

```
src/
  components/
    layout/    Header, Footer, ScrollToTop
    ui/        Button, SectionTitle, PageHeader, Placeholder
  data/        navigation.js (plan du site)
  lib/         sanity.js, useSanityDocument.js
  pages/       une page par route + pages/legal/
```

## Charte graphique (Tailwind)

| Token | Valeur |
|---|---|
| `bg-cream` / `text-cream` | #F4EFE6 |
| `bg-pine` / `text-pine` | #095228 |
| `bg-leaf` / `text-leaf` | #35985F |
| `bg-sand` / `border-sand` | #E4DCCE |
| `font-serif` | Libre Baskerville |
| `font-sans` | Nunito |
| `text-h1` / `text-h2` / `text-body` | 96px / 64px / 18px |

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run preview` — prévisualisation du build
- `npm run lint` — oxlint
