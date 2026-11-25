# Statistiques Neotisse — première version

## Circuit

Après acceptation de la bannière, React envoie les mesures à `/api/analytics` sur le même domaine. La fonction Vercel valide les données et met à jour Sanity. Aucun script Umami n'est chargé. Le Studio dispose d'un onglet **Statistiques** : son client utilise la session Sanity de la personne connectée, jamais un token serveur embarqué.

## Mesures

- Pages vues : ouverture d'une route, y compris navigation React Router.
- Visites : identifiant aléatoire dans `sessionStorage`, renouvelé après 30 minutes sans événement ou au changement de date UTC. Plusieurs onglets peuvent compter plusieurs visites ; ce ne sont pas des personnes uniques.
- Provenances : direct/inconnu, Google, Bing, Facebook, Instagram, LinkedIn, autres. Aucune URL référente brute conservée.
- Interactions : lien vers Contact, lien vers une actualité, ouverture d'un format d'atelier. Ce ne sont pas des conversions ni des envois de formulaires.
- Périodes : 7, 30, 90 jours, graphique quotidien et tableaux.

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

Contrôle navigateur : aucune requête avant choix/après refus ; après acceptation POST 204 ; navigation interne comptée ; clics suivis ; retrait suivi d'une navigation sans nouvel envoi ; aucun appel Umami. Vérifier également le tableau de bord avec une session Studio autorisée.
