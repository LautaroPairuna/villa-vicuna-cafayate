"use client";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useEffect, useRef, useState } from "react";

export default function ThirdPartyScripts() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;

    let timerId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const load = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      setShouldLoad(true);

      window.removeEventListener("pointerdown", load);
      window.removeEventListener("scroll", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("touchstart", load);
    };

    timerId = setTimeout(() => {
      if ("requestIdleCallback" in window && window.requestIdleCallback) {
        idleId = window.requestIdleCallback(
          () => load(),
          { timeout: 2000 },
        );
      } else {
        load();
      }
    }, 4000);

    window.addEventListener("pointerdown", load, { once: true, passive: true });
    window.addEventListener("scroll", load, { once: true, passive: true });
    window.addEventListener("keydown", load, { once: true });
    window.addEventListener("touchstart", load, { once: true, passive: true });

    return () => {
      if (timerId) clearTimeout(timerId);
      if (idleId && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("scroll", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("touchstart", load);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      <GoogleAnalytics gaId="G-0M5ME9D4YS" />

      <Script id="ms-clarity-cafayate" strategy="lazyOnload">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "u84orfztgs");
        `}
      </Script>

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
    </>
  );
}
