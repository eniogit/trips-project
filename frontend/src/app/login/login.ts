"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as cookie from "cookie";

export async function login(s: boolean, form: FormData) {
  const url = new URL("users/login", process.env.BASE_URL);
  const body = JSON.stringify({
    username: form.get("username"),
    password: form.get("password"),
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });

  if (response.ok) {
    const jwt = cookie.parse(response.headers.get("Set-Cookie") ?? "").jwt;
    const cookieStore = await cookies();
    cookieStore.set("jwt", jwt ?? "", {
      maxAge: 60 * 60 * 2,
      httpOnly: true,
    });
    return redirect("/");
  }

  return true;
}
