import { useEffect, useId, useRef, useState } from 'react'
import flecheUrl from '../../assets/ateliers/fleche.svg?url'
import { actionLabel } from '../../lib/actionLabel'
import './LivreDorCommentaires.css'

const PAGE_SIZE = 4

function CarteAvis({ item, onOpen }) {
  const textRef = useRef(null)
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    const element = textRef.current
    if (!element) return undefined
    let active = true
    const measure = () => {
      if (active) setTruncated(element.scrollHeight > element.clientHeight + 1)
    }
    measure()
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    observer?.observe(element)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      active = false
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [item.message])

  return (
    <li className="livre-dor-card">
      <div className="livre-dor-card__body">
        <blockquote className="livre-dor-card__quote">
          <p ref={textRef}>{item.message}</p>
        </blockquote>
        {truncated && (
          <button className="livre-dor-card__read action-label" type="button" onClick={(event) => onOpen(item, event.currentTarget)} aria-label={`Voir tout l’avis de ${item.author || 'ce participant'}`}>
            Voir tout
          </button>
        )}
        <figure className="livre-dor-card__author">
          <span className="livre-dor-card__avatar" aria-hidden="true" />
          <figcaption className="livre-dor-card__name">
            {item.author}{item.organisation ? ` — ${item.organisation}` : ''}
          </figcaption>
        </figure>
      </div>
    </li>
  )
}

export default function LivreDorCommentaires({ seeAllLink = {}, testimonials = [] }) {
  const href = seeAllLink.to || '#commentaires'
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const dialogRef = useRef(null)
  const returnFocusRef = useRef(null)
  const dialogTitle = useId()
  const pageCount = Math.ceil(testimonials.length / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(0, pageCount - 1))
  const visible = testimonials.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  useEffect(() => {
    const dialog = dialogRef.current
    if (selected && dialog && !dialog.open) dialog.showModal()
  }, [selected])

  function openAvis(item, button) {
    returnFocusRef.current = button
    setSelected(item)
  }

  function closeAvis() {
    setSelected(null)
    returnFocusRef.current?.focus()
  }

  return (
    <section className="livre-dor-comments" id="commentaires" aria-label="Témoignages">
      <div className="livre-dor-comments__more">
        <img className="livre-dor-comments__arrow" src={flecheUrl} alt="" aria-hidden="true" />
        <a className="livre-dor-comments__link action-label" href={href}>
          {actionLabel(seeAllLink.label || 'voir tous les commentaires')}
        </a>
      </div>

      {visible.length > 0 && (
        <ul className="livre-dor-comments__cards" aria-label={`Avis ${currentPage * PAGE_SIZE + 1} à ${currentPage * PAGE_SIZE + visible.length} sur ${testimonials.length}`}>
          {visible.map((item) => <CarteAvis key={item.id || `${item.author}-${item.message}`} item={item} onOpen={openAvis} />)}
        </ul>
      )}

      {pageCount > 1 && (
        <nav className="livre-dor-comments__nav" aria-label="Navigation entre les avis">
          <button type="button" aria-label="Avis précédents" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>←</button>
          <span aria-live="polite">{currentPage + 1} / {pageCount}</span>
          <button type="button" aria-label="Avis suivants" disabled={currentPage === pageCount - 1} onClick={() => setPage(currentPage + 1)}>→</button>
        </nav>
      )}

      <dialog ref={dialogRef} className="livre-dor-dialog" aria-labelledby={dialogTitle} onClose={closeAvis}>
        <h2 id={dialogTitle}>Avis de {selected?.author || 'ce participant'}</h2>
        {selected?.organisation && <p className="livre-dor-dialog__organisation">{selected.organisation}</p>}
        <blockquote className="livre-dor-dialog__message">{selected?.message}</blockquote>
        <button type="button" className="livre-dor-dialog__close action-label" onClick={() => dialogRef.current?.close()} autoFocus>Fermer</button>
      </dialog>

      <div className="livre-dor-comments__rule" aria-hidden="true" />
    </section>
  )
}
