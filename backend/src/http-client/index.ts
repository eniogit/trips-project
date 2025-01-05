import { z } from 'zod';
import { env } from '../config/env.js';
import { HttpError } from '../errors/HttpError.js';

export const tripSchema = z
  .object({
    origin: z.string(),
    destination: z.string(),
    cost: z.number(),
    duration: z.number(),
    type: z.string(),
    id: z.string(),
    display_name: z.string(),
  })
  .required();

export type Trip = z.infer<typeof tripSchema>;

export async function fetchTrips({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
  }): Promise<Trip[]> {
  
  const url = new URL('/default/trips', env.API_URL);

  url.searchParams.set('origin', origin);
  url.searchParams.set('destination', destination);

  const response = await fetch(url, {
    headers: {
      'x-api-key': env.API_KEY,
    },
  });

  if (!response.ok) {
    throw new HttpError(500, `Failed to fetch trips ${await response.text()} ${response.status}`);
  }

  const data = await response.json();
  try {
    const results = await tripSchema.array().parseAsync(data);
    return results;
  } catch (err) {
    throw new Error(`Failed to parse response: ${err}`);
  }
}

export async function fetchTripById(tripId: string): Promise<Trip> {
  const url = new URL(`/default/trips/${tripId}`, env.API_URL);

  const response = await fetch(url, {
    headers: {
      'x-api-key': env.API_KEY,
    },
  });

  if (!response.ok) {
    throw new HttpError(500, 'Failed to fetch trip');
  }

  const data = await response.json();
  try {
    const result = await tripSchema.parseAsync(data);
    return result;
  } catch (err) {
    throw new Error(`Failed to parse response: ${err}`);
  }
}
