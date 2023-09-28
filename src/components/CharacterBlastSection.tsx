import { Box, Stack, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import gsap from 'gsap'
import { SlowMo } from 'gsap/EasePack'
import { TextPlugin } from 'gsap/TextPlugin'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import logoImgDark from '/public/images/logo-dark.png'
import logoImg from '/public/images/logo.png'

gsap.registerPlugin(TextPlugin)

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const randomChar = () => chars[Math.floor(Math.random() * (chars.length - 1))]
const randomString = (length: number) => [...Array(length)].map(randomChar).join('')

export default function CharacterBlastSection() {
  const theme = useTheme()
  const isTouch = useMediaQuery('(hover: none)')

  const sectionRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const acl = useRef<Accelerometer | null>(null)

  const [charsNeeded, setCharsNeeded] = useState(0)

  const calcCharsNeeded = useCallback(() => {
    if (typeof window === 'undefined' || !lettersRef.current || !sectionRef.current) return 0

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

    // 11.3 x 20
    const charWidth = getTextWidth('0', getCanvasFont(lettersRef.current)) * 1.3 //accounting for letter-spacing
    const charHeight = parseInt(getCssStyle(lettersRef.current, 'font-size')) + 2.5 //accounting for line-height
    const rect = sectionRef.current.getBoundingClientRect()
    const lines = rect.height / charHeight
    const charsPerLine = rect.width / charWidth
    const charsNeeded = Math.round(lines * charsPerLine)

    return charsNeeded
  }, [])

  const refreshLetters = useCallback(
    (duration = 0, ease: string | gsap.EaseFunction = 'none') => {
      tl.current?.to(lettersRef.current, {
        duration,
        ease,
        text: randomString(charsNeeded),
        overwrite: true,
      })
      gsap.to(gradientRef.current, { '--hue-offset': '+=2' })
    },
    [charsNeeded]
  )

  const aclOnReadingHandler = useCallback(() => {
    const rect = sectionRef.current?.getBoundingClientRect()
    const w = rect?.width ?? 0
    const h = rect?.height ?? 0
    const aclX = acl.current?.x ?? 0
    const aclY = acl.current?.y ?? 0
    const m = 0.75 //length multiplier
    const x = Math.min(Math.max(((aclX * w) / 9.81) * m + w / 2, 0), w)
    const y = Math.min(Math.max(((aclY * -1 * h) / 9.81) * m + h, 0), h)
    lettersRef.current?.style.setProperty('--x', `${x}px`)
    lettersRef.current?.style.setProperty('--y', `${y}px`)
    // console.log('w, h, x, y, aclX, aclY', [w, h, x, y, aclX, aclY].map(Math.round))

    refreshLetters()
  }, [refreshLetters])

  useEffect(() => {
    setCharsNeeded(calcCharsNeeded())
    window.onresize = () => setCharsNeeded(calcCharsNeeded())

    tl.current = gsap.timeline()

    let recursionFlag = true
    const randomRefresh = (): Promise<void> =>
      new Promise<void>((r) => {
        const duration = Math.random() * 0.5
        setTimeout(
          () => r(void refreshLetters(duration, SlowMo.ease.config(0, 0.5))),
          duration * 1000
        )
      }).then(() => void (recursionFlag && randomRefresh()))
    randomRefresh()

    if (isTouch && 'Accelerometer' in window) {
      if (!acl.current) acl.current = new Accelerometer({ frequency: 60 })
      acl.current.addEventListener('reading', aclOnReadingHandler)
      acl.current.start()
    }

    return () => {
      window.onresize = null
      recursionFlag = false
      tl.current?.revert()
      tl.current?.kill()
      acl.current?.removeEventListener('reading', aclOnReadingHandler)
      acl.current?.stop()
    }
  }, [aclOnReadingHandler, calcCharsNeeded, charsNeeded, isTouch, refreshLetters])

  const onMouseMoveHandler: React.MouseEventHandler = useCallback(
    (e) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      const x = e.clientX - (rect?.left ?? 0)
      const y = e.clientY - (rect?.top ?? 0)
      lettersRef.current?.style.setProperty('--x', `${x}px`)
      lettersRef.current?.style.setProperty('--y', `${y}px`)

      refreshLetters()
    },
    [charsNeeded]
  )

  return (
    <Stack
      ref={sectionRef}
      onMouseMove={isTouch ? undefined : onMouseMoveHandler}
      sx={{
        position: 'relative',
        height: '100dvh',
        width: '100dvw',
        cursor: 'url("/images/cursor.svg") 12.5 12.5, auto',
      }}
    >
      <Box
        ref={lettersRef}
        sx={{
          '--x': '-1000vw',
          '--y': '-1000vh',
          fontFamily: 'monospace',
          lineHeight: 1.25,
          letterSpacing: 2.5,
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          wordWrap: 'break-word',
          userSelect: 'none',
          WebkitMaskImage:
            'radial-gradient(75vmin circle at var(--x) var(--y), #fff 25%, #fff5, transparent)',
          transition: 'opacity 400ms, filter 0s 400ms',
          ...(isTouch
            ? {}
            : {
                opacity: 0,
                filter: 'blur(10px)',
                ':hover': {
                  transition: 'opacity 400ms, filter 1000ms ease',
                  opacity: 1,
                  filter: 'blur(0px)',
                },
              }),
        }}
      />
      <Box
        ref={gradientRef}
        sx={{
          '--hue-offset': 0,
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(75vmin circle at center, rgb( 30 41 59) 40%, hsl(calc(218 + var(--hue-offset)), 100%, 58%) 50%, hsl(calc(202 + var(--hue-offset)), 100%, 61%), hsl(calc(151 + var(--hue-offset)), 97%, 58%))`,
          mixBlendMode: 'darken',
          zIndex: 10,
        }}
      />
      <Stack
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <Image
          src={theme.palette.mode === 'dark' ? logoImg : logoImgDark}
          alt="im batman"
          style={{ objectFit: 'contain', height: '50vmin', width: '50vmin' }}
        />
      </Stack>
    </Stack>
  )
}
