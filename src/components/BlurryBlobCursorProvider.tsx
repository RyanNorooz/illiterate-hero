import useIdleDetector from '@/lib/hooks/useIdleDetector'
import { Box } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { useCallback, useEffect, useRef } from 'react'

const wander1 = keyframes`
0% { transform: translate(-50%,-50%) rotate(-20deg) translateX(20%) }
25% { transform: translate(-50%,-50%) skew(-15deg,-15deg) rotate(80deg) translateX(30%) }
50% { transform: translate(-50%,-50%) rotate(180deg) translateX(25%) }
75% { transform: translate(-50%,-50%) skew(15deg,15deg) rotate(240deg) translateX(15%) }
100% { transform: translate(-50%,-50%) rotate(340deg) translateX(20%) } 
`
const wander2 = keyframes`
0% { transform: translate(-50%,-50%) rotate(40deg) translateX(-20%) }
25% { transform: translate(-50%,-50%) skew(15deg,15deg) rotate(110deg) translateX(-5%) }
50% { transform: translate(-50%,-50%) rotate(210deg) translateX(-35%) }
75% { transform: translate(-50%,-50%) skew(-15deg,-15deg) rotate(300deg) translateX(-10%) }
100% { transform: translate(-50%,-50%) rotate(400deg) translateX(-20%) }
`
const wander3 = keyframes`
0% { transform: translate(-50%,-50%) translateX(-15%) translateY(10%) }
20% { transform: translate(-50%,-50%) translateX(20%) translateY(-30%) }
40% { transform: translate(-50%,-50%) translateX(-25%) translateY(-15%) }
60% { transform: translate(-50%,-50%) translateX(30%) translateY(20%) }
80% { transform: translate(-50%,-50%) translateX(5%) translateY(35%) }
100% { transform: translate(-50%,-50%) translateX(-15%) translateY(10%) }
`

interface BlurryBlobCursorProviderProps {
  children: React.ReactNode
}

export default function BlurryBlobCursorProvider(props: BlurryBlobCursorProviderProps) {
  const blurryBlobRef = useRef<HTMLDivElement>(null)
  const { isIdle } = useIdleDetector(5)

  useEffect(() => {
    if (isIdle)
      blurryBlobRef.current?.animate(
        { left: '50%', top: '50%' },
        { duration: 2000, fill: 'forwards' }
      )
  }, [isIdle])

  const pointerMoveHandler = useCallback((e: PointerEvent) => {
    blurryBlobRef.current?.animate(
      { left: `${e.x}px`, top: `${e.y}px` },
      { duration: 6000, easing: 'ease-in-out', fill: 'forwards' }
    )
  }, [])

  useEffect(() => {
    window.addEventListener('pointermove', pointerMoveHandler)
    return () => window.removeEventListener('pointermove', pointerMoveHandler)
  }, [pointerMoveHandler])

  return (
    <>
      <Box
        ref={blurryBlobRef}
        sx={{
          position: 'fixed',
          zIndex: -10,
          top: '50%',
          left: '50%',
          filter: 'blur(100px)',
          '> div': {
            position: 'absolute',
            aspectRatio: 1,
            borderRadius: '100%',
            animationDuration: '20s',
            animationTimingFunction: 'cubic-bezier(.2,0,.8,1)',
            animationIterationCount: 'infinite',
          },
        }}
      >
        <Box
          sx={{
            zIndex: -2,
            width: [350, 438, 700, undefined, undefined, 875],
            bgcolor: '#7928ca',
            opacity: (t) => (t.palette.mode === 'dark' ? 0.4 : 0.1),
            mixBlendMode: 'lighten',
            animationName: `${wander1}`,
          }}
        />
        <Box
          sx={{
            zIndex: -1,
            width: [300, 375, 600, undefined, undefined, 750],
            bgcolor: '#ff0080',
            opacity: (t) => (t.palette.mode === 'dark' ? 0.4 : 0.3),
            mixBlendMode: 'screen',
            animationDirection: 'reverse',
            animationName: `${wander2}`,
          }}
        />
        <Box
          sx={{
            zIndex: -3,
            width: [250, 313, 500, undefined, undefined, 625],
            bgcolor: '#0070f3',
            opacity: (t) => (t.palette.mode === 'dark' ? 0.4 : 0.2),
            mixBlendMode: 'screen',
            animationName: `${wander3}`,
          }}
        />
      </Box>
      {props.children}
    </>
  )
}
