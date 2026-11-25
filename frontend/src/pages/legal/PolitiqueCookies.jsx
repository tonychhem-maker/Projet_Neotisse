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
          <p>Nous utilisons notre propre outil de mesure d’audience, hébergé avec le site sur Vercel et relié à Sanity. La collecte ne démarre qu’après votre acceptation. Refuser ne vous empêche pas de consulter le site ni d’utiliser ses formulaires.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Mémorisation de votre préférence</h2>
          <p>Votre acceptation ou votre refus est conservé pendant 180 jours dans le stockage local de votre navigateur, sous la clé « neotisse-audience-consent-v2 ». Ce stockage sert uniquement à retenir votre choix. Si vous effacez les données du navigateur, la bannière réapparaît.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Ce que cette intégration transmet</h2>
          <p>Après acceptation, nous comptons les pages consultées et les clics vers le contact, les actualités et l’ouverture des formats d’atelier. La provenance est réduite à une catégorie (par exemple Google ou Instagram), sans conserver l’adresse de la page d’origine. Le contenu des formulaires, les paramètres des adresses et leurs fragments ne sont pas transmis par cet outil.</p>
          <p>Un identifiant aléatoire est conservé dans le stockage de l’onglet, sous la clé « neotisse-analytics-session-v1 ». Il est renouvelé après 30 minutes sans activité mesurée ou au changement de jour UTC. Il sert à compter des visites, pas à identifier une personne. Côté serveur, seul un identifiant haché par jour est conservé pour éviter les doublons.</p>
          <p>Les statistiques sont réservées aux membres autorisés de l’équipe dans Sanity. Une purge quotidienne supprime les identifiants techniques des jours précédents et les statistiques agrégées au-delà de 90 jours, sous réserve de son bon fonctionnement. Notre outil ne conserve pas d’adresse IP ni d’empreinte du navigateur ; les hébergeurs peuvent traiter des données techniques dans leurs propres journaux de fonctionnement.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Modifier votre choix</h2>
          <p>Vous pouvez retirer votre accord à tout moment. Ce retrait arrête les nouveaux envois de statistiques ; il n’efface pas les données déjà transmises.</p>
          <button type="button" className="mt-4 underline underline-offset-4" onClick={() => window.dispatchEvent(new Event('neotisse:privacy-settings'))}>Gérer mes cookies et statistiques</button>
        </section>
      </div>
    </div>
  )
}
