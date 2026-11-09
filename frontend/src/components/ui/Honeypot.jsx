// Champ piège invisible pour les robots spammeurs.
// Un humain ne le voit ni ne le remplit ; les robots le remplissent souvent.
export default function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="honeypot-field">Ne pas remplir ce champ</label>
      <input
        id="honeypot-field"
        name="_gotcha"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
