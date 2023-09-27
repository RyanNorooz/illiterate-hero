import { router } from '@/server/trpc'
import { authRouter } from './authRouter'
import { userRouter } from './userRouter'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
