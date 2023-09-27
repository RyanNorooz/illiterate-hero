import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import type { TextFieldProps, Theme } from '@mui/material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ForwardedRef } from 'react'
import { forwardRef, useState } from 'react'

function BaseInput(props: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) {
  const [inputType, setInputType] = useState<React.HTMLInputTypeAttribute>(props.type ?? 'text')

  return (
    <TextField
      ref={ref}
      variant="standard"
      margin="normal"
      {...props}
      type={inputType}
      InputLabelProps={{
        shrink: true,
        ...props.InputLabelProps,
        sx: {
          fontSize: '1.125rem',
          fontWeight: 700,
          transform: 'translateY(-0.5em) scale(.75)',
          ...props.InputLabelProps?.sx,
        },
      }}
      InputProps={{
        disableUnderline: true,
        endAdornment: props.type === 'password' && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              edge="end"
              onClick={() => setInputType((prev) => (prev === 'text' ? 'password' : 'text'))}
            >
              {inputType === 'text' ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
        ...props.InputProps,
        sx: {
          bgcolor: (t) => alpha(t.palette.background.default, 0.5),
          padding: '.5em .8em',
          borderRadius: 2,
          transition: 'backdrop-filter 200ms ease-out',
          backdropFilter: 'blur(16px)',
          '&.Mui-focused': {
            backdropFilter: 'blur(64px)',
            outline: '1px solid',
            outlineColor: (t: Theme) => t.palette.grey[800], // duped to avoid color flash
          },
          ...props.InputProps?.sx,
        },
      }}
    />
  )
}

export default forwardRef(BaseInput)
