import { DEFAULT_LOCALE, LOCALES, type AvailableLocale } from '@/configs'

/**
 * extract sub-path style locale from the given url
 */
export function getLocaleFromURL(url?: string) {
  if (!url) return DEFAULT_LOCALE

  const subPathLocale = url.split('/')[3] //* 'https://www.x.com/fa/foo' => ['https:', '', 'www.x.com', 'fa', 'foo'] => 'fa'
  const usingSlugLocale = LOCALES.includes((subPathLocale || '') as string & AvailableLocale)
  if (subPathLocale && usingSlugLocale) return subPathLocale

  return DEFAULT_LOCALE
}
