import { Request, Response } from 'express';
import { fetchTripById } from '../../http-client/index.js';
import { getTripKey, setTripKey } from '../../redis/index.js';

export async function getTrip(req: Request, res: Response) {
  const { tripId } = req.params;
  const cachedTrip = await getTripKey(tripId);
  if (cachedTrip) {
    res.send(JSON.parse(cachedTrip));
    return;
  }
  const trip = await fetchTripById(tripId);
  setTripKey(tripId, trip);
  res.send(trip);
}
