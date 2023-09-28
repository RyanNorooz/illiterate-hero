import { DEFAULT_DIRECTION } from '@/configs'
import type { Direction, ThemeMode } from '@/theme/type'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

export default function createEmotionCache(
  direction: Direction = DEFAULT_DIRECTION,
  theme: ThemeMode
) {
  let insertionPoint: HTMLElement | undefined

  if (typeof window !== 'undefined')
    insertionPoint =
      document.querySelector<HTMLMetaElement>('meta[name="emotion-insertion-point"]') ?? undefined

  return createCache({
    key: `css-${direction}-${theme}`,
    insertionPoint,
    stylisPlugins: [prefixer, ...(direction === 'rtl' ? [rtlPlugin] : [])],
  })
}
