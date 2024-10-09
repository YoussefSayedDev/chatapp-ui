"use server";
import { cookies } from "next/headers";

// Function to add token to cookies
export const addToCookie = (name: string, token: string) => {
  // "authToken"
  // Set the token to cookies with the name
  cookies().set(name, token);
};
