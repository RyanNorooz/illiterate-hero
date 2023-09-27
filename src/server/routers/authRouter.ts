import { UserModel } from '@/models/User'
import { publicProcedure, router } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { loginRequestSchema } from '../zodSchemas'

export const authRouter = router({
  login: publicProcedure.input(loginRequestSchema).mutation(async ({ input }) => {
    const user = await UserModel.findOne({ username: input.username }).exec()

    if (!user || !user.comparePassword(input.password))
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials.' })

    const payload = { username: user.username }

    return { token: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }) }
  }),
})
