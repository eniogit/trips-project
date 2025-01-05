import { z } from 'zod'
import * as jose from 'jose'
import { env } from '../config/env.js'

const secret = new TextEncoder().encode(env.SECRET)
const alg = 'HS256'

export async function createToken(username: string) {
  return await new jose.SignJWT({ username })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  const { payload } = await jose.jwtVerify(token, secret)
  return await z.string().parseAsync(payload.username)
}
