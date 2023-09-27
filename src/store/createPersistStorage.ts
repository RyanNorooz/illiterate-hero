import type { PersistStorage, StorageValue } from 'zustand/middleware'
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { PersistedState } from './store'
import { initialStateJSON } from './store'
import type { StateStorage } from 'zustand/middleware'
import Cookies from 'js-cookie'

export const createPersistStorage = () => {
  const storage = {
    getItem: (name) => Cookies.get(name) ?? null,
    setItem: (name, value) => void Cookies.set(name, value, { sameSite: 'strict', expires: 1 }),
    removeItem: (name) => Cookies.remove(name),
  } satisfies StateStorage

  const persistStorage = {
    getItem: (name) =>
      JSON.parse(
        decompressFromEncodedURIComponent(storage.getItem(name) ?? '') || initialStateJSON
      ) as StorageValue<PersistedState>,
    setItem: (name, newValue) =>
      storage.setItem(name, compressToEncodedURIComponent(JSON.stringify(newValue))),
    removeItem: (name) => storage.removeItem(name),
  } satisfies PersistStorage<PersistedState>

  return persistStorage
}
