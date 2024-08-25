import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAuth = (token: string) => {
  if (token) return true;
  else {
    location.href = "/login";
  }
};
