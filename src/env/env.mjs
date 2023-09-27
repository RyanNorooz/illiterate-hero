import { z } from 'zod'

const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`
    })
    .filter(Boolean)

export const envSchema = z.object({
  BASE_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  MONGODB_URI: z.string(),
  ENV_VALIDATION: z.literal('true').optional(),
})

const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error('Invalid environment variables:\n', ...formatErrors(env.error.format()))
  process.exit(1)
}
