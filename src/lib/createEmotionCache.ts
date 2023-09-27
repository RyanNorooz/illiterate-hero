import { DEFAULT_DIRECTION } from '@/configs'
import type { Direction, ThemeMode } from '@/theme/type'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'

export default function createEmotionCache(
  direction: Direction = DEFAULT_DIRECTION,
  theme: ThemeMode
) {
  return createCache({
    key: `css-${direction}-${theme}`,
    prepend: true,
    stylisPlugins: [prefixer, ...(direction === 'rtl' ? [rtlPlugin] : [])],
  })
}
