"use client";

import { AutocompleteInput } from "./autocomplete-input";
import { useFormStatus } from "react-dom";
import Form from "next/form";
import { create } from "zustand";
import { useEffect } from "react";

type SearchFormProps = {
  origin: string;
  destination: string;
  sort_by?: "cost" | "duration";
};

export const usePending = create<{
  pending: boolean;
  setPending: (pending: boolean) => void;
}>((set) => ({
  pending: false,
  setPending: (pending: boolean) => set({ pending }),
}));

function Probe() {
  const { pending } = useFormStatus();
  useEffect(() => {
    usePending.setState({ pending });
  }, [pending]);
  return null;
}

export default function SearchForm(props: Readonly<SearchFormProps>) {
  return (
    <Form action="" className="flex flex-col gap-4">
      <AutocompleteInput
        input={props.origin}
        keys={["locations"]}
        queryFn={fetchLocations}
        placeholder="From"
        name="origin"
      />
      <Probe />
      <AutocompleteInput
        input={props.destination}
        keys={["locations"]}
        queryFn={fetchLocations}
        placeholder="To"
        name="destination"
      />
      <div className="flex flex-row gap-2">
        <button type="submit" className="p-2 bg-blue-500 rounded text-xl w-3/4">
          Search
        </button>
        <select
          name="sort_by"
          className="p-2 bg-blue-500 rounded text-xl"
          defaultValue={props.sort_by}
        >
          <option value="cost">Sort by cost</option>
          <option value="duration">Sort by duration</option>
        </select>
      </div>
    </Form>
  );
}

async function fetchLocations(q: string, signal: AbortSignal) {
  console.log(`fetching locations for ${q}`);

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/locations`);
  url.searchParams.append("q", q);
  const res = await fetch(url, {
    signal,
  });
  const locations = await res.json();
  console.log(`fetched locations for ${q}: ${locations}`);

  return locations;
}
