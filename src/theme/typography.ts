import type { TypographyOptions } from '@mui/material/styles/createTypography'

export const fallbackFonts =
  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif' as const
export const VazirmatnFont = `Vazirmatn UI FD, ${fallbackFonts}` as const
export const InterFont = `Inter, ${fallbackFonts}` as const

const typography: TypographyOptions = {
  h1: {
    fontSize: '3rem',
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: '-.06ch',
    textRendering: 'optimizeLegibility',
    '@media (min-width: 900px)': { fontSize: '6rem' },
  },
  subtitle1: {
    fontSize: '1.5rem',
    lineHeight: 1.2,
    '@media (min-width: 900px)': { fontSize: '2rem' },
  },
}

export default typography
