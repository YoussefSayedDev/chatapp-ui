"use server";
import { cookies } from "next/headers";

// Function to remove token from cookies
export const removeFromCookie = (key: string) => {
  // Remove the token with the given key
  cookies().delete(key);
};
