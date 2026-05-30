import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketing Assessment — Hewn Life',
  description: 'Seven questions. Two minutes. A clear recommendation on which marketing services and tier will actually move the needle for your business.',
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
