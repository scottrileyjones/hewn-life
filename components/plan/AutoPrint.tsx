'use client'
import { useEffect } from 'react'

/** Opens the print dialog (Save as PDF) once the page and its terrain graphics have drawn. */
export default function AutoPrint() {
  useEffect(() => {
    document.title = document.title.replace('Your growth plan', 'Growth plan')
    const t = setTimeout(() => window.print(), 1200)
    return () => clearTimeout(t)
  }, [])
  return null
}
