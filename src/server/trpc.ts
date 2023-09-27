import connectDB from '@/lib/connectDB'
import { getLocaleFromURL } from '@/lib/helpers/getLocaleFromURL'
import type { inferAsyncReturnType } from '@trpc/server'
import { TRPCError, initTRPC } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import jwt from 'jsonwebtoken'

export const createContext = async (opts?: CreateNextContextOptions) => {
  await connectDB()
  const locale = getLocaleFromURL(opts?.req.headers.referer)
  return { ...opts, locale }
}
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure

interface UserJWT {
  username: string
  iat: number
  exp: number
}

const isAuthed = middleware(async ({ ctx, next }) => {
  if (!process.env.JWT_SECRET) throw Error('`JWT_SECRET` env var is required!')
  if (!ctx.req || !ctx.res) throw new Error('You are missing `req` or `res` in your call.')
  if (!ctx.locale) throw new Error('Missing `locale` in the context.')

  const token = ctx.req.headers.authorization?.split(' ')[1]
  if (!token) throw new TRPCError({ code: 'UNAUTHORIZED' })

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET) as UserJWT
    return next({ ctx: { ...ctx, req: ctx.req, res: ctx.res, locale: ctx.locale, user } })
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
})

export const privateProcedure = publicProcedure.use(isAuthed)
