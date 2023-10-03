const path = require('path')

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    /** @type {import('@/configs/availableLocales').AvailableLocale} */
    defaultLocale: 'en',
    /** @type {import('@/configs/availableLocales').AvailableLocale[]} */
    locales: ['en', 'fa'],
  },
  localePath: path.resolve('public/locales'),
  localeExtension: 'yaml',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
