'use client'
import Script from 'next/script'
import { GTM_ID, CONSENT_STORAGE_KEY } from '@/lib/gtm'

/**
 * Loads Google Tag Manager with Google Consent Mode v2.
 *
 * Nothing renders (and no tracking loads) unless NEXT_PUBLIC_GTM_ID is set, so
 * local/dev builds without the env var stay clean. Consent defaults to denied
 * for analytics & advertising storage; the cookie banner flips it to granted
 * via updateConsent() once the visitor accepts. A previously stored "accepted"
 * choice is re-applied on load so returning visitors aren't re-prompted.
 */
export default function GoogleTagManager() {
  if (!GTM_ID) return null

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500
        });
        try {
          if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'accepted') {
            gtag('consent', 'update', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted'
            });
          }
        } catch (e) {}
        gtag('set', 'ads_data_redaction', true);
        gtag('set', 'url_passthrough', true);
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  )
}

/**
 * The <noscript> GTM fallback. Render this immediately after <body> opens so
 * tags still fire for visitors with JavaScript disabled.
 */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
