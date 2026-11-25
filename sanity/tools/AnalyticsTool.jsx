import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import {
  DEFAULT_TARGETS,
  PERIOD,
  STATUS,
  countByDay,
  dateRange,
  previousRange,
  report,
  shiftDay,
} from './analyticsSummary'
import './AnalyticsTool.css'

const ROWS_QUERY = '*[_type == "analyticsDaily" && _id in path("analytics.daily.**") && day >= $start && day <= $end] | order(day asc) { day, views, visits, engagedVisits, pages, sources, events }'
const TESTIMONIALS_QUERY = '*[_type == "testimonial" && _id in path("testimonial-**") && coalesce(submittedAt, publishedAt, _createdAt) >= $start] { submittedAt, publishedAt, _createdAt }'
const TARGETS_QUERY = '*[_id == "analyticsTargets"][0]{ quoteLeads, googleShare, testimonials }'

// Un période comparée avant cette date n'a jamais été collectée : pas de faux « 0 ».
const LAUNCH = '2026-11-25'

const LABELS = {
  direct: 'Accès direct / origine inconnue',
  google: 'Google',
  bing: 'Bing',
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  other: 'Autres sites',
  contact_click: 'Liens vers Contact',
  contact_submit: 'Messages envoyés (contact)',
  testimonial_open: 'Liens vers le livre d’or',
  testimonial_submit: 'Messages envoyés (livre d’or)',
  workshop_open: 'Ouvertures de formats d’atelier',
  article_open: 'Liens vers une actualité',
}
const PAGES = {
  '/': 'Accueil',
  '/ateliers-de-mediation-textile': 'Ateliers',
  '/a-propos': 'À propos',
  '/actualites': 'Actualités',
  '/deplacements': 'Déplacements',
  '/partenaires': 'Partenaires',
  '/contact': 'Contact',
  '/livre-d-or': 'Livre d’or',
  '/livre-d-or/laisser-un-mot': 'Livre d’or — laisser un mot',
  '/mentions-legales': 'Mentions légales',
  '/politique-de-confidentialite': 'Politique de confidentialité',
  '/politique-de-cookies': 'Politique de cookies',
  '/autres-pages': 'Autres pages',
}

