import { photos, photoUrl, photoSrcSet, type PhotoKey } from '@/lib/photos'

/**
 * A Cloudinary photo that fills its (relative, sized) parent. `w`/`h` set the
 * crop ratio and the 1× delivery size; `sizes` tells the browser how wide it renders.
 * Every photo gets the analog film treatment (faded tone, vignette, grain, dust) from `.photo-film`.
 */
export default function Photo({
  name,
  w = 800,
  h = 600,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  className = '',
  priority = false,
}: {
  name: PhotoKey
  w?: number
  h?: number
  sizes?: string
  className?: string
  priority?: boolean
}) {
  return (
    <span className={`photo-film absolute inset-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl(name, w, h)}
        srcSet={photoSrcSet(name, w, h)}
        sizes={sizes}
        alt={photos[name].alt}
        width={w}
        height={h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="photo-film-dust" aria-hidden="true" />
    </span>
  )
}
