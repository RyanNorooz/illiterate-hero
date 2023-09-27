import useBoolean from '@/lib/hooks/useBoolean'
import { Backdrop, CircularProgress } from '@mui/material'
import { createPortal } from 'react-dom'

interface LoadingBackdropProps {
  /** If `true`, the component is shown. @default true */
  open?: boolean
}

export default function LoadingBackdrop(props: LoadingBackdropProps) {
  const [open, { off: close }] = useBoolean(props.open ?? true)

  return createPortal(
    <Backdrop open={open} onClick={close} sx={{ zIndex: 9999 }}>
      <CircularProgress />
    </Backdrop>,
    document.body
  )
}
