export default function PageHeader({ eyebrow, title, children }) {
  return (
    <section className="border-b border-sand bg-sand/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {eyebrow && (
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-leaf">{eyebrow}</p>
        )}
        <h1 className="text-4xl text-pine md:text-h1">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-body">{children}</div>}
      </div>
    </section>
  )
}
