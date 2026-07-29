"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const result = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

  console.log("SIGNIN RESULT:", result);

  if (result?.error) {
    setError(result.error);
    return;
  }

  router.push("/admin/dashboard");
}

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
      <h1 className="text-3xl font-bold text-[#0B2F24]">
        NEWTA Admin
      </h1>

      <p className="mt-2 text-gray-500">
        Sign in to manage equipment.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-[#D4AF37] py-3 font-bold text-[#0B2F24]"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}