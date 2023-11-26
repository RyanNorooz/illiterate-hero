import { Box, Container, Stack, Typography, useMediaQuery } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { gsap } from 'gsap'
import { SlowMo } from 'gsap/dist/EasePack'
import { TextPlugin } from 'gsap/dist/TextPlugin'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import logoImgDark from '/public/images/logo-dark.png'
import logoImg from '/public/images/logo.png'
import { useTranslation } from 'next-i18next'

gsap.registerPlugin(TextPlugin)

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const randomChar = () => chars[(Math.random() * chars.length) | 0]
const randomString = (length: number) => {
  let str = ''
  for (let i = 0; i < length; i++) str += randomChar()
  return str
}

export default function CharacterBlastSection() {
  const { t } = useTranslation(['common', 'home'])
  const theme = useTheme()
  const isTouch = useMediaQuery('(hover: none)')

  const lettersRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const acl = useRef<Accelerometer | null>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)
  const intersectionObserver = useRef<IntersectionObserver | null>(null)
  const sectionIsVisible = useRef(false)

  const [charsNeeded, setCharsNeeded] = useState(0)
  const calcCharsNeeded = useCallback(() => {
    if (typeof window === 'undefined' || !lettersRef.current) return 0

    function getTextWidth(text: string, font: string) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      context.font = font
      const metrics = context.measureText(text)
      return metrics.width
    }
    function getCssStyle(element: Element, prop: string) {
      return window.getComputedStyle(element).getPropertyValue(prop)
    }
    function getCanvasFont(el = document.body) {
      const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
      const fontSize = getCssStyle(el, 'font-size') || '16px'
      const fontFamily = getCssStyle(el, 'font-family') || 'mono-space'
      return `${fontWeight} ${fontSize} ${fontFamily}`
    }

    const letterSpacing = parseFloat(getCssStyle(lettersRef.current, 'letter-spacing'))
    const charHeight = parseFloat(getCssStyle(lettersRef.current, 'line-height'))
    const charWidth = getTextWidth('0', getCanvasFont(lettersRef.current)) + letterSpacing
    const rect = lettersRef.current.getBoundingClientRect()
    const lines = rect.height / charHeight + 1
    const charsPerLine = rect.width / charWidth
    const charsNeeded = Math.round(lines * charsPerLine)

    setCharsNeeded(charsNeeded)
    return charsNeeded
  }, [])

  // calculate number of characters needed and recalculate on resize
  useEffect(() => {
    calcCharsNeeded()

    if (!resizeObserver.current)
      resizeObserver.current = new ResizeObserver(
        () => sectionIsVisible.current && calcCharsNeeded()
      )
    if (lettersRef.current) resizeObserver.current.observe(lettersRef.current)

    return () => {
      resizeObserver.current?.disconnect()
      resizeObserver.current = null
    }
  }, [calcCharsNeeded, theme.palette.mode])

  const refreshLetters = useCallback(
    (duration = 0, ease: string | gsap.EaseFunction = 'none') => {
      tl.current?.to(lettersRef.current, {
        duration,
        ease,
        text: randomString(charsNeeded),
        overwrite: true,
      })
      gsap.to(gradientRef.current, { '--hue-offset': '+=5' })
    },
    [charsNeeded]
  )

  const aclOnReadingHandler = useCallback(() => {
    if (!sectionIsVisible.current) return

    const rect = lettersRef.current?.getBoundingClientRect()
    const w = rect?.width ?? 0
    const h = rect?.height ?? 0
    const aclX = acl.current?.x ?? 0
    const aclY = acl.current?.y ?? 0
    const m = 0.75 //length multiplier
    const x = Math.min(Math.max(((aclX * w) / 9.81) * m + w / 2, 0), w)
    const y = Math.min(Math.max(((aclY * -1 * h) / 9.81) * m + h, 0), h)
    lettersRef.current?.style.setProperty('--x', `${x}px`)
    lettersRef.current?.style.setProperty('--y', `${y}px`)
    // console.log('w, h, x, y, aclX, aclY', [w, h, x, y, aclX, aclY].map((x) => x | 0))

    refreshLetters()
  }, [refreshLetters])

  useEffect(() => {
    tl.current = gsap.timeline()

    if (!intersectionObserver.current)
      intersectionObserver.current = new IntersectionObserver((entries) => {
        if (entries[0]) sectionIsVisible.current = entries[0].intersectionRatio > 0
      })
    if (lettersRef.current) intersectionObserver.current.observe(lettersRef.current)

    let recursionFlag = true
    const randomRefresh = (): Promise<void> =>
      new Promise<void>((r) => {
        const duration = Math.random() * 0.8
        setTimeout(() => {
          if (!recursionFlag) return
          if (sectionIsVisible.current) refreshLetters(duration, SlowMo.ease.config(0, 0.5))
          r()
        }, duration * 1000)
      }).then(() => randomRefresh())
    randomRefresh()

    if (isTouch && 'Accelerometer' in window) {
      if (!acl.current) acl.current = new Accelerometer({ frequency: 60 })
      acl.current.addEventListener('reading', aclOnReadingHandler)
      acl.current.start()
    }

    return () => {
      recursionFlag = false
      sectionIsVisible.current = false
      intersectionObserver.current?.disconnect()
      intersectionObserver.current = null
      tl.current?.revert()
      tl.current?.kill()
      tl.current = null
      acl.current?.removeEventListener('reading', aclOnReadingHandler)
      acl.current?.stop()
      acl.current = null
    }
  }, [aclOnReadingHandler, calcCharsNeeded, charsNeeded, isTouch, refreshLetters])

  const onPointerMoveHandler: React.MouseEventHandler = useCallback(
    (e) => {
      if (!sectionIsVisible.current) return

      e.stopPropagation()
      const rect = lettersRef.current?.getBoundingClientRect()
      const x = (e.clientX - (rect?.left ?? 0)) | 0
      const y = (e.clientY - (rect?.top ?? 0)) | 0
      lettersRef.current?.style.setProperty('--x', `${x}px`)
      lettersRef.current?.style.setProperty('--y', `${y}px`)
      // gsap.to(lettersRef.current, { '--x': `${x}px`, '--y': `${y}px` })

      refreshLetters()
    },
    [refreshLetters]
  )

  return (
    <Box
      onPointerMove={isTouch ? undefined : onPointerMoveHandler}
      sx={{
        position: 'relative',
        height: '100dvh',
        width: '100%',
        overflow: 'hidden',

        // bgcolor: 'background.default',
        // maskImage: 'linear-gradient(#000 80%, #0003 95%, transparent)',

        // ...(isTouch
        //   ? {}
        //   : {
        //       '#letters': {
        //         transition: 'opacity 400ms, filter 0s 400ms',
        //         opacity: 0,
        //         filter: 'blur(10px)',
        //       },
        //       ':hover #letters': {
        //         transition: 'opacity 400ms, filter 1000ms ease',
        //         opacity: 1,
        //         filter: 'blur(0px)',
        //       },
        //     }),
      }}
    >
      <Stack
        component={(p) => <Container {...p} maxWidth="xl" />}
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: [null, null, '50% 50%'],
          gridTemplateRows: ['50% 15%', '50% 30%', 'none'],
        }}
      >
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'start' },
            gap: 2,
            whiteSpace: 'pre-line',
            zIndex: 1,
          }}
        >
          <Typography variant="h1" textAlign={{ xs: 'center', md: 'start' }}>
            {t('hero.title', { ns: 'home' })}
          </Typography>
          <Typography variant="h2" textAlign={{ xs: 'center', md: 'start' }}>
            {t('hero.subtitle', { ns: 'home' })}
          </Typography>
        </Stack>
        <Stack alignItems="center" justifyContent="center">
          <Box
            ref={gradientRef}
            sx={{
              '--hue-offset': 0,
              position: 'absolute',
              height: '150dvh',
              width: '150svw',
              background:
                theme.palette.mode === 'dark'
                  ? `radial-gradient(75vmin circle at center, ${
                      theme.palette.background.default
                    } 30%, hsl(calc(218 + var(--hue-offset)) 100% 60%) 50%, hsl(calc(202 + var(--hue-offset)) 100% 60%), hsl(calc(151 + var(--hue-offset)) 100% 60%), ${alpha(
                      theme.palette.background.default,
                      0.8
                    )})`
                  : `radial-gradient(75vmin circle at center, ${
                      theme.palette.background.default
                    } 30%, hsl(calc(218 + var(--hue-offset)) 100% 40%) 50%, hsl(calc(202 + var(--hue-offset)) 100% 40%), hsl(calc(151 + var(--hue-offset)) 100% 40%), ${alpha(
                      theme.palette.background.default,
                      0.8
                    )})`,
              mixBlendMode: theme.palette.mode === 'dark' ? 'darken' : 'lighten',
              zIndex: 0,
            }}
          />
          <Image
            src={theme.palette.mode === 'dark' ? logoImg : logoImgDark}
            alt="im batman"
            style={{ objectFit: 'contain', height: '50vmin', width: '50vmin', zIndex: 1 }}
          />
        </Stack>
      </Stack>
      <Box
        ref={lettersRef}
        id="letters"
        sx={{
          position: 'absolute',
          inset: 0,
          '--x': '20vw',
          '--y': '20vh',
          fontFamily: 'monospace',
          ...(theme.palette.mode === 'dark'
            ? { fontWeight: 400, lineHeight: 1.25, letterSpacing: 2.5 }
            : { fontWeight: 900, lineHeight: 1, letterSpacing: 2 }),
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          wordWrap: 'break-word',
          userSelect: 'none',
          maskImage: `radial-gradient(${
            isTouch ? '90vmin' : '75vmin'
          } circle at var(--x) var(--y), #000 25%, #0005, transparent)`,
          scale: '1.02',
          zIndex: -1,
        }}
      />
    </Box>
  )
}
