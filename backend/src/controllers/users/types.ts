import { z } from 'zod'

export const userSchema = z
  .object({
    username: z.string().min(3).max(30),
    password: z.string().min(8),
  })
  .required()

export type User = z.infer<typeof userSchema>
