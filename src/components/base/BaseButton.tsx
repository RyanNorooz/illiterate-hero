import type { LoadingButtonProps } from '@mui/lab'
import { LoadingButton } from '@mui/lab'
import { lighten } from '@mui/material/styles'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'

function BaseButton(props: LoadingButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  return (
    <LoadingButton
      variant="contained"
      disableElevation
      {...props}
      ref={ref}
      sx={{
        typography: 'body1',
        fontSize: '1rem !important',
        fontWeight: '700 !important',
        textTransform: 'none',
        px: '1.6em',
        py: '.5em',
        backdropFilter: 'blur(4px)',

        ...(props.variant === 'outlined'
          ? {
              color: 'text.primary',
              borderColor: 'text.primary',
              '&:hover': { borderColor: '#fff', bgcolor: '#fff1' },
            }
          : props.variant === 'contained'
          ? {
              color: 'background.default',
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: (t) => lighten(t.palette.primary.main, 0.2) },
            }
          : {}),
        ...props.sx,
      }}
    >
      {props.children}
    </LoadingButton>
  )
}

export default forwardRef(BaseButton)
