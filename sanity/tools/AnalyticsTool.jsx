import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { dateRange, summarize } from './analyticsSummary'
import './AnalyticsTool.css'

const QUERY = '*[_type == "analyticsDaily" && _id in path("analytics.daily.**") && day >= $start && day <= $end] | order(day asc) { day, views, visits, pages, sources, events }'
const LABELS = { direct: 'Accès direct / origine inconnue', google: 'Google', bing: 'Bing', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', other: 'Autres sites', contact_click: 'Liens vers Contact', workshop_open: 'Ouvertures de formats d’atelier', article_open: 'Liens vers une actualité' }
const number = value => new Intl.NumberFormat('fr-FR').format(value)

function Ranking({ title, rows, unit }) {
  return (
    <section className="neotisse-stats__panel">
      <h2>{title}</h2>
      {rows.length ? <table><thead><tr><th scope="col">{title === 'Pages consultées' ? 'Page' : 'Catégorie'}</th><th scope="col">{unit}</th></tr></thead>
        <tbody>{rows.map(([key, count]) => <tr key={key}><th scope="row">{LABELS[key] || key}</th><td>{number(count)}</td></tr>)}</tbody></table>
        : <p>Aucune mesure sur cette période.</p>}
    </section>
  )
}

function Evolution({ days }) {
  const max = Math.max(1, ...days.map(day => day.views))
  const step = 660 / days.length
  return (
    <section className="neotisse-stats__panel">
      <h2>Pages vues par jour</h2>
      <svg viewBox="0 0 740 230" role="img" aria-label={`Pages vues quotidiennes du ${days[0].day} au ${days.at(-1).day}`}>
        <line x1="50" x2="710" y1="180" y2="180" stroke="currentColor" opacity=".3" />
        <line x1="50" x2="710" y1="30" y2="30" stroke="currentColor" opacity=".15" />
        <text x="40" y="35" textAnchor="end">{max}</text><text x="40" y="185" textAnchor="end">0</text>
        {days.map((day, i) => <rect key={day.day} x={50 + i * step + 1} y={180 - day.views / max * 150} width={Math.max(1, step - 2)} height={day.views / max * 150} fill="#35985f"><title>{day.day} : {day.views} pages vues</title></rect>)}
        <text x="50" y="212">{days[0].day}</text><text x="710" y="212" textAnchor="end">{days.at(-1).day}</text>
      </svg>
      <details><summary>Afficher les valeurs quotidiennes</summary>
        <table><thead><tr><th>Date (UTC)</th><th>Pages vues</th><th>Visites</th></tr></thead><tbody>{days.map(day => <tr key={day.day}><th scope="row">{day.day}</th><td>{number(day.views)}</td><td>{number(day.visits)}</td></tr>)}</tbody></table>
      </details>
    </section>
  )
}

export default function AnalyticsTool() {
  const baseClient = useClient({ apiVersion: '2025-02-19' })
  const client = useMemo(() => baseClient.withConfig({ useCdn: false, perspective: 'raw' }), [baseClient])
  const [period, setPeriod] = useState(30)
  const [refresh, setRefresh] = useState(0)
  const [state, setState] = useState({ loading: true, rows: [], error: '', updated: null })
  const range = useMemo(() => dateRange(period), [period, refresh])
  useEffect(() => {
    let cancelled = false
    setState(previous => ({ ...previous, loading: true, error: '' }))
    client.fetch(QUERY, range).then(rows => {
      if (!cancelled) setState({ loading: false, rows, error: '', updated: new Date() })
    }).catch(() => {
      if (!cancelled) setState({ loading: false, rows: [], error: 'Impossible de lire les statistiques. Vérifiez votre connexion et vos droits de lecture sur le projet Sanity.', updated: null })
    })
    return () => { cancelled = true }
  }, [client, range, refresh])
  const report = useMemo(() => summarize(state.rows, range.start, range.end), [state.rows, range])
  return (
    <div className="neotisse-stats">
      <header className="neotisse-stats__header"><div><h1>Statistiques Neotisse</h1><p>Audience consentie · journées en UTC · conservation de 90 jours</p></div>
        <div className="neotisse-stats__filters"><label>Période <select value={period} onChange={event => setPeriod(Number(event.target.value))}>
          <option value={7}>7 derniers jours</option><option value={30}>30 derniers jours</option><option value={90}>90 derniers jours</option>
        </select></label><button type="button" disabled={state.loading} onClick={() => setRefresh(value => value + 1)}>Actualiser</button></div>
      </header>
      {state.loading ? <p role="status">Chargement des statistiques…</p> : state.error ? <p role="alert">{state.error}</p> : <>
        <p className="neotisse-stats__note">Du {range.start} au {range.end} inclus. Dernière lecture : {state.updated?.toLocaleTimeString('fr-FR')}.</p>
        {!state.rows.length && <p role="status">Aucune statistique reçue sur cette période. Les premières données apparaîtront après une visite avec acceptation de la bannière, une fois la collecte activée sur Vercel.</p>}
        <div className="neotisse-stats__metrics">
          {[['Pages vues', report.totals.views], ['Visites', report.totals.visits], ['Clics suivis', report.totals.clicks]].map(([label, value]) => <div className="neotisse-stats__panel" key={label}><span>{label}</span><strong>{number(value)}</strong></div>)}
        </div>
        <Evolution days={report.days} />
        <div className="neotisse-stats__columns"><Ranking title="Pages consultées" rows={report.pages} unit="Vues" /><Ranking title="Provenance des visites" rows={report.sources} unit="Visites" /></div>
        <Ranking title="Interactions" rows={report.events} unit="Clics" />
      </>}
      <aside className="neotisse-stats__note"><p>Une visite correspond à un onglet actif, renouvelé après 30 minutes sans mesure ou à minuit UTC. Ce n’est pas un nombre de personnes uniques. Les refus, bloqueurs et échecs réseau ne sont pas comptés.</p><p>Les clics indiquent une intention, pas un formulaire envoyé. La collecte est plafonnée à 5 000 mesures et 500 visites par jour, et 200 mesures par visite ; un trafic automatisé peut fausser ou saturer ces chiffres. Aucune donnée historique Umami n’est importée.</p></aside>
    </div>
  )
}
