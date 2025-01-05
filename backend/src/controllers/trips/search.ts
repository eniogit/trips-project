import { GetTripParams } from './types.js'
import { Request, Response } from 'express'
import { HttpError } from '../../errors/HttpError.js'
import { fetchTrips } from '../../http-client/index.js'
import { getSearchKey, setSearchKey, setTripKey } from '../../redis/index.js'
import { env } from '../../config/env.js'
import { createNewLogger } from '../../logger/index.js'

const log = createNewLogger('TRIPS-SEARCH', env.LOG_LEVEL)

export async function searchTrips(
  req: Request & { query: GetTripParams },
  res: Response,
) {
  const { origin, destination, sort_by } = req.query

  if (origin === destination) {
    throw new HttpError(400, "Origin and destination can't be the same")
  }

  const cachedTrips = await getSearchKey(`${origin}-${destination}-${sort_by}`)

  if (cachedTrips) {
    log.debug('CHACHE HIT')
    res.send(JSON.parse(cachedTrips))
    return
  }
  log.debug('CHACHE MISS')

  const trips = await fetchTrips({ origin, destination })
  
  trips.sort((a, b) => {
    if (sort_by === 'cost') {
      return a.cost - b.cost
    }
    
    return a.duration - b.duration
  })

  setSearchKey(`${origin}-${destination}-${sort_by}`, trips)

  for (const trip of trips) {
    setTripKey(trip.id, trip)
  }

  console.log(trips);
  

  res.send(trips)
}
