import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hewn Life',
    short_name: 'Hewn',
    description: 'Your new growth team. One flat fee.',
    start_url: '/',
    display: 'browser',
    background_color: '#F7F6F3',
    theme_color: '#1E3826',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
