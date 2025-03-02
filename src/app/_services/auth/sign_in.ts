"use server";

import { signIn } from "@/auth";

export async function sign_in() {
  console.log(signIn);
  return await signIn("osu");
}
