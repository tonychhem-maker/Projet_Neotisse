import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal, useTextReveal } from '../../lib/reveal'
import { actionLabel } from '../../lib/actionLabel'

export default function ClosingCta({
  titleLine1 = 'Prêt à organiser votre',
  titleLine2 = 'atelier',
  label = 'Contactez-nous',
  to = '/contact',
}) {
  const scope = useRef(null)

  useTextReveal(scope)
  useReveal(scope)

  return (
    <section className="relative bg-cream" ref={scope}>
      <div className="mx-auto w-full max-w-[1230px] px-10 pb-24 pt-10 text-center">
        <h2 className="mx-auto max-w-[800px] font-serif text-[28px] uppercase leading-[1.35] tracking-[-0.01em] text-[#0b4f2a] md:text-[calc(31*var(--u))] lg:text-[calc(52*var(--u))]">
          <span className="reveal-line">
            <span className="block">{titleLine1}</span>
          </span>
          <span className="reveal-line">
            <span className="block">{titleLine2}</span>
          </span>
        </h2>
        <div data-reveal-group className="mt-14 flex flex-col items-center">
          <span
            data-reveal
            aria-hidden="true"
            className="text-[20px] leading-none text-[#2f8a55] md:text-[calc(26*var(--u))]"
          >
            ↓
          </span>
          <Link
            data-reveal
            to={to}
            className="action-label mt-8 inline-block bg-[#0b4f2a] px-9 py-3 text-[13px] text-[#f4efe6] transition-colors duration-300 hover:bg-[#2f8a55] md:text-[calc(14*var(--u))]"
          >
            {actionLabel(label)}
          </Link>
        </div>
      </div>
    </section>
  )
}
