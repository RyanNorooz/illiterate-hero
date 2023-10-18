import CanvasElement from '@/components/base/BaseCanvas'
import { Stack } from '@mui/material'
import { initTextFlowField } from './drawTextFlowField'

export default function TextFlowFieldSection() {
  return (
    <Stack>
      <CanvasElement
        initCanvas={initTextFlowField}
        canvasProps={{ style: { width: '100%', height: '100dvh' } }}
      />
    </Stack>
  )
}
