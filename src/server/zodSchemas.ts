import type { TypeOptions } from 'react-toastify'
import { z } from 'zod'

//=================================== GENERAL ===================================//
const _id = z.string()
const username = z.string()
const password = z.string()
export const loginRequestSchema = z.object({ username, password })

export const toastResponseSchema = z.object({
  toast: z.object({
    message: z.string(),
    type: z.enum([
      'info',
      'success',
      'warning',
      'error',
      'default',
    ] as const satisfies readonly TypeOptions[]),
  }),
})

//==================================== USERS ====================================//
export const getUserRequestSchema = z.object({ _id, username }).partial()
export const createUserRequestSchema = z.object({ username, password }).strict()
export const updateUserRequestSchema = z.object({
  user: getUserRequestSchema.refine((user) => !!Object.keys(user).length),
  data: z.object({ username, password }).partial(),
})
