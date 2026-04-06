// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import SwRegister from "@/components/SwRegister";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import "../../styles/globals.css";

/*─── CONFIG GENERAL ───────────────────────────────────────────*/
export const dynamic = "force-static"; // compatible con output:export

const BASE_URL = "https://www.villavicunacafayate.com.ar";
const FAV_VERSION = "20250730";
const LOCALES = ["es", "en", "pt"] as const;
const SITE_TITLE = "Villa Vicuña | Cafayate, Argentina";
const SITE_DESCRIPTION =
  "Hotel boutique a 50 m de la plaza principal de Cafayate. 12 habitaciones de estilo español, desayuno casero y atención personalizada.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

const cinzel = localFont({
  src: "../../../public/fonts/cinzel.woff2",
  variable: "--font-cinzel",
  display: "swap",
  weight: "400",
});

const montserrat = localFont({
  src: "../../../public/fonts/montserrat.woff2",
  variable: "--font-montserrat",
  display: "swap",
  weight: "400",
});

const monotype = localFont({
  src: "../../../public/fonts/monotype-cursiva.woff2",
  variable: "--font-monotype-corsiva",
  display: "swap",
  weight: "400",
});

const migra = localFont({
  src: "../../../public/fonts/migra.woff2",
  variable: "--font-migra",
  display: "swap",
  weight: "400",
});

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

  const title = SITE_TITLE;
  const description = SITE_DESCRIPTION;

  const hrefLangs = Object.fromEntries(
    LOCALES.map((l) => [l, `${BASE_URL}/${l}/`]),
  ) as Record<(typeof LOCALES)[number], string>;

  return (
    <html lang={locale}>
      <head>
        {/* Meta básicos */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="canonical" href={`${BASE_URL}/${locale}/`} />
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
        <meta property="og:url" content={`${BASE_URL}/${locale}/`} />
        <meta property="og:locale" content={locale} />
        <meta property="og:image" content={`${BASE_URL}/opengraph.jpg`} />

        {/* Verificación de dominio Facebook (Cafayate) */}
        <meta
          name="facebook-domain-verification"
          content="31422g1pamf8khfssp81jfcfyu3vls"
        />

        {/* Preload crítico (solo lo realmente above-the-fold) */}
        <link rel="preload" as="image" href="/images/hero-poster.webp" fetchPriority="high" />
        <link
          rel="preload"
          as="image"
          href="/images/logo-villa-vicuna-3.svg"
          fetchPriority="high"
        />
        {/* Si usás estas mismas fuentes en Cafayate */}
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

        <link rel="dns-prefetch" href="https://static1.cloudbeds.com" />
        <link rel="dns-prefetch" href="https://hotels.cloudbeds.com" />
        <link rel="preconnect" href="https://static1.cloudbeds.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hotels.cloudbeds.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.facebook.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="anonymous" />

        {/* ─────────────────────────────────────────────
            ANALYTICS OPTIMIZADO - CARGA DIFERIDA
           ───────────────────────────────────────────── */}
        <ThirdPartyScripts />
      </head>

      <body
        className={`${cinzel.variable} ${montserrat.variable} ${monotype.variable} ${migra.variable}`}
      >
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