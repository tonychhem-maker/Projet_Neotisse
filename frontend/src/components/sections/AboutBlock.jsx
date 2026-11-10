import { useRef } from 'react'
import { useReveal } from '../../lib/reveal'

// Bloc « Neotisse » : présentation de l'association et visuel d'accroche.
// Contenu piloté par le back-office (homePage), avec repli codé en dur.
export default function AboutBlock({ title, paragraphs, imageSrc, imageAlt }) {
  const scope = useRef(null)

  useReveal(scope, { stagger: 0.14 })

  return (
    <section className="relative" ref={scope}>
      <div className="mx-auto grid w-full max-w-[1230px] grid-cols-1 items-start gap-16 px-10 pb-24 pt-6 lg:grid-cols-[470px_1fr]">
        <div>
          <h2
            data-reveal
            className="font-serif text-[42px] leading-[1.15] text-[#0b4f2a]"
          >
            {title}
          </h2>
          <div
            data-reveal-group
            className="mt-10 space-y-14 text-[13px] leading-[2] text-[#0a0a0a]"
          >
            {paragraphs.map((paragraph) => (
              <p key={paragraph} data-reveal>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {imageSrc && (
          <div data-reveal className="justify-self-end">
            <img
              src={imageSrc}
              alt={imageAlt ?? ''}
              className="h-[262px] w-[460px] max-w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
