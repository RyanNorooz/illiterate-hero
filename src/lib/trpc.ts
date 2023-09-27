import { queryClient } from '@/lib/ReactQueryProvider'
import type { AppRouter } from '@/server/routers/_app'
import { createPersistStorage } from '@/store/createPersistStorage'
import { storageName } from '@/store/store'
import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClient,
      links: [
        httpBatchLink({
          url: '/api/trpc',
          headers: () => ({
            Authorization: `Bearer ${createPersistStorage().getItem(storageName)?.state?.token}`,
          }),
        }),
      ],
    }
  },
})
