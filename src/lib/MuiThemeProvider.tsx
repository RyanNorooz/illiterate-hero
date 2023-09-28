import createEmotionCache from '@/lib/createEmotionCache'
import type { EmotionCache } from '@emotion/react'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import configTheme from '../theme/configure'
import type { AvailableLocale } from '../configs'
import { availableLocales, DEFAULT_LOCALE } from '../configs'
import useThemeDetector from './hooks/useThemeDetector'

interface MuiThemeProviderProps {
  children: ReactNode
  emotionCache: EmotionCache
}

export default function MuiThemeProvider({ children, emotionCache }: MuiThemeProviderProps) {
  const { locale } = useRouter()
  const theme = useThemeDetector()

  const themeObject = useMemo(() => {
    const { direction, fontFamily } =
      availableLocales[(locale ?? DEFAULT_LOCALE) as AvailableLocale]
    return configTheme({ direction, mode: theme, fontFamily })
  }, [locale, theme])

  useEffect(() => {
    document.documentElement.setAttribute('dir', themeObject.direction)
  }, [themeObject.direction])

  const ClientSideemotionCache = useMemo(
    () => emotionCache || createEmotionCache(themeObject.direction, themeObject.palette.mode),
    [emotionCache, themeObject.direction, themeObject.palette.mode]
  )

  return (
    <CacheProvider value={ClientSideemotionCache}>
      <ThemeProvider theme={themeObject}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
