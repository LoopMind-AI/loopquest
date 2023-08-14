import { Html, Head, Main, NextScript } from "next/document";

import { GA_TRACKING_ID } from "../../lib/gtag";
const isProduction = process.env.NODE_ENV === "production";

export default function Document() {

  return (
    <Html lang="en">
          <Head>
          {/* enable analytics script only for production */}
          {isProduction && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
              />
            </>
          )}
        </Head>
      <link rel="icon" href="/favicon.svg" />
      <title>Close Loop on Cloud | LoopQuest</title>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
