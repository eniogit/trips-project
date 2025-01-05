import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import * as cookie from "cookie";
import { Trip } from "@/types/trips";
import { cookies } from "next/headers";
import SearchForm from "@/components/search-form";
import { fetchTrips } from "@/components/tripsAction";
import { SearchResults } from "@/components/search-results";

type HomeProps = {
  searchParams: Promise<{
    origin?: string;
    destination?: string;
    sort_by?: "cost" | "duration";
  }>;
};

export default async function Home(props: Readonly<HomeProps>) {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["locations", ""],
    queryFn: async () => {
      return await (await fetch(`${process.env.BASE_URL}/locations`)).json();
    },
  });

  const { origin, destination, sort_by = "cost" } = await props.searchParams;

  const tripsPromise: Promise<Trip[] | null> = fetchTrips(
    origin?.toUpperCase(),
    destination?.toUpperCase(),
    sort_by.toLowerCase()
  );

  const cookieStore = await cookies();

  const c = cookieStore.get("jwt");
  const jwt = c?.value;

  if (jwt && origin && destination) {
    const headers = new Headers();
    headers.set("cookie", cookie.serialize("token", jwt));

    const savedTripsResponse = await fetch(
      `${process.env.BASE_URL}/trips/saved`,
      {
        headers,
      }
    );
    if (savedTripsResponse.ok) {
      const [trips, savedTrips] = await Promise.all([
        tripsPromise,
        savedTripsResponse.json(),
      ]);
      if (trips) {
        trips.forEach((trip) => {
          trip.saved = savedTrips.some((t: Trip) => t.id === trip.id);
        });
      }
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col w-5/6 mx-auto gap-4 text-white max-w-sm">
        <p className="text-2xl text-center">Search for a trip</p>
        <SearchForm
          origin={origin ?? ""}
          destination={destination ?? ""}
          sort_by={sort_by}
        />
      </div>
      <div className="my-4 max-w-xl mx-auto w-5/6">
        <SearchResults trips={await tripsPromise} />
      </div>
    </HydrationBoundary>
  );
}
