import type { ThemeMode } from '@/theme/type'
import packageJson from 'package.json'
import { createContext, useContext } from 'react'
import { createStore, useStore as useZustandStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createPersistStorage } from './createPersistStorage'

export const storageName = packageJson.name

export interface PersistedState {
  theme: ThemeMode | 'system'
  token?: string
}

export const initialState: PersistedState = {
  theme: 'system',
  token: undefined,
}
export const initialStateJSON = JSON.stringify(initialState)

interface StoreInterface extends PersistedState {
  login: (token: string) => void
  logout: () => void
  setTheme: (themeMode: ThemeMode) => void
}

export type Store = ReturnType<typeof initializeStore>

const zustandContext = createContext<Store | null>(null)

export const Provider = zustandContext.Provider

export const useStore = <T>(selector: (state: StoreInterface) => T) => {
  const store = useContext(zustandContext)

  if (!store) throw new Error('Store is missing the provider')

  return useZustandStore(store, selector)
}

export const initializeStore = (preloadedState: Partial<PersistedState>) => {
  return createStore<StoreInterface>()(
    persist(
      (set) => ({
        ...initialState,
        ...preloadedState,
        login: (token) => set(() => ({ token })),
        logout: () => set(() => ({ token: undefined })),
        setTheme: (theme) => set(() => ({ theme })),
      }),
      {
        name: storageName,
        storage: createPersistStorage(),
        partialize: (state) => ({
          theme: state.theme,
          token: state.token,
        }),
      }
    )
  )
}
