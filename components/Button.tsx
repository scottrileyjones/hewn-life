'use client'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark'

interface ButtonProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
}

export default function Button({ href, onClick, children, variant = 'primary', className = '' }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-medium text-sm transition-all duration-300 cursor-pointer'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-moss text-bone hover:brightness-110 hover:scale-[1.02]',
    secondary: 'border border-moss text-moss hover:bg-moss hover:text-bone',
    ghost: 'text-cream hover:underline underline-offset-4',
    dark: 'bg-iron text-bone hover:bg-forge',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
