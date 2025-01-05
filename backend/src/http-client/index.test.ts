import { describe, test, expect, vi } from 'vitest'
import { fetchTrips } from './index.js'
import { HttpError } from '../errors/HttpError.js'
import { text } from 'express'

describe('http-client', () => {
  test('should work', async () => {
    const tripsMock = [
      {
        origin: 'a',
        destination: 'b',
        cost: 1,
        duration: 1,
        type: 'type',
        id: 'id',
        display_name: 'display_name',
      },
    ]
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: true,
        json: () => {
          return tripsMock
        },
      }),
    )
    const trips = await fetchTrips({ origin: 'a', destination: 'b' })
    expect(trips).toEqual(tripsMock)
  })

  test('should throw error', async () => {
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: false,
        text: () => 'Error',
        status: 500,
      }),
    )
    await expect(async () => {
      await fetchTrips({ origin: 'a', destination: 'b' })
    }).rejects.toThrow(new HttpError(500, 'Failed to fetch trips Error 500'))
  })

  test('should throw error', async () => {
    vi.stubGlobal('fetch', () =>
      Promise.resolve({
        ok: true,
        json: () => {
          return {}
        },
      }),
    )
    await expect(async () => {
      await fetchTrips({ origin: 'a', destination: 'b' })
    }).rejects.toThrow()
  })
})
