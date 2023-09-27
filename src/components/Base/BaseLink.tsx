import type { LinkProps as MuiLinkProps } from '@mui/material'
import { Link as MuiLink } from '@mui/material'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
// import { textGradientPrimary } from 'theme/palette/common'

interface BaseLinkProps extends MuiLinkProps {
  /** open in a new tab */
  newtab?: boolean
}

function BaseLink({ newtab, ...props }: BaseLinkProps, ref: ForwardedRef<HTMLAnchorElement>) {
  return (
    <MuiLink
      ref={ref}
      underline="hover"
      variant="body1"
      {...(newtab && { target: '_blank', rel: 'noreferrer noopener' })}
      {...props}
      sx={{
        cursor: 'pointer',
        textUnderlinePosition: 'under',
        color: 'inherit',

        '&:hover': {
          color: 'primary.main',
          textDecorationColor: (t) => t.palette.primary.main,
          textDecorationThickness: '.05em',
          // ...textGradientPrimary,
        },
        ...props.sx,
      }}
    />
  )
}

export default forwardRef(BaseLink)
