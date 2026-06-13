"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

// Desktop nav items — mirrors BottomNav.TABS so the top nav at lg+ stays in
// sync with the mobile bottom nav.
const DESKTOP_NAV = [
  { label: "Home",      href: "/dashboard" },
  { label: "Muhāsabah", href: "/session" },
  { label: "Murāqabah", href: "/muraqabah" },
  { label: "Insights",  href: "/insights" },
  { label: "Account",   href: "/account" },
];

function LogoB() {
  return (
    <svg width="24" height="24" viewBox="-26 -26 52 52" fill="none" aria-hidden="true">
      <circle cx="0" cy="0" r="22" stroke="var(--accent)" strokeWidth="2.5"/>
      <circle cx="7" cy="0" r="18" fill="var(--surface-bg)" stroke="none"/>
      <circle cx="-12" cy="-10" r="4" fill="var(--accent)"/>
      <path d="M -20 -8 A 14 14 0 0 1 -20 8" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.35" strokeLinecap="round"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/account") return pathname.startsWith("/account");
    return pathname.startsWith(href);
  }

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--surface-bg) 88%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="app-container h-14 lg:h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0"
          aria-label="Go to home"
        >
          <LogoB />
          <span className="text-[18px] font-medium tracking-wide" style={{ color: "var(--text-primary)" }}>
            Inābah
          </span>
        </button>

        {/* Desktop horizontal nav (lg+) — replaces the mobile BottomNav at this breakpoint */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {DESKTOP_NAV.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="px-3 py-2 rounded-lg text-[13px] transition-colors hover:opacity-80"
                style={{
                  background: active ? "var(--accent-light)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: active ? 600 : 400,
                }}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="touch-target rounded-lg transition-colors flex-shrink-0"
          style={{ background: "var(--surface-card-alt)", color: "var(--text-secondary)" }}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

      </div>
    </header>
  );
}
