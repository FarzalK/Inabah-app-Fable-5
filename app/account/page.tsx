"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [joinedDate, setJoinedDate] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [focusPlan, setFocusPlan] = useState<string | null>(null);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? null);
      if (user.created_at) {
        setJoinedDate(
          new Date(user.created_at).toLocaleDateString("en-CA", {
            month: "long", day: "numeric", year: "numeric",
          })
        );
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, focus_plan")
        .eq("id", user.id)
        .single();

      setFirstName(profile?.first_name ?? "");
      setLastName(profile?.last_name ?? "");
      setFocusPlan(profile?.focus_plan ?? null);
    }
    load();
  }, []);

  const [nameError, setNameError] = useState("");

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameLoading(true);
    setNameSuccess(false);
    setNameError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
        });
      if (error) {
        setNameError("Something went wrong — your name wasn't saved. Please try again.");
        setNameLoading(false);
        return;
      }
    }
    setNameLoading(false);
    setNameSuccess(true);
    setTimeout(() => setNameSuccess(false), 3000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (newPassword.length < 8) {
      setPwError("Your password needs to be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("The passwords you entered don't match — please check and try again.");
      return;
    }
    setPwLoading(true);
    const { error } = await createClient().auth.updateUser({ password: newPassword });
    setPwLoading(false);
    if (error) {
      setPwError("We couldn't update your password right now. Please try again in a moment.");
    } else {
      setPwSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  // Avatar initials
  const initials = (firstName || lastName)
    ? `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
    : (email?.[0] ?? "?").toUpperCase();

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <div className="space-y-5">
      <div>
        <Label>Your account</Label>
        <h1 className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>Account</h1>
      </div>

      {/* Avatar + meta */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            {initials}
          </div>
          <div>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              {fullName || "—"}
            </p>
            <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{email ?? "—"}</p>
            {joinedDate && (
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Member since {joinedDate}
              </p>
            )}
          </div>
        </div>

        {/* Name form */}
        <form onSubmit={handleSaveName} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-widest mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setNameSuccess(false); }}
                placeholder="First"
                maxLength={40}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--surface-bg)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setNameSuccess(false); }}
                placeholder="Last"
                maxLength={40}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--surface-bg)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div className="pt-1">
            <Label>Email address</Label>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{email ?? "—"}</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>

          {nameError && (
            <p className="text-[12px] rounded-lg px-3 py-2 leading-relaxed"
              style={{ background: "rgba(220,38,38,0.08)", color: "#ef4444", border: "1px solid rgba(220,38,38,0.15)" }}>
              {nameError}
            </p>
          )}
          <button
            type="submit"
            disabled={nameLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{
              background: nameSuccess
                ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                : "var(--surface-card-alt)",
              color: nameSuccess ? "var(--accent)" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {nameLoading ? "Saving…" : nameSuccess ? "Saved ✓" : "Save changes"}
          </button>
        </form>
      </div>

      {/* What I'm working toward — brief */}
      {focusPlan && (
        <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
          <Label>What I&apos;m working toward</Label>
          <p className="text-[13px] leading-relaxed line-clamp-4" style={{ color: "var(--text-secondary)" }}>
            {focusPlan}
          </p>
          <a
            href="/account/direction"
            className="inline-block mt-3 text-[12px] transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            View full direction →
          </a>
        </div>
      )}

      {/* Reset password */}
      <div className="rounded-xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-base font-medium mb-4" style={{ color: "var(--text-primary)" }}>Reset password</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--surface-bg)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--surface-bg)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>
          {pwError && (
            <p className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(220,38,38,0.1)", color: "#ef4444" }}>{pwError}</p>
          )}
          {pwSuccess && (
            <p className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>Password updated successfully.</p>
          )}
          <button
            type="submit"
            disabled={pwLoading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
            style={{ background: "var(--accent)", color: "var(--surface-bg)" }}
          >
            {pwLoading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
