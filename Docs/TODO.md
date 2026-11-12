# TODO — Site web Neotisse

## 1. Cadrage
- [x] Parcourir l'arborescence et définir la structure du projet.
- [x] Clarifier le périmètre des pages : le brief mentionne les partenaires et les avis, tandis que le design liste les déplacements et le livre d'or (les deux séries de pages sont réalisées).
- [x] Recenser les textes, photos, logos et autres assets à fournir ou à créer.

## 2. Mise en place
- [x] Initialiser l'application front-end en React avec des composants fonctionnels.
- [x] Configurer Tailwind CSS et établir les styles partagés à partir de la charte graphique.
- [x] Mettre en place Sanity CMS pour le backoffice
- [x] Connecter le front-end à Sanity afin que tout contenu éditable soit géré dans le CMS.
- [x] Installer et configurer Lenis + GSAP (ScrollTrigger) pour les animations au scroll.

## 3. Réalisation du site
- [x] Créer les éléments communs : navigation, pied de page et boutons d'action.
- [x] Réaliser la page d'accueil : présentation de l'association, aperçu des ateliers et disponibilités.
- [x] Réaliser les pages définies dans le plan du site : ateliers de médiation textile, à propos (équipe incluse), actualités, déplacements, contact et livre d'or.
- [x] Réaliser la page détail d'une actualité (cible des « voir plus » des cartes, maquette « actu ») : flèche de retour, corps en texte riche Sanity, barre verte de progression de lecture qui se remplit au scroll (uniquement si la page défile).
- [x] Créer les pages légales : mentions légales, politique de confidentialité et politique de cookies.
- [ ] Ajouter et intégrer les assets validés.
- [x] Mettre en place les animations au scroll (Lenis + GSAP ScrollTrigger) en respectant `prefers-reduced-motion`.
- [x] Adapter les pages aux écrans mobiles et desktop.
- [ ] Vérifier l'accessibilité (navigation clavier, contrastes, lecteurs d'écran).
  - Relevé Lighthouse du 11/11/2026 (page Actualités) : liens « voir plus » verts `#35985f` en contraste insuffisant sur fond crème/beige (2,6 à 3,2:1 au lieu de 4,5:1) — motif présent sur toutes les pages, à corriger globalement (les cibles tactiles du footer et l'absence de robots.txt sont aussi à traiter).

## 4. Vérification et mise en ligne
- [ ] Vérifier les liens, la navigation, les formulaires et l'affichage du contenu provenant de Sanity.
- [ ] Tester les pages sur mobile et desktop et corriger les problèmes relevés.
- [ ] Remplacer les contenus fictifs du livre d'or par les vrais témoignages (saisie de la page + modération des avis dans Sanity).
- [ ] Remplacer les contenus fictifs des actualités par les vraies publications (documents « Page Actualités » et « Actualité » dans Sanity : titre, slug, résumé, sur-titre, date, image de couverture, corps en texte riche, lien).
- [ ] Renseigner les variables d'environnement de production (endpoint Formspree du livre d'or, projet Sanity).
- [ ] Faire la mise en ligne.
