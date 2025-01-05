import 'dotenv/config'
import { z } from 'zod'
import { createNewLogger } from '../logger/index.js'

const log = createNewLogger('CONFIG')

const envSchema = z
  .object({
    NODE_ENV: z.string().default('development'),
    PORT: z.number({ coerce: true }),
    API_KEY: z.string(),
    API_URL: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.number({ coerce: true }),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    SECRET: z.string(),
    LOG_LEVEL: z.enum(['emerg', 'error', 'warn', 'info', 'debug']),
    REDIS_URL: z.string(),
  })
  .required()

type Env = z.infer<typeof envSchema>

const result = await envSchema.safeParseAsync(process.env)

if (!result.success) {
  log.error('Invalid environment variables: ')
  for (const error of result.error.errors) {
    log.error(`${error.path}: ${error.message}`)
  }
  throw new Error('Invalid environment variables')
}

export const env: Env = result.data
