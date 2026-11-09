export default function SectionTitle({ as: Tag = 'h2', eyebrow, children, className = '' }) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-leaf">{eyebrow}</p>
      )}
      <Tag className="text-4xl text-pine md:text-h2">{children}</Tag>
    </div>
  )
}
