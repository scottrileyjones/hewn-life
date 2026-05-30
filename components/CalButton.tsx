'use client'
import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'

const CAL_LINK = 'scott-hewn/discovery'

interface CalButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export default function CalButton({ children, className, onClick, style }: CalButtonProps) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({})
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])

  return (
    <button
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view"}'
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
