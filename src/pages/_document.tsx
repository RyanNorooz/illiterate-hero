import type { AvailableLocale } from '@/configs/availableLocales'
import { availableLocales, DEFAULT_LOCALE } from '@/configs/availableLocales'
import createEmotionCache from '@/lib/createEmotionCache'
import common from '@/theme/palette/common'
import type { Direction } from '@/theme/type'
import type { EmotionCache } from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import type { SimplePaletteColorOptions } from '@mui/material'
import type { AppType } from 'next/app'
import Document, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentProps,
} from 'next/document'

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: React.ReactNode[]
}

export default function MyDocument(props: MyDocumentProps) {
  return (
    <Html dir={availableLocales[(props.locale ?? DEFAULT_LOCALE) as AvailableLocale].direction}>
      <Head>
        <meta name="theme-color" content={(common.primary as SimplePaletteColorOptions).main} />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point" content="" />
        {props.emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage
  const initialProps = await Document.getInitialProps(ctx)

  const direction = availableLocales[(ctx.locale ?? DEFAULT_LOCALE) as AvailableLocale]
    ?.direction as Direction
  const cache = createEmotionCache(direction, 'dark')

  const { extractCriticalToChunks } = createEmotionServer(cache)
  const chunks = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = chunks.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: AppType | React.ComponentType<{ emotionCache: EmotionCache }>) =>
        function EnhanceApp(props) {
          return <App {...props} emotionCache={cache} />
        },
    })

  return {
    ...initialProps,
    emotionStyleTags,
  }
}
