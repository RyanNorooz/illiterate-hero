import { useStore } from '@/store/store'
import { useMediaQuery } from '@mui/material'
import { useEffect } from 'react'

export default function useThemeDetector() {
  const [theme, setTheme] = useStore((state) => [state.theme, state.setTheme])
  const preferredTheme = useMediaQuery('(prefers-color-scheme: dark)', { defaultMatches: true })
    ? 'dark'
    : 'light'

  useEffect(() => {
    if (!theme) setTheme(preferredTheme)
  }, [preferredTheme, setTheme, theme])

  return theme === 'system' ? preferredTheme : theme
}
