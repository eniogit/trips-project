import { sql } from "./index.js";


export async function searchLocations(query: string): Promise<string[]> {
  const rows = await sql`SELECT * FROM locations WHERE name ILIKE ${query + '%'}`;
  return rows.map((row) => row.name);
}