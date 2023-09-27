import BaseButton from '@/components/Base/BaseButton'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useTranslation } from 'next-i18next'
import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface DialogState {
  open: boolean
  title: string
  message: string
  onYes?: () => void
  onNo?: () => void
}

const dialogStateDefaultValue = { open: false, title: '', message: '' }
interface ConfirmationContext {
  dialogState: DialogState
  setDialogState: Dispatch<SetStateAction<DialogState>>
}

const ConfirmationDialogContext = createContext<ConfirmationContext | null>(null)

interface ConfirmationDialogProviderProps {
  children: React.ReactElement
}

export function ConfirmationDialogProvider(props: ConfirmationDialogProviderProps) {
  const { t } = useTranslation()
  const [dialogState, setDialogState] = useState<DialogState>(dialogStateDefaultValue)

  const contextValue = useMemo(
    () => ({ dialogState, setDialogState }),
    [dialogState, setDialogState]
  )

  const resetDialog = () => setDialogState(dialogStateDefaultValue)

  const yesHandler = () => {
    dialogState.onYes?.()
    resetDialog()
  }
  const noHandler = () => {
    dialogState.onNo?.()
    resetDialog()
  }

  return (
    <ConfirmationDialogContext.Provider value={contextValue}>
      <Dialog
        open={dialogState.open}
        onClose={noHandler}
        aria-labelledby="confirmation-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="confirmation-dialog-title">{dialogState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogState.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <BaseButton variant="text" onClick={noHandler} autoFocus>
            {t('cancel')}
          </BaseButton>
          <BaseButton variant="text" onClick={yesHandler}>
            {t('confirm')}
          </BaseButton>
        </DialogActions>
      </Dialog>
      {props.children}
    </ConfirmationDialogContext.Provider>
  )
}

interface UseConfirmationDialogProps {
  title: string
  message: string
}

export default function useConfirmationDialog(props: UseConfirmationDialogProps) {
  const confirmationDialogContext = useContext(ConfirmationDialogContext)

  if (!confirmationDialogContext)
    throw new Error(
      'Provider is not available. "useConfirmationDialog" hook must be used inside "ConfirmationDialogProvider".'
    )

  useEffect(() => {
    return () => confirmationDialogContext?.setDialogState(dialogStateDefaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirm = () => {
    return new Promise<void>((resolve, reject) => {
      confirmationDialogContext?.setDialogState((ps) => ({
        ...ps,
        title: props.title,
        message: props.message,
        onYes: () => resolve(),
        onNo: () => reject(),
        open: true,
      }))
    })
  }

  return { confirm }
}
