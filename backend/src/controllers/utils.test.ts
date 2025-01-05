import { z } from 'zod'
import { validateRequest } from './utils.js'
import { describe, test, expect, vi } from 'vitest'
import { Request, Response } from 'express'

describe('utils', () => {
  test('should validate body', async () => {
    const fn = validateRequest('body', z.object({ name: z.string() }))
    const req: Partial<Request> = { body: { name: 'John' } }
    const next = vi.fn()
    await fn(req as Request, {} as Response, next)
    expect(next).toHaveBeenCalled()
  })

  test('should throw error if body is invalid', async () => {
    const fn = validateRequest('body', z.object({ name: z.string() }))
    const req: Partial<Request> = { body: { name: 123 } }
    const next = vi.fn()
    await fn(req as Request, {} as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})
