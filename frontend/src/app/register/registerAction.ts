"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const registerPayloadSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .required();

type RegisterPayload = z.infer<typeof registerPayloadSchema>;

type RegisterState = {
  status: number;
  message: string;
};

export async function register(prevState: RegisterState, form: FormData) {
  const payload: RegisterPayload = await registerPayloadSchema.parseAsync({
    username: form.get("username"),
    password: form.get("password"),
  });
  const response = await fetch(
    `${process.env.BASE_URL}/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (response.ok) {
    return redirect("/login");
  } else {
    return {
      status: response.status,
      message: await response.text(),
    };
  }
}
