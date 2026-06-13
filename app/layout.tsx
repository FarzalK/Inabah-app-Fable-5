import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthListener from "@/components/AuthListener";
import ZoomBlocker from "@/components/ZoomBlocker";

export const metadata: Metadata = {
  title: "Inābah",
  description: "A daily companion for turning back to Allah.",
};

// Viewport metadata. Per product decision, user scaling is fully disabled
// on every platform so the fixed bottom nav and layout grid never break
// from zoom. This trades off browser-level accessibility (pinch-zoom, OS
// page-zoom) — users who need larger text should rely on system font-size
// settings, which we still respect via rem units.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FEFAE0" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1A12" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script — runs before first paint to prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('inabah_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ErrorBoundary>
            <AuthListener />
            <ZoomBlocker />
            <Navbar />
            {/* Bottom padding for fixed mobile bottom nav clearance.
                BottomNav is hidden at lg+, so we drop the padding there. */}
            <div className="pb-24 lg:pb-0">
              {children}
            </div>
            <BottomNav />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
