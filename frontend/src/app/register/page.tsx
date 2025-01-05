"use client";

import Link from "next/link";
import Form from "next/form";
import { useActionState } from "react";
import { register } from "./registerAction";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, {
    status: 0,
    message: "",
  });
  return (
    <div className="flex flex-col gap-4 items-center w-5/6 mx-auto bg-slate-700 mt-4 text-white p-4 rounded">
      <h1 className="text-4xl font-bold">Register</h1>
      {state.status ? <p>{state.message}</p> : null}
      <Form action={formAction} className="flex flex-col gap-4 p-4 text-black">
        <input
          name="username"
          type="text"
          placeholder="Username"
          // required
          autoComplete="username"
          className="p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          // required
          autoComplete="current-password"
          className="p-2"
        />
        <input
          type="password"
          placeholder="Confirm password"
          // required
          autoComplete="current-password"
          className="p-2"
        />
        <button
          type="submit"
          disabled={pending}
          className={`bg-blue-500 text-white p-2 rounded disabled:opacity-50`}
        >
          Register
        </button>
      </Form>
      <Link href={"/login"}>Already have an account?</Link>
    </div>
  );
}
