"use client";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export function getCurrentUser(): User | null {
  // En el cliente, intentamos obtener del localStorage
  if (typeof window !== "undefined") {
    try {
      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.user || null;
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}
