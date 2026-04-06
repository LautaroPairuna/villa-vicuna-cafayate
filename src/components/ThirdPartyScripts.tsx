"use client";

import Script from "next/script";
import { useState, useEffect } from "react";

export default function ThirdPartyScripts() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Si el navegador soporta requestIdleCallback, úsalo para cargar cuando el CPU esté libre
    // De lo contrario, usa un delay de 4 segundos o espera a la primera interacción
    const triggerLoad = () => {
      setShouldLoad(true);
      window.removeEventListener("scroll", triggerLoad);
      window.removeEventListener("click", triggerLoad);
      window.removeEventListener("mousemove", triggerLoad);
      window.removeEventListener("touchstart", triggerLoad);
    };

    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(() => setShouldLoad(true));
      } else {
        setShouldLoad(true);
      }
    }, 4000); // 4 segundos de delay base

    // También cargar si el usuario interactúa antes
    window.addEventListener("scroll", triggerLoad, { once: true, passive: true });
    window.addEventListener("click", triggerLoad, { once: true, passive: true });
    window.addEventListener("mousemove", triggerLoad, { once: true, passive: true });
    window.addEventListener("touchstart", triggerLoad, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", triggerLoad);
      window.removeEventListener("click", triggerLoad);
      window.removeEventListener("mousemove", triggerLoad);
      window.removeEventListener("touchstart", triggerLoad);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
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

      {/* Clarity – Cafayate */}
      <Script id="ms-clarity-cafayate" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "u84orfztgs");
        `}
      </Script>

      {/* Facebook Pixel – Cafayate */}
      <Script id="fb-pixel-cafayate" strategy="afterInteractive">
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
    </>
  );
}
