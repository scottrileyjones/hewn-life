/**
 * The site-wide share image (app/opengraph-image.jpg). Next.js serves it to any
 * page without its own openGraph block, but a page that sets openGraph replaces
 * the inherited image, so those pages spread this in.
 */
export const ogImage = {
  url: '/opengraph-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Hewn Life — AI runs the engine. Artists drive.',
}
