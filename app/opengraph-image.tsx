import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Hewn Life — AI-era marketing agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function fetchFont(family: string, weight: number, italic = false): Promise<ArrayBuffer> {
  const style = italic ? 'ital,' : ''
  const variant = italic ? `${weight};1,${weight}` : `0,${weight}`
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${style}wght@${variant}`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }
  ).then(r => r.text())

  const url = italic
    ? css.match(/font-style:\s*italic[\s\S]*?src:\s*url\(([^)]+)\)/)?.[1]
    : css.match(/font-style:\s*normal[\s\S]*?src:\s*url\(([^)]+)\)/)?.[1]

  if (!url) throw new Error(`Font URL not found for ${family} ${weight}`)
  return fetch(url).then(r => r.arrayBuffer())
}

export default async function Image() {
  const [playfairBold, playfairItalic] = await Promise.all([
    fetchFont('Playfair Display', 700),
    fetchFont('Playfair Display', 400, true),
  ])

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
          backgroundImage: `
            radial-gradient(ellipse at 85% 15%, rgba(124,181,80,0.18) 0%, transparent 45%),
            radial-gradient(ellipse at 15% 85%, rgba(74,83,72,0.45) 0%, transparent 45%)
          `,
          padding: '64px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Large background watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '-40px',
            fontSize: '480px',
            fontWeight: 700,
            color: 'rgba(124,181,80,0.04)',
            lineHeight: 1,
            fontFamily: '"Playfair Display"',
            letterSpacing: '-0.05em',
            display: 'flex',
          }}
        >
          H
        </div>

        {/* Top — eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '1.5px', backgroundColor: '#7CB550', display: 'flex' }} />
          <span
            style={{
              color: '#A89F92',
              fontSize: '12px',
              letterSpacing: '0.25em',
              fontFamily: 'system-ui, sans-serif',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            The AI-Era Marketing Agency
          </span>
        </div>

        {/* Center — headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div
            style={{
              color: '#F2ECE0',
              fontSize: '88px',
              fontWeight: 700,
              fontFamily: '"Playfair Display"',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            Marketing isn&apos;t a line item.
          </div>
          <div style={{ display: 'flex', gap: '0px', alignItems: 'baseline' }}>
            <span
              style={{
                color: '#F2ECE0',
                fontSize: '88px',
                fontWeight: 700,
                fontFamily: '"Playfair Display"',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              It&apos;s the&nbsp;
            </span>
            <span
              style={{
                color: '#7CB550',
                fontSize: '88px',
                fontStyle: 'italic',
                fontWeight: 400,
                fontFamily: '"Playfair Display"',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              life
            </span>
            <span
              style={{
                color: '#F2ECE0',
                fontSize: '88px',
                fontWeight: 700,
                fontFamily: '"Playfair Display"',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              &nbsp;of your business.
            </span>
          </div>
        </div>

        {/* Bottom — wordmark + url */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                color: '#F2ECE0',
                fontSize: '28px',
                fontWeight: 700,
                fontFamily: '"Playfair Display"',
                letterSpacing: '0.04em',
                display: 'flex',
              }}
            >
              HEWN LIFE
            </span>
            <span
              style={{
                color: '#A89F92',
                fontSize: '13px',
                fontFamily: 'system-ui, sans-serif',
                fontStyle: 'italic',
                letterSpacing: '0.02em',
                display: 'flex',
              }}
            >
              Carved from the raw. Built for the future.
            </span>
          </div>
          <span
            style={{
              color: '#7CB550',
              fontSize: '18px',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.08em',
              display: 'flex',
            }}
          >
            hewn.life
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Playfair Display', data: playfairBold, style: 'normal', weight: 700 },
        { name: 'Playfair Display', data: playfairItalic, style: 'italic', weight: 400 },
      ],
    },
  )
}
