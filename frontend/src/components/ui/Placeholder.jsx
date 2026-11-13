export default function Placeholder({ label }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="border border-dashed border-sand bg-white/40 p-10 text-center text-pine/70">
        <p className="text-[15px] md:text-[calc(20*var(--u))]">
          Contenu « {label} » à intégrer depuis Sanity.
        </p>
      </div>
    </div>
  )
}
