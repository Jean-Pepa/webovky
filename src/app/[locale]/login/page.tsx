"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "cs";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(password);
    setLoading(false);

    if (result.success) {
      router.push(`/${locale}/admin`);
    } else {
      setError(result.error || "Nesprávné heslo");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white px-6"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div className="w-full max-w-[320px]">
        <h1
          className="text-[28px] font-extralight tracking-[0.02em] mb-8 text-center"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              autoFocus
              className="w-full border-b border-black/15 bg-transparent py-3 text-sm font-light outline-none focus:border-black/40 transition-colors placeholder:text-black/25"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500 font-light">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 text-[11px] font-medium uppercase tracking-[0.15em] bg-black text-white hover:bg-black/85 disabled:opacity-30 transition-all"
          >
            {loading ? "..." : "Přihlásit"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <a
            href={`/${locale}`}
            className="text-[11px] text-black/25 hover:text-black/50 transition-colors"
          >
            &larr; Zpět
          </a>
        </div>
      </div>
    </div>
  );
}
