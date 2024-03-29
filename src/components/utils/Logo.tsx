import { projectInfo } from '@/configs'
import { useTheme } from '@mui/material/styles'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import logoImgDark from 'public/images/logo-dark.png'
import logoImg from 'public/images/logo.png'
import type { UrlObject } from 'url'

interface LogoProps {
  slotProps?: {
    link?: Omit<Parameters<typeof Link>[0], 'href'> & { href?: string | UrlObject }
    image?: Omit<ImageProps, 'src' | 'alt'>
  }
}

export default function Logo(props: LogoProps) {
  const theme = useTheme()

  return (
    <Link
      href="/"
      {...props.slotProps?.link}
      style={{ lineHeight: 0, ...props.slotProps?.link?.style }}
    >
      <Image
        src={theme.palette.mode === 'dark' ? logoImg : logoImgDark}
        alt={projectInfo.name}
        width={75}
        height={75}
        {...props.slotProps?.image}
        style={{ objectFit: 'contain', ...props.slotProps?.image?.style }}
      />
    </Link>
  )
}
