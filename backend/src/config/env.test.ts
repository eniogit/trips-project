import { expect, test, describe, vi } from 'vitest'

vi.mock('dotenv/config', () => {
  return {}
})

describe('env', () => {
  test('should have all required environment variables', async () => {
    await expect(async () => {
      await import('./env.js')
    }).rejects.toThrow()
  })
})
