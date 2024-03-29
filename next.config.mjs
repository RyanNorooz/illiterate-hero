process.env.ENV_VALIDATION === 'true' && (await import('./src/env/env.mjs'))
import nextI18NextConfig from './next-i18next.config.js'
import withPlugins from 'next-compose-plugins'
import withPlaiceholder from '@plaiceholder/next'

// import NEXT_PWA from 'next-pwa'

// const withPWA = NEXT_PWA({
//   dest: 'public',
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
// })

const withNextBundleAnalyzer =
  process.env.ANALYZE === 'true' &&
  (await import('@next/bundle-analyzer').then((m) => m.default))({ enabled: true })

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: nextI18NextConfig.i18n,
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
  webpack(
    /** @type {import('webpack').Configuration} */
    config
  ) {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    })
    return config
  },
}

export default withPlugins(
  [
    ...(withNextBundleAnalyzer ? [withNextBundleAnalyzer] : []),
    withPlaiceholder,
    // withPWA
  ],
  nextConfig
)
