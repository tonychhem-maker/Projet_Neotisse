# Statistiques Neotisse — première version

## Circuit

Après acceptation de la bannière, React envoie les mesures à `/api/analytics` sur le même domaine. La fonction Vercel valide les données et met à jour Sanity. Aucun script Umami n'est chargé. Le Studio dispose d'un onglet **Statistiques** : son client utilise la session Sanity de la personne connectée, jamais un token serveur embarqué.

## Mesures

- Pages vues : ouverture d'une route, y compris navigation React Router.
- Visites : identifiant aléatoire dans `sessionStorage`, renouvelé après 30 minutes sans événement ou au changement de date UTC. Plusieurs onglets peuvent compter plusieurs visites ; ce ne sont pas des personnes uniques.
- Provenances : direct/inconnu, Google, Bing, Facebook, Instagram, LinkedIn, autres. Aucune URL référente brute conservée.
- Interactions : lien vers Contact, lien vers le livre d'or, lien vers une actualité, ouverture d'un format d'atelier. Ce sont des intentions, pas des conversions.
- Conversions : message du formulaire de contact (`contact_submit`) et message du livre d'or (`testimonial_submit`), comptés après un envoi réussi. Le contenu du formulaire n'est jamais transmis.
- Visite avec intention : visite qui a produit au moins un message envoyé. Elle sert à mesurer la part des visites qui vont jusqu'au bout du parcours.
- Provenances : direct/inconnu, Google, Bing, Facebook, Instagram, LinkedIn, autres. Aucune URL référente brute conservée.
- Périodes : 7, 30 ou 90 jours glissants, comparées à la même durée juste avant, plus une vue « Mois par mois ».

## Objectifs et KPI (plan de taggage)

L'onglet **Statistiques** traduit le plan de taggage en trois cartes, toujours comparées aux 30 jours précédents :

| KPI | Métrique | Seuil négatif / positif par défaut | Source |
| --- | --- | --- | --- |
| Demandes de devis | Messages envoyés depuis le formulaire de contact | moins de 3 / plus de 6 par 30 jours | `contact_submit` |
| Référencement | Part des visites venant de Google, plus les vues des actualités | moins de 25 % / plus de 40 % | `google` + pages `/actualites/…` |
| Avis reçus | Messages du livre d'or reçus | moins de 2 / plus de 4 par 30 jours | documents `testimonial` |

Chaque carte indique le statut par rapport aux seuils, l'évolution par rapport à la période précédente et le conseil à suivre (agir, surveiller, préserver). Les seuils se règlent sans code dans le Studio, document **Objectifs statistiques** (Structure, en bas du menu).

Deux limites assumées :
- Sans Search Console, la position réelle dans Google n'est pas mesurable. Le KPI « Référencement » suit le trafic Google réel et les vues des actualités : c'est une approximation honnête, pas un rang.
- Tant que la collecte n'a pas trente jours d'historique (démarrée le 2026-11-25), l'évolution affiche « historique insuffisant » plutôt qu'un faux « 0 ». Un message envoyé sans acceptation de la bannière n'est pas compté ; l'indicateur est donc un plancher.
- Avant le 2026-11-25, les « visites avec intention » n'ont pas été enregistrées : ce compteur démarre à la mise à jour du 25/11/2026.


## Confidentialité et stockage

Consentement `neotisse-audience-consent-v2`, valable 180 jours. Le changement de version redemande un choix lors du remplacement d'Umami. Sans accord, pas de requête de mesure ni d'identifiant de visite. Un retrait annule la file d'envoi et les requêtes en cours lorsque possible ; une requête déjà traitée ne peut pas être rappelée.

