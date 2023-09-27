import { DEFAULT_LOCALE, availableLocales, type AvailableLocale } from '@/configs'
import { useStore } from '@/store/store'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CustomToastContainer() {
  const theme = useTheme()
  const colorTheme = useStore((state) => state.theme)
  const { locale } = useRouter()
  const isRTL = availableLocales[(locale ?? DEFAULT_LOCALE) as AvailableLocale]?.direction === 'rtl'

  return (
    <ToastContainer
      theme={colorTheme}
      position={isRTL ? 'bottom-left' : 'bottom-right'}
      rtl={isRTL}
      closeOnClick={false}
      pauseOnFocusLoss
      pauseOnHover
      // hideProgressBar
      toastStyle={{ borderRadius: 16, backgroundColor: theme.palette.background.default }}
      closeButton={false}
    />
  )
}
