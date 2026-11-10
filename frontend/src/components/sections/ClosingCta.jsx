import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../lib/reveal'

export default function ClosingCta() {
  const scope = useRef(null)

  useReveal(scope, { stagger: 0.16 })

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto w-full max-w-[1230px] px-10 pb-24 pt-10 text-center">
        <h2
          data-reveal
          className="mx-auto max-w-[800px] font-serif text-[34px] uppercase leading-[1.3] text-[#0b4f2a] lg:text-display"
        >
          Prêt à organiser votre
          <br />
          atelier
        </h2>
        <div data-reveal-group className="mt-14 flex flex-col items-center">
          <span
            data-reveal
            aria-hidden="true"
            className="text-[26px] leading-none text-[#2f8a55]"
          >
            ↓
          </span>
          <Link
            data-reveal
            to="/contact"
            className="mt-8 inline-block rounded-full bg-[#0b4f2a] px-9 py-3 text-[13px] font-medium text-[#f4efe6] transition-colors duration-300 hover:bg-[#2f8a55]"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </section>
  )
}
