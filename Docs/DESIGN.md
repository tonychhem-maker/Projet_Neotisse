# Police d'ecriture :
-Les grands titres H1 utilisent la police **Boldonse** (Google Fonts) en 96 pixels sur desktop.
-Les titres secondaires H2 utilisent la police **Boldonse** en 64 pixels sur desktop.
-La police de texte principale est **Outfit** (Google Fonts) en 18 pixels sur desktop.

> Historique : les polices initialement prevues etaient Baskerville (titres) et Nunito (texte).
> Elles ont ete remplacees lors de la refonte du design par Boldonse et Outfit.

# Charte graphique :
-couleur principale : le blanc creme #F4EFE6
-couleur secondaire : le vert sapin #095228
-couleurs d'accentuation : le vert clair #35985F et le beige #E4DCCE
# Regle d'utilisation :
-le blanc creme s'utilise pour le fond
-le vert sapin pour les boutons d'action (CTA), header, footer, bandeau de communication
-le vert clair et le beige pour certains elemments visuelle, certain boutons moins important et cadre

# Animations au scroll :
-Le site comporte des animations declenchees au defilement de la page.
-Librairies retenues : **Lenis** (defilement fluide) combinee a **GSAP** et son plugin **ScrollTrigger** (declenchement et pilotage des animations).
-Toute animation au scroll doit passer par ce duo ; aucune autre librairie d'animation n'est autorisee.
-Les animations doivent etre respectueuses de l'accessibilite : si l'utilisateur a active `prefers-reduced-motion`, les animations sont desactivees ou reduites.

# Arborescence
/accueil/                        Accueil
/ateliers-de-mediation-textile/  Ateliers
/deplacements/                   Deplacements
/actualites/                     Actualites
/livre-d-or/                     Livre d'or
  └── /laisser-un-mot/           Laisser un mot
/a-propos/                       A propos (inclut la presentation de l'equipe)
/contact/                        Contact
/mentions-legales/               Mentions legales
/politique-de-confidentialite/   Politique de confidentialite
/politique-de-cookies/           Politique de cookies

## Navigation principale (header)
Ordre impose par la maquette :
`Accueil - Ateliers - Deplacements - Actualites - Livre d'or - A propos - Contact`

## Pied de page (« Lien Rapide »)
`Accueil - Ateliers - A propos - Partenaires - Contact`

> La page /partenaires/ a ete retiree de la navigation principale mais reste
> accessible depuis le pied de page. La page /equipe/ n'existe plus : le contenu
> de l'equipe est integre a la page /a-propos/.
