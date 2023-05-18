import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <meta property="og:url" content="https://quickcast.lol/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="quickcast" />
        <meta
          property="og:description"
          content="Boost your efficiency with hotkeys and AI."
        />
        <meta property="og:site_name" content="quickcast" />
        <meta property="og:image" content="https://quickcast.lol/images/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="quickcast" />
        <meta
          name="twitter:description"
          content="Boost your efficiency with hotkeys and AI."
        />
        <meta name="twitter:image" content="https://quickcast.lol/images/og-image.png" />

        <meta name="theme-color" content="##09090B" />

        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
