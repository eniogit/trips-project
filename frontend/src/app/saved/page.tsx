import * as cookie from "cookie";
import { Trip } from "@/types/trips";
import { cookies } from "next/headers";
import { SearchResults } from "@/components/search-results";
import { redirect } from "next/navigation";

export default async function SavedPage() {
  let trips: Trip[] = [];
  const cookieStore = await cookies();
  const c = cookieStore.get("jwt");
  const headers = new Headers();
  headers.set("cookie", cookie.serialize("token", c?.value ?? ""));

  const savedTripsResponse = await fetch(
    `${process.env.BASE_URL}/trips/saved`,
    {
      headers,
    }
  );
  if (savedTripsResponse.ok) {
    trips = await savedTripsResponse.json();
    trips.forEach((trip) => {
      trip.saved = true;
    });
  } else {
    return redirect("/login");
  }

  return (
    <div className="max-w-xl mx-auto w-5/6">
      <SearchResults trips={trips} />
    </div>
  );
}
