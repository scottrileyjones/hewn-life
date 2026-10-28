import type { Metadata } from 'next'
import GrowthDashboard from '@/components/GrowthDashboard'

export const metadata: Metadata = {
  title: 'Growth Dashboard (Sample)',
  description: 'See the live growth dashboard every Hewn client gets: spend, cost per customer and verdicts by strategy across Meta and Google, graded against best in class.',
  alternates: { canonical: 'https://www.hewn.life/dashboard' },
}

export default function DashboardPage() {
  return <GrowthDashboard />
}
