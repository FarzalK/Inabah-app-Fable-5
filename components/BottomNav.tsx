"use client";

import { usePathname, useRouter } from "next/navigation";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}

function MuhasabahIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
      <path d="M12 8v4l2 2"/>
    </svg>
  );
}

function MuraqabahIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="9" ry="5.5"/>
      <circle cx="12" cy="12" r="2.5" fill={active ? "currentColor" : "none"}/>
    </svg>
  );
}

function InsightsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="14" width="4" height="7" rx="1"/>
      <rect x="10" y="9" width="4" height="12" rx="1"/>
      <rect x="17" y="4" width="4" height="17" rx="1"/>
    </svg>
  );
}

function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

const TABS = [
  { label: "Home",       href: "/dashboard",  Icon: HomeIcon },
  { label: "Muhāsabah",  href: "/session",    Icon: MuhasabahIcon },
  { label: "Murāqabah",  href: "/muraqabah",  Icon: MuraqabahIcon },
  { label: "Insights",   href: "/insights",   Icon: InsightsIcon },
  { label: "Account",    href: "/account",    Icon: AccountIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/account") return pathname.startsWith("/account");
    return pathname.startsWith(href);
  }

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm lg:hidden"
      style={{
        background: "color-mix(in srgb, var(--surface-bg) 92%, transparent)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="flex items-stretch mx-auto" style={{ maxWidth: "640px" }}>
        {TABS.map(({ label, href, Icon }) => {
          const active = isActive(href);
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-opacity"
              style={{
                color: active ? "var(--accent)" : "var(--text-tertiary)",
                minHeight: "56px",
              }}
            >
              <Icon active={active} />
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.03em",
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent)" : "var(--text-tertiary)",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Safe area spacer for iOS home indicator */}
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </nav>
  );
}
