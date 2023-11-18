import { IconButton, Stack, SvgIcon, Typography } from '@mui/material'
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Telegram as TelegramIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material'
import { projectInfo } from '@/configs'
import BaseLink from './base/BaseLink'

const linkIcons = {
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  telegram: <TelegramIcon />,
  instagram: <InstagramIcon />,
  x: <TwitterIcon />,
} as const

export default function FloatingFooter() {
  return (
    <Stack
      direction="row"
      sx={{
        px: 4,
        pb: 3,
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      {projectInfo.links.map((link) => (
        <BaseLink
          newtab
          key={link.key}
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: ['column', null, 'row'],
          }}
        >
          <SvgIcon sx={{ fontSize: [36, 42, null, 46] }}>{linkIcons[link.key]}</SvgIcon>
          <Typography
            variant="link"
            textAlign="center"
            display={['none', 'inline']}
            sx={{ zIndex: 1 }}
            textTransform="uppercase"
          >
            {link.label}
          </Typography>
        </BaseLink>
      ))}
    </Stack>
  )
}
