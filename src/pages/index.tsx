import CustomHead from '@/components/Utils/CustomHead'
import { DEFAULT_LOCALE } from '@/configs'
import getInitialState from '@/store/getInitialState'
import { useStore } from '@/store/store'
import { Box, Stack } from '@mui/material'
import gsap from 'gsap'
import { SlowMo } from 'gsap/EasePack'
import { TextPlugin } from 'gsap/TextPlugin'
import type { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import logoImgDark from '/public/images/logo-dark.png'
import logoImg from '/public/images/logo.png'
import { useCallback, useEffect, useRef, useState } from 'react'

gsap.registerPlugin(TextPlugin)

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const randomChar = () => chars[Math.floor(Math.random() * (chars.length - 1))]
const randomString = (length: number) => [...Array(length)].map(randomChar).join('')

export default function LandingPage() {
  const theme = useStore((state) => state.theme)

  const sectionRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

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

  useEffect(() => {
    setCharsNeeded(calcCharsNeeded())
    window.onresize = () => setCharsNeeded(calcCharsNeeded())
    return () => {
      window.onresize = null
    }
  }, [calcCharsNeeded])

  useEffect(() => {
    tl.current = gsap.timeline()

    let recursionFlag = true
    const randomRefresh = (): Promise<void> =>
      new Promise<void>((r) => {
        const duration = Math.random() * 0.5
        setTimeout(() => {
          tl.current?.to(lettersRef.current, {
            duration,
            ease: SlowMo.ease.config(0, 0.5),
            text: randomString(charsNeeded),
          })
          gsap.to(gradientRef.current, { '--hue-offset': '+=2' })
          r()
        }, duration * 1000)
      }).then(() => void (recursionFlag && randomRefresh()))
    randomRefresh()

    return () => {
      recursionFlag = false
    }
  }, [charsNeeded])

  const onMouseMoveHandler: React.MouseEventHandler = useCallback(
    (e) => {
      const rect = sectionRef.current?.getBoundingClientRect(),
        x = e.clientX - (rect?.left ?? 0),
        y = e.clientY - (rect?.top ?? 0)

      lettersRef.current?.style.setProperty('--x', `${x}px`)
      lettersRef.current?.style.setProperty('--y', `${y}px`)

      tl.current?.to(lettersRef.current, {
        text: randomString(charsNeeded),
        duration: 0,
        ease: 'none',
        overwrite: true,
      })
      gsap.to(gradientRef.current, { '--hue-offset': '+=2' })
    },
    [charsNeeded]
  )

  return (
    <Stack>
      <Stack
        ref={sectionRef}
        onMouseMove={onMouseMoveHandler}
        sx={{ position: 'relative', height: '100dvh', width: '100dvw' }}
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
            WebkitMaskImage:
              'radial-gradient(75vmin circle at var(--x) var(--y), #fff 25%, #fff5, transparent)',
            transition: 'opacity 400ms, filter 0s 400ms',
            opacity: 0,
            filter: 'blur(10px)',
            ':hover': {
              transition: 'opacity 400ms, filter 1000ms ease',
              opacity: 1,
              filter: 'blur(0px)',
            },
          }}
        />
        <Box
          ref={gradientRef}
          sx={{
            '--hue-offset': 0,
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(
              75vmin circle at center,
              rgb( 30 41 59)  40%,
              hsl(calc(218 + var(--hue-offset)), 100%, 58%) 50%,
              hsl(calc(202 + var(--hue-offset)), 100%, 61%),
              hsl(calc(151 + var(--hue-offset)), 97%, 58%)
            )`,
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
            src={theme === 'dark' ? logoImg : logoImgDark}
            alt="im batman"
            style={{ objectFit: 'contain', height: '50vmin', width: '50vmin' }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}

LandingPage.Layout = function Layout(page: React.ReactElement) {
  return (
    <>
      <CustomHead />
      {page}
    </>
  )
}

export const getServerSideProps = (async ({ locale, req }) => ({
  props: {
    locale,
    initialState: getInitialState(req.headers),
    ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
  },
})) satisfies GetServerSideProps
