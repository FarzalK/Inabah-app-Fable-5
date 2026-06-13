import AccountSidebar from "@/components/account/AccountSidebar";

// Account section keeps its own 800px max width — slightly wider than the
// global app-container's reading width since the sidebar + content combo
// needs the room. On mobile (<md) the sidebar stacks above the content;
// on md+ it sits side-by-side as today.
//
// Batch B will replace the mobile-stacked sidebar with a proper burger
// drawer (Notion: "Burger menu / drawer navigation in account section").
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen py-10 px-4 md:px-6" style={{ background: "var(--surface-bg)" }}>
      <div className="mx-auto md:flex md:gap-8" style={{ maxWidth: "800px" }}>
        <AccountSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
