import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-pine text-cream hover:bg-leaf focus-visible:outline-pine',
  secondary:
    'bg-leaf text-cream hover:bg-pine focus-visible:outline-leaf',
  outline:
    'border-2 border-pine text-pine hover:bg-pine hover:text-cream focus-visible:outline-pine',
  ghost:
    'border-2 border-sand text-pine hover:border-pine focus-visible:outline-pine',
}

export default function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const classes = [
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:text-[calc(16*var(--u))]',
    variants[variant],
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    const external = /^https?:\/\//.test(href)

    return (
      <a
        href={href}
        className={classes}
        {...((external || props.target === '_blank') && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={props.type ?? 'button'} className={classes} {...props}>
      {children}
    </button>
  )
}
