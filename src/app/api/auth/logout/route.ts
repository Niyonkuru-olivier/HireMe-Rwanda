import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // Clear the authentication token
  const cookieStore = await cookies();
  cookieStore.delete("token");

  // Return success response
  return NextResponse.json({ success: true });
}

export async function GET() {
  // Also handle GET requests for logout
  const cookieStore = await cookies();
  cookieStore.delete("token");

  // Redirect to login page
  return NextResponse.redirect(new URL("/auth/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}
