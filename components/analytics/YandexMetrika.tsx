"use client";

import { getOrCreateLandingSessionId } from "@/lib/analytics/attribution";
import { YANDEX_METRIKA_ID } from "@/lib/analytics/yandex-metrika";
import Script from "next/script";

export function YandexMetrika() {
  if (!YANDEX_METRIKA_ID) return null;

  const landing_session_id = getOrCreateLandingSessionId();
  const params = landing_session_id ? { landing_session_id } : undefined;

  return (
    <>
      <Script id="yandex-metrika-init" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}", "ym");

          ym(${YANDEX_METRIKA_ID}, "init", {
            ssr: true,
            webvisor: true,
            clickmap: true,
            referrer: document.referrer,
            url: location.href,
            accurateTrackBounce: true,
            trackLinks: true,
            trackHash: true${params ? `,
            params: ${JSON.stringify(params)}` : ""}
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

