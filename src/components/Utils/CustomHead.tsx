import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'

interface CustomHeadProps {
  title?: string
  description?: string
  imageUrl?: string
  url?: string
  twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player'
  keywords?: string[]
}

export default function CustomHead(props: CustomHeadProps) {
  const router = useRouter()
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { defaultMatches: true })
  const { t } = useTranslation()

  // defaults
  const title = props.title ?? t('meta.title')
  const description = props.description ?? t('meta.description')
  const url = props.url ?? router.asPath
  const image = props.imageUrl ?? '/images/logo-full.png'
  const twitterCardType = props.twitterCardType ?? 'summary'
  const keywords = props.keywords ?? []

  return (
    <Head>
      <link rel="icon" href={prefersDark ? '/favicon.ico' : '/favicon-dark.ico'} />

      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCardType} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Head>
  )
}
