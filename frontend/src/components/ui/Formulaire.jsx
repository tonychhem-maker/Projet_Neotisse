// Formulaire global du site : primitives partagées par le formulaire de
// contact et celui du livre d'or.
//
// Style : formulaire compact sur une demi-largeur (la page choisit son
// conteneur), champs blancs à filet fin sur le fond crème, libellés
// capitales discrets, placeholders fins et gris peu opaque, aucun arrondi
// (règle du site). Erreurs sous le champ, en rouge.
//
// Les pages gardent la main sur l'état, la validation et l'envoi ; ces
// primitives ne font que l'affichage.

const BASE_CONTROLE =
  'w-full border bg-white px-4 py-3 font-dm text-[15px] leading-snug text-[#0a0a0a] ' +
  'outline-none transition-colors duration-200 ' +
  'placeholder:font-light placeholder:text-black/35 ' +
  'focus:border-[#2f8a55] '

function classesControle(erreur, supplement) {
  return (
    BASE_CONTROLE +
    (erreur ? 'border-[#b42318] ' : 'border-[#0b4f2a]/25 ') +
    (supplement ?? '')
  )
}

// Formulaire : le <form> commun aux pages (pas de validation native, la
// validation est faite par chaque page ; styles de mise en page par props).
export function Formulaire({ children, ...props }) {
  return (
    <form noValidate {...props}>
      {children}
    </form>
  )
}

// Étiquette du champ : petite capitale verte, au-dessus de la zone.
function Etiquette({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#0b4f2a]"
    >
      {children}
    </label>
  )
}

// Message d'erreur sous le champ.
function Erreur({ children }) {
  if (!children) return null
  return <p className="text-[13px] text-[#b42318]">{children}</p>
}

// Champ texte d'une ligne.
export function ChampTexte({ label, id, erreur, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <Etiquette htmlFor={id}>{label}</Etiquette>
      <input id={id} aria-invalid={erreur ? true : undefined} className={classesControle(erreur)} {...props} />
      <Erreur>{erreur}</Erreur>
    </div>
  )
}

// Zone de texte multiligne (message).
export function ChampLong({ label, id, erreur, rows = 5, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <Etiquette htmlFor={id}>{label}</Etiquette>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={erreur ? true : undefined}
        className={`${classesControle(erreur)} resize-y`}
        {...props}
      />
      <Erreur>{erreur}</Erreur>
    </div>
  )
}

// Menu déroulant. Tant qu'aucune valeur n'est choisie, le texte du
// « placeholder » reste gris clair (option disabled).
export function ChampSelect({
  label,
  id,
  options = [],
  placeholder,
  valeur,
  erreur,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      <Etiquette htmlFor={id}>{label}</Etiquette>
      <select
        id={id}
        value={valeur}
        aria-invalid={erreur ? true : undefined}
        className={`${classesControle(erreur)} cursor-pointer appearance-none bg-no-repeat ${
          valeur ? '' : 'text-black/40'
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%230b4f2a' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          backgroundPosition: 'right 14px center',
          backgroundSize: '13px auto',
        }}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-[#0a0a0a]">
            {option}
          </option>
        ))}
      </select>
      <Erreur>{erreur}</Erreur>
    </div>
  )
}

// Case à cocher + texte de consentement.
export function CaseCocher({ label, id, erreur, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-[#0a0a0a]">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-[18px] w-[18px] flex-none cursor-pointer accent-[#0b4f2a]"
          {...props}
        />
        <span>{label}</span>
      </label>
      <div className="pl-[26px]">
        <Erreur>{erreur}</Erreur>
      </div>
    </div>
  )
}

// Bouton d'envoi : bloc vert sapin, coins droits.
export function BoutonEnvoyer({ children, ...props }) {
  return (
    <button
      type="submit"
      className="inline-flex cursor-pointer items-center justify-center self-start bg-[#0b4f2a] px-9 py-3 text-[15px] font-medium text-[#f4efe6] transition-colors duration-300 hover:bg-[#2f8a55] disabled:cursor-progress disabled:opacity-70"
      {...props}
    >
      {children}
    </button>
  )
}
