import Lenis from '@studio-freight/lenis'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface LenisContext {
  lenis: Lenis | null
}

const LenisContext = createContext<LenisContext>({ lenis: null })

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider(props: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis()
    setLenis(lenis)

    return () => {
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    let animationFrameHandle = 0

    const render: FrameRequestCallback = (time) => {
      lenis?.raf(time)
      animationFrameHandle = requestAnimationFrame(render)
    }
    animationFrameHandle = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameHandle)
    }
  }, [lenis])

  const memoedValue = useMemo(() => ({ lenis: lenis }), [lenis])

  return <LenisContext.Provider value={memoedValue}>{props.children}</LenisContext.Provider>
}

export function useLenis() {
  return useContext(LenisContext)
}
