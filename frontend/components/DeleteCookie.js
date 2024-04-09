"use client";
export function deleteCookie() {
  // Set the cookie expiration date to a past date to delete it
  document.cookie = "jwtauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
