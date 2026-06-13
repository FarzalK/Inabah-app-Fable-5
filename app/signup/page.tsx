"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Disclaimer from "@/components/Disclaimer";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--surface-bg)" }}>
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-1" style={{ color: "var(--text-primary)" }}>إنابة</h1>
          <p className="text-sm tracking-widest uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.2em" }}>Inābah</p>
          <p className="mt-3 text-sm" style={{ color: "var(--text-tertiary)" }}>Turning back to Allah</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Create account</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--surface-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--surface-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "var(--surface-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {error && (
              <p className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(220,38,38,0.1)", color: "#ef4444" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
          Already have an account?{" "}
          <Link href="/login" className="underline" style={{ color: "var(--accent)" }}>
            Sign in
          </Link>
        </p>

        <Disclaimer className="text-center mt-6 text-xs leading-relaxed" />
      </div>
    </div>
  );
}
