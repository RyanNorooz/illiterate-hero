import { useCallback, useEffect, useRef } from 'react'

export type InitCanvas = (context: CanvasRenderingContext2D) => { draw: Draw }
export type Draw = (context: CanvasRenderingContext2D, time: number, frameCount: number) => void

interface BaseCanvasProps {
  initCanvas: InitCanvas
  canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>
  /** @default false */
  clearCanvasOnRender?: boolean
}

export default function BaseCanvas(props: BaseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)

  const preDraw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (props.clearCanvasOnRender) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    },
    [props.clearCanvasOnRender]
  )

  // const postDraw = useCallback((ctx: CanvasRenderingContext2D) => {
  // }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) throw Error(`expected CanvasRenderingContext2D. got ${ctx}`)

    if (!resizeObserver.current)
      resizeObserver.current = new ResizeObserver((entries) => {
        for (const entry of entries)
          if (entry.borderBoxSize.length) {
            const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0]!
            const ratio = window.devicePixelRatio ?? 1
            ctx.canvas.width = width * ratio
            ctx.canvas.height = height * ratio
            ctx.scale(ratio, ratio)
          }
      })
    resizeObserver.current.observe(ctx.canvas)

    preDraw(ctx)
    const { draw } = props.initCanvas(ctx)

    let animationFrameHandle: number
    let frameCount = 0

    const render: FrameRequestCallback = (time) => {
      if (!ctx) return
      ++frameCount
      preDraw(ctx)
      draw(ctx, time, frameCount)
      // postDraw()
      animationFrameHandle = requestAnimationFrame(render)
    }
    animationFrameHandle = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameHandle)
      resizeObserver.current?.disconnect()
      resizeObserver.current = null
    }
  }, [preDraw, props])

  return <canvas ref={canvasRef} {...props.canvasProps} />
}
