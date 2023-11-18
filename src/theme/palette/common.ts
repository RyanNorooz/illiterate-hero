import type { PaletteOptions } from '@mui/material'
import { red, yellow, green } from '@mui/material/colors'

const common: PaletteOptions = {
  primary: {
    main: '#c88d2d',
    contrastText: '#260a06',
  },
  secondary: {
    main: '#0070F3',
    contrastText: '#fff',
  },
  error: {
    main: '#f46a6a',
    contrastText: '#fff',
    dark: red[900],
    light: red[400],
  },
  warning: {
    main: '#f1b44c',
    contrastText: '#fff',
    dark: yellow[900],
    light: yellow[400],
  },
  success: {
    main: '#34c38f',
    contrastText: '#fff',
    dark: green[900],
    light: green[400],
  },
  info: {
    main: '#0070F3',
    contrastText: '#fff',
    dark: green[900],
    light: green[400],
  },
}

export default common
