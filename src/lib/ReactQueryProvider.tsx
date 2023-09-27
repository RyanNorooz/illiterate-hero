import { toastResponseSchema } from '@/server/zodSchemas'
import { useStore } from '@/store/store'
import type { DefaultOptions, MutationObserverOptions } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TRPCClientError } from '@trpc/client'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { loadingSpinnerEnd, loadingSpinnerStart } from './hooks/useNProgress'

export const queryClient = new QueryClient()

interface ReactQueryProviderProps {
  children: React.ReactNode
}

export default function ReactQueryProvider(props: ReactQueryProviderProps) {
  const router = useRouter()
  const logout = useStore((state) => state.logout)

  const onSettled = ((data, error) => {
    loadingSpinnerEnd()

    if (error instanceof TRPCClientError) {
      toast(error?.message, { type: 'error' })
      if (error.message === 'UNAUTHORIZED') {
        logout()
        router.push('/admin/auth?redirect=' + router.asPath)
      }
      return
    }

    try {
      const { message, type } = toastResponseSchema.parse(data).toast
      toast(message, { type: type })
    } catch {
      /* empty */
    }
  }) satisfies MutationObserverOptions['onSettled']

  const options = useMemo(
    () =>
      ({
        queries: {
          retry: 1,
          keepPreviousData: true,
          onSettled,
        },
        mutations: {
          retry: false,
          onMutate: loadingSpinnerStart,
          onSettled,
        },
      }) satisfies DefaultOptions,
    [onSettled]
  )

  useEffect(() => {
    queryClient.setDefaultOptions(options)
  }, [options])

  return (
    <>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
