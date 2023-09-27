import type { TypographyOptions } from '@mui/material/styles/createTypography'

export const fallbackFonts =
  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif' as const
export const VazirmatnFont = `Vazirmatn UI FD, ${fallbackFonts}` as const

const typography: TypographyOptions = {
  h1: {
    fontSize: '1.6rem',
    fontWeight: 900,
  },
  h2: {
    fontSize: '1.8rem',
    fontWeight: 700,
  },
  h3: {
    fontSize: '1.125rem',
    fontWeight: 700,
  },
  h4: {
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  subtitle1: {
    fontSize: '1.25rem',
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: '.875rem',
    fontWeight: 400,
  },
}

export default typography
