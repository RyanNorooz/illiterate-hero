import { VazirmatnFont } from '@/theme/typography'
import { i18n } from 'next-i18next.config.js'

export const availableLocales = {
  en: {
    key: 'en',
    label: 'English',
    direction: 'ltr',
    fontFamily: VazirmatnFont,
  },
  fa: {
    key: 'fa',
    label: 'Farsi',
    direction: 'rtl',
    fontFamily: VazirmatnFont,
  },
} as const

export type AvailableLocale = keyof typeof availableLocales
export const LOCALES = i18n.locales as AvailableLocale[]
export const DEFAULT_LOCALE = i18n.defaultLocale as AvailableLocale
export const DEFAULT_DIRECTION = availableLocales[DEFAULT_LOCALE].direction
