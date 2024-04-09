import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define arrays for authenticated and protected routes
const authRoutes = ["/"];
const protectedRoutes = ["/profile", "/dashboard"];

// Define the middleware function
export async function middleware(request: NextRequest) {
  // Check if the 'authToken' cookie exists

  const authToken = request.cookies.get("jwtauth");

  if (authToken) {
    const token = authToken.value;
    try {
      // Decode the JWT token to extract the user ID
      const decodedToken = jwt.decode(authToken.value) as JwtPayload;
      const userId = decodedToken?.id as string;

      if (!userId) {
        const expiredCookie = `${authToken.name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;

        // Return a response with the expired cookie to remove it
        return NextResponse.next({
          headers: {
            "Set-Cookie": expiredCookie,
          },
        });
      }
      // Send a request to the backend to validate the user
      const response = await fetch("http://localhost:4000/api/validateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (response.status === 401) {
        const expiredCookie = `${authToken.name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;

        // Return a response with the expired cookie to remove it
        return NextResponse.next({
          headers: {
            "Set-Cookie": expiredCookie,
          },
        });
        // document.cookie =
        //   "jwtauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
      if (response.status === 200) {
        // console.log("VALID");
      }
    } catch (error) {
      console.error("Error validating user:", error);
    }
  }

  const isAuthenticated = authToken !== undefined;

  // Check if the user is trying to access an authentication route while already logged in
  if (authRoutes.includes(request.nextUrl.pathname) && isAuthenticated) {
    // If user is already logged in and visits authentication route, redirect to profile
    const redirectUrl =
      request.nextUrl.protocol +
      "//" +
      request.nextUrl.hostname +
      (request.nextUrl.port ? `:${request.nextUrl.port}` : "") +
      "/profile";
    return NextResponse.redirect(redirectUrl);
  }

  // Check if the user is trying to access a protected route without being logged in
  if (!isAuthenticated && protectedRoutes.includes(request.nextUrl.pathname)) {
    // If user is not logged in and tries to access a protected route, redirect to authentication route
    const redirectUrl =
      request.nextUrl.protocol +
      "//" +
      request.nextUrl.hostname +
      (request.nextUrl.port ? `:${request.nextUrl.port}` : "") +
      "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Default action if the request does not match any of the defined routes

  return NextResponse.next();
}
