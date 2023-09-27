import type { inferReactQueryProcedureOptions } from '@trpc/react-query'
import type { inferRouterInputs } from '@trpc/server'
import type { AppRouter } from '../routers/_app'

type RouterInput = inferRouterInputs<AppRouter>
type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>
