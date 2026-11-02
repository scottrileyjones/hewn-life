/**
 * Line icons for the checkout galleries: 24×24, 1.7 stroke, round caps and
 * joins (the brand's icon spec). Drawn here so they match each other exactly.
 */

const paths = {
  megaphone: 'M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1ZM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11',
  layout: 'M4 5h16v14H4zM4 9h16M9 9v10',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pipeline: 'M5 5h4v14H5zM10 5h4v9h-4zM15 5h4v5h-4z',
  calendar: 'M5 6h14v13H5zM5 10h14M9 4v4M15 4v4M9 14h2',
  pen: 'M4 20l4-1 10-10-3-3L5 16l-1 4ZM13 8l3 3',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.5 2.6 3.5 5.6 3.5 9s-1 6.4-3.5 9M12 3c-2.5 2.6-3.5 5.6-3.5 9s1 6.4 3.5 9',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM15.5 15.5 20 20',
  layers: 'M12 4 3 9l9 5 9-5-9-5ZM3 14l9 5 9-5',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
}

export type LineIconName = keyof typeof paths

export default function LineIcon({ name, color = 'currentColor', size = 24, className = '' }: { name: LineIconName; color?: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
