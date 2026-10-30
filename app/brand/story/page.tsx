import type { Metadata } from 'next'
import LaunchStory from '@/components/brand/LaunchStory'

export const metadata: Metadata = {
  title: 'Launch story',
  robots: { index: false, follow: false },
}

/** The animated launch Story, played on a loop and exported to MP4 frame by frame. */
export default function StoryPage() {
  return (
    <div className="bg-bone px-5 pb-24 pt-10">
      <style>{'nav { display: none !important; }'}</style>
      <LaunchStory />
    </div>
  )
}
