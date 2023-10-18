import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { Inter, Vazirmatn } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const vazirmatn = Vazirmatn({ subsets: ['arabic'] })

export const fallbackFonts =
  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
export const VazirmatnFont = `${vazirmatn.style.fontFamily}, ${fallbackFonts}`
export const InterFont = `${inter.style.fontFamily}, ${fallbackFonts}`

const typography: TypographyOptions = {
  h1: {
    fontSize: '3rem',
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: '-.06ch',
    textRendering: 'optimizeLegibility',
    '@media (min-width: 900px)': { fontSize: '6rem' },
  },
  h2: {
    fontSize: '1.5rem',
    lineHeight: 1.2,
    '@media (min-width: 900px)': { fontSize: '2rem' },
  },
}

export default typography
