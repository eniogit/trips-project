import { expect, describe, test, vi } from 'vitest'
import { cookieAuth } from './auth.js'
import { HttpError } from '../errors/HttpError.js'
import { NextFunction, Request, Response } from 'express'
import { createToken } from '../jwt/index.js'

describe('auth middleware', () => {
  test('should be a function', async () => {
    expect(typeof cookieAuth).toBe('function')
  })

  test('should throw an error if no token is provided', async () => {
    await expect(async () => {
      await cookieAuth({ cookies: {} } as Request, {} as Response, () => {})
    }).rejects.toThrow(new HttpError(402, 'Unauthorized'))
  })

  test('should set req.username if token is provided', async () => {
    const jwt = await createToken('username')
    const req: Partial<Request> = {
      cookies: {
        token: jwt,
      },
    }
    const next = vi.fn()
    await cookieAuth(req as Request, {} as Response, next as NextFunction)
    expect(req.username).toBe('username')
    expect(next).toHaveBeenCalled()
  })
})
