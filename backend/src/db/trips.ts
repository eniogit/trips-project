import { sql } from './index.js';

export async function getTrips(username: string): Promise<string[]> {
  const trips = await sql`SELECT * FROM trips WHERE user_id = ${username}`;
  return trips.map((trip) => trip.id);
}

export async function saveTrip(
  tripId: string,
  username: string,
): Promise<void> {
  await sql`
    INSERT INTO trips (
      id,
      user_id
    ) VALUES (
      ${tripId},
      ${username}
    )
  `;
}

export async function deleteTrip(
  tripId: string,
  username: string,
): Promise<void> {
  await sql`DELETE FROM trips WHERE id = ${tripId} AND user_id = ${username}`;
}
