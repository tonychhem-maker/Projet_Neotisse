import { useRef } from 'react'
import { useReveal, useTextReveal } from '../../lib/reveal'

// Bloc « Neotisse » : présentation de l'association et visuel d'accroche.
// Contenu piloté par le back-office (homePage), avec repli codé en dur.
export default function AboutBlock({ title, paragraphs, imageSrc, imageAlt }) {
  const scope = useRef(null)

  useTextReveal(scope)
  useReveal(scope)

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto grid w-full max-w-[1230px] grid-cols-1 items-start gap-16 px-10 pb-24 pt-6 lg:grid-cols-[470px_1fr]">
        <div>
          <h2 className="font-serif text-[28px] leading-[1.15] text-[#0b4f2a] md:text-[calc(42*var(--u))]">
            <span className="reveal-line">
              <span className="block">{title}</span>
            </span>
          </h2>
          <div className="mt-10 space-y-14 font-dm text-[15px] font-normal leading-[1.6] text-[#0a0a0a] md:text-[calc(18*var(--u))]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="reveal-line">
                <span className="block">{paragraph}</span>
              </p>
            ))}
          </div>
        </div>

        {imageSrc && (
          <div data-reveal className="justify-self-end">
            <img
              src={imageSrc}
              alt={imageAlt ?? ''}
              className="h-[210px] w-[368px] max-w-full object-cover md:h-[calc(262*var(--u))] md:w-[calc(460*var(--u))]"
            />
          </div>
        )}
      </div>
    </section>
  )
}
