"use client";

import {
  MdDirectionsCar,
  MdFlightTakeoff,
  MdOutlinePublic,
  MdOutlineStar,
  MdOutlineTrain,
} from "react-icons/md";
import { IconType } from "react-icons";
import { usePending } from "./search-form";
import { useRouter } from "next/navigation";
import { Trip, TripType } from "@/types/trips";

type SearchResultsProps = {
  trips: Trip[] | null;
};

export function SearchResults(props: Readonly<SearchResultsProps>) {
  const router = useRouter();
  const isPending = usePending((state) => state.pending);
  const { trips } = props;

  if (isPending) {
    return <p className="text-4xl text-white text-center">Searching...</p>;
  }

  if (trips === null) {
    return <p className="text-4xl text-white text-center">Search for trips</p>;
  }

  if (trips.length === 0) {
    return <p className="text-4xl text-white text-center">No trips found</p>;
  }

  return (
    <ul className="flex flex-col gap-4 text-black">
      {trips?.map((trip) => (
        <li
          key={trip.id}
          className="p-2 bg-white rounded flex flex-col md:flex-row justify-evenly items-center hover:bg-pink-200 hover:cursor-pointer"
        >
          <MdOutlineStar
            className={`${
              trip.saved ? "text-yellow-400" : "text-black"
            } self-end text-4xl md:order-6 md:self-start`}
            onClick={() => {
              if (trip.saved) {
                fetch(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/trips/saved/${trip.id}`,
                  {
                    credentials: "include",
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                ).then(() => {
                  router.refresh();
                });
              } else {
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/trips/saved`, {
                  credentials: "include",
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: trip.id }),
                }).then(() => {
                  router.refresh();
                });
              }
            }}
          />
          <p className="text-4xl">{trip.origin}</p>
          <div className="flex flex-col gap-2 items-center">
            {getIcon(trip.type)({ className: "text-4xl" })}
            <p>{trip.display_name}</p>
          </div>
          <p className="self-end ">
            <span className="font-medium">Cost:</span> {trip.cost}
          </p>
          <p className="self-end">
            <span className="font-medium">Duration:</span> {trip.duration}
          </p>
          <p className="text-4xl">{trip.destination}</p>
        </li>
      ))}
    </ul>
  );
}

const icons: Record<TripType, IconType> = {
  flight: MdFlightTakeoff,
  train: MdOutlineTrain,
  car: MdDirectionsCar,
  other: MdOutlinePublic,
};

function getIcon(type: TripType): IconType {
  return icons[type];
}
