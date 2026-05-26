import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Hewn Life — AI-era marketing agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1A1815',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top — wordmark + eyebrow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '2px', backgroundColor: '#7CB550' }} />
            <span style={{ color: '#A89F92', fontSize: '13px', letterSpacing: '0.22em', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase' }}>
              The AI-Era Marketing Agency
            </span>
          </div>
          <span style={{ color: '#F2ECE0', fontSize: '42px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1 }}>
            HEWN LIFE
          </span>
        </div>

        {/* Center — headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: '#F2ECE0', fontSize: '64px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Marketing isn&apos;t a line item.
          </div>
          <div style={{ color: '#7CB550', fontSize: '64px', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            It&apos;s the life of your business.
          </div>
        </div>

        {/* Bottom — descriptor + url */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ color: '#A89F92', fontSize: '18px', fontFamily: 'system-ui, sans-serif', maxWidth: '520px', lineHeight: 1.5 }}>
            Thirty years of human business acumen. The speed and scale of AI. Flat fees.
          </span>
          <span style={{ color: '#7CB550', fontSize: '20px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.04em' }}>
            hewn.life
          </span>
        </div>
      </div>
    ),
    size,
  )
}