Documents techniques : `analytics.daily.JJJJ-MM-JJ` (agrégats) et `analytics.visit.JJJJ-MM-JJ.HASH` (identifiants d'événements pour déduplication). Les identifiants Sanity avec sous-chemin ne sont pas accessibles en lecture anonyme, même dans le dataset public. Cette propriété a été testée contre l'API sans token. Les membres authentifiés disposant des droits sur le dataset peuvent les lire. Ces documents ne sont volontairement pas proposés dans Structure pour éviter l'édition manuelle ; l'onglet les consulte en lecture seule.

Pas de conservation d'IP, de user-agent, d'empreinte, de nom, d'e-mail ou du contenu de formulaire dans cet outil. Les URL sont limitées aux routes connues et slugs d'actualités, sans query/hash. Les hébergeurs peuvent conserver leurs propres logs techniques. Ne pas placer de données personnelles dans les slugs publics.

Purge quotidienne Vercel à 03:17 UTC (`/api/analytics-cleanup`) : suppression des visites des jours précédents et des agrégats de plus de 90 jours, par lots de 5 000. Vérifier les exécutions dans Vercel ; une purge en erreur nécessite une intervention. Les conditions de sauvegarde de Sanity restent celles de l'hébergeur.

## Configuration Vercel Production

| Variable | Utilisation |
| --- | --- |
| `VITE_ANALYTICS_ENABLED=true` | Active le client au prochain build |
| `ANALYTICS_ENABLED=true` | Active la réception serveur |
| `ANALYTICS_ALLOWED_ORIGINS` | Origines exactes séparées par virgule, ex. `https://neotisse.vercel.app` |
| `SANITY_ANALYTICS_WRITE_TOKEN` | Token serveur autorisé à créer/modifier/supprimer les documents analytics ; facultatif si `SANITY_WRITE_TOKEN` existe |
| `SANITY_WRITE_TOKEN` | Repli serveur existant, jamais envoyé au navigateur |
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | Défauts : `k7jmb6gr`, `production` |
| `CRON_SECRET` | Secret aléatoire vérifié par la fonction de purge |

Les anciennes variables `VITE_UMAMI_*` ne sont plus utilisées. Le script Umami ne doit pas être ajouté à `index.html`. Pour désactiver : `VITE_ANALYTICS_ENABLED=false` et `ANALYTICS_ENABLED=false`, puis redéployer. L'historique Umami n'est pas importé.

## Limites et exploitation

V1 destinée au trafic modeste de l'association : 5 000 mesures/jour, 500 visites/jour et 200 mesures/visite. Les compteurs plafonnés renvoient 429. Ces plafonds limitent les écritures/documents, pas toutes les requêtes entrantes. Une origine HTTP peut être falsifiée par un client automatisé : ce n'est pas un mécanisme anti-bot. Activer au besoin des règles de limitation dans le pare-feu Vercel. Au-delà de ce volume, migrer le stockage vers une base dédiée avant de relever les limites. Les quotas et coûts Sanity/Vercel continuent de s'appliquer.

Transactions avec contrôle de révision : une mesure réessayée conserve son identifiant et n'est comptée qu'une fois. Les conflits sont relus (4 tentatives). Le client réessaie une fois sur erreur serveur/réseau ; pas de stockage hors ligne. Un échec persistant entraîne une mesure perdue, pas un blocage de navigation. Les compteurs du jour partagent un document : contention possible à fort trafic.

## Tests

Depuis `frontend/` :

```sh
node --test src/lib/audienceConsent.test.js server/analytics.test.js
npm run lint
npm run build
```

Depuis `sanity/` :

```sh
npm run build
npx sanity exec scripts/verify-analytics.mjs --with-user-token
```

Le dernier test crée deux documents sous la date réservée 2001-01-01, vérifie concurrence/déduplication/confidentialité puis les supprime. Il ne modifie pas les compteurs courants. Les visites réelles utilisées pour tester le site peuvent figurer dans les statistiques du jour.

Contrôle navigateur : aucune requête avant choix/après refus ; après acceptation POST 204 ; navigation interne comptée ; clics suivis ; envoi d'un message compté comme conversion ; retrait suivi d'une navigation sans nouvel envoi ; aucun appel Umami. Vérifier également le tableau de bord avec une session Studio autorisée.

`npx sanity exec scripts/check-dashboard.mjs --with-user-token` rejoue la lecture du tableau de bord avec la session du poste et affiche les KPI calculés, sans modifier les données.
