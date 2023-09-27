import type { AvailableLocale } from '@/configs/availableLocales'
import { availableLocales, DEFAULT_LOCALE } from '@/configs/availableLocales'
import createEmotionCache from '@/lib/createEmotionCache'
import common from '@/theme/palette/common'
import type { Direction } from '@/theme/type'
import createEmotionServer from '@emotion/server/create-instance'
import type { SimplePaletteColorOptions } from '@mui/material'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="theme-color"
            content={(common.primary as SimplePaletteColorOptions).main ?? '#000'}
          />
          <meta name="format-detection" content="telephone=no" />
          <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage
  const initialProps = await Document.getInitialProps(ctx)

  // Create Emotion cache
  const direction = availableLocales[(ctx.locale ?? DEFAULT_LOCALE) as AvailableLocale]
    ?.direction as Direction
  const cache = createEmotionCache(direction, 'dark')

  // Extract styles from html
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)
  const chunks = extractCriticalToChunks(initialProps.html)
  const styles = constructStyleTagsFromChunks(chunks)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props: any) => <App serverEmotionCache={cache} {...props} />,
    })

  return {
    ...initialProps,
    emotionStyleTags: styles,
  }
}

export default MyDocument
