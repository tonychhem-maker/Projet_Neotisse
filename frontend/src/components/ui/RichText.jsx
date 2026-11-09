import { PortableText } from '@portabletext/react'
import { Link } from 'react-router-dom'

const components = {
  block: {
    normal: ({ children }) => <p className="text-body leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="mt-8 text-2xl text-pine md:text-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 text-xl text-pine">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-leaf pl-4 italic text-pine/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href ?? '#'
      const isInternal = href.startsWith('/')

      if (isInternal) {
        return (
          <Link to={href} className="text-leaf underline underline-offset-2 hover:text-pine">
            {children}
          </Link>
        )
      }

      return (
        <a
          href={href}
          className="text-leaf underline underline-offset-2 hover:text-pine"
          {...(value?.blank && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {children}
        </a>
      )
    },
  },
}

// Rend du Portable Text Sanity, ou un texte brut en repli (contenu de prévisualisation).
export default function RichText({ value, className = '' }) {
  if (!value) return null

  if (typeof value === 'string') {
    return <p className={`text-body leading-relaxed ${className}`}>{value}</p>
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  )
}
