// Code: Home Page
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // ✅ Prevent hydration mismatch

  // ✅ Check if user is logged in (Only on client-side)
  useEffect(() => {
    if (typeof window !== "undefined") { // ✅ Ensure it's running in the browser
      const token = localStorage.getItem("token");

      if (token) {
        fetchUser(token);
      } else {
        setAuthChecked(true); // ✅ Allow UI to render even if no token is found
      }
    }
  }, []);

  // ✅ Fetch user details
  const fetchUser = async (token) => {
    try {
      const response = await fetch("/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid token, redirecting...");
      }

      setUser(data.user);
    } catch (error) {
      console.error("Authentication error:", error.message);
      localStorage.removeItem("token"); // Remove invalid token
      router.replace("/login");
    } finally {
      setAuthChecked(true); // ✅ Ensure UI renders after authentication check
    }
  };

  // ✅ Prevent rendering until auth check is completed
  if (!authChecked) {
    return <div className="text-white text-lg">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6">Welcome to AI Quiz Generator</h1>
      
      {/* ✅ Show User Info & Logout */}
      {user && (
        <div className="absolute top-4 right-4 bg-gray-800 p-3 rounded-lg">
          <p className="text-sm">Welcome, {user.username}!</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              router.replace("/login");
            }}
            className="mt-2 bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* ✅ Navigation Button */}
      <button
        onClick={() => router.push(user ? "/quiz" : "/login")}
        className="p-4 mt-4 bg-blue-500 rounded-lg font-semibold text-white text-lg hover:bg-blue-600 transition duration-200"
      >
        {user ? "Start Quiz" : "Login to Continue"}
      </button>
    </div>
  );
}
