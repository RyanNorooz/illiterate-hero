import { UserModel } from '@/models/User'
import { privateProcedure, router } from '@/server/trpc'
import { TRPCError } from '@trpc/server'
import {
  createUserRequestSchema,
  getUserRequestSchema,
  updateUserRequestSchema,
} from '../zodSchemas'

export const userRouter = router({
  getAll: privateProcedure.input(getUserRequestSchema.optional()).query(async ({ input }) => {
    return await UserModel.find({ ...input })
      .lean()
      .exec()
  }),

  getOne: privateProcedure.input(getUserRequestSchema).query(async ({ input }) => {
    const user = await UserModel.findOne(input).lean().exec()
    if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
    return user
  }),

  update: privateProcedure.input(updateUserRequestSchema).mutation(async ({ input }) => {
    const user = await UserModel.findOneAndUpdate(input.user, input.data, { new: true })
      .lean()
      .exec()
    if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
    return user
  }),

  delete: privateProcedure.input(getUserRequestSchema).mutation(async ({ input }) => {
    const user = await UserModel.findOneAndDelete(input).lean().exec()
    if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
    return { message: 'User successfully deleted.' }
  }),

  create: privateProcedure.input(createUserRequestSchema).mutation(async ({ input }) => {
    const user = await UserModel.create(input)
    if (!user) throw new TRPCError({ code: 'BAD_REQUEST' })
    return user
  }),
})
