"use server";

import { Trip } from "@/types/trips";

export async function fetchTrips(
  origin?: string | null,
  destination?: string | null,
  sort_by?: string | null
): Promise<Trip[] | null> {
  if (!origin || !destination) {
    return null;
  }
  const url = new URL("trips", process.env.BASE_URL);
  url.searchParams.append("origin", origin);
  url.searchParams.append("destination", destination);
  url.searchParams.append("sort_by", sort_by ?? "cost");

  const response = await fetch(url, {
    credentials: "include",
  });

  if (response.ok) {
    return await response.json();
  }

  return [];
}
