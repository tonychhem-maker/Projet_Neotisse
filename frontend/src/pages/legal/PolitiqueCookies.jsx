import PageHeader from '../../components/ui/PageHeader'

export default function PolitiqueCookies() {
  return (
    <div className="cq">
      <PageHeader title="Politique de cookies">
        Les cookies utilisés sur le site Neotisse et leur finalité.
      </PageHeader>
      <div className="mx-auto max-w-3xl space-y-6 px-6 pb-20 font-dm text-[16px] leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl">Votre choix de mesure d’audience</h2>
          <p>Nous utilisons notre propre outil de mesure d’audience, hébergé avec le site sur Vercel et relié à Sanity, ainsi que Google Analytics 4, chargé par Google Tag Manager. Ces outils ne démarrent qu’après votre acceptation. Refuser ne vous empêche pas de consulter le site ni d’utiliser ses formulaires.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Mémorisation de votre préférence</h2>
          <p>Votre acceptation ou votre refus est conservé pendant 180 jours dans le stockage local de votre navigateur, sous la clé « neotisse-audience-consent-v3 ». Ce stockage sert uniquement à retenir votre choix. Si vous effacez les données du navigateur, la bannière réapparaît. Un nouveau choix est demandé lors de l’ajout de Google Analytics.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Ce que cette intégration transmet</h2>
          <p>Après acceptation, nous comptons les pages consultées et les clics vers le contact, les actualités et l’ouverture des formats d’atelier. La provenance est réduite à une catégorie (par exemple Google ou Instagram), sans conserver l’adresse de la page d’origine. Le contenu des formulaires, les paramètres des adresses et leurs fragments ne sont pas transmis par cet outil.</p>
          <p>Un identifiant aléatoire est conservé dans le stockage de l’onglet, sous la clé « neotisse-analytics-session-v1 ». Il est renouvelé après 30 minutes sans activité mesurée ou au changement de jour UTC. Il sert à compter des visites, pas à identifier une personne. Côté serveur, seul un identifiant haché par jour est conservé pour éviter les doublons.</p>
          <p>Les statistiques sont réservées aux membres autorisés de l’équipe dans Sanity. Une purge quotidienne supprime les identifiants techniques des jours précédents et les statistiques agrégées au-delà de 90 jours, sous réserve de son bon fonctionnement. Notre outil ne conserve pas d’adresse IP ni d’empreinte du navigateur ; les hébergeurs peuvent traiter des données techniques dans leurs propres journaux de fonctionnement.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Google Analytics</h2>
          <p>Avec votre accord, Google Analytics 4, un service de Google, mesure les pages consultées et certaines actions : clics vers le contact, les actualités ou le livre d’or, ouverture des formats d’atelier et confirmation d’envoi d’un message. Il peut utiliser des cookies, notamment <code>_ga</code> et <code>_ga_*</code>, et traiter des données techniques sur votre navigateur et votre connexion, selon ses propres règles. Nous avons désactivé la collecte automatique des données fournies par les utilisateurs et des interactions avec les formulaires ; les événements d’envoi ne contiennent pas le contenu des messages. Les adresses de pages transmises par le site sont limitées aux chemins, sans paramètres ni fragments ; les fonctionnalités publicitaires ne sont pas autorisées par ce choix.</p>
          <p>Pour en savoir plus sur le traitement des données par Google, consultez ses <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">règles de confidentialité</a>.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Modifier votre choix</h2>
          <p>Vous pouvez retirer votre accord à tout moment. La page est alors rechargée sans les outils de mesure. Ce retrait n’efface pas les données déjà transmises ; les cookies Google déjà déposés peuvent rester jusqu’à leur expiration ou leur suppression dans les réglages de votre navigateur.</p>
          <button type="button" className="mt-4 underline underline-offset-4" onClick={() => window.dispatchEvent(new Event('neotisse:privacy-settings'))}>Gérer mes cookies et statistiques</button>
        </section>
      </div>
    </div>
  )
}
