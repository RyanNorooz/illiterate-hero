import CanvasElement from '@/components/base/BaseCanvas'
import { Stack } from '@mui/material'
import { initBasicFlowField } from './drawBasicFlowField'

export default function BasicFlowFieldSection() {
  return (
    <Stack>
      <CanvasElement
        initCanvas={initBasicFlowField}
        canvasProps={{ style: { width: '100%', height: '100dvh' } }}
        clearCanvasOnRender
      />
    </Stack>
  )
}
