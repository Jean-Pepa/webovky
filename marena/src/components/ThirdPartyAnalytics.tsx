// Externí analytické nástroje. Každý se aktivuje JEN když je v prostředí (Vercel)
// vyplněný jeho klíč — jinak se nevloží nic. Skripty jsou od cizích domén, takže
// běží až na produkci (na živém webu), ne v dev náhledu bez klíčů.
//
// Env proměnné (Vercel → Settings → Environment Variables), musí začínat NEXT_PUBLIC_:
//   NEXT_PUBLIC_GA_ID              → GA4 Measurement ID (např. G-XXXXXXX)
//   NEXT_PUBLIC_PLAUSIBLE_DOMAIN   → doména v Plausible (např. marena-blush.vercel.app)
//   NEXT_PUBLIC_SMARTLOOK_KEY      → Smartlook Project Key (heatmapy + nahrávky)

export function ThirdPartyAnalytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const smartlook = process.env.NEXT_PUBLIC_SMARTLOOK_KEY;

  return (
    <>
      {ga && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`,
            }}
          />
        </>
      )}

      {plausible && (
        <script defer data-domain={plausible} src="https://plausible.io/js/script.js" />
      )}

      {smartlook && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.smartlook||(function(d){var o=smartlook=function(){o.api.push(arguments)},h=d.getElementsByTagName('head')[0];var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);})(document);smartlook('init','${smartlook}',{region:'eu'});`,
          }}
        />
      )}
    </>
  );
}
