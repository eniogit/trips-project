"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type AutocompleteProps = {
  input: string;
  keys: string[];
  queryFn: (q: string, signal: AbortSignal) => Promise<string[]>;
  placeholder: string;
  name: string;
};

export function AutocompleteInput(props: Readonly<AutocompleteProps>) {
  const [hidden, setHidden] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState(props.input);

  const { isPending, data: locations } = useQuery<string[]>({
    queryKey: [...props.keys, input.toLowerCase()],
    queryFn: ({ signal }) => {
      return props.queryFn(input, signal);
    },
  });

  return (
    <div>
      <input
        autoComplete="off"
        name={props.name}
        ref={inputRef}
        type="text"
        placeholder={props.placeholder}
        className="p-2 text-xl text-black w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setHidden(false)}
        onBlur={() => setHidden(true)}
      />
      <ul
        style={{ width: inputRef.current?.clientWidth }}
        className={`absolute max-h-36 overflow-y-scroll ${
          hidden ? "hidden" : ""
        }`}
      >
        {isPending ? (
          <li className={`p-2 bg-blue-500 text-white`}>Loading...</li>
        ) : (
          locations?.map((location) => (
            <li
              key={location}
              className={`p-2 bg-blue-500 text-white cursor-pointer`}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                setInput(location);
                setHidden(true);
              }}
            >
              {location}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
