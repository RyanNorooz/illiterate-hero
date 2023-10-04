// import InstallPWA from '@/components/pwa/InstallPWA'
import CustomToastContainer from '@/components/utils/CustomToastContainer'
import ErrorBoundary from '@/lib/ErrorBoundary'
import MuiThemeProvider from '@/lib/MuiThemeProvider'
import ReactQueryProvider from '@/lib/ReactQueryProvider'
import { trpc } from '@/lib/trpc'
import StoreProvider from '@/store/StoreProvider'
import type { PersistedState } from '@/store/store'
import type { EmotionCache } from '@emotion/react'
import type { NextPage } from 'next'
import type { SSRConfig } from 'next-i18next'
import { appWithTranslation } from 'next-i18next'
import nextI18NextConfig from 'next-i18next.config.js'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import type { ReactElement, ReactNode } from 'react'
import '../styles/main.scss'

interface PageProps extends SSRConfig {
  initialZustandState: PersistedState
}

type NextPageWithLayout = NextPage<PageProps> & {
  Layout?: (page: ReactElement) => ReactNode
}

export type MyAppProps = AppProps<PageProps> & {
  emotionCache: EmotionCache
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps, emotionCache }: MyAppProps) => {
  const Layout = Component.Layout ?? ((page) => page)

  return (
    <ErrorBoundary>
      <StoreProvider {...pageProps.initialZustandState}>
        <ReactQueryProvider>
          <MuiThemeProvider emotionCache={emotionCache}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>

            {Layout(<Component {...pageProps} />)}

            {/* <InstallPWA /> */}

            <CustomToastContainer />
          </MuiThemeProvider>
        </ReactQueryProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}

export default trpc.withTRPC(appWithTranslation<MyAppProps>(App, nextI18NextConfig))
