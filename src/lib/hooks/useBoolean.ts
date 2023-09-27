import { useCallback, useState } from 'react'

export default function useBoolean(initialState = false) {
  const [value, setValue] = useState(initialState)

  const on = useCallback(() => setValue(true), [])
  const off = useCallback(() => setValue(false), [])
  const toggle = useCallback(() => setValue((ps) => !ps), [])

  return [value, { setValue, on, off, toggle }] as const
}
