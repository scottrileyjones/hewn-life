import Link from 'next/link'

interface HewnLogoProps {
  dark?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function HewnLogo({ dark = true, size = 'md' }: HewnLogoProps) {
  const markSize = size === 'sm' ? 24 : size === 'lg' ? 44 : 32
  const textSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-[26px]'
  const markColor = dark ? 'text-[#0D0D0D]' : 'text-white'
  const wordColor = dark ? 'text-[#0D0D0D]' : 'text-white'

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={`${markColor} flex-shrink-0 transition-opacity duration-300 group-hover:opacity-80`}
        aria-hidden="true"
      >
        <rect x="14" y="14" width="18" height="72" fill="currentColor" />
        <rect x="68" y="14" width="18" height="72" fill="currentColor" />
        <polygon points="32,58 68,42 68,54 32,70" fill="currentColor" />
      </svg>
      <span className={`font-display font-semibold ${textSize} leading-none tracking-[0.02em] ${wordColor}`}>
        Hewn<span className="accent text-[#6BAD3D]">Life</span>
      </span>
    </Link>
  )
}
