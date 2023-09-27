// import InstallPWA from '@/components/PWA/InstallPWA'
import CustomToastContainer from '@/components/Utils/CustomToastContainer'
import ErrorBoundary from '@/lib/ErrorBoundary'
import ReactQueryProvider from '@/lib/ReactQueryProvider'
import { trpc } from '@/lib/trpc'
import MuiThemeProvider from '@/lib/MuiThemeProvider'
import StoreProvider from '@/store/StoreProvider'
import getInitialState from '@/store/getInitialState'
import type { PersistedState } from '@/store/store'
import type { EmotionCache } from '@emotion/react'
import type { NextPage } from 'next'
import type { SSRConfig } from 'next-i18next'
import { appWithTranslation } from 'next-i18next'
import nextI18NextConfig from 'next-i18next.config.js'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import 'public/fonts/Vazirmatn/style.css'
import type { ReactElement, ReactNode } from 'react'
import '../styles/main.scss'

interface InitialState {
  initialState?: PersistedState
}

type NextPageWithLayout = NextPage & {
  Layout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout<P> = AppProps<P> & {
  serverEmotionCache: EmotionCache
  Component: NextPageWithLayout
}

const App = ({
  Component,
  pageProps: { initialState, ...pageProps },
  serverEmotionCache,
}: AppPropsWithLayout<InitialState>) => {
  const Layout = Component.Layout ?? ((page) => page)

  return (
    <ErrorBoundary>
      <StoreProvider {...(initialState ?? getInitialState())}>
        <ReactQueryProvider>
          <MuiThemeProvider serverEmotionCache={serverEmotionCache}>
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

export default trpc.withTRPC(
  appWithTranslation<AppPropsWithLayout<InitialState & SSRConfig>>(App, nextI18NextConfig)
)
