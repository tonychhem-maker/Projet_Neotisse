import './PageHeader.css'

export default function PageHeader({ eyebrow, title, children }) {
  return (
    <section className="page-header">
      <div className="page-header__inner">
        {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {children && <div className="page-header__intro">{children}</div>}
      </div>
    </section>
  )
}
