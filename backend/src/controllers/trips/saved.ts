import { Request, Response } from 'express';
import { HttpError } from '../../errors/HttpError.js';
import { fetchTripById, Trip } from '../../http-client/index.js';
import {
  getTrips,
  saveTrip as saveTripToDb,
  deleteTrip as deleteTripFromDb,
} from '../../db/trips.js';
import { getTripKey, setTripKey } from '../../redis/index.js';

export async function saveTrip(
  req: Request & { body: { id: string } },
  res: Response,
) {
  if (!req.username) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const response = await getTripFromCacheOrDb(req.body.id);
    await saveTripToDb(response.id, req.username);
  } catch {
    throw new HttpError(500, 'Error saving trip');
  }
  res.status(201).end();
}

export async function getSavedTrips(req: Request, res: Response) {
  if (!req.username) {
    throw new HttpError(401, 'Unauthorized');
  }
  const savedTripsId = await getTrips(req.username);

  const fetchedTrips = await Promise.allSettled(
    savedTripsId.map(getTripFromCacheOrDb),
  );

  const trips: Trip[] = [];

  for (const trip of fetchedTrips) {
    if (trip.status === 'rejected') {
      continue;
    }
    trips.push(trip.value);
  }
  res.send(trips);
}

async function getTripFromCacheOrDb(tripId: string) {
  const trip = await getTripKey(tripId);
  if (trip) {
    return JSON.parse(trip);
  }
  const tripFromDB = await fetchTripById(tripId);
  setTripKey(tripId, tripFromDB);
  return tripFromDB;
}

export async function deleteTrip(
  req: Request & { params: { tripId: string } },
  res: Response,
) {
  if (!req.username) {
    throw new HttpError(401, 'Unauthorized');
  }
  const { tripId } = req.params;
  await deleteTripFromDb(tripId, req.username);
  res.status(204).end();
}
