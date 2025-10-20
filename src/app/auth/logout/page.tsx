"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Call the logout API route
    fetch("/api/auth/logout", {
      method: "POST",
    })
    .then(() => {
      // Redirect to login page after logout
      router.push("/auth/login");
    })
    .catch(() => {
      // Even if API call fails, redirect to login
      router.push("/auth/login");
    });
  }, [router]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}>
        <h2 style={{ color: "#009a55", marginBottom: "20px" }}>Logging out...</h2>
        <p style={{ color: "#666" }}>Please wait while we log you out.</p>
      </div>
    </div>
  );
}
