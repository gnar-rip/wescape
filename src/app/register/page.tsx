"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      // Redirect to sign-in page after successful registration
      router.push("/api/auth/signin");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-gray-900 rounded-xl text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
      {error && <p className="mb-2 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            name="username"
            type="text"
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-white font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
}