const number = value => new Intl.NumberFormat('fr-FR').format(value ?? 0)
const percent = value => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value ?? 0)} %`
const pageLabel = path => {
  if (PAGES[path]) return PAGES[path]
  const slug = path.replace(/^\/actualites\//, '')
  const words = decodeURIComponent(slug).split('-').filter(Boolean)
  return words.length ? `Actualité — ${words.slice(0, 5).join(' ')}${words.length > 5 ? '…' : ''}` : path
}
const shortDate = date => date.slice(8) + '/' + date.slice(5, 7)
/** « +12 » / « −4 » avec flèche, ou un mot quand il n'y a rien à comparer. */
function Delta({ value, unit = '' }) {
  if (value === null || value === undefined) return <span className="neotisse-stats__delta">nouveau</span>
  if (value === 0) return <span className="neotisse-stats__delta">stable</span>
  return (
    <span className={`neotisse-stats__delta ${value > 0 ? 'is-up' : 'is-down'}`}>
      <span aria-hidden="true">{value > 0 ? '▲' : '▼'}</span>
      {number(Math.abs(value))}{unit}
      <span className="neotisse-stats__delta-sr">{value > 0 ? ' de plus' : ' de moins'}</span>
    </span>
  )
}

function KpiCard({ kpi, before }) {
  const meta = STATUS[kpi.status]
  const previous = kpi.previousValue === null ? 'historique insuffisant' : `${number(kpi.previousValue)}${kpi.id === 'seo' ? ' %' : ''} (${shortDate(before.start)} → ${shortDate(before.end)})`
  const thresholds = kpi.target
    ? `moins de ${number(kpi.target.low)}${kpi.id === 'seo' ? ' %' : ''} · plus de ${number(kpi.target.high)}${kpi.id === 'seo' ? ' %' : ''}`
    : 'non définis'
  return (
    <article className={`neotisse-stats__kpi neotisse-stats__kpi--${kpi.status}`}>
      <header>
        <h3>{kpi.label}</h3>
        <span className="neotisse-stats__badge">{meta.label}</span>
      </header>
      <p className="neotisse-stats__kpi-value">
        <strong>{number(kpi.value)}</strong> <span>{kpi.id === 'seo' ? '%' : kpi.unit}</span>
      </p>
      <dl className="neotisse-stats__kpi-meta">
        <div><dt>Période précédente</dt><dd>{previous}</dd></div>
        <div><dt>Évolution</dt><dd><Delta value={kpi.delta} unit={kpi.id === 'seo' ? ' pts' : ''} /></dd></div>
        <div><dt>Seuils</dt><dd>{thresholds}</dd></div>
        {kpi.detail && <div><dt>{kpi.detail.label}</dt><dd>{number(kpi.detail.value)} <Delta value={kpi.detail.delta} /></dd></div>}
      </dl>
      <p className="neotisse-stats__advice">{meta.advice}</p>
      <p className="neotisse-stats__hint">{kpi.hint}</p>
    </article>
  )
}

function Funnel({ data, before }) {
  const submits = data.events.find(([kind]) => kind === 'contact_submit')?.[1] ?? 0
  const avis = data.events.find(([kind]) => kind === 'testimonial_submit')?.[1] ?? 0
  const steps = [
    { label: 'Visites', value: data.totals.visits },
    { label: 'Visites avec intention', value: data.totals.engagedVisits },
    { label: 'Messages envoyés', value: submits + avis },
  ]
  const max = Math.max(1, ...steps.map(step => step.value))
  return (
    <section className="neotisse-stats__panel">
      <h2>Où le parcours s’arrête</h2>
      <p className="neotisse-stats__muted">De la visite au message envoyé. Une visite « avec intention » a ouvert un format d’atelier, cliqué vers Contact ou vers le livre d’or.</p>
      <div className="neotisse-stats__funnel">
        {steps.map((step, index) => (
          <div key={step.label} className="neotisse-stats__funnel-row">
            <span>{step.label}</span>
            <span className="neotisse-stats__funnel-bar" aria-hidden="true"><i style={{ width: `${Math.round((step.value / max) * 100)}%` }} /></span>
            <strong>{number(step.value)}</strong>
            <span className="neotisse-stats__muted">
              {index > 0 && data.totals.visits ? `${percent(Math.round((step.value / data.totals.visits) * 1000) / 10)} des visites` : ''}
            </span>
          </div>
        ))}
      </div>
      <p className="neotisse-stats__muted">Part des visites avec intention : {percent(data.conversion.current)} cette période, {percent(data.conversion.previous)} la précédente ({shortDate(before.start)} → {shortDate(before.end)}).</p>
    </section>
  )
}

function Ranking({ title, rows, unit, firstColumn, mapLabel }) {
  const max = Math.max(1, ...rows.map(([, count]) => count))
  return (
    <section className="neotisse-stats__panel">
      <h2>{title}</h2>
      {rows.length ? (
        <table>
          <thead><tr><th scope="col">{firstColumn}</th><th scope="col">{unit}</th><th scope="col" aria-label="Part relative" /></tr></thead>
          <tbody>
            {rows.map(([key, count]) => (
              <tr key={key}>
                <th scope="row">{mapLabel(key)}</th>
                <td>{number(count)}</td>
                <td className="neotisse-stats__ratio"><span aria-hidden="true" style={{ width: `${Math.round((count / max) * 100)}%` }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>Aucune mesure sur cette période.</p>}
    </section>
  )
}

function Evolution({ days, previousDays, showPrevious }) {
  const max = Math.max(1, ...days.map((day, index) => Math.max(day.views, showPrevious ? previousDays[index]?.views ?? 0 : 0)))
  const step = 640 / days.length
  const tick = Math.ceil(days.length / 6)
  return (
    <section className="neotisse-stats__panel">
      <h2>Pages vues par jour</h2>
      <svg viewBox="0 0 700 220" role="img" aria-label={`Pages vues quotidiennes du ${days[0].day} au ${days.at(-1).day}`}>
        <line x1="50" x2="690" y1="180" y2="180" stroke="currentColor" opacity=".3" />
        <line x1="50" x2="690" y1="30" y2="30" stroke="currentColor" opacity=".15" />
        <text x="40" y="35" textAnchor="end">{max}</text><text x="40" y="185" textAnchor="end">0</text>
        {days.map((day, index) => {
          const before = previousDays[index]
          return (
            <g key={day.day}>
              {showPrevious && before && <rect x={50 + index * step + 1} y={180 - before.views / max * 150} width={Math.max(1, step - 2)} height={before.views / max * 150} fill="currentColor" opacity=".16"><title>{day.day} (période précédente) : {before.views} pages vues</title></rect>}
              <rect x={50 + index * step + 1} y={180 - day.views / max * 150} width={Math.max(1, step - 2)} height={day.views / max * 150} fill="#35985f"><title>{day.day} : {day.views} pages vues, {day.visits} visites</title></rect>
            </g>
          )
        })}
        {days.map((day, index) => (index % tick === 0 ? <text key={`t-${day.day}`} x={50 + index * step + step / 2} y="200" textAnchor="middle">{shortDate(day.day)}</text> : null))}
      </svg>
      {showPrevious && <p className="neotisse-stats__legend"><span className="neotisse-stats__swatch" aria-hidden="true" /> Période affichée <span className="neotisse-stats__swatch neotisse-stats__swatch--previous" aria-hidden="true" /> Période précédente</p>}
      <details>
        <summary>Afficher les valeurs quotidiennes</summary>
        <table>
          <thead><tr><th>Date (UTC)</th><th>Pages vues</th><th>Visites</th><th>Visites avec intention</th></tr></thead>
          <tbody>{days.map(day => <tr key={day.day}><th scope="row">{day.day}</th><td>{number(day.views)}</td><td>{number(day.visits)}</td><td>{number(day.engagedVisits)}</td></tr>)}</tbody>
        </table>
      </details>
    </section>
  )
}

/** Tableau de bord mensuel : compare les mois entre eux, sans la distorsion des mois partiels. */
function Monthly({ rows, onClose }) {
  const months = useMemo(() => {
    const map = new Map()
    for (const row of rows) {
      const month = row.day.slice(0, 7)
      const entry = map.get(month) ?? { month, views: 0, visits: 0, engagedVisits: 0, google: 0, contact: 0, avis: 0 }
      entry.views += row.views || 0
      entry.visits += row.visits || 0
      entry.engagedVisits += row.engagedVisits || 0
      entry.google += row.sources?.find(source => source.source === 'google')?.count ?? 0
      entry.contact += row.events?.find(event => event.kind === 'contact_submit')?.count ?? 0
      entry.avis += row.events?.find(event => event.kind === 'testimonial_submit')?.count ?? 0
      map.set(month, entry)
    }
    return [...map.values()].sort((a, b) => b.month.localeCompare(a.month))
  }, [rows])
  const monthName = month => new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T00:00:00Z`))
  return (
    <section className="neotisse-stats__panel" aria-labelledby="neotisse-stats-monthly">
      <div className="neotisse-stats__panel-head"><h2 id="neotisse-stats-monthly">Mois par mois</h2><button type="button" onClick={onClose}>Fermer</button></div>
      {months.length ? (
        <table>
          <thead><tr><th scope="col">Mois</th><th scope="col">Pages vues</th><th scope="col">Visites</th><th scope="col">Intention</th><th scope="col">Google</th><th scope="col">Devis</th><th scope="col">Avis</th></tr></thead>
          <tbody>
            {months.map((month, index) => {
              const older = months[index + 1]
              return (
                <tr key={month.month}>
                  <th scope="row">{monthName(month.month)}{older ? <> <Delta value={month.visits - older.visits} /></> : null}</th>
                  <td>{number(month.views)}</td>
                  <td>{number(month.visits)}</td>
                  <td>{number(month.engagedVisits)}</td>
                  <td>{month.visits ? percent(Math.round((month.google / month.visits) * 1000) / 10) : '—'}</td>
                  <td>{number(month.contact)}</td>
                  <td>{number(month.avis)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : <p>Aucun mois à afficher pour l’instant.</p>}
      <p className="neotisse-stats__muted">La flèche compare les visites au mois précédent. Le mois en cours est incomplet jusqu’à sa fin.</p>
    </section>
  )
}

export default function AnalyticsTool() {
  const baseClient = useClient({ apiVersion: '2025-02-19' })
  const client = useMemo(() => baseClient.withConfig({ useCdn: false, perspective: 'raw' }), [baseClient])
  const [period, setPeriod] = useState(PERIOD)
  const [refresh, setRefresh] = useState(0)
  const [showMonthly, setShowMonthly] = useState(false)
  const [showPrevious, setShowPrevious] = useState(true)
  const [state, setState] = useState({ loading: true, rows: [], testimonials: new Map(), targets: DEFAULT_TARGETS, error: '', updated: null })
  const range = useMemo(() => dateRange(period), [period, refresh])
  const before = useMemo(() => previousRange(range), [range])
  // Fenêtre lue : la période comparée, plus les deux mois précédents pour la vue mensuelle.
  const fetchRange = useMemo(() => ({ start: shiftDay(range.start, -62), end: range.end }), [range])
  useEffect(() => {
    let cancelled = false
    setState(previous => ({ ...previous, loading: true, error: '' }))
    Promise.all([
      client.fetch(ROWS_QUERY, fetchRange),
      client.fetch(TESTIMONIALS_QUERY, { start: fetchRange.start }),
      client.fetch(TARGETS_QUERY),
    ]).then(([rows, testimonials, targets]) => {
      if (cancelled) return
      setState({
        loading: false,
        rows,
        testimonials: countByDay(testimonials),
        targets: {
          quoteLeads: targets?.quoteLeads ?? DEFAULT_TARGETS.quoteLeads,
          googleShare: targets?.googleShare ?? DEFAULT_TARGETS.googleShare,
          testimonials: targets?.testimonials ?? DEFAULT_TARGETS.testimonials,
        },
        error: '',
        updated: new Date(),
      })
    }).catch(() => {
      if (!cancelled) setState(previous => ({ ...previous, loading: false, error: 'Impossible de lire les statistiques. Vérifiez votre connexion et vos droits de lecture sur le projet Sanity.', updated: null }))
    })
    return () => { cancelled = true }
  }, [client, fetchRange, refresh])

  const periodStarted = before.end >= LAUNCH
  const options = useMemo(
    () => ({ targets: state.targets, testimonials: state.testimonials, hasHistory: periodStarted }),
    [state.targets, state.testimonials, periodStarted],
  )
  const data = useMemo(() => report(state.rows, range, options), [state, range, options])
  const previousDays = useMemo(() => report(state.rows, before, options).days, [state, before, options])
  const events = useMemo(() => data.events.map(([kind, count]) => [LABELS[kind] ?? kind, count]), [data])

  return (
    <div className="neotisse-stats">
      <header className="neotisse-stats__header">
        <div>
          <h1>Statistiques Neotisse</h1>
          <p>Audience consentie · journées en UTC · conservation de 90 jours</p>
        </div>
        <div className="neotisse-stats__filters">
          <label>Comparer sur <select value={period} onChange={event => setPeriod(Number(event.target.value))}>
            <option value={7}>7 jours</option><option value={30}>30 jours glissants</option><option value={90}>90 jours</option>
          </select></label>
          <button type="button" aria-pressed={showMonthly} onClick={() => setShowMonthly(value => !value)}>Mois par mois</button>
          <button type="button" disabled={state.loading} onClick={() => setRefresh(value => value + 1)}>Actualiser</button>
        </div>
      </header>

      {state.loading ? <p role="status">Chargement des statistiques…</p> : state.error ? <p role="alert">{state.error}</p> : <>
        <p className="neotisse-stats__note">Du {range.start} au {range.end} inclus, comparé à {before.start} → {before.end}. Dernière lecture : {state.updated?.toLocaleTimeString('fr-FR')}.</p>
        {!periodStarted && <p className="neotisse-stats__notice" role="status">La collecte a démarré le {LAUNCH} : les comparatifs « période précédente » resteront sans valeur quelques semaines, le temps d’avoir un historique.</p>}
        {!state.rows.length && <p role="status">Aucune statistique reçue sur cette période. Les premières données apparaissent après une visite avec acceptation de la bannière.</p>}

        <h2 className="neotisse-stats__section-title">Objectifs du trimestre</h2>
        <p className="neotisse-stats__section-sub">Trois indicateurs du plan de taggage. Chaque carte donne la tendance et le conseil à suivre. Les seuils se règlent dans « Objectifs statistiques ».</p>
        <div className="neotisse-stats__kpis">
          {data.kpis.map(kpi => <KpiCard key={kpi.id} kpi={kpi} before={before} />)}
        </div>

        {showMonthly && <Monthly rows={state.rows} onClose={() => setShowMonthly(false)} />}

        <h2 className="neotisse-stats__section-title">Vue d’ensemble</h2>
        <div className="neotisse-stats__metrics">
          {[
            ['Pages vues', data.totals.views, data.previousTotals.views],
            ['Visites', data.totals.visits, data.previousTotals.visits],
            ['Visites avec intention', data.totals.engagedVisits, data.previousTotals.engagedVisits],
            ['Clics d’intention', data.totals.clicks, data.previousTotals.clicks],
          ].map(([name, value, previous]) => (
            <div className="neotisse-stats__panel" key={name}>
              <span>{name}</span><strong>{number(value)}</strong>
              {periodStarted && <Delta value={value - previous} />}
            </div>
          ))}
        </div>

        <Evolution days={data.days} previousDays={previousDays} showPrevious={showPrevious && periodStarted && period <= 31} />
        {periodStarted && period <= 31 && (
          <label className="neotisse-stats__toggle">
            <input type="checkbox" checked={showPrevious} onChange={event => setShowPrevious(event.target.checked)} /> Afficher la période précédente en filigrane
          </label>
        )}

        <Funnel data={data} before={before} />

        <div className="neotisse-stats__columns">
          <Ranking title="Pages consultées" rows={data.pages} unit="Vues" firstColumn="Page" mapLabel={pageLabel} />
          <Ranking title="Provenance des visites" rows={data.sources} unit="Visites" firstColumn="Source" mapLabel={key => LABELS[key] ?? key} />
        </div>
        <Ranking title="Conversions et clics" rows={events} unit="Nombre" firstColumn="Action" mapLabel={key => key} />
      </>}

      <aside className="neotisse-stats__note">
        <p>Une visite correspond à un onglet actif, renouvelé après 30 minutes sans mesure ou à minuit UTC. Ce n’est pas un nombre de personnes uniques. Les refus, bloqueurs et échecs réseau ne sont pas comptés.</p>
        <p>Un « message envoyé » est compté après un envoi réussi du formulaire ; son contenu n’est jamais collecté. La collecte est plafonnée à 5 000 mesures et 500 visites par jour, et 200 mesures par visite. Aucune donnée historique Umami n’est importée.</p>
      </aside>
    </div>
  )
}
