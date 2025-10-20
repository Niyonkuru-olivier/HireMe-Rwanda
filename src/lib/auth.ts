import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Use your environment secret for JWT verification
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "changeme");

// ✅ Auth session type
export type AuthSession =
  | { userId: number; role: "EMPLOYEE" | "EMPLOYER" }
  | { adminId: number; role: "ADMIN" }
  | null;

// ✅ Get session from JWT stored in cookies
export async function getSession(): Promise<AuthSession> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);
    const role = String(payload.role || "");

    // Admin token
    if (role === "ADMIN") {
      const adminId = Number(payload.sub || 0);
      if (!adminId) return null;
      return { adminId, role: "ADMIN" };
    }

    // User token
    const userId = Number(payload.sub || 0);
    if (!userId || (role !== "EMPLOYEE" && role !== "EMPLOYER")) return null;

    return { userId, role: role as "EMPLOYEE" | "EMPLOYER" };
  } catch {
    return null;
  }
}
