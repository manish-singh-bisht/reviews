import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function setTokenInLocalStorage(token) {
  return localStorage.setItem("token", token);
}
export function removeTokenFromLocalStorage() {
  return localStorage.removeItem("token");
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem("token");
}
export function convertWithHypens(name) {
  return name.trim().replace(/\s+/g, "-").toLowerCase();
}
