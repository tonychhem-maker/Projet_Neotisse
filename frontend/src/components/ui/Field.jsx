import { useId } from 'react'

const fieldBase =
  'mt-2 w-full rounded-lg border border-sand bg-white/70 px-4 py-3 text-base text-pine placeholder:text-pine/40 focus:border-leaf focus:outline-2 focus:outline-offset-1 focus:outline-leaf/40'

export default function Field({
  label,
  as = 'input',
  required = false,
  error,
  hint,
  className = '',
  rows,
  children,
  ...props
}) {
  const id = useId()
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ')
  const shared = {
    id,
    required,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy || undefined,
    className: fieldBase,
    ...props,
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-pine">
        {label}
        {required && (
          <span className="ml-1 text-leaf" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {as === 'textarea' && <textarea rows={rows ?? 6} {...shared} />}
      {as === 'select' && <select {...shared}>{children}</select>}
      {as === 'input' && <input {...shared} />}

      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-pine/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
