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
          <p>Nous proposons une mesure de fréquentation avec Umami. Le script de suivi ne se charge qu’après votre acceptation. Refuser ne vous empêche pas de consulter le site ni d’utiliser ses formulaires.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Mémorisation de votre préférence</h2>
          <p>Votre acceptation ou votre refus est conservé pendant 180 jours dans le stockage local de votre navigateur, sous la clé « neotisse-audience-consent-v1 ». Ce stockage sert uniquement à retenir votre choix. Si vous effacez les données du navigateur, la bannière réapparaît.</p>
        </section>
        <section>
          <h2 className="mb-3 text-xl">Ce que cette intégration transmet</h2>
          <p>Après acceptation, l’intégration transmet les pages consultées à Umami. Elle ne transmet pas le contenu des formulaires, les paramètres des adresses ni leurs fragments. Les formulaires restent traités par leurs services d’envoi respectifs.</p>
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
