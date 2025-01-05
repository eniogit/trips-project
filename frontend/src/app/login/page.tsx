"use client";

import Form from "next/form";
import Link from "next/link";
import { login } from "./login";
import { useActionState } from "react";

export default function LoginPage() {
  const [error, action, isPending] = useActionState(login, false);
  return (
    <div className="flex flex-col gap-4 items-center w-5/6 mx-auto bg-slate-700 mt-4 text-white p-4 rounded">
      <h1 className="text-4xl font-bold">Login</h1>
      {error ? <p className="text-red-500">Error</p> : null}
      <Form
        action={action}
        formMethod="POST"
        className="flex flex-col gap-4 p-4 text-black"
      >
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="p-2"
          autoComplete="username"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-2"
          autoComplete="current-password"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isPending}>
          {isPending ? "Wait" : "Login"}
        </button>
      </Form>
      <Link href={"/register"}>Register instead?</Link>
    </div>
  );
}
