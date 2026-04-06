// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import SwRegister from "@/components/SwRegister";
import "../../styles/globals.css";

/*─── CONFIG GENERAL ───────────────────────────────────────────*/
export const dynamic = "force-static"; // compatible con output:export

const BASE_URL = "https://www.villavicunacafayate.com.ar";
const FAV_VERSION = "20250730"; // cambia al actualizar favicon
const LOCALES = ["es", "en", "pt"] as const;

/*─── LAYOUT ─────────────────────────────────────────────────*/
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: (typeof LOCALES)[number] };

  // Validación de locale
  if (!LOCALES.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  const title = "Villa Vicuña | Cafayate, Argentina";
  const description =
    "Hotel boutique a 50 m de la plaza principal de Cafayate. 12 habitaciones de estilo español, desayuno casero y atención personalizada.";

  const hrefLangs = Object.fromEntries(
    LOCALES.map((l) => [l, `${BASE_URL}/${l}`]),
  ) as Record<(typeof LOCALES)[number], string>;

  return (
    <html lang={locale}>
      <head>
        {/* Meta básicos */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${BASE_URL}/${locale}`} />
        {Object.entries(hrefLangs).map(([lang, url]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}

        {/* Favicons versionados */}
        <link rel="icon" href={`/favicon.ico?v=${FAV_VERSION}`} />
        <link
          rel="apple-touch-icon"
          href={`/apple-touch-icon.png?v=${FAV_VERSION}`}
        />

        {/* Open Graph mínimo */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Hotel Villa Vicuña" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${BASE_URL}/${locale}`} />
        <meta property="og:locale" content={locale} />
        <meta property="og:image" content={`${BASE_URL}/opengraph.jpg`} />

        {/* Verificación de dominio Facebook (Cafayate) */}
        <meta
          name="facebook-domain-verification"
          content="31422g1pamf8khfssp81jfcfyu3vls"
        />

        {/* Preload crítico (solo lo realmente above-the-fold) */}
        <link rel="preload" as="image" href="/images/hero-poster.jpg" />
        <link
          rel="preload"
          as="image"
          href="/images/logo-villa-vicuna-2.svg"
          fetchPriority="high"
        />
        {/* Si usás estas mismas fuentes en Cafayate */}
        <link
          rel="preload"
          as="font"
          href="/fonts/cinzel.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/montserrat.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/monotype-cursiva.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/migra.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preconexiones para reducir latencia de terceros críticos */}
        <link
          rel="preconnect"
          href="https://static1.cloudbeds.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://static1.cloudbeds.com" />
        <link
          rel="preconnect"
          href="https://hotels.cloudbeds.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://hotels.cloudbeds.com" />
        <link
          rel="preconnect"
          href="https://clientstream.launchdarkly.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://clientstream.launchdarkly.com" />
        <link
          rel="preconnect"
          href="https://clientsdk.launchdarkly.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://clientsdk.launchdarkly.com" />
        <link
          rel="preconnect"
          href="https://www.clarity.ms"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/*
          IMPORTANTE:
          - No cargamos Cloudbeds aquí.
          - Solo preconnect; el script se inyecta on-demand en CloudbedsBookNow.
        */}

        {/* ─────────────────────────────────────────────
            ANALYTICS SIN PARTYTOWN, OPTIMIZADO
           ───────────────────────────────────────────── */}

        {/* Google Analytics (GA4) – Cafayate */}
        <Script
          id="ga4-external-cafayate"
          src="https://www.googletagmanager.com/gtag/js?id=G-0M5ME9D4YS"
          strategy="afterInteractive"
        />
        <Script id="ga4-inline-cafayate" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0M5ME9D4YS', { cookie_domain: 'villavicunacafayate.com.ar' });
          `}
        </Script>

        {/* Clarity – Cafayate (snippet oficial) */}
        <Script id="ms-clarity-cafayate" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u84orfztgs");
          `}
        </Script>

        {/* Facebook Pixel – Cafayate (snippet oficial, lazyOnload) */}
        <Script id="fb-pixel-cafayate" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1303096650960204');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>

      <body>
        {/* Facebook Pixel (noscript): <img> simple */}
        <noscript>
          <img
            height="1"
            width="1"
            alt="Facebook Pixel"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1303096650960204&ev=PageView&noscript=1"
          />
        </noscript>

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        {/* Registro del Service Worker */}
        <SwRegister />
      </body>
    </html>
  );
}
