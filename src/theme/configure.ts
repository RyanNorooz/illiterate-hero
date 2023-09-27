import { createTheme } from '@mui/material/styles'
import common from './palette/common'
import dark from './palette/dark'
import light from './palette/light'
import type { Direction, ThemeMode } from './type'
import typography from './typography'

interface ConfigThemeProps {
  direction: Direction
  mode: ThemeMode
  fontFamily: string
}

export default function configTheme({ direction, mode, fontFamily }: ConfigThemeProps) {
  return createTheme({
    direction,
    palette: {
      ...common,
      ...(mode === 'light' ? light : dark),
      mode,
    },
    typography: {
      ...typography,
      fontFamily: fontFamily,
    },
  })
}
